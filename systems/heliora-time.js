export class HelioraTime {
  constructor() {
    this.baseDate = new Date('2025-06-29T00:00:00');
    this.warpFactor = 2;
    this.listeners = {};
    this.init();
  }

  init() {
    setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date();
    const warpedTime = new Date(now.getTime() * this.warpFactor);
    
    const diff = now - this.baseDate;
    const day = Math.floor(diff / 86400000);
    const days = ["Elarion", "Velmora", "Tarsilune", "Dravendei", "Esmiradyn", "Lapliel", "Noxverra"];
    const months = ["Aethera", "Crystallina", "Aerius", "Floraison", "Luminosa", "Solaria", "Ignifera", "Abundantia", "Vestalia", "Terraverdea", "Nestaria", "Glimmeria"];
    
    const timeData = {
      realTime: now.toLocaleTimeString(),
      hour: warpedTime.getHours(),
      minute: warpedTime.getMinutes(),
      dayName: days[day % 7],
      monthName: months[Math.floor((day % 360) / 30)],
      year: 800 + Math.floor(day / 360),
      date: (day % 30) + 1,
      dayProgress: (warpedTime.getHours() * 60 + warpedTime.getMinutes()) / 1440
    };
    
    this.emit('timeUpdate', timeData);
  }

  setWarpFactor(factor) {
    this.warpFactor = factor;
    this.emit('warpChange', factor);
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
