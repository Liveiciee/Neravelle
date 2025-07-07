document.addEventListener('DOMContentLoaded', function () {
  const weatherTypes = ['rain', 'snow', 'sunny'];
  let currentWeather = null;
  let audioEnabled = false;
  let weatherAudio = null; 

  weatherTypes.forEach(type => {
    const overlay = document.createElement('div');
    overlay.className = `weather-overlay`;
    overlay.id = `${type}-overlay`;
    overlay.style.display = 'none';
    document.body.appendChild(overlay);
  });

  const weatherControls = document.createElement('div');
  weatherControls.className = 'weather-controls';

  weatherTypes.forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'weather-btn';
    btn.innerHTML = getWeatherIcon(type);
    btn.title = `Toggle ${type}`;
    btn.addEventListener('click', () => toggleWeather(type));
    weatherControls.appendChild(btn);
  });

  document.body.appendChild(weatherControls);

  const audioControl = document.createElement('button');
  audioControl.className = 'audio-control';
  audioControl.innerHTML = '🔇';
  audioControl.title = 'Toggle sound';
  audioControl.addEventListener('click', toggleAudio);
  document.body.appendChild(audioControl);

  function toggleWeather(type) {
    if (currentWeather === type) {
      document.documentElement.style.setProperty('--weather-opacity', '0');
      currentWeather = null;
      stopWeatherAudio();
    } else {
      document.documentElement.style.setProperty('--weather-opacity', '1');
      weatherTypes.forEach(t => {
        const el = document.getElementById(`${t}-overlay`);
        el.style.display = t === type ? 'block' : 'none';
        el.innerHTML = '';
        if (t === type) generateParticles(el, t);
      });
      currentWeather = type;
      playWeatherAudio(type);
    }

    document.querySelectorAll('.weather-btn').forEach(btn => {
      btn.classList.toggle('active', btn.innerHTML === getWeatherIcon(type) && currentWeather === type);
    });
  }

  function generateParticles(container, type) {
  container.innerHTML = '';
  const count = type === 'sunny' ? 15 : type === 'snow' ? 100 : 80; // ❄️ tambahin jadi 120
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className = type === 'rain' ? 'drop' : type === 'snow' ? 'flake' : 'ray';
    span.style.left = Math.random() * 100 + 'vw';
    span.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(span);
  }
}


  function getWeatherIcon(type) {
    return { rain: '🌧️', snow: '❄️', sunny: '☀️' }[type] || '✨';
  }

  function toggleAudio() {
    audioEnabled = !audioEnabled;
    audioControl.innerHTML = audioEnabled ? '🔊' : '🔇';
    if (audioEnabled && currentWeather) playWeatherAudio(currentWeather);
    else stopWeatherAudio();
  }

  function playWeatherAudio(type) {
    if (!audioEnabled) return;
    stopWeatherAudio();
    const sounds = {
      rain: 'https://assets.mixkit.co/sfx/preview/mixkit-rain-loop-1246.mp3',
      snow: 'https://assets.mixkit.co/sfx/preview/mixkit-cold-wind-rain-loop-2406.mp3',
      sunny: 'https://assets.mixkit.co/sfx/preview/mixkit-summer-forest-birds-1250.mp3'
    };
    if (sounds[type]) {
      weatherAudio = new Audio(sounds[type]);
      weatherAudio.loop = true;
      weatherAudio.volume = 0.3;
      weatherAudio.play().catch(() => {});
    }
  }

  function stopWeatherAudio() {
    if (weatherAudio) {
      weatherAudio.pause();
      weatherAudio.currentTime = 0;
      weatherAudio = null;
    }
  }

  // Clock
  setInterval(updateClock, 1000);
  updateClock();

  function updateClock() {
    const now = new Date();
    document.getElementById('realWorldTime').textContent = now.toLocaleTimeString();

    const base = new Date('2025-06-29T00:00:00');
    const diff = now - base;
    const day = Math.floor(diff / 86400000);
    const days = ["Elarion", "Velmora", "Tarsilune", "Dravendei", "Esmiradyn", "Lapliel", "Noxverra"];
    const months = ["Aethera", "Crystallina", "Aerius", "Floraison", "Luminosa", "Solaria", "Ignifera", "Abundantia", "Vestalia", "Terraverdea", "Nestaria", "Glimmeria"];
    const year = 800 + Math.floor(day / 360);
    const month = Math.floor((day % 360) / 30);
    const date = (day % 30) + 1;
    const dayName = days[day % 7];
    const time = new Date(now.getTime() * 2);
    const nTime = time.toTimeString().split(' ')[0];

    document.getElementById('neravelleTime').textContent = nTime;
    document.getElementById('neravelleDate').textContent = `${dayName}, ${date} ${months[month]} ${year} KHL`;
    document.getElementById('dayDescription').textContent = {
      Elarion: "Hari cahaya baru",
      Velmora: "Hari ilmu pengetahuan",
      Tarsilune: "Hari meditasi dan ritual",
      Dravendei: "Hari kekuatan",
      Esmiradyn: "Hari keberuntungan",
      Lapliel: "Hari seni dan kedamaian",
      Noxverra: "Hari doa dan istirahat"
    }[dayName] || '';
  }

  document.getElementById('birthdayInput')?.addEventListener('change', (e) => {
    const b = new Date(e.target.value);
    const diff = b - new Date('2025-06-29');
    const day = Math.floor(diff / 86400000);
    const year = 800 + Math.floor(day / 360);
    const month = Math.floor((day % 360) / 30);
    const date = (day % 30) + 1;
    const days = ["Elarion", "Velmora", "Tarsilune", "Dravendei", "Esmiradyn", "Lapliel", "Noxverra"];
    const months = ["Aethera", "Crystallina", "Aerius", "Floraison", "Luminosa", "Solaria", "Ignifera", "Abundantia", "Vestalia", "Terraverdea", "Nestaria", "Glimmeria"];
    const dayName = days[day % 7];
    document.getElementById('birthdayOutput').textContent = `${dayName}, ${date} ${months[month]} ${year} KHL`;
  });
});
