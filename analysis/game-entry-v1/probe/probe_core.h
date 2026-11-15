#ifndef MOLI_CALLBACK_PROBE_CORE_H
#define MOLI_CALLBACK_PROBE_CORE_H
#include <stdint.h>

/* The executable supplies the only two compiled profiles. No address comes from argv. */
static int moli_pid(const char *text, uint32_t *pid) {
    uint64_t value = 0;
    unsigned i;
    if (!text || !pid || text[0] < '1' || text[0] > '9') return 0;
    for (i = 0; i < 10; ++i) {
        unsigned char c = (unsigned char)text[i];
        if (!c) { *pid = (uint32_t)value; return value != 0; }
        if (c < '0' || c > '9') return 0;
        value = value * 10 + c - '0';
        if (value >= UINT32_MAX) return 0;
    }
    if (text[10] != 0) return 0;
    *pid = (uint32_t)value;
    return 1;
}

static int moli_slot_address(uint64_t base, uint64_t image_bytes, uint32_t rva, uint32_t count, uint32_t *address) {
    if (!address || !base || !image_bytes || !count || base > UINT32_MAX || image_bytes > UINT32_MAX
        || base + image_bytes > UINT64_C(0x100000000) || (uint64_t)rva + count > image_bytes) return 0;
    *address = (uint32_t)(base + rva);
    return 1;
}
#endif
