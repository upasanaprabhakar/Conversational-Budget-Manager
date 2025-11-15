# Agora AI Voice Integration Setup Guide

## Overview

The voice assistant now uses **Agora RTC SDK** for high-quality audio capture combined with **Web Speech API** for speech-to-text conversion. This provides better audio quality and reliability compared to using Web Speech API alone.

## Features

✅ **Agora RTC SDK Integration**
- High-quality audio capture
- Noise suppression and echo cancellation
- Better audio processing for speech recognition

✅ **Hybrid Approach**
- Uses Agora for audio capture when configured
- Falls back to Web Speech API if Agora is not configured
- Web Speech API handles speech-to-text conversion

✅ **Automatic Fallback**
- If Agora fails, automatically uses Web Speech API
- Works even without Agora credentials

## Setup Instructions

### Step 1: Create Agora Account

1. Visit [Agora Console](https://console.agora.io/)
2. Sign up for a free account
3. Create a new project
4. Copy your **App ID** from the project settings

### Step 2: Configure Environment Variables

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Add your Agora App ID:
   ```env
   VITE_AGORA_APP_ID=your_app_id_here
   ```

3. Replace `your_app_id_here` with your actual App ID from Agora Console

### Step 3: Install Dependencies

The Agora RTC SDK is already included in `package.json`. If you need to reinstall:

```bash
npm install
```

### Step 4: Run the Application

```bash
npm run dev
```

## How It Works

### With Agora App ID Configured

1. **Audio Capture**: Agora RTC SDK captures high-quality audio from microphone
2. **Audio Processing**: Agora applies noise suppression, echo cancellation, and gain control
3. **Speech Recognition**: Web Speech API converts the processed audio to text
4. **Result**: Transcribed text is processed by the expense parser

### Without Agora App ID (Fallback)

1. **Audio Capture**: Web Speech API handles both audio capture and recognition
2. **Result**: Works the same way but with standard browser audio quality

## Testing

1. **Start the app**: `npm run dev`
2. **Click the microphone button** in the chat interface
3. **Allow microphone permissions** when prompted
4. **Speak your expense**: e.g., "Spent 250 on lunch"
5. **Verify**: The app should transcribe and process your voice input

## Troubleshooting

### Issue: "Agora client not initialized"

**Solution**: 
- Check that your `.env` file exists and contains `VITE_AGORA_APP_ID`
- Verify your App ID is correct
- Restart the development server after adding `.env` file

### Issue: "Voice recognition is not available"

**Solution**:
- The app will automatically fall back to Web Speech API
- Make sure you're using Chrome, Edge, or Safari
- Check browser microphone permissions

### Issue: Microphone not working

**Solution**:
- Check browser permissions (Settings → Privacy → Microphone)
- Make sure you're on HTTPS or localhost
- Try a different browser

### Issue: Poor audio quality

**Solution**:
- Ensure Agora App ID is configured (uses better audio processing)
- Check microphone hardware
- Reduce background noise

## Production Deployment

### Token Generation (Required for Production)

For production, you need to generate tokens from your backend:

1. **Backend Setup**: Create a token generation endpoint
2. **Token Service**: Use Agora's token generator library
3. **Update Code**: Modify `voiceService.js` to fetch tokens from your backend

Example token generation (Node.js):
```javascript
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

function generateToken(appId, appCertificate, channelName, uid) {
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600; // 1 hour
  
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  
  return RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
}
```

### Environment Variables

Make sure to set `VITE_AGORA_APP_ID` in your production environment.

## Advanced Configuration

### Custom Audio Settings

You can modify audio settings in `voiceService.js`:

```javascript
this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
  encoderConfig: 'speech_standard', // Options: 'speech_low_quality', 'speech_standard', 'speech_high_quality'
  AEC: true,  // Acoustic Echo Cancellation
  ANS: true,  // Automatic Noise Suppression
  AGC: true,  // Automatic Gain Control
});
```

### Channel Configuration

Change the channel name in `voiceService.js`:

```javascript
this.channelName = 'your-custom-channel-name';
```

## Next Steps

1. ✅ Set up Agora account and get App ID
2. ✅ Configure `.env` file
3. ✅ Test voice recognition
4. 🔄 (Optional) Set up backend for token generation
5. 🔄 (Optional) Integrate with Agora's cloud STT for better accuracy

## Support

- [Agora Documentation](https://docs.agora.io/)
- [Agora RTC SDK for Web](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=web)
- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

**Note**: The current implementation uses Web Speech API for speech-to-text. For production-grade STT, consider integrating with Agora's cloud services or other STT providers like Google Cloud Speech-to-Text or AWS Transcribe.

