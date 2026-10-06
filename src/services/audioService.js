// Web Audio API Sound Effects & Speech Synthesis Engine for Uzbek Language

class AudioService {
  constructor() {
    this.ctx = null;
    this.speechSynth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.soundEnabled = true;
    this.voiceEnabled = true;
    this.cachedVoices = [];

    if (typeof window !== 'undefined' && this.speechSynth) {
      this.loadVoices();
      if (this.speechSynth.onvoiceschanged !== undefined) {
        this.speechSynth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.speechSynth) return;
    this.cachedVoices = this.speechSynth.getVoices() || [];
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play custom synthesized sound effects
  playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  playCorrect() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Cheerful major chord arpeggio (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + (idx * 0.08);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.36);
      });
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  playWrong() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Gentle, friendly "boing" error, not harsh
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  playLevelUp() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Fanfare notes
      const notes = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.50];
      const durations = [0.1, 0.1, 0.1, 0.15, 0.2, 0.6];
      let t = now;
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + durations[i]);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + durations[i] + 0.05);
        t += durations[i] * 0.9;
      });
    } catch (e) {
      console.warn('Fanfare error', e);
    }
  }

  playStar() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.18);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn('Star audio error', e);
    }
  }

  // Preprocess text to ensure clean Uzbek phonetics and avoid robotic/English quirks
  formatUzbekPhonetics(text) {
    if (!text) return '';
    let t = String(text);
    
    // Replace apostrophe variants with clean single quote for TTS
    t = t.replace(/[ʻ`‘’]/g, "'");
    
    // Normalize special Uzbek letters for smooth audio pronunciation
    t = t.replace(/\bO'\b/gi, 'O‘');
    t = t.replace(/\bG'\b/gi, 'G‘a');
    t = t.replace(/\bSh\b/gi, 'Sha');
    t = t.replace(/\bCh\b/gi, 'Cha');
    t = t.replace(/\bNg\b/gi, 'Eng');

    return t;
  }

  // Text-To-Speech Pronunciation for Uzbek
  speakUzbek(text, onEnd = null) {
    if (!this.voiceEnabled) {
      if (onEnd) onEnd();
      return;
    }
    if (!this.speechSynth) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.speechSynth.cancel(); // Cancel any lingering speech

      const formatted = this.formatUzbekPhonetics(text);
      const utterance = new SpeechSynthesisUtterance(formatted);
      
      // Warm, child-friendly rate and pitch
      utterance.rate = 0.88; // slightly relaxed for clear child comprehension
      utterance.pitch = 1.12; // warm friendly tone

      // Select best matching voice
      if (this.cachedVoices.length === 0) {
        this.loadVoices();
      }

      // Priority 1: Uzbek locale (uz-UZ, uz)
      // Priority 2: Turkish / Azerbaijani / Turkic (tr-TR, az-AZ, kk-KZ)
      // Priority 3: Natural multilingual voices
      let chosenVoice = this.cachedVoices.find(v => 
        v.lang && (v.lang.startsWith('uz') || v.lang.includes('Uzbek') || v.name.includes('Uzbek'))
      );

      if (!chosenVoice) {
        chosenVoice = this.cachedVoices.find(v => 
          v.lang && (v.lang.startsWith('tr') || v.lang.startsWith('az') || v.lang.startsWith('kk'))
        );
      }

      if (!chosenVoice) {
        chosenVoice = this.cachedVoices.find(v => 
          v.name.includes('Natural') || v.name.includes('Online') || v.lang.startsWith('ru')
        );
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      utterance.lang = chosenVoice ? chosenVoice.lang : 'uz-UZ';

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }

      this.speechSynth.speak(utterance);
    } catch (err) {
      console.warn('TTS error:', err);
      if (onEnd) onEnd();
    }
  }

  // Exact Uzbek letter names & phonetics helper
  speakLetter(letter) {
    const uzbekLetterNames = {
      'A': 'A',
      'a': 'A',
      'B': 'Be',
      'b': 'Be',
      'D': 'De',
      'd': 'De',
      'E': 'E',
      'e': 'E',
      'F': 'Ef',
      'f': 'Ef',
      'G': 'Ge',
      'g': 'Ge',
      'H': 'Ha',
      'h': 'Ha',
      'I': 'I',
      'i': 'I',
      'J': 'Je',
      'j': 'Je',
      'K': 'Ka',
      'k': 'Ka',
      'L': 'El',
      'l': 'El',
      'M': 'Em',
      'm': 'Em',
      'N': 'En',
      'n': 'En',
      'O': 'O',
      'o': 'O',
      'P': 'Pe',
      'p': 'Pe',
      'Q': 'Qa',
      'q': 'Qa',
      'R': 'Er',
      'r': 'Er',
      'S': 'Es',
      's': 'Es',
      'T': 'Te',
      't': 'Te',
      'U': 'U',
      'u': 'U',
      'V': 'Ve',
      'v': 'Ve',
      'X': 'Xa',
      'x': 'Xa',
      'Y': 'Ye',
      'y': 'Ye',
      'Z': 'Ze',
      'z': 'Ze',
      'O‘': 'O‘',
      'o‘': 'O‘',
      'Oʻ': 'O‘',
      'oʻ': 'O‘',
      "O'": 'O‘',
      "o'": 'O‘',
      'G‘': 'G‘a',
      'g‘': 'G‘a',
      'Gʻ': 'G‘a',
      'gʻ': 'G‘a',
      "G'": 'G‘a',
      "g'": 'G‘a',
      'Sh': 'Sha',
      'sh': 'Sha',
      'Ch': 'Cha',
      'ch': 'Cha',
      'Ng': 'Eng',
      'ng': 'Eng'
    };

    const phoneticName = uzbekLetterNames[letter] || letter;
    this.speakUzbek(phoneticName);
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    return this.voiceEnabled;
  }
}

export const audio = new AudioService();
export default audio;
