# Voice Integration Documentation

## Overview

The Conversational Budget Manager now includes real-time voice recognition using the **Web Speech API** (browser-native speech-to-text). The integration is designed to work seamlessly with the existing expense tracking functionality.

## How It Works

### Architecture

1. **Voice Service** (`src/services/voiceService.js`)
   - Wraps the Web Speech API
   - Provides a clean interface for voice recognition
   - Handles browser compatibility checks
   - Manages recognition lifecycle (start/stop/listen)

2. **App Integration** (`src/App.jsx`)
   - Integrates voice service on component mount
   - Handles voice recognition results
   - Automatically processes transcribed text
   - Provides visual feedback (listening state, errors)

### Flow

```
User clicks mic button
    ↓
Voice Service starts listening
    ↓
User speaks expense (e.g., "Spent 250 on lunch")
    ↓
Web Speech API converts speech to text
    ↓
Transcript is processed by expense parser
    ↓
Expense is logged and AI responds
```

## Features

✅ **Real-time Speech Recognition**
- Uses browser's native Web Speech API
- No additional API keys required for basic functionality
- Works offline (after initial load)

✅ **Automatic Processing**
- Voice input is automatically processed
- No need to click "Send" after speaking
- Seamless user experience

✅ **Error Handling**
- Clear error messages for common issues
- Browser compatibility checks
- Microphone permission handling

✅ **Visual Feedback**
- Microphone button changes color when listening
- Pulse animation during listening
- Error messages displayed above input

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Best support |
| Edge | ✅ Full | Based on Chromium |
| Safari | ✅ Good | May require user gesture |
| Firefox | ⚠️ Limited | May not work in all versions |
| Mobile | ⚠️ Varies | iOS Safari works, Android Chrome works |

## Usage

### Basic Usage

1. Click the microphone button
2. Allow microphone access when prompted
3. Speak your expense naturally
4. The app processes it automatically

### Example Commands

- "Spent 250 on lunch"
- "Invested 1000 in stocks"
- "Paid 500 for groceries"
- "Bought coffee for 50"
- "Spent 300 on Uber"

## Technical Details

### Voice Service API

```javascript
// Check if voice recognition is available
voiceService.isAvailable()

// Start listening
voiceService.startListening()

// Stop listening
voiceService.stopListening()

// Set callbacks
voiceService.onResult((transcript) => { ... })
voiceService.onError((error) => { ... })
voiceService.onStart(() => { ... })
voiceService.onEnd(() => { ... })
```

### Configuration

The voice service uses the following default settings:
- **Language**: English (en-US)
- **Continuous**: false (stops after user stops speaking)
- **Interim Results**: false (only final results)

To change the language, modify `voiceService.js`:
```javascript
this.recognition.lang = 'en-US'; // Change to your preferred language
```

## Future Enhancements

### Potential Improvements

1. **Agora Cloud Services Integration**
   - Use Agora's cloud-based STT for better accuracy
   - Support for more languages
   - Better offline capabilities

2. **Text-to-Speech (TTS)**
   - AI responses spoken back to user
   - Multi-language support
   - Voice customization

3. **Continuous Listening**
   - Keep microphone active for multiple commands
   - Voice wake word detection
   - Background listening mode

4. **Advanced Features**
   - Voice commands for navigation
   - Voice-based budget queries
   - Multi-language expense tracking

## Troubleshooting

### Common Issues

**Issue**: "Voice recognition is not supported"
- **Solution**: Use Chrome, Edge, or Safari browser

**Issue**: "Microphone permission denied"
- **Solution**: 
  1. Check browser settings
  2. Allow microphone access for the site
  3. Refresh the page

**Issue**: "No speech detected"
- **Solution**:
  1. Check microphone is working
  2. Speak clearly and loudly
  3. Reduce background noise

**Issue**: Poor recognition accuracy
- **Solution**:
  1. Speak clearly and at normal pace
  2. Use supported phrases (see example commands)
  3. Check microphone quality

## Security & Privacy

- **Local Processing**: Speech recognition happens in the browser
- **No Cloud Storage**: Voice data is not sent to external servers (with Web Speech API)
- **User Control**: Users can grant/revoke microphone access anytime
- **HTTPS Required**: For production, HTTPS is required for microphone access

## Notes

- The current implementation uses **Web Speech API** which is free and browser-native
- **Agora RTC SDK** is included in dependencies but not actively used in the current implementation
- For production use with Agora cloud services, you would need to:
  1. Set up Agora account and get credentials
  2. Configure `.env` file with App ID and Certificate
  3. Modify `voiceService.js` to use Agora's STT service instead of Web Speech API

---

For setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
For quick start, see [QUICK_START.md](./QUICK_START.md)

