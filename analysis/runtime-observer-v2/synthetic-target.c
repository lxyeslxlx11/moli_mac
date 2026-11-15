/* Original synthetic x86 observer target, freestanding Win32.
 * Only its own PID-named 64-byte mapping; mapping bytes are never accessed.
 * No CRT, arguments, output, sockets, files, child processes or game namespace.
 */
#define WIN32_LEAN_AND_MEAN
#include <windows.h>

__declspec(dllexport) int moli_probe_sequence(void) {
    static const WCHAR prefix[] = L"MoliSyntheticDiagnostic_";
    WCHAR name[40];
    WCHAR digits[10];
    DWORD pid;
    unsigned int i = 0, count = 0;
    HANDLE created, opened;
    LPVOID view;
    BOOL unmapped;

    Sleep(1500); /* Not a debugger wall-clock limit. */
    if (GetCommandLineW() == NULL) return 10; /* Pointer only, never dereferenced. */
    pid = GetCurrentProcessId();
    if (pid == 0) return 11;
    while (prefix[i] != 0) { name[i] = prefix[i]; ++i; }
    do {
        digits[count++] = (WCHAR)(L'0' + pid % 10);
        pid /= 10;
    } while (pid != 0);
    while (count != 0) name[i++] = digits[--count];
    name[i] = 0;

    SetLastError(ERROR_SUCCESS);
    created = CreateFileMappingW(INVALID_HANDLE_VALUE, NULL, PAGE_READWRITE, 0, 64, name);
    if (created == NULL) return 20;
    if (GetLastError() == ERROR_ALREADY_EXISTS) { CloseHandle(created); return 21; }
    opened = OpenFileMappingW(FILE_MAP_READ, FALSE, name);
    if (opened == NULL) { CloseHandle(created); return 22; }
    view = MapViewOfFile(opened, FILE_MAP_READ, 0, 0, 64);
    if (view == NULL) { CloseHandle(opened); CloseHandle(created); return 23; }
    Sleep(250); /* No read/write through view. */
    unmapped = UnmapViewOfFile(view);
    CloseHandle(opened);
    CloseHandle(created);
    return unmapped ? 0 : 24;
}

void WINAPI moli_start(void) {
    ExitProcess((UINT)moli_probe_sequence());
}
