/* Execute the original probe body with test-only APIs; not a Windows trace. */
#include <windows.h>
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

extern int moli_probe_sequence(void);
static const HANDLE H1 = (HANDLE)(uintptr_t)0x101;
static const HANDLE H2 = (HANDLE)(uintptr_t)0x202;
static int scenario, closes, sleep_count, event_count;
static DWORD pid_value, error_value;
static const char *events[8];

static void event(const char *name) {
    assert(event_count < 8);
    events[event_count++] = name;
}
static void verify_name(const WCHAR *name) {
    char expected[48];
    unsigned int i;
    snprintf(expected, sizeof(expected), "MoliSyntheticDiagnostic_%u", pid_value);
    for (i = 0; expected[i] != 0; ++i) assert(name[i] == (unsigned char)expected[i]);
    assert(name[i] == 0);
    assert(i < 40);
}
void Sleep(DWORD ms) {
    assert(ms == (sleep_count++ == 0 ? 1500u : 250u));
}
WCHAR *GetCommandLineW(void) {
    event("GetCommandLineW");
    /* An invalid but non-null address catches accidental dereference. */
    return scenario == 10 ? NULL : (WCHAR *)(uintptr_t)1;
}
DWORD GetCurrentProcessId(void) { return scenario == 11 ? 0 : pid_value; }
void SetLastError(DWORD error) { assert(error == 0); error_value = error; }
DWORD GetLastError(void) { return error_value; }
HANDLE CreateFileMappingW(HANDLE file, void *security, DWORD protection,
                          DWORD high, DWORD low, const WCHAR *name) {
    event("CreateFileMappingW");
    assert(file == INVALID_HANDLE_VALUE && security == NULL);
    assert(protection == PAGE_READWRITE && high == 0 && low == 64);
    verify_name(name);
    if (scenario == 20) return NULL;
    if (scenario == 21) error_value = ERROR_ALREADY_EXISTS;
    return H1;
}
HANDLE OpenFileMappingW(DWORD access, BOOL inherit, const WCHAR *name) {
    event("OpenFileMappingW");
    assert(access == FILE_MAP_READ && inherit == FALSE);
    verify_name(name);
    return scenario == 22 ? NULL : H2;
}
LPVOID MapViewOfFile(HANDLE handle, DWORD access, DWORD high, DWORD low, size_t size) {
    event("MapViewOfFile");
    assert(handle == H2 && access == FILE_MAP_READ && high == 0 && low == 0 && size == 64);
    return scenario == 23 ? NULL : (void *)(uintptr_t)1;
}
BOOL UnmapViewOfFile(const void *view) {
    event("UnmapViewOfFile");
    assert(view == (void *)(uintptr_t)1);
    return scenario != 24;
}
BOOL CloseHandle(HANDLE handle) {
    event("CloseHandle");
    if (scenario == 21 || scenario == 22) assert(handle == H1 && closes == 0);
    else assert(handle == (closes == 0 ? H2 : H1));
    ++closes;
    return 1;
}
void ExitProcess(UINT code) { (void)code; abort(); }

int main(void) {
    static const struct { int scenario; DWORD pid; int expected, close_count, events; } cases[] = {
        {0, 1, 0, 2, 7}, {0, 10, 0, 2, 7}, {0, UINT32_MAX, 0, 2, 7},
        {10, 99, 10, 0, 1}, {11, 99, 11, 0, 1},
        {20, 99, 20, 0, 2}, {21, 99, 21, 1, 3},
        {22, 99, 22, 1, 4}, {23, 99, 23, 2, 6}, {24, 99, 24, 2, 7}
    };
    static const char *success[] = {"GetCommandLineW", "CreateFileMappingW", "OpenFileMappingW",
        "MapViewOfFile", "UnmapViewOfFile", "CloseHandle", "CloseHandle"};
    size_t i, j;
    _Static_assert(sizeof(WCHAR) == 2, "Host stand-in requires -fshort-wchar.");
    for (i = 0; i < sizeof(cases) / sizeof(cases[0]); ++i) {
        int result;
        scenario = cases[i].scenario; pid_value = cases[i].pid;
        closes = sleep_count = event_count = 0; error_value = 0;
        result = moli_probe_sequence();
        assert(result == cases[i].expected && closes == cases[i].close_count);
        assert(event_count == cases[i].events);
        if (result == 0 || result == 24) {
            for (j = 0; j < 7; ++j) assert(strcmp(events[j], success[j]) == 0);
            assert(sleep_count == 2);
        } else assert(sleep_count == 1);
    }
    printf("{\"passed\":10,\"total\":10,\"scope\":\"Actual original C probe body under host API stand-ins; not Windows execution or observer acceptance\"}\n");
    return 0;
}
