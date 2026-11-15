#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <stdint.h>
#include <stdio.h>

_Static_assert(sizeof(void *) == 4, "Fixture is x86 only.");
struct slots { unsigned char padding[0xdb8]; volatile uint32_t cleanup; volatile uint32_t entry; };
/* Original BSS allocation is supplied by entry_fixture_slots.S. */
extern struct slots fixture_slots;
_Static_assert(sizeof(struct slots) == 0xdc0, "Fixture callback layout changed.");
static int fixture_entry(void) { return 17; }
static int fixture_cleanup(void) { return 23; }

int main(void) {
    fixture_slots.cleanup = (uint32_t)(uintptr_t)&fixture_cleanup;
    fixture_slots.entry = (uint32_t)(uintptr_t)&fixture_entry;
    printf("MOLI_ENTRY_FIXTURE_V1 pid=%lu slot_rva=e65db8 ready=1 wait_ms=30000\n", (unsigned long)GetCurrentProcessId());
    fflush(stdout);
    Sleep(30000);
    return 0;
}
