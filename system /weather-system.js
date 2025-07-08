class WeatherSystem {
  constructor() {
    this.currentWeather = null;
    this.types = ['rain', 'snow', 'sunny'];
    this.initOverlays();
  }

  initOverlays() {
    this.types.forEach(type => {
      const overlay = document.getElementById(`${type}-overlay`);
      overlay.style.display = 'none';
    });
  }

  toggle(type) {
    if (this.currentWeather === type) {
      this.deactivate();
    } else {
      this.activate(type);
    }
  }

  activate(type) {
    this.currentWeather = type;
    const overlay = document.getElementById(`${type}-overlay`);
    
    // Animasi fade in
    overlay.style.display = 'block';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 10);
    
    // Update tombol aktif
    document.querySelectorAll('.weather-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent === this.getWeatherIcon(type));
    });
    
    this.emit('weatherChange', type);
  }

  deactivate() {
    const overlay = document.getElementById(`${this.currentWeather}-overlay`);
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 500);
    this.currentWeather = null;
  }

  getWeatherIcon(type) {
    const icons = { rain: '🌧️', snow: '❄️', sunny: '☀️' };
    return icons[type];
  }
}
