export class AudioSystem {
  constructor() {
    this.enabled = false;
    this.unlocked = false;
    this.currentAudio = null;
    this.sounds = {
      rain: 'assets/audio/rain.mp3',
      snow: 'assets/audio/snow.mp3',
      sunny: 'assets/audio/sunny.mp3'
    };
  }

  async loadSounds() {
    // Preload audio files
    await Promise.all(
      Object.values(this.sounds).map(url => this.preloadAudio(url))
    );
  }

  async preloadAudio(url) {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.addEventListener('canplaythrough', resolve, { once: true });
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    document.querySelector('.audio-control').textContent = 
      this.enabled ? '🔊' : '🔇';
    
    if (this.enabled && !this.unlocked) {
      this.unlockAudio();
    } else if (!this.enabled) {
      this.stop();
    }
  }

  unlockAudio() {
    // Play silent audio to unlock Web Audio API
    const silentAudio = new Audio();
    silentAudio.play().then(() => {
      this.unlocked = true;
      silentAudio.remove();
    }).catch(e => console.error('Audio unlock failed:', e));
  }

  play(type) {
    if (!this.enabled || !this.unlocked) return;
    
    this.stop();
    
    if (!this.sounds[type]) return;
    
    try {
      // Try Web Audio API first
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createBufferSource();
      
      fetch(this.sounds[type])
        .then(response => response.arrayBuffer())
        .then(buffer => audioContext.decodeAudioData(buffer))
        .then(decoded => {
          source.buffer = decoded;
          source.loop = true;
          
          // Add spatial effect based on time
          const panner = audioContext.createPanner();
          panner.panningModel = 'HRTF';
          const hours = new Date().getHours();
          panner.setPosition(
            Math.sin((hours / 24) * Math.PI * 2),
            0,
            Math.cos((hours / 24) * Math.PI * 2)
          );
          
          source.connect(panner);
          panner.connect(audioContext.destination);
          source.start();
          
          this.currentAudio = { source, audioContext };
        });
    } catch (e) {
      // Fallback to HTML5 Audio
      console.log('Using HTML5 Audio fallback');
      this.currentAudio = new Audio(this.sounds[type]);
      this.currentAudio.loop = true;
      this.currentAudio.volume = 0.3;
      this.currentAudio.play();
    }
  }

  stop() {
    if (!this.currentAudio) return;
    
    if (this.currentAudio.source) {
      // Web Audio API
      this.currentAudio.source.stop();
      this.currentAudio.audioContext.close();
    } else {
      // HTML5 Audio
      this.currentAudio.pause();
    }
    
    this.currentAudio = null;
  }

  updateSpatialAudio(hour) {
    if (this.currentAudio?.panner) {
      this.currentAudio.panner.setPosition(
        Math.sin((hour / 24) * Math.PI * 2),
        0,
        Math.cos((hour / 24) * Math.PI * 2)
      );
    }
  }
}
