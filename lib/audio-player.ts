// Audio player supporting server Gemini TTS (gemini-3.1-flash-tts-preview)
// and seamless browser Web Speech API fallback

export interface AudioPlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentText: string;
  source: "gemini" | "webspeech" | null;
}

type StateListener = (state: AudioPlaybackState) => void;

class AudioPlayer {
  private audioCtx: AudioContext | null = null;
  private currentSourceNode: AudioBufferSourceNode | null = null;
  private listeners: Set<StateListener> = new Set();
  private state: AudioPlaybackState = {
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    currentText: "",
    source: null,
  };
  private speechUtterance: SpeechSynthesisUtterance | null = null;

  private notify() {
    this.listeners.forEach((l) => l({ ...this.state }));
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => this.listeners.delete(listener);
  }

  public getState(): AudioPlaybackState {
    return { ...this.state };
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx({ sampleRate: 24000 });
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public stop() {
    // Stop Web Audio node
    if (this.currentSourceNode) {
      try {
        this.currentSourceNode.stop();
        this.currentSourceNode.disconnect();
      } catch {}
      this.currentSourceNode = null;
    }

    // Stop Web Speech
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.speechUtterance = null;
    }

    this.state = {
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      currentText: "",
      source: null,
    };
    this.notify();
  }

  public pause() {
    if (this.state.source === "webspeech" && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      this.state.isPaused = true;
      this.notify();
    } else if (this.audioCtx && this.state.source === "gemini") {
      this.audioCtx.suspend();
      this.state.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.state.source === "webspeech" && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      this.state.isPaused = false;
      this.notify();
    } else if (this.audioCtx && this.state.source === "gemini") {
      this.audioCtx.resume();
      this.state.isPaused = false;
      this.notify();
    }
  }

  public async speakText(text: string, voiceName: string = "Kore"): Promise<void> {
    this.stop();

    if (!text.trim()) return;

    this.state = {
      isPlaying: false,
      isPaused: false,
      isLoading: true,
      currentText: text,
      source: null,
    };
    this.notify();

    try {
      // First attempt Gemini TTS API
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: voiceName }),
      });

      if (!res.ok) {
        throw new Error(`TTS API returned status ${res.status}`);
      }

      const data = await res.json();

      if (data.audioData && !data.fallbackToWebSpeech) {
        await this.playGeminiAudio(data.audioData, data.sampleRate || 24000);
        return;
      }
    } catch (err) {
      console.warn("Gemini TTS playback fallback to Web Speech:", err);
    }

    // High quality fallback: Browser Web Speech API
    this.playWebSpeech(text);
  }

  private playWebSpeech(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.state.isLoading = false;
      this.notify();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick best English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Natural") ||
          v.name.includes("Google") ||
          v.name.includes("Samantha") ||
          v.name.includes("Daniel") ||
          v.name.includes("Siri"))
    ) || voices.find((v) => v.lang.startsWith("en"));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      this.state = {
        isPlaying: true,
        isPaused: false,
        isLoading: false,
        currentText: text,
        source: "webspeech",
      };
      this.notify();
    };

    utterance.onend = () => {
      this.state = {
        isPlaying: false,
        isPaused: false,
        isLoading: false,
        currentText: "",
        source: null,
      };
      this.speechUtterance = null;
      this.notify();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis event error:", e);
      this.state = {
        isPlaying: false,
        isPaused: false,
        isLoading: false,
        currentText: "",
        source: null,
      };
      this.speechUtterance = null;
      this.notify();
    };

    this.speechUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  private async playGeminiAudio(base64Audio: string, sampleRate: number = 24000): Promise<void> {
    const ctx = this.getAudioContext();
    if (!ctx) {
      this.playWebSpeech(this.state.currentText);
      return;
    }

    try {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Check if it's WAV or raw PCM linear16
      let audioBuffer: AudioBuffer;

      // Check WAV header ("RIFF")
      if (
        bytes.length > 4 &&
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46
      ) {
        audioBuffer = await ctx.decodeAudioData(bytes.buffer);
      } else {
        // Raw 16-bit PCM mono
        const int16Array = new Int16Array(bytes.buffer);
        const floatArray = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
          floatArray[i] = int16Array[i] / 32768.0;
        }

        audioBuffer = ctx.createBuffer(1, floatArray.length, sampleRate);
        audioBuffer.copyToChannel(floatArray, 0, 0);
      }

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      source.onended = () => {
        if (this.currentSourceNode === source) {
          this.state = {
            isPlaying: false,
            isPaused: false,
            isLoading: false,
            currentText: "",
            source: null,
          };
          this.currentSourceNode = null;
          this.notify();
        }
      };

      this.currentSourceNode = source;
      source.start();

      this.state = {
        isPlaying: true,
        isPaused: false,
        isLoading: false,
        currentText: this.state.currentText,
        source: "gemini",
      };
      this.notify();
    } catch (err) {
      console.warn("PCM decode error, falling back to Web Speech:", err);
      this.playWebSpeech(this.state.currentText);
    }
  }
}

export const audioPlayer = new AudioPlayer();
