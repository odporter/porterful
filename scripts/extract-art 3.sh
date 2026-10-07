#!/bin/bash

# Album directories and their corresponding album names
declare -A albums=(
  ["$HOME/Music/Music/Media.localized/Music/O D Music/Ambiguous"]="Ambiguous"
  ["$HOME/Music/Music/Media.localized/Music/O D Music/Roxannity"]="Roxannity"
  ["$HOME/Music/Music/Media.localized/Music/O D Music/One Day"]="One Day"
  ["$HOME/Music/Music/Media.localized/Music/O D Music/From Feast to Famine"]="From Feast to Famine"
  ["$HOME/Music/Music/Media.localized/Music/O D Music/God Is Good"]="God Is Good"
  ["$HOME/Music/Music/Media.localized/Music/O D Music/Levi"]="Levi"
  ["$HOME/Music/Music/Media.localized/Music/O D Music/Streets Thought I Left"]="Streets Thought I Left"
  ["$HOME/Music/Music/Media.localized/Music/O D Music/Artgasm"]="Artgasm"
  ["$HOME/Music/Music/Media.localized/Music/O D Porter/Every (Instrumentals)"]="Every Instrumentals"
  ["$HOME/Music/Music/Media.localized/Music/O D Porter/TLF (single)"]="TLF"
  ["$HOME/Music/Music/Media.localized/Music/O D Porter/Embrace (Single)"]="Embrace"
  ["$HOME/Music/Music/Media.localized/Music/O D Porter/After Effects"]="After Effects"
)

OUTPUT_DIR="$HOME/Documents/Porterful/porterful-app/public/album-art"
mkdir -p "$OUTPUT_DIR"

echo "🎵 Extracting album artwork..."
echo ""

for dir in "${!albums[@]}"; do
  album="${albums[$dir]}"
  
  # Find first audio file in the album
  first_file=$(find "$dir" -type f \( -name "*.mp3" -o -name "*.m4a" -o -name "*.wav" -o -name "*.flac" \) 2>/dev/null | head -1)
  
  if [ -n "$first_file" ]; then
    output="$OUTPUT_DIR/${album// /_}.jpg"
    
    # Extract artwork using ffmpeg
    ffmpeg -i "$first_file" -an -vcodec copy "$output" 2>/dev/null
    
    if [ -f "$output" ]; then
      size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
      if [ "$size" -gt 1000 ]; then
        echo "✅ $album: $(basename "$output") ($(numfmt --to=iec $size 2>/dev/null || echo $size bytes))"
      else
        rm "$output"
        echo "❌ $album: No embedded artwork found"
      fi
    else
      echo "❌ $album: Could not extract"
    fi
  else
    echo "⚠️  $album: No audio files found"
  fi
done

echo ""
echo "📁 Artwork saved to: $OUTPUT_DIR"
echo "Run 'ls $OUTPUT_DIR' to see all files"
