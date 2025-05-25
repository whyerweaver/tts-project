# Development History: Building the ElevenLabs TTS System

## Project Genesis
**User Need:** Convert a multi-voice transcript (3 speakers + sound effects) into a 5-6 minute audio file
**User Background:** Basic ElevenLabs subscription, tried Descript but pricing/limits were problematic
**Approach:** Step-by-step incremental development with testing at each stage

## Development Philosophy Applied
**Key Principle:** "Single, short, simple steps" - user preference due to complex multi-step approaches leading to errors and time waste
**Method:** Build → Test → Confirm → Next Step
**Each step was confirmed working before proceeding**

## Step-by-Step Build Process

### Step 1: Environment Setup
**Goal:** Basic Node.js project structure
```bash
npm init -y
npm install axios dotenv
```
**Result:** Created package.json and installed dependencies
**Learning:** Foundation established successfully

### Step 2: API Key Configuration  
**Goal:** Secure API key storage and verification
**Challenge:** Initial 401 authentication error
**Root Cause:** User had leftover template text attached to actual API key in .env file
**Solution:** Clean .env format with no quotes: `ELEVENLABS_API_KEY=actual_key_here`
**Test Script:** `test-connection.js` - verified key loading
**Learning:** .env format is critical - no quotes, no extra text

### Step 3: API Connection Testing
**Goal:** Verify communication with ElevenLabs servers
**Test Script:** `test-api.js` - fetched available voices
**Result:** Successfully connected, discovered 21 available voices
**Learning:** Connection testing separate from key loading prevents confusion

### Step 4: Voice Selection and Testing
**Goal:** Choose appropriate voices for 3 characters
**Tool:** `list-voices.js` - displayed all voices with metadata
**Selections Made:**
- Laura (FGY2WhTYpPnrIDTdsKH5) - young female
- Liam (TX3LPaxmHKxFdv7VOQHJ) - young male  
- Chris (iP95p4xoKVk53GoZ742B) - middle-aged male
**Test Script:** `test-voices.js` - generated sample audio for each voice
**Result:** All voices sounded good for intended characters
**Learning:** Voice testing before bulk generation saves time and API costs

### Step 5: Script Format Design
**Challenge:** How to handle multi-speaker transcript with sound effects
**Solution:** Simple format - `SPEAKER: dialogue` with `[SFX_DESCRIPTION]` markers
**Script Mapping Decision:**
- Mike → Chris (transcript name → voice name)
- Sarah → Laura  
- Liam → Aaron (voice name, but keep "Aaron" in spoken content)
**Sound Effects Strategy:** Mark locations, skip in TTS, add manually in Audacity
**Learning:** Simple format easier to parse and debug

### Step 6: Batch Audio Generation System
**Goal:** Process entire script automatically
**Core Script:** `generate-audio.js`
**Features Implemented:**
- Read script.txt line by line
- Skip blank lines automatically: `lines.split('\n').filter(line => line.trim())`
- Skip sound effect markers (log them for later)
- Generate numbered MP3 files (001_laura.mp3, 002_chris.mp3, etc.)
- Create timing-log.txt for assembly reference
**Result:** Successful bulk generation of all voice segments
**Learning:** Numbered files + timing log crucial for assembly

### Step 7: Single Line Editor
**User Need:** Edit individual lines without regenerating everything (cost control)
**Tool:** `edit-single-line.js`
**Method:** User specifies line number, speaker, and new text
**Result:** Can replace any single audio file
**Learning:** Revision capability essential for iterative refinement

### Step 8: Audio Assembly Process
**Tool Choice:** Audacity (free, full-featured)
**Challenge:** User tried corrupted MP3 sound effect from Freesound
**Problem:** Raw data import produced scratching sounds
**Solution:** Download WAV format sound effects instead
**Assembly Method:**
- Import all numbered MP3s
- Arrange in sequence using timing log
- Add sound effects during natural pauses
- Export final MP3
**Learning:** WAV format more reliable for sound effects than MP3

### Step 9: Project Organization and Documentation
**GitHub Setup:** Organized into logical folder structure
**Documentation Created:** Comprehensive usage guide
**Version Control:** Proper .gitignore (exclude .env, large files)
**Learning:** Good organization from start saves time later

### Step 10: Second Iteration Setup
**User returned with improved script**
**Challenge:** npm install run from wrong directory (scripts folder instead of root)
**Problem:** Dependencies not available because package.json is in root
**Solution:** Always run npm install where package.json lives
**Learning:** File location matters for dependency management

## Key Technical Discoveries

### API Integration
- ElevenLabs API straightforward with proper authentication
- Text-to-speech endpoint: `/v1/text-to-speech/{voice_id}`
- Model: 'eleven_monolingual_v1' works well for English
- Response type: 'arraybuffer' for audio data

### Error Patterns and Solutions
1. **401 Unauthorized:** Always API key format issue
2. **File Import Problems:** Usually format/corruption - try WAV
3. **Missing Dependencies:** npm install in wrong directory
4. **Script Processing Issues:** Usually extra spaces or wrong speaker names

### Successful Development Patterns
1. **Incremental Testing:** Each component tested before integration
2. **Simple Format:** Easy parsing reduces bugs
3. **Numbered Output:** Makes assembly straightforward  
4. **Logging:** Timing log essential for manual assembly
5. **Cost Control:** Edit individual lines rather than regenerate all

## Methodology That Worked

### Step-by-Step Approach
- Single focused goal per step
- Test immediately after each change
- Confirm success before proceeding
- No multi-step instructions without checkpoints

### Problem-Solving Process
1. Identify specific error/issue
2. Test minimal reproduction
3. Apply targeted fix
4. Verify fix works
5. Document solution

### User Learning Curve
- Started with copy/paste approach (ElevenLabs web interface)
- Moved to API for better control and cost management
- Learned Node.js environment setup through practice
- Gained understanding of audio workflow (TTS → Assembly → Export)

## Tools and Technologies Chosen

### Why Node.js
- User wanted VS Code development environment
- JavaScript familiar/learnable
- Good API client libraries available
- Cross-platform compatibility

### Why ElevenLabs
- User already had subscription
- High-quality voice synthesis
- Good API documentation
- Reasonable pricing for small projects

### Why Audacity
- Free and full-featured
- Handles multiple tracks well
- Good import/export options
- User-friendly for non-experts

## Project Success Factors

1. **Incremental Development:** No big-bang approach
2. **Immediate Testing:** Catch issues early
3. **User-Driven Pace:** Respect learning curve
4. **Documentation:** Capture knowledge for reuse
5. **Practical Focus:** Solve real problem, not theoretical exercise
6. **Cost Awareness:** API usage optimization throughout

## Lessons for Future Similar Projects

### Do This
- Test API connection before building complex features
- Create sample outputs early to verify quality
- Build editing/revision capabilities from start
- Document as you go, not at the end
- Use numbered files for complex assembly

### Avoid This
- Don't assume file formats will work (test imports)
- Don't run npm commands from wrong directories
- Don't skip voice testing before bulk generation
- Don't build everything before testing components

## Final Architecture

The successful system follows this pattern:
1. **Configuration:** Secure API key management
2. **Testing Tools:** Connection, voices, individual files
3. **Processing Engine:** Script → numbered audio files
4. **Revision Tools:** Edit individual segments
5. **Assembly Process:** Manual control in audio editor
6. **Documentation:** Complete usage and development history

This architecture balances automation (bulk generation) with control (manual assembly) while keeping costs manageable through targeted editing capabilities.