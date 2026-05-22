import re

def decode_wat(s):
    out = []
    i = 0
    while i < len(s):
        if s[i] == "\\":
            j = i + 1
            if j + 1 < len(s) and all(c in "0123456789abcdefABCDEF" for c in s[j:j+2]):
                hex_digits = s[j:j+2]
                out.append(int(hex_digits, 16))
                i += 3
            else:
                if j < len(s):
                    out.append(ord(s[j]))
                    i += 2
                else:
                    out.append(92)
                    i += 1
        else:
            out.append(ord(s[i]))
            i += 1
    return bytes(out)

text = open('secret/sentinel.wat', 'r').read()
vals = re.findall(r'\(data \(i32\.const \d+\)\s*"([^\"]*)"\)', text)
for idx, v in enumerate(vals, 1):
    b = decode_wat(v)
    print(idx, ''.join(chr(c ^ 0x4D) for c in b))
