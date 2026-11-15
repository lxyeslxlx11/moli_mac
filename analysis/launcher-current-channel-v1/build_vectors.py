"""Original current-group fixtures; Python pow/struct, no captured challenge or account."""
from pathlib import Path
import json, struct

ROOT = Path(__file__).parent

def message(g, p, a):
    return struct.pack(">I", 0) + b"".join(struct.pack(">I", len(x)) + x.encode("ascii") for x in [g, p, a])

def native_hex(x):
    text = format(x, "X")
    return "0" + text if x and len(text) % 2 else text

def build():
    group = json.loads((ROOT / "public-group.json").read_text())
    p = int(group["modulusHex"], 16)
    cases = []
    for name, exponent, peer_secret, peer_override in [
        ("public-original-A", int("12" * 20, 16), 0x13579bdf, None),
        ("public-original-B", int("ab" * 20, 16), 0x102030405060708, None),
        ("native-p-minus-one", 3, None, p - 1),
    ]:
        peer = peer_override if peer_override is not None else pow(2, peer_secret, p)
        shared = native_hex(pow(peer, exponent, p))
        public = native_hex(pow(2, exponent, p)).encode("ascii")
        assert len(shared) >= 16
        challenge = message("2", group["modulusHex"], format(peer, "x").rjust(256, "0"))
        cases.append({"name": name, "challenge_hex": challenge.hex(),
                      "public_fixture_exponent_hex": exponent.to_bytes(20, "big").hex(),
                      "expected_public_message_hex": (struct.pack(">I", len(public)) + public).hex(),
                      "public_fixture_key_hex": bytes.fromhex(shared)[:8].hex()})
    peer = format(pow(2, 0x13579bdf, p), "x").rjust(256, "0")
    wrong = [
        {"name": "generator-spelling", "hex": message("02", group["modulusHex"], peer).hex()},
        {"name": "generator-value", "hex": message("3", group["modulusHex"], peer).hex()},
        {"name": "modulus-case", "hex": message("2", group["modulusHex"].upper(), peer).hex()},
        {"name": "modulus-value", "hex": message("2", group["modulusHex"][:-1] + "9", peer).hex()},
        {"name": "peer-zero", "hex": message("2", group["modulusHex"], "0").hex()},
        {"name": "peer-one", "hex": message("2", group["modulusHex"], "1").hex()},
        {"name": "peer-at-modulus", "hex": message("2", group["modulusHex"], group["modulusHex"]).hex()},
        {"name": "peer-field-overflow", "hex": message("2", group["modulusHex"], "0" + peer).hex()},
    ]
    return {"schema": "moli.current-channel.original-vectors.v1", "synthetic_only": True,
            "oracle": "Python pow/struct; fixture private exponents/keys are public original test constants, never session values",
            "hello_hex": "0000000100000008", "valid": cases, "invalid": wrong}

if __name__ == "__main__":
    data = build()
    (ROOT / "original-vectors.json").write_text(json.dumps(data, indent=2) + "\n")
    print(json.dumps({"valid": len(data["valid"]), "invalid": len(data["invalid"])}))
