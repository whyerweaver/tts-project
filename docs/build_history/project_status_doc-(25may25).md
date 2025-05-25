# Project Status & Context

## Current Status
- ✅ Initial TTS system built and working
- ✅ First script processed successfully (Young Professionals podcast)
- ✅ Project documented and pushed to GitHub
- ✅ Second improved script ready for processing
- 🔄 **CURRENT:** Processing second script with same voice setup

## Voice Configuration (Established & Working)
- **LAURA** → FGY2WhTYpPnrIDTdsKH5 (young female) - Podcast host
- **AARON** → TX3LPaxmHKxFdv7VOQHJ (young male) - Caller/guest  
- **CHRIS** → iP95p4xoKVk53GoZ742B (middle-aged male) - Podcast co-host

## File Organization (Current Setup)
```
tts-project/
├── docs/                     # Documentation
├── scripts/                  # All .js processing files
│   ├── generate-audio.js     # Main script processor
│   ├── edit-single-line.js   # Individual line editor
│   └── [other tools]
├── output/                   # Currently empty (ready for new script)
├── sound-effects/            # Phone ring WAV file
├── final/                    # Completed audio files
├── script.txt               # Current script (improved version)
├── .env                     # ElevenLabs API key
└── package.json             # Dependencies: axios, dotenv
```

## Workflow That Works
1. **Setup:** `npm install` (from root folder)
2. **Generate:** `node scripts/generate-audio.js`
3. **Edit if needed:** Modify `edit-single-line.js` then run it
4. **Assemble:** Import numbered MP3s into Audacity + sound effects
5. **Export:** Final podcast to `final/` folder

## Key Lessons Learned
- **API Key Format:** No quotes in .env file
- **File Organization:** npm install must run from root (where package.json lives)
- **Sound Effects:** Use WAV format, import via Audacity
- **Script Format:** `SPEAKER: dialogue` with `[SFX_DESCRIPTION]` markers
- **Blank Lines:** Automatically filtered out by script

## Troubleshooting Notes
- **401 Error:** Usually API key format issue
- **File Import Issues:** MP3 corruption - try WAV instead
- **Wrong Directory:** Scripts expect to run from root folder
- **Missing Dependencies:** Run `npm install` from project root

## Next Session Quick Start
1. Open VS Code to tts-project folder
2. Terminal → New Terminal (should open in project root)
3. Verify setup: `node scripts/test-api.js`
4. Process current script: `node scripts/generate-audio.js`

## Current Script Status
- Script improved from first version
- Same speakers (Laura, Aaron, Chris)
- Ready to process with established workflow
- Output folder cleared for fresh generation