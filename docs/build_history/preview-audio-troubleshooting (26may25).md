# Preview Audio Troubleshooting Session - May 26, 2025

## Session Overview
**Goal:** Debug and fix keyboard control issues with the Python audio preview system
**Context:** User needed to stop/start preview during playback to edit specific audio files and resume workflow
**Outcome:** Partial success - continuous preview works, but real-time keyboard controls remain non-functional

## Problem Statement
The audio preview system (`preview-audio.py`) was designed to:
1. **Play all MP3 files continuously** with 1.0-second gaps
2. **Accept real-time keyboard controls** during playback:
   - SPACEBAR = Pause/Resume
   - B = Back to previous file  
   - N = Next file
   - R = Repeat current file
   - S = Stop cleanly
3. **Enable edit workflow:** Listen → Stop → Edit single line → Resume preview

**Issue:** Only Ctrl+C worked to stop playback; all other keyboard controls were non-responsive.

## What We Tried

### 1. Environment Setup Issues (RESOLVED)
**Problem:** VS Code linting errors showing pygame import issues
**Root Cause:** Multiple Python interpreters, VS Code confusion
**Solution Applied:**
- Selected correct Python interpreter (Microsoft Store Python 3.12.10)
- Reloaded VS Code window (`Ctrl+Shift+P` → "Developer: Reload Window")
- **Result:** ✅ Linting errors cleared, pygame import working

### 2. User Experience Enhancement (SUCCESSFUL)
**Problem:** Keyboard controls scrolled out of view during playback
**Solution Applied:**
- Added `show_persistent_status()` method
- Added screen clearing (`os.system('cls')`) before each file
- Controls now always visible at top of terminal
- **Result:** ✅ Controls remain visible, improved UX

### 3. Real-Time Keyboard Detection (FAILED)
**Problem:** `msvcrt.getch()` not detecting keypresses during playback
**Debugging Steps:**
- Added debug print statements to see if keys were detected
- Tested various key combinations (with/without Enter)
- Confirmed `msvcrt.kbhit()` was being called in threading loop
- **Result:** ❌ No keypresses detected during playback

### 4. Alternative Input Method (FAILED)
**Problem:** Real-time detection failing
**Solution Attempted:** Replace automatic gaps with manual `input()` prompts
**Implementation:** 
```python
print(f"  → Press ENTER for next file, 's' + ENTER to stop, 'r' + ENTER to repeat:")
user_input = input().strip().lower()
```
**User Feedback:** "No joy. Please write up a summary"
**Result:** ❌ Did not meet user requirements for continuous preview

## Technical Analysis

### What Works
- ✅ **Continuous audio playback** with proper file sequencing
- ✅ **1.0-second gaps** between files (user-configured)
- ✅ **File detection and sorting** by numerical prefix
- ✅ **Clean termination** via Ctrl+C
- ✅ **Basic keyboard input** via `input()` function (tested and confirmed)
- ✅ **Threading architecture** (keyboard listener thread spawns correctly)

### What Doesn't Work
- ❌ **Real-time keyboard detection** during audio playback
- ❌ **msvcrt.getch() responsiveness** in threaded environment
- ❌ **Interactive controls** during continuous playback

### Potential Root Causes
1. **Threading Conflict:** Audio playback thread may be blocking keyboard input
2. **Terminal Configuration:** Windows terminal settings affecting `msvcrt` behavior
3. **Focus Issues:** VS Code integrated terminal may not handle `msvcrt` properly
4. **Pygame Conflict:** Audio mixer may be interfering with keyboard input detection

## Current Status

### What User Can Do Now
- **Run continuous preview:** `python scripts/python/preview-audio.py`
- **Listen to full sequence** with natural 1.0-second gaps
- **Stop when needed:** Ctrl+C (reliable)
- **Edit specific files:** Modify `edit-single-line.js` and run
- **Re-run preview:** Start fresh preview after edits

### What User Cannot Do
- **Stop cleanly mid-playback** without Ctrl+C
- **Skip to specific files** during preview
- **Pause/resume** during playback
- **Interactive editing workflow** as originally envisioned

## Impact on Workflow

### Current Workflow (Works)
1. Generate all audio: `node scripts/js/generate-audio.js`
2. Preview full sequence: `python scripts/python/preview-audio.py`
3. Stop with Ctrl+C when issues identified
4. Edit specific line: Update `edit-single-line.js` and run
5. Re-run full preview to verify changes

### Desired Workflow (Partially Broken)
1. Generate all audio: `node scripts/js/generate-audio.js`
2. Start preview: `python scripts/python/preview-audio.py`
3. ~~Stop cleanly at problem (S key)~~ ← **NOT WORKING**
4. Edit specific line: Update `edit-single-line.js` and run  
5. ~~Resume preview from specific point~~ ← **NOT WORKING**

## Development Philosophy Applied

### Single, Short, Simple (s,s,s) Approach
- ✅ **Single focus:** One issue at a time (VS Code setup, then UX, then keyboard)
- ✅ **Short steps:** Each change tested immediately
- ✅ **Simple testing:** Quick verification of each component

### What Worked Well
- **Incremental debugging:** Environment issues resolved first
- **User feedback loop:** "No joy" clearly communicated failed attempts
- **Fallback planning:** Ctrl+C provides reliable stop mechanism

### What Didn't Work
- **Assumption about msvcrt:** Expected Windows keyboard detection to work reliably
- **Threading complexity:** May have overcomplicated the solution
- **Terminal environment:** VS Code integrated terminal may not be ideal for real-time input

## Next Steps / Future Considerations

### Potential Solutions to Explore
1. **Different keyboard library:** Replace `msvcrt` with `keyboard` or `pynput`
2. **Terminal environment:** Test in Command Prompt vs VS Code terminal
3. **Input method redesign:** Web-based controls or separate control window
4. **Simplified approach:** Return to basic functionality that works reliably

### User Priority Assessment Needed
- **Is continuous preview sufficient** for current workflow?
- **Is Ctrl+C acceptable** as primary stop mechanism?
- **Should we prioritize fixing keyboard controls** or focus on other features?

## Key Learnings

### Technical
1. **VS Code environment setup** critical for Python development
2. **Multiple Python interpreters** common source of confusion
3. **Threading + keyboard input** more complex than expected in Windows
4. **pygame + msvcrt interaction** may have compatibility issues

### Process
1. **s,s,s approach** effective for systematic debugging
2. **User feedback** essential for determining when to stop pursuing a solution
3. **Working baseline** important to maintain during enhancement attempts
4. **Documentation during development** captures context that would be lost

### User Experience
1. **Visible controls** significantly improve usability
2. **Reliable basic functionality** often better than unreliable advanced features
3. **Clear stop mechanism** essential for interactive tools
4. **Workflow integration** more important than individual feature perfection

## Session Conclusion
The audio preview system serves its core purpose of continuous playback for full sequence review. While the interactive controls enhancement failed, the system remains functional for the primary use case. The troubleshooting process revealed environment setup knowledge and highlighted the importance of reliable basic functionality over advanced but unreliable features.

**Status:** Core functionality preserved, advanced features require further investigation or alternative approaches.