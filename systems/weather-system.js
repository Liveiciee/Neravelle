export class WeatherSystem {
  constructor() {
    this.current = null;
    this.types = ['rain', 'snow', 'sunny'];
    this.listeners = {};
    this.initElements();
  }

  initElements() {
    this.types.forEach(type => {
      const overlay = document.getElementById(`${type}-overlay`);
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'weather-overlay';
        overlay.id = `${type}-overlay`;
        document.body.appendChild(overlay);
      }
      overlay.style.display = 'none';
    });
  }

  toggle(type) {
    if (this.current === type) {
      this.deactivate();
    } else {
      this.activate(type);
    }
  }

  activate(type) {
    this.deactivate(); // Matikan yang aktif sebelumnya
    
    this.current = type;
    const overlay = document.getElementById(`${type}-overlay`);
    
    overlay.style.display = 'block';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.opacity = '1';
      this.generateParticles(type);
    }, 10);
    
    this.updateActiveButton();
    this.emit('change', type);
  }

  generateParticles(type) {
    const overlay = document.getElementById(`${type}-overlay`);
    overlay.innerHTML = '';
    
    const count = type === 'sunny' ? 15 : type === 'snow' ? 120 : 80;
    const className = type === 'rain' ? 'drop' : type === 'snow' ? 'flake' : 'ray';
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = className;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      overlay.appendChild(particle);
    }
  }

  deactivate() {
    if (!this.current) return;
    
    const overlay = document.getElementById(`${this.current}-overlay`);
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 500);
    
    this.current = null;
    this.updateActiveButton();
  }

  updateActiveButton() {
    document.querySelectorAll('.weather-btn').forEach(btn => {
      const iconMap = { rain: '🌧️', snow: '❄️', sunny: '☀️' };
      btn.classList.toggle('active', 
        this.current && btn.textContent === iconMap[this.current]);
    });
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}
