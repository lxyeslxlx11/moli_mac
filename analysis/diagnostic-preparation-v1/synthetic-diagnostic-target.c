/* Original synthetic Win32 diagnostic target. Never uses a game namespace or real session.
 * Build as x86 PE32 with a reviewed Windows toolchain; no binary is supplied or run here.
 * No network APIs, child processes, file I/O, account queries or mapped-buffer reads/writes.
 */
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <wchar.h>

int wmain(int argc, wchar_t **argv) {
    WCHAR name[96];
    HANDLE created = NULL, opened = NULL;
    LPVOID view = NULL;
    BOOL unmapped;
    UNREFERENCED_PARAMETER(argc);
    UNREFERENCED_PARAMETER(argv);
    Sleep(1500); /* Observer must be ready at process start; this is not a hard wall-clock guarantee. */
    if (GetCommandLineW() == NULL) return 10; /* Do not dereference or print the returned string. */
    if (swprintf_s(name, 96, L"MoliSyntheticDiagnostic_%lu", GetCurrentProcessId()) < 0) return 11;
    SetLastError(ERROR_SUCCESS);
    created = CreateFileMappingW(INVALID_HANDLE_VALUE, NULL, PAGE_READWRITE, 0, 64, name);
    if (created == NULL) return 20;
    if (GetLastError() == ERROR_ALREADY_EXISTS) { CloseHandle(created); return 21; }
    opened = OpenFileMappingW(FILE_MAP_READ, FALSE, name);
    if (opened == NULL) { CloseHandle(created); return 22; }
    view = MapViewOfFile(opened, FILE_MAP_READ, 0, 0, 64);
    if (view == NULL) { CloseHandle(opened); CloseHandle(created); return 23; }
    Sleep(250); /* No access to bytes in view. */
    unmapped = UnmapViewOfFile(view);
    CloseHandle(opened);
    CloseHandle(created);
    return unmapped ? 0 : 24;
}
