"""Original synthetic type11 vectors and independent native little-endian int16 oracle."""
from pathlib import Path
import json, struct

STATES = [0, 0xfffffffc, 0x0000fffc, 0x00010000, 0x1234fffc, 0x12340000,
          0x80000000, 0x80000001, 0x00008000, 0xffffffff, 0x0000ffff, 0x0001fffc]
NAME = b"FixtureID"
OPAQUE = b"FixtureTicket"

def length_bytes(value):
    return bytes([len(value)]) + value

def words(values):
    return bytes([len(values)]) + b"".join(struct.pack(">I", v) for v in values)

def build():
    cases = []
    for state in STATES:
        low16 = struct.unpack("<h", struct.pack("<I", state)[:2])[0]
        for billing, expired in [(0, 0), (1, 0), (0, 1), (1, 1)]:
            reason = "state" if low16 not in (0, -4) else "billing-expired" if billing and expired else None
            # W0 is deliberately different from W1; the native intermediate adapter drops W0.
            columns = [[0x80000001], [state], [billing], [99], [expired]]
            body = (b"\x0b" + struct.pack(">II", 7, 0) + length_bytes(OPAQUE)
                    + b"\x01" + length_bytes(NAME) + b"".join(words(v) for v in columns)
                    + struct.pack(">II", 0x80000001, 19))
            handoff = b"gid:" + NAME + b" glt:" + OPAQUE + b":1 \x00"
            cases.append({"name": f"state-{state:08x}-billing-{billing}-expired-{expired}",
                          "state_word": state, "native_signed16_state": low16,
                          "billing_word": billing, "expired_word": expired,
                          "passes": reason is None, "blocked_reason": reason,
                          "reply_body_hex": body.hex(),
                          "expected_handoff_hex": handoff.hex() if reason is None else None})
    return {"schema": "moli.updated-launcher.synthetic-state-vectors.v1",
            "source_analysis_sha256": "c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152",
            "oracle": "Python struct little-endian UInt32 storage followed by signed16 read; billing conjunction from native 0x41ea60..0x41ea86",
            "synthetic_only": True, "case_count": len(cases), "cases": cases}

if __name__ == "__main__":
    out = Path(__file__).with_name("state-vectors.json")
    out.write_text(json.dumps(build(), ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {len(build()['cases'])} original synthetic cases")
