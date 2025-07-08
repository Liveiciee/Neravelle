// Impor semua sistem
import { LivingOcean } from './systems/ocean-system.js';
import { HelioraTime } from './systems/heliora-time.js';
import { WeatherSystem } from './systems/weather-system.js';
import { AudioSystem } from './systems/audio-system.js';
import { TimeWarp } from './systems/time-warp.js';
import { RuneSystem } from './systems/rune-system.js';

class KalenderHeliora {
  constructor() {
    // Inisialisasi semua sistem
    this.timeSystem = new HelioraTime();
    this.oceanScene = new LivingOcean();
    this.weatherSystem = new WeatherSystem();
    this.audioSystem = new AudioSystem();
    this.timeWarp = new TimeWarp();
    this.runeSystem = new RuneSystem();
    
    // Integrasi sistem
    this.integrateSystems();
    this.setupEventListeners();
  }

  integrateSystems() {
    // Hubungkan waktu dengan sistem lain
    this.timeSystem.on('timeUpdate', (timeData) => {
      this.oceanScene.updateEnvironment(timeData);
      this.weatherSystem.updateTime(timeData.hour);
      this.audioSystem.updateSpatialAudio(timeData.hour);
      
      // Update tampilan kalender
      document.getElementById('neravelleTime').textContent = 
        `${timeData.hour}:${timeData.minute.toString().padStart(2, '0')}`;
      document.getElementById('neravelleDate').textContent = 
        `${timeData.dayName}, ${timeData.date} ${timeData.monthName} ${timeData.year} KHL`;
    });
    
    // Hubungkan cuaca dengan audio
    this.weatherSystem.on('weatherChange', (type) => {
      this.audioSystem.playWeatherAudio(type);
    });
  }

  setupEventListeners() {
    // Kontrol warp waktu
    document.querySelectorAll('.time-warp-controls button').forEach(btn => {
      btn.addEventListener('click', () => {
        const factor = parseFloat(btn.textContent);
        this.timeWarp.setFactor(factor);
        this.timeSystem.setWarpFactor(factor);
      });
    });
    
    // Kontrol audio
    document.querySelector('.audio-control').addEventListener('click', () => {
      this.audioSystem.toggle();
    });
    
    // Kontrol cuaca
    document.querySelectorAll('.weather-btn').forEach((btn, i) => {
      const types = ['rain', 'snow', 'sunny'];
      btn.addEventListener('click', () => {
        this.weatherSystem.toggle(types[i]);
      });
    });
    
    // Runik interaktif
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('floating-rune')) {
        this.runeSystem.activateRune(e.target);
      }
    });
  }
}

// Inisialisasi saat DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new KalenderHeliora();
  
  // Inisialisasi konstelasi mekanikal
  function createMechanicalConstellations() {
    const container = document.querySelector('.constellations');
    // ... kode konstelasi sebelumnya ...
  }
  
  // Inisialisasi ombak generatif
  function initWaveAnimation() {
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    // ... kode ombak sebelumnya ...
  }
  
  createMechanicalConstellations();
  initWaveAnimation();
});
