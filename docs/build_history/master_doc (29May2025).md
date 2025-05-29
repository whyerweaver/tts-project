# TTS Project Master Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [2024-05-24 – Initial System Development](#2024-05-24--initial-system-development)
- [2025-05-25 – Structure Reorganization & Python Preview](#2025-05-25--structure-reorganization--python-preview)
- [2025-05-26 – Preview Audio Troubleshooting](#2025-05-26--preview-audio-troubleshooting)
- [2025-05-27 – New PC Setup & Path Resolution Issues](#2025-05-27--new-pc-setup--path-resolution-issues)
- [2025-05-28 – Dynamic Path Management System Implementation](#2025-05-28--dynamic-path-management-system-implementation)
- [2025-05-29 – Perfect 1:1 Script-to-Audio Correspondence Implementation](#2025-05-29--perfect-11-script-to-audio-correspondence-implementation)

---

## Project Overview

**Project Goal:** Convert multi-voice transcripts (3 speakers + sound effects) into audio files using ElevenLabs TTS API
**Development Philosophy:** Single, short, simple (s,s,s) steps with incremental testing
**Current Status:** Core system working, resolving cross-platform path consistency issues

### Established Voice Configuration
- **LAURA** → FGY2WhTYpPnrIDTdsKH5 (young female) - Podcast host
- **AARON** → TX3LPaxmHKxFdv7VOQHJ (young male) - Caller/guest  
- **CHRIS** → iP95p4xoKVk53GoZ742B (middle-aged male) - Podcast co-host

### Current Project Structure
```
tts-project/
├── scripts/
│   ├── js/              # JavaScript TTS generation tools
│   └── python/          # Python audio preview tools
├── output/              # Generated MP3 files
├── sound-effects/       # WAV sound effects
├── final/              # Completed audio files
├── script.txt          # Current podcast script
├── .env                # ElevenLabs API key
└── package.json        # Dependencies: axios, dotenv
```

### Established Workflow
1. **Generate:** `node scripts/js/generate-audio.js`
2. **Preview:** `python scripts/python/preview-audio.py`
3. **Edit if needed:** Modify `scripts/js/edit-single-line.js` and run
4. **Assemble:** Import numbered MP3s into Audacity + sound effects
5. **Export:** Final podcast to `final/` folder

---

## 2024-05-24 – Initial System Development
------------------------------------------------------------

### Session Focus
Complete end-to-end TTS system development from API setup through final audio assembly.

### What Was Done
- **Environment Setup:** Node.js project structure with axios/dotenv dependencies
- **API Integration:** ElevenLabs API connection, authentication, voice selection and testing
- **Script Processing:** Automated batch generation system with numbered MP3 output
- **Revision Tools:** Single-line editor for cost-effective changes
- **Assembly Process:** Audacity-based workflow with timing logs
- **Documentation:** Comprehensive usage guide and troubleshooting reference

### Key Technical Discoveries
- .env format critical: no quotes, no extra text
- WAV format more reliable than MP3 for sound effects
- Numbered files + timing log essential for assembly
- Voice testing before bulk generation saves API costs

### Architecture Established
1. **Configuration:** Secure API key management
2. **Testing Tools:** Connection, voices, individual files  
3. **Processing Engine:** Script → numbered audio files
4. **Revision Tools:** Edit individual segments
5. **Assembly Process:** Manual control in audio editor

### Files Created
- Core generation system: `generate-audio.js`, `edit-single-line.js`
- Testing tools: `test-api.js`, `test-connection.js`, `list-voices.js`, `test-voices.js`
- Documentation: Usage guide, troubleshooting reference

### Next Steps
- System ready for production use with established voice configuration

---

## 2025-05-25 – Structure Reorganization & Python Preview
------------------------------------------------------------

### Session Focus
Reorganize project structure by language and add Python-based continuous audio preview system.

### What Was Done
- **File Organization:** Separated JavaScript and Python tools into `scripts/js/` and `scripts/python/` directories
- **Path Updates:** Modified all JS files to use `../../` relative paths for new directory structure
- **Python Preview System:** Built continuous playback tool with threading-based keyboard controls
- **Environment Setup:** Added `requirements.txt` for Python dependencies (pygame)

### Key Features Added
- **Continuous Preview:** 1.5-second gaps, automatic file sequencing
- **Real-time Controls:** SPACEBAR (pause/resume), B (back), N (next), R (repeat), S (stop)
- **Live Display:** Current file information during playback
- **Threading Architecture:** Non-blocking keyboard input during audio playback

### Technical Implementation
- Class-based design (`AudioPreview`) for state management
- Windows-specific `msvcrt` for real-time keyboard detection
- File sorting by numerical prefix (001, 002, etc.)
- Error handling for audio loading issues

### Updated Workflow
1. **Generate:** `node scripts/js/generate-audio.js`
2. **Preview:** `python scripts/python/preview-audio.py` ← NEW
3. **Edit if needed:** Modify `scripts/js/edit-single-line.js` and run
4. **Re-preview:** Quick verification of changes ← NEW
5. **Final assembly:** Import to Audacity with sound effects

### Files Modified
- Moved and updated: All JS files to `scripts/js/` with corrected paths
- Created: `scripts/python/preview-audio.py`, `requirements.txt`

### Next Steps
- Test all components work with new structure
- Remove old `script-files/` folder after verification

---

## 2025-05-26 – Preview Audio Troubleshooting
------------------------------------------------------------

### Session Focus
Debug and fix keyboard control issues with Python audio preview system for interactive workflow.

### What Was Done
- **Environment Issues Resolved:** Fixed VS Code Python interpreter confusion and pygame import errors
- **UX Enhancement:** Added persistent status display with screen clearing for visible controls
- **Keyboard Detection Debugging:** Extensive testing of `msvcrt.getch()` real-time input
- **Alternative Input Method:** Attempted `input()` prompts as fallback approach

### Issues Encountered
- **Real-time keyboard detection failed:** `msvcrt.getch()` non-responsive during audio playback
- **Threading conflicts:** Audio playback may be blocking keyboard input detection
- **Terminal environment:** VS Code integrated terminal may not handle `msvcrt` properly
- **Alternative approach rejected:** Manual prompts broke continuous preview requirement

### What Works Now
- ✅ Continuous audio playback with 1.0-second gaps
- ✅ File detection and sorting by numerical prefix
- ✅ Clean termination via Ctrl+C
- ✅ Threading architecture spawns correctly
- ✅ Improved UX with persistent control display

### What Doesn't Work
- ❌ Real-time keyboard controls during playback
- ❌ Interactive pause/resume functionality
- ❌ Clean stop mechanism (only Ctrl+C works)

### Current Workflow Impact
**Working:** Generate → Preview full sequence → Stop with Ctrl+C → Edit → Re-run preview
**Broken:** Interactive controls during playback for targeted editing workflow

### Key Learnings
- VS Code environment setup critical for Python development
- Threading + keyboard input more complex than expected on Windows
- Reliable basic functionality often better than unreliable advanced features
- User feedback essential for determining when to stop pursuing problematic solutions

### Files Modified
- Enhanced `scripts/python/preview-audio.py` with UX improvements

### Next Steps
- Assess user priorities: Is continuous preview sufficient vs. pursuing interactive controls?
- Consider alternative approaches: different keyboard library, separate control interface

---

## 2025-05-27 – New PC Setup & Path Resolution Issues
------------------------------------------------------------

### Session Focus
Set up TTS project on new PC and resolve path/encoding issues preventing cross-platform functionality.

### What Was Done
- ✅ **Environment Setup:** Verified Node.js v20.13.1, successfully ran `npm install` (24 packages)
- ✅ **API Key Recovery:** Retrieved new ElevenLabs API key (existing keys only show last 4 characters)
- ✅ **Encoding Issue Resolution:** Fixed UTF-16 encoding problem with PowerShell `echo` command
- ✅ **API Connection Verification:** Confirmed ElevenLabs API works (19 voices available)
- ✅ **Core Problem Identification:** Discovered systematic path inconsistency issues

### Critical Issue Discovered
**Path Inconsistency Problem:** Scripts contain conflicting path assumptions:
- Documentation: `node generate-audio.js` (assumes run from root)
- Script internals: `'../../script.txt'` (assumes run from subdirectory)
- Result: "Works here, breaks there" across different PC setups

### Technical Details
- **UTF-16 Encoding Fix:** PowerShell `echo` creates UTF-16, dotenv requires UTF-8
  - Solution: Use `Out-File -Encoding utf8` for proper .env format
- **Working Components:** `test-api.js` functions correctly with proper dotenv path resolution
- **Blocked Components:** `generate-audio.js` produces 401 errors due to path/API key coordination issues

### Root Cause Analysis
File reorganization from `script-files/` to `scripts/js/` created path mismatches that weren't systematically resolved, only individually patched.

### User Insight Applied
Identified need for centralized path management pattern (similar to PHP's `initialize.php`) rather than scattered hardcoded relative paths.

### Next Steps
- **Implement systematic path resolution** using Node.js `__dirname` or `process.cwd()`
- **Create initialization pattern** for centralized path configuration
- **Test cross-platform compatibility** to ensure portable solution
- **Fix core TTS generation** currently blocked by path coordination

### Files Modified
- **`.env`** - Recreated with UTF-8 encoding and new API key
- **`scripts/js/test-connection.js`** - Path updates (may need systematic revert)

### Outstanding Issues
- Core TTS generation blocked by path/API key coordination
- Need systematic solution before resuming audio generation workflow

---

## Project Status Summary

**Working Components:**
- API connection and authentication
- Voice selection and testing tools
- Continuous audio preview (basic functionality)
- Single-line editing capability
- Audacity assembly workflow

**Current Blockers:**
- Path resolution inconsistencies preventing reliable cross-platform operation
- Interactive preview controls (non-critical, fallback to Ctrl+C acceptable)

**Immediate Priority:**
Implement centralized path management to resolve cross-platform reliability issues and restore full TTS generation capability.

## 2025-05-28 – Dynamic Path Management System Implementation
------------------------------------------------------------

### Session Focus
Implement systematic solution for cross-platform path resolution issues using dynamic path management pattern similar to PHP initialize.php approach.

### What Was Done
- **Systematic Testing:** Audited all components on PC #2 to identify scope of path issues (API connection worked, generate-audio.js and edit-single-line.js had path problems, Python missing pygame)
- **Dynamic Path System:** Created `initialize.js` with `getProjectPath()` function that finds project root automatically and builds any path dynamically
- **Fixed generate-audio.js:** Replaced hardcoded `../../script.txt` paths with dynamic path system, now works from any location
- **Fixed edit-single-line.js:** Completely rewrote to read actual script.txt content and match exact file numbering logic as generate-audio.js
- **Path Logic Alignment:** Ensured both scripts use identical numbering system (sound effects logged but don't increment file counter)
- **Cross-Platform Solution:** System works regardless of run location, folder structure, or PC setup

### Key Technical Discoveries
- **Path Issues Were Systematic:** Multiple scripts had hardcoded relative paths that broke when run from project root vs subdirectories
- **File Numbering Mismatch:** edit-single-line.js was using dialogue line counting while generate-audio.js used sequential file numbering with sound effect gaps
- **PHP Pattern Translation:** Successfully translated PHP initialize.php dynamic path discovery pattern to JavaScript using `getProjectPath(...pathParts)` function
- **Simple Integration:** Scripts now require only `const { getProjectPath } = require('../../initialize.js')` and use `getProjectPath('output', filename)` syntax

### Components Now Working
- ✅ **initialize.js** - Dynamic path builder, finds project root automatically
- ✅ **generate-audio.js** - Reads script.txt correctly, creates numbered MP3 files with proper sound effect handling
- ✅ **edit-single-line.js** - Reads script.txt dynamically, matches exact file numbering, allows editing specific lines after script changes
- ✅ **Cross-platform compatibility** - All scripts work from any location on any PC

### Workflow Improvements
- **Edit Workflow Restored:** Can now edit dialogue in script.txt, set file number and speaker in edit-single-line.js, run to replace just that MP3
- **Consistent Numbering:** File numbers now match between generation and editing (001_laura.mp3, 002_chris.mp3, etc.)
- **Location Independence:** Scripts work whether run from root, subdirectories, or different PC configurations
- **GitHub Push/Pull Safe:** No more "works here, breaks there" cycles when sharing code between PCs

### Files Modified
- **Created:** `initialize.js` (dynamic path management system)
- **Updated:** `scripts/js/generate-audio.js` (fixed script.txt reading, uses dynamic paths)
- **Updated:** `scripts/js/edit-single-line.js` (complete rewrite to read script.txt and match file numbering)

### Testing Results
- **PC #2 Testing:** All path issues resolved, generate-audio.js now finds script.txt correctly
- **File Creation:** edit-single-line.js creates MP3 files in correct output directory
- **Numbering Accuracy:** File numbering matches between scripts, accounting for sound effect markers
- **Dynamic Discovery:** initialize.js correctly finds project root from any execution location

### Next Steps
- **Python Conversion Decision:** Evaluate whether to convert preview-audio.py to JavaScript (would eliminate pygame dependency and control issues) or create parallel Python path system
- **Additional Script Integration:** Apply dynamic path system to remaining utility scripts (test-api.js, list-voices.js, etc.) as needed
- **Workflow Testing:** Verify complete generate → preview → edit → re-generate workflow functions smoothly

### Key Files Touched
- `initialize.js` (new)
- `scripts/js/generate-audio.js` (path fixes)
- `scripts/js/edit-single-line.js` (complete rewrite)

### Development Philosophy Success
- **Single, Short, Simple (s,s,s) approach:** Each component tested individually before integration
- **Systematic solution:** Addressed root cause (path management) rather than individual script fixes  
- **PHP pattern adaptation:** Successfully translated proven organizational pattern to JavaScript ecosystem
- **Cross-platform focus:** Solution designed from start to work across different PC environments

### Current System Status
**Fully functional TTS generation and editing system with robust cross-platform path management. All scripts now location-independent and ready for reliable GitHub collaboration workflow.**

## 2025-05-29 – Perfect 1:1 Script-to-Audio Correspondence Implementation
------------------------------------------------------------

### Session Focus
Implement perfect 1:1 correspondence between script line numbers and audio file numbers by using spoken sound effect placeholders with a dedicated EFFECT voice.

### What Was Done
- **Cross-Platform Verification:** Successfully tested dynamic path management system across PC1 and PC2 with GitHub sync
- **Root Problem Analysis:** Identified that `[SFX_PHONE_RING]` markers broke script line to audio file correspondence, causing edit-single-line.js confusion
- **Voice Selection for Sound Effects:** Tested all 21 available voices and selected Lily (pFZP5JQG7iQjIQuC4Bku) as EFFECT voice for gentle British whisper quality
- **Sound Effect Bridge Solution:** Replaced non-speaking `[SFX_PHONE_RING]` with spoken `EFFECT: A phone is ringing.` to maintain numbering
- **System Integration:** Added EFFECT voice to both generate-audio.js and edit-single-line.js voice mappings
- **Perfect Correspondence Achievement:** Script line 6 now correctly corresponds to audio file 006 with no mapping confusion

### Key Technical Breakthrough
**Before:** 
- Script line 6 (Aaron) → Audio file 005 (confusing mapping)
- `[SFX_PHONE_RING]` skipped, breaking correspondence
- edit-single-line.js required complex numbering calculations

**After:**
- Script line 6 (Aaron) → Audio file 006 (perfect match)
- `EFFECT: A phone is ringing.` gets audio file 004 with Lily's voice
- edit-single-line.js works with direct script line numbers

### Solution Architecture
1. **Four-Voice System:**
   - LAURA (FGY2WhTYpPnrIDTdsKH5) - Podcast host
   - AARON (TX3LPaxmHKxFdv7VOQHJ) - Caller/guest
   - CHRIS (iP95p4xoKVk53GoZ742B) - Podcast co-host  
   - EFFECT (pFZP5JQG7iQjIQuC4Bku) - Sound effect placeholders (Lily)

2. **Perfect Workflow:**
   - Edit script.txt line 6 with new Aaron dialogue
   - Set edit-single-line.js: `fileNumber = 6, speaker = 'AARON'`
   - Run edit script → Only file 006_aaron.mp3 regenerated
   - All other 27 files remain unchanged

### Proven Cross-Platform Reliability
- ✅ PC1 ↔ PC2 ↔ GitHub sync works flawlessly
- ✅ Dynamic path management eliminates "works here, breaks there" issues
- ✅ Initialize.js provides location-independent operation

### Workflow Improvements
- **Intuitive Editing:** Script line numbers directly match audio file numbers
- **Cost Efficiency:** Edit individual lines without regenerating entire script
- **Clear Sound Effects:** Lily's gentle voice provides obvious but unobtrusive cues during preview
- **No Mental Math:** Eliminated complex file number calculations and mapping confusion

### Files Modified
- **scripts/js/generate-audio.js** - Added EFFECT voice mapping
- **scripts/js/edit-single-line.js** - Added EFFECT voice mapping  
- **script.txt** - Replaced `[SFX_PHONE_RING]` with `EFFECT: A phone is ringing.`
- **Created:** `test-all-voices.js` - Voice selection tool for all 21 available voices

### Testing Results
- **Cross-platform verification:** Complete success across PC1/PC2/GitHub
- **Perfect correspondence:** Script line 6 = Audio file 006 confirmed
- **Single-line editing:** Successfully replaced Aaron's line 6 with new content
- **Sound effect integration:** Lily's voice provides clear, gentle placeholder cues

### Key Learnings
- **Sound effect handling:** Spoken placeholders more reliable than skip-markers for maintaining sequence
- **Voice selection importance:** Testing all available voices crucial for finding right tone
- **Documentation workflow:** Comprehensive session tracking enables seamless collaboration
- **s,s,s methodology:** Single, short, simple steps prevented complexity creep

### Next Steps
- **Python Preview Conversion:** Convert preview-audio.py to JavaScript for unified ecosystem
- **Additional Script Integration:** Apply dynamic path system to remaining utility scripts
- **Enhanced Preview Features:** Consider adding script text display during preview playback

### Current System Status
**Perfect 1:1 script-to-audio correspondence achieved. Cross-platform reliability confirmed. Single-line editing workflow fully functional with cost-effective targeted regeneration capability.**