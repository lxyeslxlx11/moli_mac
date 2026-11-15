#include <assert.h>
#include <stdio.h>
#include "probe_core.h"
int main(void) {
    uint32_t value = 17;
    const char *bad[] = {"", "0", "00", "01", "-1", "+1", " 1", "1 ", "1x", "4294967295", "4294967296", "10000000000", "99999999999"};
    unsigned i;
    assert(moli_pid("1", &value) && value == 1);
    assert(moli_pid("1234", &value) && value == 1234);
    assert(moli_pid("4294967294", &value) && value == UINT32_MAX - 1);
    for (i = 0; i < sizeof(bad) / sizeof(bad[0]); ++i) assert(!moli_pid(bad[i], &value));
    assert(!moli_pid(NULL, &value)); assert(!moli_pid("1", NULL));
    assert(moli_slot_address(0x400000, 0x103b000, 0xe65db8, 8, &value) && value == 0x1265db8);
    assert(moli_slot_address(0x970000, 0x103b000, 0xe65db8, 8, &value) && value == 0x17d5db8);
    assert(moli_slot_address(0xffff0000, 0x10000, 0xfff8, 8, &value) && value == 0xfffffff8);
    assert(!moli_slot_address(0xffff0000, 0x10001, 0, 8, &value));
    assert(!moli_slot_address(0x400000, 0x1000, 0xff9, 8, &value));
    assert(!moli_slot_address(0x400000, 0x1000, 0, 0, &value));
    assert(!moli_slot_address(0, 0x1000, 0, 8, &value));
    assert(!moli_slot_address(0x400000, 0x1000, 0, 8, NULL));
    puts("MOLI_PROBE_CORE_TESTS_V1 assertions=26 pass=26 win32_execution=0");
    return 0;
}
