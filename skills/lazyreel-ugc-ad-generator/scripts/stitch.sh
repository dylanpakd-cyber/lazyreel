#!/usr/bin/env bash
# stitch.sh — concatenate Seedance clips into one vertical UGC ad.
#
# Usage: ./stitch.sh <clips-dir> <output-file>
# Example: ./stitch.sh outputs/my-ad/clips outputs/my-ad/final-ad.mp4
#
# Expects clips named shot-1.mp4, shot-2.mp4, ... in numerical order.
# Re-encodes to a consistent 1080x1920 9:16 output so clips with different
# resolutions/codecs can be concatenated cleanly.

set -euo pipefail

CLIPS_DIR="${1:?Usage: stitch.sh <clips-dir> <output-file>}"
OUTPUT="${2:?Usage: stitch.sh <clips-dir> <output-file>}"

if ! command -v ffmpeg &> /dev/null; then
    echo "ERROR: ffmpeg not installed." >&2
    echo "  macOS:        brew install ffmpeg" >&2
    echo "  Ubuntu/Debian: sudo apt install ffmpeg" >&2
    echo "  Windows:      https://ffmpeg.org/download.html" >&2
    exit 1
fi

# Collect clips in numerical order
CLIPS=()
while IFS= read -r -d '' f; do
    CLIPS+=("$f")
done < <(find "$CLIPS_DIR" -name "shot-*.mp4" -print0 | sort -z -V)

if [ ${#CLIPS[@]} -eq 0 ]; then
    echo "ERROR: No shot-*.mp4 files found in $CLIPS_DIR" >&2
    exit 1
fi

echo "Stitching ${#CLIPS[@]} clips → $OUTPUT"
for c in "${CLIPS[@]}"; do echo "  $c"; done

# Build ffmpeg concat input list
CONCAT_LIST="$(mktemp)"
trap 'rm -f "$CONCAT_LIST"' EXIT

for c in "${CLIPS[@]}"; do
    # ffmpeg concat demuxer requires absolute paths and escaped single quotes
    abs=$(cd "$(dirname "$c")" && pwd)/$(basename "$c")
    escaped="${abs//\'/\'\\\'\'}"
    echo "file '$escaped'" >> "$CONCAT_LIST"
done

# Re-encode to H.264 + AAC at 1080x1920 9:16.
# scale+pad: fit clips inside 1080x1920 and pad edges black rather than crop.
mkdir -p "$(dirname "$OUTPUT")"

ffmpeg -y \
    -f concat -safe 0 -i "$CONCAT_LIST" \
    -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,setsar=1" \
    -c:v libx264 -preset medium -crf 20 \
    -c:a aac -b:a 192k \
    -movflags +faststart \
    "$OUTPUT"

echo "✓ Finished: $OUTPUT"
echo "  Size: $(du -h "$OUTPUT" | cut -f1)"
echo "  Duration: $(ffprobe -v quiet -show_entries format=duration -of default=nw=1:nk=1 "$OUTPUT" | head -c 6)s"
