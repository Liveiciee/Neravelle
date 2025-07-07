document.addEventListener('DOMContentLoaded', function () {
  // Initialize magical elements
  createConstellations();
  createFloatingRunes();
  
  const weatherTypes = ['rain', 'snow', 'sunny'];
  let currentWeather = null;
  let audioEnabled = false;
  let weatherAudio = null; 

  // Create weather overlays
  weatherTypes.forEach(type => {
    const overlay = document.createElement('div');
    overlay.className = `weather-overlay`;
    overlay.id = `${type}-overlay`;
    overlay.style.display = 'none';
    document.body.appendChild(overlay);
  });

  // Create weather controls
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

  // Create audio control
  const audioControl = document.createElement('button');
  audioControl.className = 'audio-control';
  audioControl.innerHTML = '🔇';
  audioControl.title = 'Toggle sound';
  audioControl.addEventListener('click', toggleAudio);
  document.body.appendChild(audioControl);

  // Add hover effects to time cards
  const timeCards = document.querySelectorAll('.time-card');
  timeCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const decoration = card.querySelector('.time-card-decoration');
      if (decoration) {
        decoration.style.height = '8px';
        decoration.style.opacity = '1';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const decoration = card.querySelector('.time-card-decoration');
      if (decoration) {
        decoration.style.height = '4px';
        decoration.style.opacity = '0.7';
      }
    });
  });

  // Weather functions
  function toggleWeather(type) {
    if (currentWeather === type) {
      // Fade out current weather
      document.documentElement.style.setProperty('--weather-opacity', '0');
      setTimeout(() => {
        weatherTypes.forEach(t => {
          document.getElementById(`${t}-overlay`).style.display = 'none';
        });
      }, 500); // Match this with CSS transition duration
      currentWeather = null;
      stopWeatherAudio();
    } else {
      // First fade out current weather if any
      if (currentWeather) {
        document.documentElement.style.setProperty('--weather-opacity', '0');
        setTimeout(() => {
          weatherTypes.forEach(t => {
            const el = document.getElementById(`${t}-overlay`);
            el.style.display = 'none';
            el.innerHTML = '';
          });
          // Then fade in new weather
          fadeInNewWeather(type);
        }, 500);
      } else {
        // No current weather, just fade in new one
        fadeInNewWeather(type);
      }
    }

    document.querySelectorAll('.weather-btn').forEach(btn => {
      btn.classList.toggle('active', btn.innerHTML === getWeatherIcon(type) && currentWeather === type);
    });
  }
  
function fadeInNewWeather(type) {
    weatherTypes.forEach(t => {
      const el = document.getElementById(`${t}-overlay`);
      el.style.display = t === type ? 'block' : 'none';
      el.innerHTML = '';
      if (t === type) generateParticles(el, t);
    });
    currentWeather = type;
    // Start opacity at 0 and animate to 1
    document.documentElement.style.setProperty('--weather-opacity', '0');
    setTimeout(() => {
      document.documentElement.style.setProperty('--weather-opacity', '1');
    }, 10);
    playWeatherAudio(type);
        }

  
  function generateParticles(container, type) {
    container.innerHTML = '';
    const count = type === 'sunny' ? 15 : type === 'snow' ? 120 : 80;
    
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.className = type === 'rain' ? 'drop' : type === 'snow' ? 'flake' : 'ray';
      span.style.left = Math.random() * 100 + 'vw';
      span.style.animationDelay = Math.random() * 5 + 's';
      
      if (type === 'snow') {
        span.style.animationDuration = (8 + Math.random() * 10) + 's';
      }
      
      container.appendChild(span);
    }
  }

  function getWeatherIcon(type) {
    return { rain: '🌧️', snow: '❄️', sunny: '☀️' }[type] || '✨';
  }

let audioUnlocked = false; // Track audio context status

function toggleAudio() {
  // Unlock audio on first interaction
  if (!audioUnlocked) {
    audioUnlocked = true;
    // Play silent audio to unlock context
    new Audio().play().catch(e => console.log('Audio unlock attempt:', e));
  }
  
  audioEnabled = !audioEnabled;
  audioControl.innerHTML = audioEnabled ? '🔊' : '🔇';
  
  if (audioEnabled && currentWeather) {
    playWeatherAudio(currentWeather);
  } else {
    stopWeatherAudio();
  }
}

function playWeatherAudio(type) {
  if (!audioEnabled || !audioUnlocked) return;
  
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
    
    // Better error handling
    weatherAudio.play().catch(e => {
      console.error('Audio play failed:', e);
      // Show user feedback if needed
      if (e.name === 'NotAllowedError') {
        alert('Please click anywhere on page first to enable audio');
      }
    });
  }
}

// Unlock audio on any user interaction
document.addEventListener('click', function initAudio() {
  if (!audioUnlocked) {
    audioUnlocked = true;
    if (currentWeather && audioEnabled) {
      playWeatherAudio(currentWeather);
    }
  }
  document.removeEventListener('click', initAudio);
}, { once: true });
  // Clock functions
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

  // Birthday conversion
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

  // Create constellations
  function createConstellations() {
    const constellations = document.querySelector('.constellations');
    const starCount = 50;
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${Math.random() * 3 + 1}px`;
      star.style.height = star.style.width;
      star.style.animationDelay = `${Math.random() * 5}s`;
      constellations.appendChild(star);
    }
  }

  // Create floating runes
  function createFloatingRunes() {
    const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛟ', 'ᛞ'];
    const container = document.body;
    
    for (let i = 0; i < 15; i++) {
      const rune = document.createElement('div');
      rune.className = 'floating-rune';
      rune.textContent = runes[Math.floor(Math.random() * runes.length)];
      rune.style.left = `${Math.random() * 100}%`;
      rune.style.top = `${Math.random() * 100}%`;
      rune.style.fontSize = `${Math.random() * 10 + 10}px`;
      rune.style.opacity = Math.random() * 0.3 + 0.1;
      rune.style.animationDuration = `${Math.random() * 30 + 20}s`;
      rune.style.animationDelay = `${Math.random() * 10}s`;
      container.appendChild(rune);
    }
  }
});
