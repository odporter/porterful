#!/usr/bin/env python3
"""
Porterful Auto Lyric Video — One-Shot Mode
Drop a song → get a lyric video. No manual steps.

Usage:
    python3 auto-lyric-video.py input/audio.mp3 --cover input/cover.jpg --artist "Artist" --title "Song" --template classic-lyric --format 9x16 --output output/video.mp4

Or minimal:
    python3 auto-lyric-video.py input/audio.mp3 --artist "O D Porter" --title "Heart of a Lion"

Steps (automated):
    1. Transcribe audio with Whisper (local, offline)
    2. Format lyrics as timed lines
    3. Generate synced lyric video with chosen template
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile


def run_whisper(audio_path: str, output_dir: str) -> str:
    """Run local Whisper transcription. Returns path to lyrics text file."""
    print("🎤 Transcribing with Whisper (local, offline)...")
    
    whisper_cmd = [
        'whisper',
        audio_path,
        '--model', 'base',
        '--language', 'en',
        '--output_format', 'srt',
        '--output_dir', output_dir,
        '--verbose', 'False'
    ]
    
    result = subprocess.run(whisper_cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Whisper error: {result.stderr}")
        sys.exit(1)
    
    # Whisper outputs: audio.srt
    base = os.path.splitext(os.path.basename(audio_path))[0]
    srt_path = os.path.join(output_dir, f"{base}.srt")
    
    if not os.path.exists(srt_path):
        # Try with different naming
        for f in os.listdir(output_dir):
            if f.endswith('.srt'):
                srt_path = os.path.join(output_dir, f)
                break
    
    if not os.path.exists(srt_path):
        print("❌ Whisper did not produce SRT file")
        sys.exit(1)
    
    print(f"   ✓ Lyrics saved: {srt_path}")
    return srt_path


def run_generator(config_path: str, output_path: str) -> None:
    """Run the synced video generator."""
    print("🎬 Generating lyric video...")
    
    generator = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'generate-synced-video.py')
    result = subprocess.run(
        ['python3', generator, config_path, output_path, '30'],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"Generator error: {result.stderr}")
        sys.exit(1)
    
    print(f"   ✓ Video saved: {output_path}")


def main():
    parser = argparse.ArgumentParser(
        description='One-shot lyric video: song → transcribe → video'
    )
    parser.add_argument('audio', help='Path to audio file (MP3, WAV, M4A)')
    parser.add_argument('--cover', help='Path to cover image (JPG, PNG)', default='')
    parser.add_argument('--artist', required=True, help='Artist name')
    parser.add_argument('--title', required=True, help='Track title')
    parser.add_argument('--template', default='classic-lyric',
                        choices=['classic-lyric', 'cover-pulse', 'minimal-wave',
                                 'release-promo', 'support-this-artist', 'ocean-deck'])
    parser.add_argument('--format', default='9x16',
                        choices=['16x9', '9x16', '1x1'])
    parser.add_argument('--output', default='', help='Output path (auto-generated if omitted)')
    parser.add_argument('--model', default='base',
                        choices=['tiny', 'base', 'small', 'medium', 'large'],
                        help='Whisper model size (base is default, good balance)')
    
    args = parser.parse_args()
    
    # Resolve paths
    audio_path = os.path.abspath(args.audio)
    if not os.path.exists(audio_path):
        print(f"❌ Audio file not found: {audio_path}")
        sys.exit(1)
    
    cover_path = os.path.abspath(args.cover) if args.cover else ''
    if args.cover and not os.path.exists(cover_path):
        print(f"⚠ Cover image not found: {cover_path}")
        cover_path = ''
    
    # Auto-generate output path
    if not args.output:
        safe_name = f"{args.artist}-{args.title}-{args.format}".replace(' ', '_').replace('/', '_')
        output_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            'output', 'generated-videos',
            f"{safe_name}.mp4"
        )
    else:
        output_path = os.path.abspath(args.output)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Step 1: Transcribe with Whisper
    with tempfile.TemporaryDirectory() as tmpdir:
        lyrics_path = run_whisper(audio_path, tmpdir)
        
        # Build config for generator
        config = {
            "version": "0.1",
            "artist": args.artist,
            "title": args.title,
            "audio": audio_path,
            "cover": cover_path,
            "lyrics": lyrics_path,
            "lyricsFormat": "srt",
            "outputFormat": args.format,
            "outputFile": output_path,
            "template": args.template
        }
        
        config_path = os.path.join(tmpdir, 'config.json')
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
        
        # Step 2: Generate video
        run_generator(config_path, output_path)
    
    # Done
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"\n✅ Done!")
    print(f"   📁 {output_path}")
    print(f"   📊 {size_mb:.1f} MB")


if __name__ == '__main__':
    main()
