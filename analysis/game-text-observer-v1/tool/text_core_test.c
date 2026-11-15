#include <stdio.h>
#include <stdlib.h>
#include "text_core.h"

static unsigned checks;
#define CHECK(value) do { ++checks; if (!(value)) { \
    fprintf(stderr, "text core check failed at line %d\n", __LINE__); exit(1); \
} } while (0)

static int region(uint64_t cursor, uint64_t end, uint64_t start, uint64_t size,
                  uint64_t allocation, uint32_t state, uint32_t protect, uint32_t type,
                  uint64_t *next) {
    return moli_text_region_next(cursor, end, start, size, allocation, 0x400000,
                                 state, protect, type, next);
}

int main(void) {
    uint32_t address = 0, pid = 0;
    uint64_t end = 0, next = 0;
    CHECK(moli_pid("804", &pid) && pid == 804);
    CHECK(!moli_pid("0804", &pid));
    CHECK(!moli_pid("804 ", &pid));
    CHECK(!moli_pid("-804", &pid));
    CHECK(!moli_pid("4294967295", &pid));
    CHECK(moli_text_span(0x400000, 0x103b000, 0x1000, 1753452, &address, &end));
    CHECK(address == 0x401000 && end == UINT64_C(0x5ad16c));
    CHECK(moli_text_span(0x360000, 0xe82000, 0x1000, 6624, &address, &end));
    CHECK(address == 0x361000 && end == UINT64_C(0x3629e0));
    CHECK(!moli_text_span(0, 0x2000, 0x1000, 1, &address, &end));
    CHECK(!moli_text_span(0x400000, 0x2000, 0x1000, 0, &address, &end));
    CHECK(!moli_text_span(0x400000, 0x2000, 0x1000, 0x1001, &address, &end));
    CHECK(!moli_text_span(0x400000, 0x400000, 0x1000, 2 * 1024 * 1024 + 1, &address, &end));
    CHECK(!moli_text_span(0xffff0000, 0x20000, 0x1000, 1, &address, &end));
    CHECK(!moli_text_span(0x400000, 0x2000, 0x1000, 1, NULL, &end));
    CHECK(!moli_text_span(0x400000, 0x2000, 0x1000, 1, &address, NULL));
    CHECK(region(0x401000, 0x403000, 0x401000, 0x1000, 0x400000, 0x1000, 0x20, 0x1000000, &next));
    CHECK(next == 0x402000);
    CHECK(region(next, 0x403000, 0x402000, 0x1000, 0x400000, 0x1000, 0x40, 0x1000000, &next));
    CHECK(next == 0x403000);
    CHECK(region(0x401123, 0x401777, 0x401000, 0x1000, 0x400000, 0x1000, 0x80, 0x1000000, &next));
    CHECK(next == 0x401777);
    CHECK(region(0x401000, 0x402000, 0x401000, 0x1000, 0x400000, 0x1000, 0x220, 0x1000000, &next));
    CHECK(!region(0x401000, 0x402000, 0x401001, 0x1000, 0x400000, 0x1000, 0x20, 0x1000000, &next));
    CHECK(!region(0x401000, 0x402000, 0x400000, 0x1000, 0x400000, 0x1000, 0x20, 0x1000000, &next));
    CHECK(!region(0x401000, 0x402000, 0x401000, 0, 0x400000, 0x1000, 0x20, 0x1000000, &next));
    CHECK(!region(0x401000, 0x402000, 0x401000, 0x1000, 0x500000, 0x1000, 0x20, 0x1000000, &next));
    CHECK(!region(0x401000, 0x402000, 0x401000, 0x1000, 0x400000, 0x2000, 0x20, 0x1000000, &next));
    CHECK(!region(0x401000, 0x402000, 0x401000, 0x1000, 0x400000, 0x1000, 0x20, 0x20000, &next));
    CHECK(!region(0x401000, 0x402000, 0x401000, 0x1000, 0x400000, 0x1000, 0x20, 0x40000, &next));
    CHECK(!region(0x401000, 0x402000, 0x401000, 0x1000, 0x400000, 0x1000, 0x120, 0x1000000, &next));
    CHECK(!region(0x401000, 0x402000, 0x401000, 0x1000, 0x400000, 0x1000, 1, 0x1000000, &next));
    CHECK(!region(0x401000, 0x402000, 0x401000, 0x1000, 0x400000, 0x1000, 0x04, 0x1000000, &next));
    CHECK(!region(0x401000, 0x402000, 0x401000, 0x1000, 0x400000, 0x1000, 0x02, 0x1000000, &next));
    CHECK(!region(0x401000, 0x402000, 0x401000, 0x1000, 0x400000, 0x1000, 0x10, 0x1000000, &next));
    CHECK(!region(0x401000, 0x402000, 0x401000, UINT64_MAX, 0x400000, 0x1000, 0x20, 0x1000000, &next));
    CHECK(!region(0x401000, 0x402000, 0x401000, 0x1000, 0x400000, 0x1000, 0x20, 0x1000000, NULL));
    CHECK(!region(0x402000, 0x402000, 0x401000, 0x1000, 0x400000, 0x1000, 0x20, 0x1000000, &next));
    CHECK(!region(0x401000, UINT64_C(0x100000001), 0x401000, 0x1000, 0x400000, 0x1000, 0x20, 0x1000000, &next));
    printf("MOLI_TEXT_CORE assertions=%u pass=%u win32_execution=0\n", checks, checks);
    return 0;
}
