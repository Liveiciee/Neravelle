import { HelioraTime } from './systems/heliora-time.js';
import { WeatherSystem } from './systems/weather-system.js';
import { AudioSystem } from './systems/audio-system.js';
import { TimeWarp } from './systems/time-warp.js';
import { RuneSystem } from './systems/rune-system.js';
import { LivingOcean } from './systems/ocean-system.js';

class KalenderHeliora {
  constructor() {
    this.systems = {
      time: new HelioraTime(),
      weather: new WeatherSystem(),
      audio: new AudioSystem(),
      timeWarp: new TimeWarp(),
      runes: new RuneSystem(),
      ocean: new LivingOcean()
    };
    this.init();
  }

  async init() {
    await this.loadModules();
    this.setupEventListeners();
    this.integrateSystems();
  }

  async loadModules() {
    // Load additional assets if needed
    await Promise.all([
      this.systems.audio.loadSounds(),
      this.systems.ocean.initTextures()
    ]);
  }

  integrateSystems() {
    // Sistem waktu sebagai pusat integrasi
    this.systems.time.on('timeUpdate', (timeData) => {
      this.systems.ocean.updateTime(timeData);
      this.systems.weather.updateTime(timeData.hour);
      this.systems.audio.updateSpatialAudio(timeData.hour);
      this.updateCalendarDisplay(timeData);
    });

    // Hubungkan cuaca dengan audio
    this.systems.weather.on('weatherChange', (type) => {
      this.systems.audio.playWeather(type);
    });

    // Hubungkan warp waktu
    this.systems.timeWarp.on('factorChange', (factor) => {
      this.systems.time.setWarpFactor(factor);
    });
  }

  updateCalendarDisplay(timeData) {
    document.getElementById('neravelleTime').textContent = 
      `${timeData.hour}:${timeData.minute.toString().padStart(2, '0')}`;
    document.getElementById('neravelleDate').textContent = 
      `${timeData.dayName}, ${timeData.date} ${timeData.monthName} ${timeData.year} KHL`;
  }

  setupEventListeners() {
    // Delegasi event untuk performa
    document.body.addEventListener('click', (e) => {
      if (e.target.closest('.weather-btn')) {
        const index = Array.from(document.querySelectorAll('.weather-btn')).indexOf(e.target);
        const types = ['rain', 'snow', 'sunny'];
        this.systems.weather.toggle(types[index]);
      }
      else if (e.target.closest('.audio-control')) {
        this.systems.audio.toggle();
      }
      else if (e.target.closest('.time-warp-controls button')) {
        const factor = parseFloat(e.target.textContent);
        this.systems.timeWarp.setFactor(factor);
      }
      else if (e.target.classList.contains('floating-rune')) {
        this.systems.runes.activate(e.target);
      }
    });
  }
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  new KalenderHeliora();
});
