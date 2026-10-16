#!/usr/bin/env bash
# optimize-images.sh
#
# Converts images/*.png|jpg|jpeg to WebP and rewrites the references in every
# tracked .html/.css/.js/.md file. macOS only (uses `sips` and BSD `stat`).
#
# Usage, from the repo root:
#   ./optimize-images.sh            convert + update references, KEEP the originals
#   ./optimize-images.sh --clean    same, then `git rm` the originals that were converted
#
# Needs:  brew install webp

set -euo pipefail

IMG_DIR="images"
MAX_WIDTH=1200            # only images wider than this are shrunk; nothing is upscaled
SKIP_LIST=" B.png "       # space-separated names to leave alone (favicon etc.)
CLEAN=0
[ "${1:-}" = "--clean" ] && CLEAN=1

command -v cwebp >/dev/null 2>&1 || { echo "cwebp not found. Install it with: brew install webp"; exit 1; }
[ -d "$IMG_DIR" ] || { echo "No $IMG_DIR/ folder here. Run this from the repo root."; exit 1; }

REF_FILES="$(git ls-files '*.html' '*.css' '*.js' '*.md')"

total_before=0
total_after=0
converted=0

while IFS= read -r f; do
    name="$(basename "$f")"
    stem="${name%.*}"
    out="$IMG_DIR/$stem.webp"

    case "$SKIP_LIST" in
        *" $name "*) echo "skip    $name (in skip list)"; continue ;;
    esac

    width="$(sips -g pixelWidth "$f" | awk '/pixelWidth/ {print $2}')"
    resize_args=""
    if [ "$width" -gt "$MAX_WIDTH" ]; then
        resize_args="-resize $MAX_WIDTH 0"
    fi

    # Near-lossless: sharp text on certificates and diagrams stays crisp (a11y),
    # while files are still far smaller than PNG.
    # shellcheck disable=SC2086
    cwebp -quiet -lossless -near_lossless 80 -m 6 $resize_args "$f" -o "$out"

    before="$(stat -f%z "$f")"
    after="$(stat -f%z "$out")"

    if [ "$after" -ge "$before" ]; then
        rm "$out"
        echo "keep    $name (WebP would not be smaller)"
        continue
    fi

    total_before=$((total_before + before))
    total_after=$((total_after + after))
    converted=$((converted + 1))
    printf "ok      %-50s %6sK -> %6sK\n" "$name" "$((before / 1024))" "$((after / 1024))"

    # Rewrite references: images/NAME.ext  ->  images/NAME.webp
    if [ -n "$REF_FILES" ]; then
        D="$IMG_DIR" NAME="$name" STEM="$stem" \
            perl -pi -e 's{\Q$ENV{D}/$ENV{NAME}\E}{$ENV{D}/$ENV{STEM}.webp}g' $REF_FILES
    fi

    if [ "$CLEAN" -eq 1 ]; then
        git rm -q "$f" 2>/dev/null || rm "$f"
    fi
done < <(find "$IMG_DIR" -maxdepth 1 -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) | sort)

echo
echo "Converted $converted file(s): $((total_before / 1024))K -> $((total_after / 1024))K"
echo
echo "Next:"
echo "  1. git diff --stat           (see which files had references rewritten)"
echo "  2. Open the site and check every image, including the enlarged modal view"
if [ "$CLEAN" -eq 0 ]; then
    echo "  3. When happy, re-run with --clean to remove the originals"
fi