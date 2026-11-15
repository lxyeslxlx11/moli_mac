/* Keep every image section adjacent.  The zero-filled virtual span costs no
   file payload; the two original callback words retain RVA 0xe65db8. */
SECTIONS
{
  /* This fixed fixture is linked immediately after the verified .bss extent.
     build_probe.py rejects a compiler layout that makes sections nonadjacent. */
  .slots 0x00406000 :
  {
    . += 0x00e5f000;
    KEEP(*(.slots))
  }
}
INSERT AFTER .bss;
