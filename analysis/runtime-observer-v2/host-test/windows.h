/* Test-only Win32 stand-in. Never passed to the actual Windows build. */
#ifndef MOLI_HOST_TEST_WINDOWS_H
#define MOLI_HOST_TEST_WINDOWS_H
#include <stddef.h>
#include <stdint.h>
typedef wchar_t WCHAR;
typedef uint32_t DWORD;
typedef unsigned int UINT;
typedef int BOOL;
typedef void *HANDLE;
typedef void *LPVOID;
#define WINAPI
#define FALSE 0
#define ERROR_SUCCESS 0
#define ERROR_ALREADY_EXISTS 183
#define PAGE_READWRITE 4
#define FILE_MAP_READ 4
#define INVALID_HANDLE_VALUE ((HANDLE)(intptr_t)-1)
void Sleep(DWORD ms);
WCHAR *GetCommandLineW(void);
DWORD GetCurrentProcessId(void);
void SetLastError(DWORD error);
DWORD GetLastError(void);
HANDLE CreateFileMappingW(HANDLE, void *, DWORD, DWORD, DWORD, const WCHAR *);
HANDLE OpenFileMappingW(DWORD, BOOL, const WCHAR *);
LPVOID MapViewOfFile(HANDLE, DWORD, DWORD, DWORD, size_t);
BOOL UnmapViewOfFile(const void *);
BOOL CloseHandle(HANDLE);
void ExitProcess(UINT);
#endif
