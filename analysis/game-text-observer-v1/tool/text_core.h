#ifndef MOLI_TEXT_OBSERVER_CORE_H
#define MOLI_TEXT_OBSERVER_CORE_H
#include <stdint.h>
#include "../../game-entry-v1/probe/probe_core.h"

/* These functions accept numeric metadata only. They perform no OS calls. */
static int moli_text_span(uint64_t base, uint64_t image_bytes, uint32_t rva,
                          uint32_t count, uint32_t *address, uint64_t *end) {
    if (!end || count > 2 * 1024 * 1024
        || !moli_slot_address(base, image_bytes, rva, count, address)) return 0;
    *end = (uint64_t)*address + count;
    return 1;
}

static int moli_text_region_next(uint64_t cursor, uint64_t end,
                                 uint64_t region_base, uint64_t region_bytes,
                                 uint64_t allocation_base, uint64_t image_base,
                                 uint32_t state, uint32_t protect, uint32_t type,
                                 uint64_t *next) {
    uint32_t access = protect & 0xff;
    if (!next || !image_base || allocation_base != image_base
        || cursor >= end || end > UINT64_C(0x100000000)
        || region_base > cursor || !region_bytes
        || region_base > UINT32_MAX || region_bytes > UINT64_C(0x100000000)
        || region_base + region_bytes > UINT64_C(0x100000000)
        || cursor >= region_base + region_bytes
        || state != 0x1000 || type != 0x1000000 || (protect & 0x100)
        || !(access == 0x20 || access == 0x40 || access == 0x80)) return 0;
    *next = region_base + region_bytes < end ? region_base + region_bytes : end;
    return 1;
}
#endif
