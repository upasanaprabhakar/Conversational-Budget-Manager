/**
 * Voice Service for Conversational Budget Manager
 * Integrates Agora RTC SDK for audio capture and Web Speech API for speech-to-text
 * Can be extended to use Agora's cloud STT services
 */

// Proper ESM import for Vite/React
import AgoraRTC from "agora-rtc-sdk-ng";

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

    // Speech recognition
    this.recognition = null;
    this.useAgoraAudio = false;

    // Agora configuration
    this.appId = import.meta.env.VITE_AGORA_APP_ID || "fcd3ec59c9a54db0897e8d30af1a08a4";
    this.appCertificate = import.meta.env.VITE_AGORA_APP_CERTIFICATE || "23080a50ca7541a0869dfc5255d16428";
    this.channelName = "budget-manager-voice";
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
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack?.play();
        }
      });

      this.client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack?.stop();
        }
      });

      this.isInitialized = true;
      console.log("Agora RTC client initialized with App ID:", this.appId);
    } catch (error) {
      console.error("Error initializing Agora:", error);
      this.isInitialized = false;
    }
  }

  /**
   * Initialize Web Speech API
   */
  initSpeechRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Web Speech API is not supported in this browser");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = "en-US";

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStartCallback) this.onStartCallback();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (this.onResultCallback) this.onResultCallback(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (this.onErrorCallback) this.onErrorCallback(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) this.onEndCallback();
    };
  }

  /**
   * Start Agora audio capture
   */
  async startAgoraAudio() {
    try {
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
      });

      await this.client.publish([this.localAudioTrack]);

      console.log("Agora audio capture started");
      return true;
    } catch (error) {
      console.error("Error starting Agora audio:", error);
      throw error;
    }
  }

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
      return;
    }

    try {
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
      throw error;
    }
  }

  async stopListening() {
    try {
      if (this.recognition && this.isListening) this.recognition.stop();

      if (this.useAgoraAudio) {
        await this.stopAgoraAudio();
        this.useAgoraAudio = false;
      }

      this.isListening = false;
    } catch (error) {
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

  getAudioTrack() {
    return this.localAudioTrack;
  }

  isUsingAgora() {
    return this.useAgoraAudio && this.isInitialized;
  }

  async destroy() {
    await this.stopListening();

    if (this.client) {
      try {
        await this.client.leave();
      } catch (e) {
        console.error("Error leaving Agora:", e);
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

export default new VoiceService();
