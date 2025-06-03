# ElevenLabs Text-to-Speech Project Guide

## Overview
This project generates multi-voice audio content using the ElevenLabs API. Perfect for podcasts, audiobooks, or any multi-character audio content. It features both batch generation and an interactive web-based editor for refinements.

## Project Structure
```
tts-project/
├── .env                    # API key (keep secure!)
├── script.txt             # Your formatted script
├── timing-log.txt         # Generated sequence log
├── package.json           # Node.js dependencies
├── initialize.js          # Path resolution helper
├── server.js             # Interactive editing server
├── audio-preview-seamless-edit.html  # Web UI for editing
├── output/                # Generated MP3 files
└── scripts/
    └── js/
        ├── test-connection.js  # Verify API key
        ├── test-api.js        # Test API connection
        └── generate-audio.js  # Main script processor
```

## Setup Instructions

### 1. Initial Setup
```bash
npm install
```
This installs all required dependencies (axios, cors, dotenv, express).

### 2. Configure API Key
1. Get your ElevenLabs API key from elevenlabs.io
2. Create `.env` file:
```
ELEVENLABS_API_KEY=your_api_key_here
```
**Important:** No quotes around the API key!

### 3. Test Configuration
```bash
node scripts/js/test-connection.js  # Should show "API Key loaded: Yes"
node scripts/js/test-api.js         # Should show "Connection successful!"
```

## Voice Configuration
Current voice mapping in generate-audio.js:
- **LAURA** → FGY2WhTYpPnrIDTdsKH5 (young female)
- **AARON** → TX3LPaxmHKxFdv7VOQHJ (young male) 
- **CHRIS** → iP95p4xoKVk53GoZ742B (middle-aged male)
- **EFFECT** → pFZP5JQG7iQjIQuC4Bku (for sound effects)

To change voices, edit the `voices` object in generate-audio.js.

## Script Format
Format your `script.txt` like this:
```
LAURA: Welcome to the show.
CHRIS: Thanks for having me.
AARON: Hi Laura and Chris. I'm Aaron.
[SFX_PHONE_RING]
LAURA: Our caller is on the line.
```

**Rules:**
- Each line starts with `SPEAKER_NAME:`
- Use `[SFX_DESCRIPTION]` for sound effect markers
- Keep speaker names consistent with voice mapping

## Usage Workflow

### Step 1: Generate Initial Audio
```bash
node scripts/js/generate-audio.js
```
This creates:
- Numbered MP3 files in `output/` folder (e.g., 001_laura.mp3)
- `timing-log.txt` with sequence information

### Step 2: Interactive Editing
1. Start the editing server:
```bash
node server.js
```
This starts the Express server on port 3000.

2. Open audio-preview-seamless-edit.html:
   - In VS Code, install the "Live Server" extension
   - Right-click on audio-preview-seamless-edit.html
   - Select "Open with Live Server"
   - Browser will open to something like: http://127.0.0.1:5500/audio-preview-seamless-edit.html

3. Use the web interface to:
   - Play through all audio files
   - Edit individual lines
   - Automatically regenerate specific audio files
   - Preview changes immediately

## Troubleshooting

### API Issues
- **401 Error:** Check API key in `.env` file (no quotes!)
- **Rate Limits:** Add delays between requests if generating many files
- **Voice Not Found:** Verify voice IDs in generate-audio.js

### Web Interface Issues
- **Can't Edit:** Make sure server.js is running on port 3000
- **Audio Not Playing:** Check output/ folder for MP3 files
- **Live Server:** Install VS Code Live Server extension if missing

## Tips & Best Practices

### Script Writing
- Keep individual lines under 500 characters for best results
- Use natural punctuation for proper speech pacing
- Test voice assignments with sample text first

### Cost Management
- ElevenLabs charges per character generated
- Use the web interface for edits instead of regenerating everything
- Preview lines mentally before generating

### Version Control
- Add `.env` to `.gitignore` (API keys should never be in git)
- Include sample `.env.example` file for setup reference
- Keep `output/` folder in git for collaboration

### Audio Quality
- Files are generated in high-quality MP3 format
- Web interface allows for seamless playback and editing
- Use gap settings in web interface for natural spacing

## Quick Reference Commands
```bash
# Test configuration
node scripts/js/test-connection.js
node scripts/js/test-api.js

# Generate all audio from script
node scripts/js/generate-audio.js

# Start editing server
node server.js
```

## Support
- ElevenLabs API Docs: https://elevenlabs.io/docs
- Node.js/npm Issues: Check package.json dependencies

---

**Note on Legacy Features:**
This documentation reflects the current streamlined workflow using the web-based editor (server.js + audio-preview-seamless-edit.html). The project repository may contain additional files from earlier development iterations (Python scripts, single-line editing tools, etc.) that are no longer part of the main workflow but have been retained for reference or backward compatibility. These deprecated features include:
- Python-based tools (referenced in requirements.txt)
- Individual line editing scripts (superseded by the web interface)
- Manual audio assembly instructions (now handled by the web interface)