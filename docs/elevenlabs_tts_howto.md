# ElevenLabs Text-to-Speech Project Guide

## Overview
This project generates multi-voice audio content using the ElevenLabs API. Perfect for podcasts, audiobooks, or any multi-character audio content.

## Project Structure
```
tts-project/
├── .env                    # API key (keep secure!)
├── script.txt             # Your formatted script
├── timing-log.txt         # Generated sequence log
├── package.json           # Node.js dependencies
├── output/                # Generated MP3 files
├── sound-effects/         # Sound effect files
├── final/                 # Completed audio files
└── scripts/
    ├── test-connection.js     # Verify API key
    ├── test-api.js           # Test API connection
    ├── list-voices.js        # Show available voices
    ├── test-voices.js        # Test selected voices
    ├── generate-audio.js     # Main script processor
    └── edit-single-line.js   # Edit individual lines
```

## Setup Instructions

### 1. Initial Setup
```bash
npm init -y
npm install axios dotenv
```

### 2. Configure API Key
1. Get your ElevenLabs API key from elevenlabs.io
2. Create `.env` file:
```
ELEVENLABS_API_KEY=your_api_key_here
```
**Important:** No quotes around the API key!

### 3. Test Connection
```bash
node test-connection.js  # Should show "API Key loaded: Yes"
node test-api.js         # Should show "Connection successful!"
```

## Voice Configuration
Current voice mapping in all scripts:
- **LAURA** → FGY2WhTYpPnrIDTdsKH5 (young female)
- **AARON** → TX3LPaxmHKxFdv7VOQHJ (young male) 
- **CHRIS** → iP95p4xoKVk53GoZ742B (middle-aged male)

To change voices, edit the `voices` object in each script file.

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

### Step 1: Generate All Audio
```bash
node generate-audio.js
```
This creates:
- Numbered MP3 files in `output/` folder
- `timing-log.txt` with sequence and sound effect locations

### Step 2: Edit Individual Lines (if needed)
1. Open `timing-log.txt` to find line numbers
2. Edit `edit-single-line.js`:
```javascript
const lineNumber = 5;           // Line to replace
const speaker = 'LAURA';        // LAURA, AARON, or CHRIS
const newText = 'New dialogue'; // Replacement text
```
3. Run: `node edit-single-line.js`

### Step 3: Assembly in Audacity
1. Import all MP3s from `output/` folder
2. Arrange in numerical order (001, 002, 003...)
3. Add sound effects from `sound-effects/` folder using timing log
4. Export final MP3 to `final/` folder

## Troubleshooting

### API Issues
- **401 Error:** Check API key in `.env` file (no quotes!)
- **Rate Limits:** Add delays between requests if generating many files
- **Voice Not Found:** Run `node list-voices.js` to see available voices

### Audio Issues
- **File Won't Import:** Use WAV format for sound effects
- **Poor Quality:** Check ElevenLabs subscription limits
- **Wrong Voice:** Verify speaker names match voice mapping exactly

### Script Issues
- **Missing Audio:** Check for extra spaces or wrong speaker names
- **Sound Effects Skipped:** Use exact format `[SFX_DESCRIPTION]`

## File Descriptions

### Core Scripts
- **generate-audio.js:** Main processor - converts script to numbered MP3 files
- **edit-single-line.js:** Updates individual lines without regenerating everything
- **list-voices.js:** Shows all available voices in your ElevenLabs account

### Test Scripts
- **test-connection.js:** Verifies API key is loaded correctly
- **test-api.js:** Tests actual connection to ElevenLabs servers
- **test-voices.js:** Creates sample audio for voice testing

### Configuration Files
- **.env:** Contains API key (never commit to git!)
- **script.txt:** Your formatted dialogue script
- **timing-log.txt:** Generated reference for assembly order

## Tips & Best Practices

### Script Writing
- Keep individual lines under 500 characters for best results
- Use natural punctuation for proper speech pacing
- Test voice assignments with sample text first

### Cost Management
- ElevenLabs charges per character generated
- Use `edit-single-line.js` for revisions instead of regenerating everything
- Preview lines mentally before generating

### Version Control
- Add `.env` to `.gitignore` (API keys should never be in git)
- Include sample `.env.example` file for setup reference
- Keep `output/` folder in git for collaboration, exclude large final files

### Audio Quality
- Use 192 kbps MP3 export for good quality/size balance
- Leave 0.5-1 second gaps between speakers in Audacity
- Normalize audio levels before final export

## Quick Reference Commands
```bash
# Test everything is working
node test-api.js

# See available voices
node list-voices.js

# Generate all audio from script
node generate-audio.js

# Edit line 5 to new text
# (Edit the variables in edit-single-line.js first)
node edit-single-line.js
```

## Support
- ElevenLabs API Docs: https://elevenlabs.io/docs
- Audacity Manual: https://manual.audacityteam.org/
- Node.js/npm Issues: Check package.json dependencies