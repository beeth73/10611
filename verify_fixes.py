#!/usr/bin/env python3
import os
import sys

print("=" * 60)
print("TEST 1: Secret page files")
print("=" * 60)
files = ["secret/index.html", "secret/sentinel.wasm", "secret/sentinel.wat"]
for f in files:
    if os.path.isfile(f):
        print(f"✓ {f}")
    else:
        print(f"✗ {f} MISSING")

print("\n" + "=" * 60)
print("TEST 2: No plaintext FLAG{} values in secret/index.html")
print("=" * 60)
with open("secret/index.html") as f:
    content = f.read()
    
suspicious = []
if 'btoa("FLAG{' in content:
    suspicious.append("btoa(FLAG{...}) found - FLAG-5 should be base64 literal")
if '// base64 of "FLAG{' in content:
    suspicious.append("Comment with plaintext FLAG found")
if '// XOR 0x4D on FLAG{' in content:
    suspicious.append("Comment with plaintext FLAG-7 found")

if suspicious:
    for s in suspicious:
        print(f"✗ {s}")
else:
    print("✓ No plaintext FLAG{} discovered in comments or encoded calls")

print("\n" + "=" * 60)
print("TEST 3: CSP includes Google Fonts domains")
print("=" * 60)
with open("index.html") as f:
    content = f.read()
    
if "fonts.googleapis.com" in content and "fonts.gstatic.com" in content:
    print("✓ fonts.googleapis.com and fonts.gstatic.com present in CSP")
else:
    print("✗ Google Fonts domains missing from CSP")

print("\n" + "=" * 60)
print("TEST 4: Boot Escape key handler")
print("=" * 60)
with open("secret/index.html") as f:
    content = f.read()
    
if 'e.key === "Escape"' in content and "skipBoot" in content:
    print("✓ Escape key handler implemented in boot sequence")
else:
    print("✗ Escape key handler not found")

print("\n" + "=" * 60)
print("TEST 5: WASM file exists and is binary")
print("=" * 60)
stat = os.stat("secret/sentinel.wasm")
if stat.st_size > 500:
    print(f"✓ sentinel.wasm exists ({stat.st_size} bytes)")
else:
    print("✗ sentinel.wasm too small or missing")

print("\n" + "=" * 60)
print("TEST 6: Verify base64 strings replaced correctly")
print("=" * 60)
if "RkxBR3szbmNyeXB0MTBuXzFzX2p1c3RfMGJmdXNjNHQxMG59" in content:
    print("✓ Base64 encoded FLAG-6 (passwd entry) present")
else:
    print("✗ Base64 FLAG-6 missing")

if "RkxBR3t0aDNfZjByYzNfMXNfc3RyMG5nfQ==" in content:
    print("✓ Base64 encoded FLAG-5 (quote signal) present")
else:
    print("✗ Base64 FLAG-5 missing")

print("\n" + "=" * 60)
print("VERIFICATION COMPLETE")
print("=" * 60)
