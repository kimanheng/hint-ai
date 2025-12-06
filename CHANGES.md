# Major Changes - Screenshot-Only Mode with Gemini 3 Pro (Preview)

## Overview
The application has been significantly simplified to remove all audio and screen recording features, keeping only screenshot capture functionality. The AI backend has been switched from Gemini Live API to the standard Gemini API using the **gemini-3-pro-preview** model (Gemini 3 Pro Preview).

## Changes Made

### 1. API Migration ✅
- **Removed**: `@google/genai` (Gemini Live API)
- **Added**: `@google/generative-ai` (Standard Gemini API)
- **Model**: Now using `gemini-3-pro-preview` (Gemini 3 Pro Preview) instead of `gemini-live-2.5-flash-preview`
- **Architecture**: Switched from real-time streaming to standard chat-based API
- **Max Output Tokens**: Increased from 2048 to 8192 for longer responses

### 2. Audio Removal ✅
- **Removed all audio capture systems**:
  - macOS `SystemAudioDump` integration
  - Windows loopback audio capture
  - Linux microphone capture
  - Speaker diarization
  - Audio processing functions
  - Audio token tracking
  
- **Removed IPC handlers**:
  - `start-macos-audio`
  - `stop-macos-audio`
  - `send-audio-content`
  - `send-mic-audio-content`

- **Removed audio utilities**:
  - `audioUtils.js` functions (PCM conversion, audio analysis)
  - Audio buffer processing
  - Audio context management

### 3. UI Simplification ✅
- **Removed settings sections**:
  - "Audio & Microphone" settings
  - "Language & Audio" settings (speech recognition language selector)
  - Audio mode selection (speaker/mic/both)

- **Kept settings sections**:
  - Screen Capture Settings (interval, quality)
  - Interface Layout
  - Keyboard Shortcuts
  - Google Search toggle
  - Stealth Profile
  - Advanced Mode

### 4. Screenshot-Only Mode ✅
- **Preserved functionality**:
  - Automatic screenshot capture at configurable intervals
  - Manual screenshot capture via keyboard shortcut
  - Screenshot quality settings (high/medium/low)
  - Screenshot token tracking and rate limiting

- **How it works now**:
  1. User starts a Gemini session with their API key
  2. Screenshots are captured automatically or manually
  3. Screenshots are stored in memory until the next text query
  4. User sends a text message, which includes all pending screenshots
  5. Gemini 1.5 Pro analyzes the screenshots and responds

### 5. Conversation Flow ✅
**Old Flow (Live API)**:
- Real-time audio streaming → Live transcription → Speaker diarization → Automatic AI responses

**New Flow (Standard API)**:
- Screenshot capture → Store image → User sends text query → Gemini analyzes image + text → Response

### 6. Removed Files/Functions
- Audio processing functions in `renderer.js`:
  - `setupLinuxMicProcessing()`
  - `setupLinuxSystemAudioProcessing()`
  - `setupWindowsLoopbackProcessing()`
  - `convertFloat32ToInt16()`
  - `arrayBufferToBase64()`

- Gemini helper functions:
  - `formatSpeakerResults()`
  - `sendReconnectionContext()`
  - `attemptReconnection()`
  - `startMacOSAudioCapture()`
  - `stopMacOSAudioCapture()`
  - `killExistingSystemAudioDump()`
  - `convertStereoToMono()`
  - `sendAudioToGemini()`

## Installation & Testing

### Install Dependencies
```bash
npm install
```

This will install the new `@google/generative-ai` package and remove the old `@google/genai` package.

### Run the Application
```bash
npm start
```

### Testing the Screenshot Feature

1. **Start the application**
2. **Enter your Gemini API key** (get one from https://aistudio.google.com/apikey)
3. **Choose a profile** (interview, sales, meeting, etc.)
4. **Start the session** - this initializes Gemini 1.5 Pro
5. **Begin screen capture** - select automatic interval or manual mode
6. **Take screenshots**:
   - Automatic: Screenshots captured at the configured interval
   - Manual: Press `Ctrl/Cmd + Enter` to capture a screenshot on demand
7. **Send a text query**: Type a message and press Enter
   - The AI will analyze the screenshot(s) along with your text
   - Response appears in the assistant view

### Expected Behavior

✅ **Should work**:
- Screenshot capture (automatic or manual)
- Text messaging to Gemini
- Screenshot + text combined analysis
- Conversation history saving
- All UI controls and settings (except audio-related)
- Keyboard shortcuts
- Google Search integration (if enabled)

❌ **Should NOT work** (removed):
- Audio capture or microphone access
- Real-time transcription
- Speaker diarization
- Automatic voice-triggered responses
- Language selection for speech
- Audio mode selection

## Breaking Changes

⚠️ **Users upgrading from the previous version should note**:

1. **No more audio capture**: The application no longer captures or processes audio
2. **Manual text input required**: Users must type queries instead of relying on voice transcription
3. **No automatic responses**: Responses only come after explicitly sending a text message
4. **API key**: Requires a standard Gemini API key (same as before, but uses different model)
5. **Language settings removed**: The language selection feature has been removed (no speech recognition)

## File Changes Summary

### Modified Files:
- `package.json` - Updated dependencies
- `src/utils/gemini.js` - Complete rewrite for standard API
- `src/utils/renderer.js` - Removed all audio code
- `src/index.js` - Removed audio cleanup calls
- `src/components/views/CustomizeView.js` - Removed audio settings UI

### Unchanged Files:
- `src/utils/prompts.js` - System prompts remain the same
- `src/components/views/AssistantView.js` - Display logic unchanged
- `src/components/views/MainView.js` - Start flow unchanged
- `src/components/views/HistoryView.js` - History display unchanged
- Most UI styling and layout code

## Model Information

**Available Models** (switchable in-app):

1. **`gemini-3-pro-preview`** (Gemini 3 Pro Preview) - Default
   - Latest preview model with enhanced multimodal understanding
   - Higher output token limit (8192)
   - Best performance for complex queries
   
2. **`gemini-2.5-flash`** (Gemini 2.5 Flash)
   - Faster response times
   - Lower latency
   - Good for quick queries

Both models support:
- Text input ✅
- Image input (screenshots) ✅
- Google Search grounding ✅
- Long context window ✅
- Multi-turn conversations ✅

**Switching Models:**
You can change the model in real-time using the dropdown selector in the assistant view. The model change takes effect when you start a new session.

## Chat-Style Interface ✅

**Complete UI Redesign**: The assistant view has been transformed into a modern chat application interface.

### New Features:
- **Back-and-forth conversation**: Messages are displayed in chronological order like a chat app
- **User messages**: Show your text queries with associated screenshots
- **AI responses**: Displayed in formatted markdown bubbles
- **Screenshot previews**: Screenshots are shown inline with user messages
- **Auto-scroll**: Chat automatically scrolls to show the latest messages
- **Clean design**: Modern chat bubbles with proper spacing and animations

### Removed Features:
- ❌ **Saved Responses**: The save button and saved responses system has been removed
- ❌ **Response Navigation**: No more previous/next response buttons
- ❌ **Response Counter**: Removed response index display
- ❌ **Word-by-word animation**: Removed for simpler, faster rendering

### Updated Views:
- **AssistantView**: Completely rewritten to use a message-based chat interface
- **HistoryView**: Simplified to show informational message only
- **HintAIApp**: Updated to manage chat messages instead of response arrays

### Technical Changes:
- Messages stored as objects: `{ type: 'user'|'ai', content: string, screenshot: base64|null, timestamp: number }`
- Screenshots attached to user messages when available
- Simplified state management (removed response index tracking)
- Markdown rendering preserved for AI responses

## Build Configuration

**Platform**: Windows Only (x64)

The application is now configured to build exclusively for Windows:
- **Removed**: macOS (DMG), Linux (AppImage, DEB, RPM) makers
- **Kept**: Windows Squirrel installer + ZIP portable
- **Removed**: SystemAudioDump from build resources (no longer needed)

### Building for Windows

```bash
# Install dependencies
npm install

# Build Windows installer and portable version
npm run make:win
```

Output location: `out/make/squirrel.windows/x64/`

See **BUILD.md** for detailed build instructions.

## Future Considerations

If you want to add back audio features in the future:
1. Consider using local Whisper.cpp for transcription
2. Implement VAD (Voice Activity Detection) before processing
3. Use the standard API with audio converted to text
4. See AGENTS.md for transcriber project integration plans

