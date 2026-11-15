#define WIN32_LEAN_AND_MEAN
#define _WIN32_WINNT 0x0a00
#include <windows.h>
#include <tlhelp32.h>
#include <bcrypt.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <wchar.h>
#include "text_core.h"
#include "fixture_identity.h"

_Static_assert(sizeof(void *) == 4 && sizeof(DWORD) == 4, "Observer is x86 only.");
enum { FILE_BUDGET = 16 * 1024 * 1024 };
struct profile {
    const char *name;
    const wchar_t *path, *final_path;
    const unsigned char *sha;
    DWORD image_bytes, text_rva, text_bytes;
    const wchar_t *output;
};
static const unsigned char game_sha[32] = {
    0x9b,0xaa,0x0d,0x26,0x60,0xf9,0x6c,0x66,0x99,0xcc,0xf4,0x2a,0xd4,0x6b,0xd9,0x18,
    0x71,0x7b,0x98,0xcc,0xb2,0x28,0xf4,0xed,0xde,0x2d,0x92,0xaf,0xb8,0x9d,0x31,0x26
};
static const struct profile profiles[] = {
    {"fixture", L"C:\\MoliOffline\\observer-fixture\\entry-fixture.exe", L"\\\\?\\C:\\MoliOffline\\observer-fixture\\entry-fixture.exe", fixture_sha,
     FIXTURE_IMAGE_BYTES, 0x1000, 6624, L"C:\\MoliOffline\\game-text-observer-stage115\\fixture-text.bin"},
    {"game-installed", L"C:\\Program Files (x86)\\PlayOnline\\\u9b54\u529b\u5b9d\u8d1d\\cg_se_3000.exe", L"\\\\?\\C:\\Program Files (x86)\\PlayOnline\\\u9b54\u529b\u5b9d\u8d1d\\cg_se_3000.exe", game_sha,
     0x103b000, 0x1000, 1753452, L"C:\\MoliOffline\\game-text-observer-stage115\\game-text.bin"}
};
static int same_path(const wchar_t *a, const wchar_t *b) {
    return CompareStringOrdinal(a, -1, b, -1, TRUE) == CSTR_EQUAL;
}
static int stopped(const char *code) {
    printf("MOLI_TEXT_OBSERVER_V1 stopped code=%s\n", code);
    return 1;
}

/* Hold each lab ancestor without share-delete. No directory is created here. */
static HANDLE checked_directory(const wchar_t *path, const wchar_t *expected) {
    wchar_t final_path[1024];
    BY_HANDLE_FILE_INFORMATION info;
    DWORD n;
    HANDLE result = CreateFileW(path, FILE_READ_ATTRIBUTES, FILE_SHARE_READ | FILE_SHARE_WRITE,
        NULL, OPEN_EXISTING, FILE_FLAG_BACKUP_SEMANTICS | FILE_FLAG_OPEN_REPARSE_POINT, NULL);
    if (result == INVALID_HANDLE_VALUE) return result;
    n = GetFinalPathNameByHandleW(result, final_path, 1024, FILE_NAME_NORMALIZED | VOLUME_NAME_DOS);
    if (!GetFileInformationByHandle(result, &info) || !(info.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)
        || (info.dwFileAttributes & FILE_ATTRIBUTE_REPARSE_POINT) || !n || n >= 1024
        || !same_path(final_path, expected)) {
        CloseHandle(result);
        return INVALID_HANDLE_VALUE;
    }
    return result;
}

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
    HANDLE query = NULL, process = NULL, file = INVALID_HANDLE_VALUE;
    HANDLE modules = INVALID_HANDLE_VALUE, parent = INVALID_HANDLE_VALUE;
    HANDLE directory = INVALID_HANDLE_VALUE, output = INVALID_HANDLE_VALUE;
    wchar_t path[1024], final_path[1024];
    DWORD path_chars = 1024, n, attrs, base = 0, written = 0;
    uint32_t pid, address = 0;
    uint64_t end = 0, cursor, next, started = GetTickCount64();
    USHORT process_machine = 0, native_machine = 0;
    unsigned char digest[32], *bytes = NULL;
    MODULEENTRY32W module;
    MEMORY_BASIC_INFORMATION region;
    SIZE_T got = 0;
    FILETIME created, checked, exit_time, kernel_time, user_time;
    const char *failure = "UNCONFIRMED";
    unsigned i, region_count = 0;
    int ok = 0, nonzero = 0;
    if (argc != 3 || !moli_pid(argv[2], &pid)) return stopped("INPUT");
    for (i = 0; i < sizeof(profiles) / sizeof(profiles[0]); ++i)
        if (!strcmp(argv[1], profiles[i].name)) profile = &profiles[i];
    if (!profile || pid == GetCurrentProcessId()) return stopped("PROFILE_OR_PID");
    parent = checked_directory(L"C:\\MoliOffline", L"\\\\?\\C:\\MoliOffline");
    directory = checked_directory(L"C:\\MoliOffline\\game-text-observer-stage115",
                                  L"\\\\?\\C:\\MoliOffline\\game-text-observer-stage115");
    if (parent == INVALID_HANDLE_VALUE || directory == INVALID_HANDLE_VALUE) { failure = "OUTPUT_DIRECTORY"; goto done; }
    attrs = GetFileAttributesW(profile->output);
    if (attrs != INVALID_FILE_ATTRIBUTES || GetLastError() != ERROR_FILE_NOT_FOUND) { failure = "OUTPUT_EXISTS_OR_ACCESS"; goto done; }
    query = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION | SYNCHRONIZE, FALSE, pid);
    if (!query) { failure = "PROCESS_QUERY_ACCESS"; goto done; }
    if (WaitForSingleObject(query, 0) != WAIT_TIMEOUT) { failure = "NOT_RUNNING"; goto done; }
    if (!QueryFullProcessImageNameW(query, 0, path, &path_chars) || !same_path(path, profile->path)) { failure = "IMAGE_PATH"; goto done; }
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
    if (!base || !moli_text_span(base, profile->image_bytes, profile->text_rva, profile->text_bytes, &address, &end)) { failure = "TEXT_BOUNDS"; goto done; }
    cursor = address;
    while (cursor < end) {
        if (++region_count > 1024 || GetTickCount64() - started > 10000) { failure = "METADATA_BUDGET"; goto done; }
        memset(&region, 0, sizeof(region));
        if (VirtualQueryEx(process, (LPCVOID)(uintptr_t)cursor, &region, sizeof(region)) != sizeof(region)) { failure = "TEXT_QUERY"; goto done; }
        if (!moli_text_region_next(cursor, end, (uintptr_t)region.BaseAddress, region.RegionSize,
                (uintptr_t)region.AllocationBase, base, region.State, region.Protect, region.Type, &next)) {
            printf("MOLI_TEXT_REGION_V1 cursor=%08lx region_base=%08lx region_bytes=%08lx allocation_base=%08lx state=%08lx protect=%08lx type=%08lx\n",
                (unsigned long)cursor, (unsigned long)(uintptr_t)region.BaseAddress,
                (unsigned long)region.RegionSize, (unsigned long)(uintptr_t)region.AllocationBase,
                (unsigned long)region.State, (unsigned long)region.Protect, (unsigned long)region.Type);
            failure = "TEXT_REGION"; goto done;
        }
        cursor = next;
    }
    bytes = (unsigned char *)HeapAlloc(GetProcessHeap(), 0, profile->text_bytes);
    if (!bytes) { failure = "BUFFER"; goto done; }
    if (!ReadProcessMemory(process, (LPCVOID)(uintptr_t)address, bytes, profile->text_bytes, &got)
        || got != profile->text_bytes) { failure = "TEXT_READ"; goto done; }
    if (WaitForSingleObject(process, 0) != WAIT_TIMEOUT) { failure = "EXITED_DURING_READ"; goto done; }
    for (i = 0; i < profile->text_bytes; ++i) if (bytes[i]) { nonzero = 1; break; }
    if (!nonzero) { failure = "TEXT_ZERO"; goto done; }
    output = CreateFileW(profile->output, GENERIC_READ | GENERIC_WRITE, FILE_SHARE_READ, NULL, CREATE_NEW, FILE_ATTRIBUTE_NORMAL, NULL);
    if (output == INVALID_HANDLE_VALUE || GetFileType(output) != FILE_TYPE_DISK) { failure = "OUTPUT_CREATE_NEW"; goto done; }
    n = GetFinalPathNameByHandleW(output, final_path, 1024, FILE_NAME_NORMALIZED | VOLUME_NAME_DOS);
    if (!n || n >= 1024 || wcsncmp(final_path, L"\\\\?\\", 4) || !same_path(final_path + 4, profile->output)) { failure = "OUTPUT_FINAL_PATH"; goto done; }
    if (!WriteFile(output, bytes, profile->text_bytes, &written, NULL) || written != profile->text_bytes
        || !FlushFileBuffers(output) || !hash_image(output, digest)) { failure = "OUTPUT_WRITE_OR_HASH"; goto done; }
    printf("MOLI_TEXT_OBSERVER_V1 ok profile=%s pid=%lu image_base=%08lx image_bytes=%08lx text_rva=%08lx read_bytes=%lu regions=%u snapshot_sha256=",
        profile->name, (unsigned long)pid, (unsigned long)base, (unsigned long)profile->image_bytes,
        (unsigned long)profile->text_rva, (unsigned long)written, region_count);
    for (i = 0; i < 32; ++i) printf("%02x", digest[i]);
    printf(" elapsed_ms=%llu\n", (unsigned long long)(GetTickCount64() - started));
    ok = 1;
done:
    if (bytes) { SecureZeroMemory(bytes, profile->text_bytes); HeapFree(GetProcessHeap(), 0, bytes); }
    if (output != INVALID_HANDLE_VALUE) CloseHandle(output);
    if (modules != INVALID_HANDLE_VALUE) CloseHandle(modules);
    if (file != INVALID_HANDLE_VALUE) CloseHandle(file);
    if (process) CloseHandle(process);
    if (query) CloseHandle(query);
    if (directory != INVALID_HANDLE_VALUE) CloseHandle(directory);
    if (parent != INVALID_HANDLE_VALUE) CloseHandle(parent);
    SecureZeroMemory(path, sizeof(path)); SecureZeroMemory(final_path, sizeof(final_path));
    SecureZeroMemory(digest, sizeof(digest));
    return ok ? 0 : stopped(failure);
}
