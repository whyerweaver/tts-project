# TTS Project Final Vision Document
*Version 1.0 - Created 2025-06-01*
*Living document - update as project evolves*

## Overview

Transform the current ElevenLabs TTS system into a comprehensive, web-based audio production platform that enables complete script-to-podcast workflows without external dependencies (except final mastering).

**Current Foundation:** Stage 1.5 Complete
- Dynamic path management system ✅
- 4-voice TTS generation (LAURA, AARON, CHRIS, EFFECT) ✅
- HTML5 audio preview with real-time controls ✅
- Cross-platform browser-based architecture ✅
- Seamless edit-to-preview workflow ✅

---

## Core Functionality Modules

### 1. Voice Selection & Management System

**User Experience:**
- Dropdown interface showing all available ElevenLabs voices
- Audio sample playback for each voice before selection
- Custom voice naming/assignment (e.g., "Sarah" → "FGY2WhTYpPnrIDTdsKH5")
- Voice library management for reuse across projects

**Technical Implementation:**
- **Effort Level:** High (15-20 hours)
- **Requirements:**
  - ElevenLabs API integration for dynamic voice listing
  - Sample audio generation system (30-second test phrases)
  - Voice metadata storage and management
  - Audio player components for sample playback
- **Current Status:** We have static 4-voice system; need dynamic voice discovery
- **Dependencies:** ElevenLabs API rate limits may affect sample generation

**Architecture Considerations:**
- Voice samples could be cached locally to reduce API calls
- Consider voice categorization (age, gender, accent, style)
- May require voice usage analytics for cost management

---

### 2. Interactive Draft Mode Workspace

**User Experience:**
- Clean, intuitive script composition interface
- Voice selection dropdown per line
- Auto-generated line numbers with selection checkboxes
- Real-time character count and cost estimation
- Drag-and-drop line reordering capabilities

**Technical Implementation:**
- **Effort Level:** Medium-High (10-15 hours)
- **Requirements:**
  - Dynamic form generation with voice selection
  - Auto-numbering system with gap management
  - Rich text editing with formatting options
  - Real-time validation and cost calculation
- **Current Status:** We have static script.txt; need dynamic line management
- **Dependencies:** State management system for complex UI interactions

**Architecture Considerations:**
- **Database Integration Point:** Line-by-line storage becomes essential here
- Consider Vue.js or React for complex state management
- May require undo/redo functionality for user experience
- Character limits and cost warnings based on ElevenLabs pricing

---

### 3. Generate Mode & TTS Integration

**User Experience:**
- Batch generation with progress indicators
- Individual line generation with immediate feedback
- Error handling and retry mechanisms
- Generation queue management for large scripts

**Technical Implementation:**
- **Effort Level:** Medium (8-12 hours)
- **Requirements:**
  - Asynchronous TTS processing with progress tracking
  - Error handling and retry logic
  - File management and linking system
  - Queue system for batch operations
- **Current Status:** We have working single/batch generation; need UI integration
- **Dependencies:** Robust error handling for API failures

**Architecture Considerations:**
- Consider WebSockets for real-time progress updates
- May require background job processing for large scripts
- Audio file versioning for edit history
- **Database Integration:** Essential for tracking generation status and file associations

---

### 4. Advanced Edit Mode

**User Experience:**
- Inline text editing with immediate TTS regeneration
- Side-by-side script and audio preview
- One-click save and regenerate workflow
- Version history and rollback capabilities

**Technical Implementation:**
- **Effort Level:** Medium (5-8 hours for basic, 10-15 for advanced)
- **Requirements:**
  - Contenteditable interface or rich text editor
  - Backend API for script updates and TTS regeneration
  - Real-time audio player refresh
  - Version control system
- **Current Status:** We have edit-single-line.js; need web interface integration
- **Dependencies:** Backend API development, possibly Node.js/Express

**Architecture Considerations:**
- **Next Session Target:** This is our immediate implementation goal
- Consider autosave functionality to prevent data loss
- May require conflict resolution for concurrent editing
- **Database Essential:** For version history and change tracking

---

### 5. Revise Mode - Script Restructuring

**User Experience:**
- Visual drag-and-drop interface for line reordering
- Insert/delete line functionality
- Bulk operations (select multiple lines)
- Real-time renumbering and file management

**Technical Implementation:**
- **Effort Level:** High (15-20 hours)
- **Requirements:**
  - Complex drag-and-drop UI framework
  - State management for line reordering
  - File renaming and reorganization system
  - Bulk operation processing
- **Current Status:** No current equivalent; major new development
- **Dependencies:** Advanced frontend framework (React DnD, Vue Draggable)

**Architecture Considerations:**
- **Database Critical:** Complex relationships between lines, files, and metadata
- Consider undo/redo for complex restructuring operations
- May require temporary file management during reordering
- Performance considerations for large scripts (100+ lines)

---

### 6. Enhanced Preview/Perform Mode

**User Experience:**
- Checkbox-based selection for custom playlists
- Advanced playback controls (speed, volume, skip)
- Gapless playback with crossfading
- Export functionality for partial selections

**Technical Implementation:**
- **Effort Level:** Low-Medium (3-8 hours)
- **Requirements:**
  - Enhanced HTML5 audio controls
  - Playlist management system
  - Audio processing capabilities
  - Export/download functionality
- **Current Status:** We have basic preview; good foundation for enhancement
- **Dependencies:** HTML5 Audio API limitations may require Web Audio API

**Architecture Considerations:**
- Consider Web Audio API for advanced audio processing
- May require audio format conversion capabilities
- Caching strategy for smooth playback experience

---

### 7. Sound Effects & Staging Integration

**User Experience:**
- Effect library management
- Drag-and-drop effect placement
- Timing adjustment interface
- Effect preview and replacement workflow

**Technical Implementation:**
- **Effort Level:** Medium (8-12 hours)
- **Requirements:**
  - Sound effect library management
  - Audio timeline interface
  - Effect placement and timing system
  - Integration with voice generation workflow
- **Current Status:** We have EFFECT voice; foundation exists
- **Dependencies:** Audio manipulation libraries, possibly tone.js

**Architecture Considerations:**
- Consider integration with free sound effect APIs
- May require audio waveform visualization
- **Database Integration:** Effect library and placement metadata storage

---

### 8. Finalize Mode - Audio Production

**User Experience:**
- Visual timeline with drag-and-drop audio placement
- Effect timing and overlap adjustment
- Basic mixing controls (volume, fade in/out)
- Export to multiple formats

**Technical Implementation:**
- **Effort Level:** Very High (20-30 hours)
- **Requirements:**
  - Browser-based DAW functionality
  - Web Audio API mastery
  - Complex timeline UI
  - Audio rendering and export system
- **Current Status:** No equivalent; would be major undertaking
- **Dependencies:** Extensive Web Audio API development

**Alternative Approaches:**
1. **Audacity Integration:** Investigate Audacity automation/scripting
2. **External DAW Export:** Generate session files for other tools
3. **Basic Mixing Only:** Simple concatenation with gap control
4. **Third-Party Integration:** Partner with existing web-based DAW

**Points to Ponder:**
- May be outside reasonable scope for this project
- Consider if basic concatenation meets 80% of use cases
- Audacity automation might be more practical approach

---

## Technical Architecture Considerations

### Database Integration Strategy

**When Database Becomes Essential:**
- **Immediate:** Advanced Edit Mode (line metadata, version history)
- **Soon:** Draft Mode (complex line relationships, voice assignments)
- **Eventually:** All modes require persistent state management

**Database Options:**
1. **SQLite:** Simple, file-based, perfect for single-user
2. **MySQL/PostgreSQL:** Full-featured, multi-user capable
3. **MongoDB:** Document-based, flexible schema
4. **Browser Storage:** IndexedDB for client-side storage

**Recommended Approach:** Start with browser IndexedDB, migrate to SQLite as complexity grows

### Full-Stack Architecture Decision Point

**Current Status:** File-based system with browser frontend
**Future Requirements:** Real-time collaboration, user management, project sharing

**Full-Stack Considerations:**
1. **Node.js + Express:** Natural evolution from current JavaScript base
2. **PHP + Laravel:** Robust, mature, excellent database integration
3. **Python + Django:** Powerful, great for AI/ML integration
4. **Hybrid Approach:** Keep current system, add backend APIs incrementally

**Recommendation:** Evolve incrementally - add Node.js API endpoints as needed rather than complete rewrite

### Frontend Framework Evolution

**Current:** Vanilla HTML/CSS/JavaScript
**Future Needs:** Complex state management, real-time updates, component reusability

**Framework Options:**
1. **Vue.js:** Gentle learning curve, great for incremental adoption
2. **React:** Industry standard, extensive ecosystem
3. **Svelte:** Minimal overhead, excellent performance
4. **Stay Vanilla:** Use Web Components for modularity

**Recommendation:** Introduce Vue.js incrementally, starting with Edit Mode components

---

## Implementation Roadmap

### Phase 1 (Current Session): Core Edit Mode
- **Goal:** Inline text editing with one-click regeneration
- **Effort:** 2-3 hours
- **Foundation:** Extends current Stage 1.5 system
- **Deliverable:** Working edit interface within current preview system

### Phase 2 (Next 1-2 Sessions): Enhanced Draft Mode
- **Goal:** Voice selection UI and dynamic line management
- **Effort:** 8-12 hours
- **Foundation:** Database integration begins here
- **Deliverable:** Complete script composition interface

### Phase 3 (Future): Advanced Features
- **Goal:** Revise Mode, enhanced Preview, sound effects
- **Effort:** 20-30 hours
- **Foundation:** Full-stack architecture decisions
- **Deliverable:** Professional-grade audio production platform

### Phase 4 (Future): Polish & Finalize
- **Goal:** Production-ready system with export capabilities
- **Effort:** 15-25 hours
- **Foundation:** Performance optimization and user experience refinement
- **Deliverable:** Complete standalone audio production suite

---

## Success Metrics & Decision Points

### Immediate Success (Phase 1):
- Can edit script text directly in browser interface
- One-click regeneration and immediate audio feedback
- Seamless integration with existing file system

### Short-term Success (Phase 2):
- Can create complete scripts without touching text files
- Voice selection interface working smoothly
- Database integration providing reliable state management

### Long-term Success (Phase 3-4):
- Complete script-to-podcast workflow without external tools
- Professional-quality output suitable for publication
- User experience competitive with dedicated audio software

### Decision Points Along the Way:
1. **Database Migration:** When file-based system becomes limiting
2. **Framework Adoption:** When vanilla JavaScript becomes unwieldy
3. **Full-Stack Migration:** When collaboration features become essential
4. **Finalize Mode Scope:** Whether to build DAW features or integrate externally

---

## Cost & Resource Considerations

### Development Time Investment:
- **Minimum Viable Product:** 15-25 hours (Phases 1-2)
- **Feature-Complete System:** 50-80 hours (All Phases)
- **Professional Polish:** Additional 20-30 hours

### ElevenLabs API Costs:
- Voice sample generation for selection interface
- Increased usage during development and testing
- Consider development vs. production API key strategy

### Technical Infrastructure:
- Database hosting (if moving beyond local files)
- Web hosting for production deployment
- CDN for audio file delivery (for shared/collaborative features)

---

## Conclusion

The final vision is ambitious but entirely achievable through incremental development. The current Stage 1.5 foundation provides an excellent starting point, and each phase builds logically on the previous work.

**Key Strategic Insight:** Focus on immediate productivity gains (Phase 1 Edit Mode) while designing with the larger vision in mind. This ensures every hour invested moves toward the ultimate goal while delivering tangible benefits along the way.

The architecture decisions (database integration, frontend framework, full-stack evolution) can be made incrementally based on actual needs rather than theoretical requirements, following our established "single, short, simple" development philosophy.