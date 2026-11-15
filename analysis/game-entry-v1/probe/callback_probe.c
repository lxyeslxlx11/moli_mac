#define WIN32_LEAN_AND_MEAN
#define _WIN32_WINNT 0x0a00
#include <windows.h>
#include <tlhelp32.h>
#include <bcrypt.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include "probe_core.h"
#include "fixture_identity.h"

_Static_assert(sizeof(void *) == 4 && sizeof(DWORD) == 4, "Observer is x86 only.");
enum { SLOT_RVA = 0xe65db8, SLOT_BYTES = 8, FILE_BUDGET = 16 * 1024 * 1024 };
struct profile { const char *name; const wchar_t *path; const wchar_t *final_path; const unsigned char *sha; DWORD image_bytes; };
static const unsigned char game_sha[32] = {
    0x9b,0xaa,0x0d,0x26,0x60,0xf9,0x6c,0x66,0x99,0xcc,0xf4,0x2a,0xd4,0x6b,0xd9,0x18,
    0x71,0x7b,0x98,0xcc,0xb2,0x28,0xf4,0xed,0xde,0x2d,0x92,0xaf,0xb8,0x9d,0x31,0x26
};
static const struct profile profiles[] = {
    {"fixture", L"C:\\MoliOffline\\observer-fixture\\entry-fixture.exe", L"\\\\?\\C:\\MoliOffline\\observer-fixture\\entry-fixture.exe", fixture_sha, FIXTURE_IMAGE_BYTES},
    {"game", L"C:\\MoliOffline\\launcher-probe\\cg_se_3000.exe", L"\\\\?\\C:\\MoliOffline\\launcher-probe\\cg_se_3000.exe", game_sha, 0x103b000},
    {"game-installed", L"C:\\Program Files (x86)\\PlayOnline\\\u9b54\u529b\u5b9d\u8d1d\\cg_se_3000.exe", L"\\\\?\\C:\\Program Files (x86)\\PlayOnline\\\u9b54\u529b\u5b9d\u8d1d\\cg_se_3000.exe", game_sha, 0x103b000}
};
static int same_path(const wchar_t *a, const wchar_t *b) { return CompareStringOrdinal(a, -1, b, -1, TRUE) == CSTR_EQUAL; }
static int stopped(const char *code) { printf("MOLI_CALLBACK_PROBE_V1 stopped code=%s\n", code); return 1; }

static int hash_image(HANDLE file, unsigned char digest[32]) {
    BCRYPT_ALG_HANDLE alg = NULL;
    BCRYPT_HASH_HANDLE hash = NULL;
    PUCHAR object = NULL;
    DWORD object_bytes = 0, received = 0, count;
    LARGE_INTEGER length, zero;
    unsigned char buffer[16384];
    uint64_t total = 0, started = GetTickCount64();
    int ok = 0;
    zero.QuadPart = 0;
    if (!GetFileSizeEx(file, &length) || length.QuadPart < 1 || length.QuadPart > FILE_BUDGET
        || !SetFilePointerEx(file, zero, NULL, FILE_BEGIN)) goto done;
    if (BCryptOpenAlgorithmProvider(&alg, BCRYPT_SHA256_ALGORITHM, NULL, 0) != 0
        || BCryptGetProperty(alg, BCRYPT_OBJECT_LENGTH, (PUCHAR)&object_bytes, sizeof(object_bytes), &received, 0) != 0
        || received != sizeof(object_bytes) || !object_bytes || object_bytes > 65536) goto done;
    object = (PUCHAR)HeapAlloc(GetProcessHeap(), HEAP_ZERO_MEMORY, object_bytes);
    if (!object || BCryptCreateHash(alg, &hash, object, object_bytes, NULL, 0, 0) != 0) goto done;
    while (total < (uint64_t)length.QuadPart) {
        uint64_t remaining = (uint64_t)length.QuadPart - total;
        DWORD wanted = remaining < sizeof(buffer) ? (DWORD)remaining : (DWORD)sizeof(buffer);
        if (GetTickCount64() - started > 5000 || !ReadFile(file, buffer, wanted, &count, NULL) || count != wanted
            || BCryptHashData(hash, buffer, count, 0) != 0) goto done;
        total += count;
    }
    if (!ReadFile(file, buffer, 1, &count, NULL) || count != 0 || BCryptFinishHash(hash, digest, 32, 0) != 0) goto done;
    ok = 1;
done:
    if (hash) BCryptDestroyHash(hash);
    if (object) { SecureZeroMemory(object, object_bytes); HeapFree(GetProcessHeap(), 0, object); }
    if (alg) BCryptCloseAlgorithmProvider(alg, 0);
    SecureZeroMemory(buffer, sizeof(buffer));
    return ok;
}

int main(int argc, char **argv) {
    const struct profile *profile = NULL;
    HANDLE query = NULL, process = NULL, file = INVALID_HANDLE_VALUE, modules = INVALID_HANDLE_VALUE;
    wchar_t path[1024], final_path[1024];
    DWORD path_bytes = 1024, n, attrs, base = 0, slots[2];
    uint32_t pid, slot_address = 0;
    USHORT process_machine = 0, native_machine = 0;
    unsigned char digest[32];
    MODULEENTRY32W module;
    MEMORY_BASIC_INFORMATION regions[2];
    SIZE_T got = 0, queried[2] = {0, 0};
    FILETIME created, checked, exit_time, kernel_time, user_time;
    uint64_t started = GetTickCount64();
    const char *failure = "UNCONFIRMED";
    unsigned i;
    int ok = 0;
    if (argc != 3 || !moli_pid(argv[2], &pid)) return stopped("INPUT");
    for (i = 0; i < sizeof(profiles) / sizeof(profiles[0]); ++i) if (!strcmp(argv[1], profiles[i].name)) profile = &profiles[i];
    if (!profile || pid == GetCurrentProcessId()) return stopped("PROFILE_OR_PID");
    query = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION | SYNCHRONIZE, FALSE, pid);
    if (!query) return stopped("PROCESS_QUERY_ACCESS");
    if (WaitForSingleObject(query, 0) != WAIT_TIMEOUT) { failure = "NOT_RUNNING"; goto done; }
    if (!QueryFullProcessImageNameW(query, 0, path, &path_bytes) || !same_path(path, profile->path)) { failure = "IMAGE_PATH"; goto done; }
    if (!GetProcessTimes(query, &created, &exit_time, &kernel_time, &user_time)) { failure = "PROCESS_IDENTITY"; goto done; }
    if (!IsWow64Process2(query, &process_machine, &native_machine)
        || !(process_machine == IMAGE_FILE_MACHINE_I386 || (!process_machine && native_machine == IMAGE_FILE_MACHINE_I386))) { failure = "ARCHITECTURE"; goto done; }
    attrs = GetFileAttributesW(profile->path);
    if (attrs == INVALID_FILE_ATTRIBUTES || (attrs & (FILE_ATTRIBUTE_DIRECTORY | FILE_ATTRIBUTE_REPARSE_POINT))) { failure = "FILE_TYPE"; goto done; }
    file = CreateFileW(profile->path, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
    if (file == INVALID_HANDLE_VALUE || GetFileType(file) != FILE_TYPE_DISK) { failure = "IMAGE_OPEN"; goto done; }
    n = GetFinalPathNameByHandleW(file, final_path, 1024, FILE_NAME_NORMALIZED | VOLUME_NAME_DOS);
    if (!n || n >= 1024 || !same_path(final_path, profile->final_path)) { failure = "FINAL_IMAGE_PATH"; goto done; }
    if (!hash_image(file, digest) || memcmp(digest, profile->sha, 32)) { failure = "IMAGE_HASH"; goto done; }
    process = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ | SYNCHRONIZE, FALSE, pid);
    if (!process) { failure = "PROCESS_READ_ACCESS"; goto done; }
    if (!GetProcessTimes(process, &checked, &exit_time, &kernel_time, &user_time)
        || created.dwLowDateTime != checked.dwLowDateTime || created.dwHighDateTime != checked.dwHighDateTime
        || WaitForSingleObject(query, 0) != WAIT_TIMEOUT) { failure = "PROCESS_CHANGED"; goto done; }
    modules = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE | TH32CS_SNAPMODULE32, pid);
    if (modules == INVALID_HANDLE_VALUE) { failure = "MODULE_SNAPSHOT"; goto done; }
    memset(&module, 0, sizeof(module)); module.dwSize = sizeof(module);
    if (Module32FirstW(modules, &module)) do {
        if (same_path(module.szExePath, profile->path)) {
            if (module.modBaseSize != profile->image_bytes) { failure = "MODULE_SIZE"; goto done; }
            base = (DWORD)(uintptr_t)module.modBaseAddr;
            break;
        }
    } while (Module32NextW(modules, &module));
    if (!base || !moli_slot_address(base, profile->image_bytes, SLOT_RVA, SLOT_BYTES, &slot_address)) { failure = "SLOT_BOUNDS"; goto done; }
    if (!ReadProcessMemory(process, (LPCVOID)(uintptr_t)slot_address, slots, SLOT_BYTES, &got) || got != SLOT_BYTES) { failure = "SLOT_READ"; goto done; }
    memset(regions, 0, sizeof(regions));
    for (i = 0; i < 2; ++i) if (slots[i]) {
        queried[i] = VirtualQueryEx(process, (LPCVOID)(uintptr_t)slots[i], &regions[i], sizeof(regions[i]));
        if (queried[i] != sizeof(regions[i])) memset(&regions[i], 0, sizeof(regions[i]));
    }
    if (WaitForSingleObject(process, 0) != WAIT_TIMEOUT) { failure = "EXITED_DURING_READ"; goto done; }
    printf("MOLI_CALLBACK_PROBE_V1 ok profile=%s pid=%lu image_base=%08lx image_bytes=%08lx read_bytes=8 elapsed_ms=%llu\n",
           profile->name, (unsigned long)pid, (unsigned long)base, (unsigned long)profile->image_bytes,
           (unsigned long long)(GetTickCount64() - started));
    for (i = 0; i < 2; ++i) {
        int inside = slots[i] >= base && (uint64_t)slots[i] < (uint64_t)base + profile->image_bytes;
        printf("MOLI_CALLBACK_SLOT_V1 index=%u value=%08lx inside_image=%d rva=%08lx region_valid=%d state=%08lx protect=%08lx type=%08lx allocation_base=%08lx region_base=%08lx region_bytes=%08lx\n",
               i, (unsigned long)slots[i], inside, (unsigned long)(inside ? slots[i] - base : 0),
               queried[i] == sizeof(regions[i]), (unsigned long)regions[i].State, (unsigned long)regions[i].Protect, (unsigned long)regions[i].Type,
               (unsigned long)(uintptr_t)regions[i].AllocationBase, (unsigned long)(uintptr_t)regions[i].BaseAddress, (unsigned long)regions[i].RegionSize);
    }
    ok = 1;
done:
    if (modules != INVALID_HANDLE_VALUE) CloseHandle(modules);
    if (file != INVALID_HANDLE_VALUE) CloseHandle(file);
    if (process) CloseHandle(process);
    if (query) CloseHandle(query);
    SecureZeroMemory(path, sizeof(path)); SecureZeroMemory(final_path, sizeof(final_path)); SecureZeroMemory(digest, sizeof(digest));
    return ok ? 0 : stopped(failure);
}
