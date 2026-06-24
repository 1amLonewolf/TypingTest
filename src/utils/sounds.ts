// Using dynamic imports for Tone.js to prevent internal initialization 
// until an explicit user gesture occurs.
type ToneModule = typeof import('tone');

class SoundManager {
  private isInitialized = false;
  private Tone: ToneModule | null = null;
  private currentTheme: string = 'serika-dark';
  
  // Ambient components (typed as any to avoid early Tone dependency)
  private ambientNoise: any = null;
  private ambientFilter: any = null;
  private eventLoop: any = null;

  // Keystroke synthesis using Web Audio API (Legacy-style for quality)
  private audioCtx: AudioContext | null = null;

  private initWebAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private async getTone(): Promise<ToneModule> {
    if (!this.Tone) {
      // DYNAMIC IMPORT is key here. It prevents Tone.js from running its
      // internal autoplay tests during the initial script evaluation.
      this.Tone = await import('tone');
    }
    return this.Tone;
  }

  private async initTone() {
    if (this.isInitialized) return;
    const Tone = await this.getTone();
    await Tone.start();
    this.isInitialized = true;
  }

  async resume() {
    this.initWebAudio();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
    // We do NOT call initTone here to keep the console clean 
    // until the user specifically wants music.
  }

  playClick(type: 'correct' | 'incorrect') {
    this.initWebAudio();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    const now = this.audioCtx.currentTime;

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    } else {
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    }

    osc.start(now);
    osc.stop(now + (type === 'correct' ? 0.05 : 0.1));
  }

  async toggleAmbient(theme: string) {
    this.currentTheme = theme;
    const Tone = await this.getTone();
    await this.initTone();

    if (Tone.Transport.state === 'started') {
      await this.stopAmbient();
      return false;
    } else {
      await this.startAmbient();
      return true;
    }
  }

  private async startAmbient() {
    const Tone = await this.getTone();
    await this.stopAmbient(); // Clean up existing

    const themeMap: Record<string, { noise: string, frequency: number }> = {
      'serika-dark': { noise: 'brown', frequency: 100 },
      'carbon': { noise: 'pink', frequency: 800 },
      'dracula': { noise: 'brown', frequency: 200 },
      'nord': { noise: 'white', frequency: 1500 },
    };

    const cfg = themeMap[this.currentTheme] || themeMap['serika-dark'];

    this.ambientNoise = new Tone.Noise(cfg.noise as any).start();
    this.ambientFilter = new Tone.AutoFilter({
      frequency: 0.1,
      baseFrequency: cfg.frequency,
      octaves: 2,
      filter: {
        type: 'lowpass',
        rolloff: -12,
        Q: 1
      }
    }).connect(Tone.getDestination());
    
    this.ambientNoise.connect(this.ambientFilter);
    this.ambientFilter.start();
    this.ambientNoise.volume.value = -30;

    this.eventLoop = new Tone.Loop((time) => {
      if (Math.random() > 0.7) {
        this.triggerNatureEvent(time);
      }
    }, '2n').start(0);

    Tone.Transport.start();
  }

  private async triggerNatureEvent(time: number) {
    const Tone = await this.getTone();
    const osc = new Tone.Oscillator().toDestination();
    
    if (this.currentTheme === 'carbon') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, time);
      const env = new Tone.AmplitudeEnvelope({ attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }).toDestination();
      osc.connect(env);
      env.triggerAttackRelease(0.05, time);
      osc.start(time).stop(time + 0.1);
    } else if (this.currentTheme === 'serika-dark') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2500, time);
      const env = new Tone.AmplitudeEnvelope({ attack: 0.01, decay: 0.01, sustain: 1, release: 0.01 }).toDestination();
      osc.connect(env);
      env.triggerAttackRelease(0.02, time);
      osc.start(time).stop(time + 0.05);
    }
  }

  async stopAmbient() {
    if (!this.Tone) return;
    const Tone = this.Tone;

    if (this.ambientNoise) {
      this.ambientNoise.stop();
      this.ambientNoise.dispose();
      this.ambientNoise = null;
    }
    if (this.ambientFilter) {
      this.ambientFilter.dispose();
      this.ambientFilter = null;
    }
    if (this.eventLoop) {
      this.eventLoop.dispose();
      this.eventLoop = null;
    }
    Tone.Transport.stop();
  }

  async updateTheme(theme: string) {
    this.currentTheme = theme;
    // Only update Tone settings if it has already been loaded and ambient is active
    if (this.Tone && this.Tone.Transport.state === 'started') {
      await this.startAmbient();
    }
  }
}

export const soundManager = new SoundManager();
