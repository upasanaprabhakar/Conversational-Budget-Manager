/**
 * Voice Service for Conversational Budget Manager
 * Integrates Agora RTC SDK for audio capture and Web Speech API for speech-to-text
 * Can be extended to use Agora's cloud STT services
 */

import AgoraRTC from 'agora-rtc-sdk-ng';

class VoiceService {
  constructor() {
    this.client = null;
    this.localAudioTrack = null;
    this.isListening = false;
    this.isInitialized = false;
    
    // Callbacks
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.onStartCallback = null;
    this.onEndCallback = null;
    
    // Speech recognition (fallback/primary)
    this.recognition = null;
    this.useAgoraAudio = false;
    
    // Agora configuration
    this.appId = import.meta.env.VITE_AGORA_APP_ID || 'fcd3ec59c9a54db0897e8d30af1a08a4';
    this.appCertificate = import.meta.env.VITE_AGORA_APP_CERTIFICATE || '23080a50ca7541a0869dfc5255d16428';
    this.channelName = 'budget-manager-voice';
    this.uid = null;
    
    // Initialize both systems
    this.initSpeechRecognition();
    this.initAgora();
  }

  /**
   * Initialize Agora RTC client
   */
  async initAgora() {
    try {
      // Check if Agora App ID is configured
      if (!this.appId) {
        console.warn('Agora App ID not configured. Using Web Speech API only.');
        return;
      }

      // Create Agora client
      this.client = AgoraRTC.createClient({ 
        mode: 'rtc', 
        codec: 'vp8' 
      });

      // Set up event handlers
      this.client.on('user-published', async (user, mediaType) => {
        if (mediaType === 'audio') {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack?.play();
        }
      });

      this.client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'audio') {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack?.stop();
        }
      });

      this.isInitialized = true;
      console.log('Agora RTC client initialized with App ID:', this.appId);
    } catch (error) {
      console.error('Error initializing Agora:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Initialize Web Speech API as fallback/primary
   */
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStartCallback) {
        this.onStartCallback();
      }
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (this.onResultCallback) {
        this.onResultCallback(transcript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };
  }

  /**
   * Start Agora audio capture
   */
  async startAgoraAudio() {
    try {
      if (!this.isInitialized || !this.client) {
        throw new Error('Agora client not initialized');
      }

      // Generate a unique UID for this session
      this.uid = Math.floor(Math.random() * 100000);

      // Join channel (using a temporary token - in production, generate token from backend)
      await this.client.join(
        this.appId,
        this.channelName,
        null, // token - null for testing, use proper token in production
        this.uid
      );

      // Create and publish local audio track
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: 'speech_standard', // Optimized for speech
        AEC: true, // Acoustic Echo Cancellation
        ANS: true, // Automatic Noise Suppression
        AGC: true, // Automatic Gain Control
      });

      await this.client.publish([this.localAudioTrack]);

      console.log('Agora audio capture started');
      return true;
    } catch (error) {
      console.error('Error starting Agora audio:', error);
      throw error;
    }
  }

  /**
   * Stop Agora audio capture
   */
  async stopAgoraAudio() {
    try {
      if (this.localAudioTrack) {
        this.localAudioTrack.stop();
        this.localAudioTrack.close();
        this.localAudioTrack = null;
      }

      if (this.client) {
        await this.client.unpublish();
        await this.client.leave();
      }

      console.log('Agora audio capture stopped');
    } catch (error) {
      console.error('Error stopping Agora audio:', error);
    }
  }

  /**
   * Check if voice recognition is available
   */
  isAvailable() {
    // Available if either Web Speech API or Agora is available
    return this.recognition !== null || this.isInitialized;
  }

  /**
   * Start listening for voice input
   */
  async startListening() {
    if (this.isListening) {
      console.warn('Already listening');
      return;
    }

    try {
      // Try to use Agora if available, otherwise fall back to Web Speech API
      if (this.isInitialized && this.appId) {
        try {
          await this.startAgoraAudio();
          this.useAgoraAudio = true;
          
          // Start Web Speech API for transcription (Agora handles audio capture)
          if (this.recognition) {
            this.recognition.start();
          } else {
            throw new Error('Speech recognition not available');
          }
        } catch (agoraError) {
          console.warn('Agora audio failed, falling back to Web Speech API:', agoraError);
          this.useAgoraAudio = false;
          if (this.recognition) {
            this.recognition.start();
          } else {
            throw new Error('No voice recognition available');
          }
        }
      } else {
        // Use Web Speech API only
        this.useAgoraAudio = false;
        if (this.recognition) {
          this.recognition.start();
        } else {
          throw new Error('Voice recognition is not available in this browser');
        }
      }
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      if (this.onErrorCallback) {
        this.onErrorCallback(error.message || 'Failed to start voice recognition');
      }
      throw error;
    }
  }

  /**
   * Stop listening for voice input
   */
  async stopListening() {
    try {
      // Stop Web Speech API
      if (this.recognition && this.isListening) {
        this.recognition.stop();
      }

      // Stop Agora audio if it was used
      if (this.useAgoraAudio) {
        await this.stopAgoraAudio();
        this.useAgoraAudio = false;
      }

      this.isListening = false;
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  }

  /**
   * Set callback for when speech is recognized
   */
  onResult(callback) {
    this.onResultCallback = callback;
  }

  /**
   * Set callback for errors
   */
  onError(callback) {
    this.onErrorCallback = callback;
  }

  /**
   * Set callback for when listening starts
   */
  onStart(callback) {
    this.onStartCallback = callback;
  }

  /**
   * Set callback for when listening ends
   */
  onEnd(callback) {
    this.onEndCallback = callback;
  }

  /**
   * Get audio track for processing (if using Agora)
   */
  getAudioTrack() {
    return this.localAudioTrack;
  }

  /**
   * Check if using Agora for audio capture
   */
  isUsingAgora() {
    return this.useAgoraAudio && this.isInitialized;
  }

  /**
   * Clean up resources
   */
  async destroy() {
    await this.stopListening();
    
    if (this.client) {
      try {
        await this.client.leave();
      } catch (error) {
        console.error('Error leaving Agora channel:', error);
      }
      this.client = null;
    }

    this.localAudioTrack = null;
    this.recognition = null;
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.onStartCallback = null;
    this.onEndCallback = null;
    this.isInitialized = false;
  }
}

// Export singleton instance
export default new VoiceService();
