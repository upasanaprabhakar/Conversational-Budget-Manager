/**
 * Voice Service for Conversational Budget Manager
 * Integrates Agora RTC SDK for audio capture and Web Speech API for speech-to-text
 * Can be extended to use Agora's cloud STT services
 */

<<<<<<< HEAD
// Proper ESM import for Vite/React
import AgoraRTC from "agora-rtc-sdk-ng";
=======
import AgoraRTC from 'agora-rtc-sdk-ng';
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976

class VoiceService {
  constructor() {
    this.client = null;
    this.localAudioTrack = null;
    this.isListening = false;
    this.isInitialized = false;
<<<<<<< HEAD

=======
    
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    // Callbacks
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.onStartCallback = null;
    this.onEndCallback = null;
<<<<<<< HEAD

    // Speech recognition
    this.recognition = null;
    this.useAgoraAudio = false;

    // Agora configuration
    this.appId = import.meta.env.VITE_AGORA_APP_ID || "fcd3ec59c9a54db0897e8d30af1a08a4";
    this.appCertificate = import.meta.env.VITE_AGORA_APP_CERTIFICATE || "23080a50ca7541a0869dfc5255d16428";
    this.channelName = "budget-manager-voice";
    this.uid = null;

=======
    
    // Speech recognition (fallback/primary)
    this.recognition = null;
    this.useAgoraAudio = false;
    
    // Agora configuration
    this.appId = import.meta.env.VITE_AGORA_APP_ID || 'fcd3ec59c9a54db0897e8d30af1a08a4';
    this.appCertificate = import.meta.env.VITE_AGORA_APP_CERTIFICATE || '23080a50ca7541a0869dfc5255d16428';
    this.channelName = 'budget-manager-voice';
    this.uid = null;
    
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    // Initialize both systems
    this.initSpeechRecognition();
    this.initAgora();
  }

  /**
   * Initialize Agora RTC client
   */
  async initAgora() {
    try {
<<<<<<< HEAD
      if (!this.appId || !AgoraRTC) {
        console.warn("Agora App ID not configured or SDK not loaded.");
        return;
      }

      this.client = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });

      this.client.on("user-published", async (user, mediaType) => {
        if (mediaType === "audio") {
=======
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
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack?.play();
        }
      });

<<<<<<< HEAD
      this.client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
=======
      this.client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'audio') {
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack?.stop();
        }
      });

      this.isInitialized = true;
<<<<<<< HEAD
      console.log("Agora RTC client initialized with App ID:", this.appId);
    } catch (error) {
      console.error("Error initializing Agora:", error);
=======
      console.log('Agora RTC client initialized with App ID:', this.appId);
    } catch (error) {
      console.error('Error initializing Agora:', error);
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
      this.isInitialized = false;
    }
  }

  /**
<<<<<<< HEAD
   * Initialize Web Speech API
   */
  initSpeechRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Web Speech API is not supported in this browser");
=======
   * Initialize Web Speech API as fallback/primary
   */
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser');
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
<<<<<<< HEAD
    this.recognition.lang = "en-US";

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStartCallback) this.onStartCallback();
=======
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStartCallback) {
        this.onStartCallback();
      }
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
<<<<<<< HEAD
      if (this.onResultCallback) this.onResultCallback(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (this.onErrorCallback) this.onErrorCallback(event.error);
=======
      if (this.onResultCallback) {
        this.onResultCallback(transcript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    };

    this.recognition.onend = () => {
      this.isListening = false;
<<<<<<< HEAD
      if (this.onEndCallback) this.onEndCallback();
=======
      if (this.onEndCallback) {
        this.onEndCallback();
      }
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    };
  }

  /**
   * Start Agora audio capture
   */
  async startAgoraAudio() {
    try {
<<<<<<< HEAD
      if (!this.isInitialized || !this.client)
        throw new Error("Agora client not initialized");

      this.uid = Math.floor(Math.random() * 100000);

      await this.client.join(
        this.appId,
        this.channelName,
        null,
        this.uid
      );

      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: "speech_standard",
        AEC: true,
        ANS: true,
        AGC: true,
=======
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
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
      });

      await this.client.publish([this.localAudioTrack]);

<<<<<<< HEAD
      console.log("Agora audio capture started");
      return true;
    } catch (error) {
      console.error("Error starting Agora audio:", error);
=======
      console.log('Agora audio capture started');
      return true;
    } catch (error) {
      console.error('Error starting Agora audio:', error);
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
      throw error;
    }
  }

<<<<<<< HEAD
=======
  /**
   * Stop Agora audio capture
   */
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
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

<<<<<<< HEAD
      console.log("Agora audio capture stopped");
    } catch (error) {
      console.error("Error stopping Agora audio:", error);
    }
  }

  isAvailable() {
    return this.recognition !== null || this.isInitialized;
  }

  async startListening() {
    if (this.isListening) {
      console.warn("Already listening");
=======
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
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
      return;
    }

    try {
<<<<<<< HEAD
      if (this.isInitialized && this.appId && AgoraRTC) {
        try {
          await this.startAgoraAudio();
          this.useAgoraAudio = true;

          if (this.recognition) this.recognition.start();
          else throw new Error("Speech recognition not available");
        } catch (agoraError) {
          console.warn("Agora failed, falling back:", agoraError);
          this.useAgoraAudio = false;

          if (this.recognition) this.recognition.start();
          else throw new Error("No voice recognition available");
        }
      } else {
        this.useAgoraAudio = false;

        if (this.recognition) this.recognition.start();
        else throw new Error("Voice recognition not available");
      }
    } catch (error) {
      console.error("Error starting voice recognition:", error);
      if (this.onErrorCallback) this.onErrorCallback(error.message);
=======
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
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
      throw error;
    }
  }

<<<<<<< HEAD
  async stopListening() {
    try {
      if (this.recognition && this.isListening) this.recognition.stop();

=======
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
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
      if (this.useAgoraAudio) {
        await this.stopAgoraAudio();
        this.useAgoraAudio = false;
      }

      this.isListening = false;
    } catch (error) {
<<<<<<< HEAD
      console.error("Error stopping voice recognition:", error);
    }
  }

  onResult(cb) {
    this.onResultCallback = cb;
  }

  onError(cb) {
    this.onErrorCallback = cb;
  }

  onStart(cb) {
    this.onStartCallback = cb;
  }

  onEnd(cb) {
    this.onEndCallback = cb;
  }

=======
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
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
  getAudioTrack() {
    return this.localAudioTrack;
  }

<<<<<<< HEAD
=======
  /**
   * Check if using Agora for audio capture
   */
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
  isUsingAgora() {
    return this.useAgoraAudio && this.isInitialized;
  }

<<<<<<< HEAD
  async destroy() {
    await this.stopListening();

    if (this.client) {
      try {
        await this.client.leave();
      } catch (e) {
        console.error("Error leaving Agora:", e);
=======
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
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
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

<<<<<<< HEAD
=======
// Export singleton instance
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
export default new VoiceService();
