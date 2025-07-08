document.addEventListener('DOMContentLoaded', function () {
  // Initialize magical elements
  createDynamicConstellations();
  createInteractiveRunes();
  
  const weatherTypes = ['rain', 'snow', 'sunny'];
  let currentWeather = null;
  let audioEnabled = false;
  let audioUnlocked = false;
  let weatherAudio = null;
  let timeWarpFactor = 2; // Default time warp (1 real hour = 2 Neravelle hours)

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

  // Create time warp controls
  const timeWarpControls = document.createElement('div');
  timeWarpControls.className = 'time-warp-controls';
  
  const timeWarpIndicator = document.createElement('div');
  timeWarpIndicator.id = 'timeWarpIndicator';
  timeWarpIndicator.textContent = `⏱️ ${timeWarpFactor}x`;
  timeWarpControls.appendChild(timeWarpIndicator);
  
  [0.5, 1, 2, 5].forEach(factor => {
    const btn = document.createElement('button');
    btn.textContent = `${factor}x`;
    btn.addEventListener('click', () => setTimeWarp(factor));
    timeWarpControls.appendChild(btn);
  });
  
  document.body.appendChild(timeWarpControls);

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
      }, 500);
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
      rain: 'assets/audio/rain.wav',
      snow: 'assets/audio/snow.wav',
      sunny: 'assets/audio/sunny.wav'
    };
    
    if (sounds[type]) {
      // Create 3D audio effect based on time of day
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const panner = audioContext.createPanner();
      panner.panningModel = 'HRTF';
      
      // Position audio based on current hour (creates 3D spatial effect)
      const hours = new Date().getHours();
      const x = Math.sin((hours / 24) * Math.PI * 2);
      const z = Math.cos((hours / 24) * Math.PI * 2);
      panner.setPosition(x, 0, z);
      
      fetch(sounds[type])
        .then(response => response.arrayBuffer())
        .then(buffer => audioContext.decodeAudioData(buffer))
        .then(decodedData => {
          const source = audioContext.createBufferSource();
          source.buffer = decodedData;
          source.loop = true;
          source.connect(panner);
          panner.connect(audioContext.destination);
          source.start();
          weatherAudio = { source, audioContext };
        })
        .catch(e => {
          console.error('Audio loading failed:', e);
          // Fallback to standard audio if Web Audio API fails
          weatherAudio = new Audio(sounds[type]);
          weatherAudio.loop = true;
          weatherAudio.volume = 0.3;
          weatherAudio.play().catch(e => console.error('Fallback audio failed:', e));
        });
    }
  }

  function stopWeatherAudio() {
    if (weatherAudio) {
      if (weatherAudio.source && weatherAudio.audioContext) {
        // Web Audio API version
        weatherAudio.source.stop();
        weatherAudio.audioContext.close();
      } else if (weatherAudio.pause) {
        // Standard HTML5 Audio version
        weatherAudio.pause();
      }
      weatherAudio = null;
    }
  }

  function setTimeWarp(factor) {
    timeWarpFactor = factor;
    document.getElementById('timeWarpIndicator').textContent = `⏱️ ${factor}x`;
    updateClock(); // Immediately update time display
  }

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
    
    // Apply time warp factor
    const nTime = new Date(now.getTime() * timeWarpFactor).toTimeString().split(' ')[0];

    document.getElementById('neravelleTime').textContent = nTime;
    document.getElementById('neravelleDate').textContent = `${dayName}, ${date} ${months[month]} ${year} KHL`;
    document.getElementById('dayDescription').textContent = getDayDescription(dayName);
    
    // Generate random prophecy for the day
    if (!document.getElementById('dayProphecy')) {
      const prophecyElement = document.createElement('div');
      prophecyElement.id = 'dayProphecy';
      prophecyElement.className = 'day-prophecy';
      document.querySelector('.time-card').appendChild(prophecyElement);
    }
    document.getElementById('dayProphecy').textContent = generateProphecy(dayName);
  }

  function getDayDescription(dayName) {
    const descriptions = {
      Elarion: "Hari cahaya baru",
      Velmora: "Hari ilmu pengetahuan",
      Tarsilune: "Hari meditasi dan ritual",
      Dravendei: "Hari kekuatan",
      Esmiradyn: "Hari keberuntungan",
      Lapliel: "Hari seni dan kedamaian",
      Noxverra: "Hari doa dan istirahat"
    };
    return descriptions[dayName] || '';
  }

  function generateProphecy(dayName) {
    const prophecies = {
      Elarion: ["Cahaya baru akan menyinari jalanmu", "Kesempatan emas muncul di pagi hari"],
      Velmora: ["Ilmu kuno akan terungkap", "Buku misterius muncul di perpustakaan"],
      Tarsilune: ["Ritual kuno memberikan kekuatan", "Meditasi membuka pikiran baru"],
      Noxverra: ["Mimpi ini adalah pesan dari alam baka", "Hati-hati dengan bayangan tengah malam"]
    };
    
    if (!prophecies[dayName]) {
      const words = ["api", "angin", "laut", "bintang", "raga"];
      const randomProphet = [
        `${words[Math.floor(Math.random() * words.length)]} akan membimbingmu`,
        `Dengarkan bisikan ${words[Math.floor(Math.random() * words.length)]}`
      ];
      return randomProphet[Math.floor(Math.random() * randomProphet.length)];
    }
    
    return prophecies[dayName][Math.floor(Math.random() * prophecies[dayName].length)];
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

  // Create dynamic constellations with moon phase
  function createDynamicConstellations() {
    const now = new Date();
    const moonPhase = Math.floor((now.getDate() / 30) * 8) % 8;
    const constellations = document.querySelector('.constellations');
    
    // Clear existing stars
    constellations.innerHTML = '';
    
    // Generate stars with patterns based on moon phase
    const starCount = 100 + (moonPhase * 10);
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${Math.random() * 3 + 1}px`;
      star.style.height = star.style.width;
      star.style.opacity = `${Math.random() * 0.8 + 0.2}`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      // Different glow during full/new moon
      if (moonPhase === 0 || moonPhase === 4) {
        star.style.boxShadow = `0 0 ${Math.random() * 8 + 2}px white`;
      } else {
        star.style.boxShadow = `0 0 ${Math.random() * 4 + 1}px var(--celestial-blue)`;
      }
      
      constellations.appendChild(star);
    }
    
    // Add moon phase indicator
    const moon = document.createElement('div');
    moon.className = 'moon-phase';
    moon.style.background = `radial-gradient(circle at ${moonPhase * 12.5}% 50%, transparent 30%, var(--pearl-white) 30%)`;
    constellations.appendChild(moon);
  }

  // Create interactive floating runes
  function createInteractiveRunes() {
    const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ'];
    const effects = {
      'ᚠ': () => toggleWeather('rain'),
      'ᚢ': () => toggleWeather('snow'),
      'ᚦ': () => setTimeWarp(5),
      'ᚨ': () => document.body.style.filter = 'sepia(100%)',
      'ᚱ': () => alert('Rune Rahasia Terbuka!'),
    };
    
    for (let i = 0; i < 10; i++) {
      const rune = document.createElement('div');
      rune.className = 'floating-rune interactive';
      rune.textContent = runes[Math.floor(Math.random() * runes.length)];
      rune.style.left = `${Math.random() * 100}%`;
      rune.style.top = `${Math.random() * 100}%`;
      rune.style.fontSize = `${Math.random() * 10 + 10}px`;
      rune.style.opacity = Math.random() * 0.3 + 0.1;
      rune.style.animationDuration = `${Math.random() * 30 + 20}s`;
      rune.style.animationDelay = `${Math.random() * 10}s`;
      
      // Click effect
      rune.addEventListener('click', () => {
        if (effects[rune.textContent]) {
          effects[rune.textContent]();
          rune.style.animation = 'runeExplode 0.5s forwards';
          setTimeout(() => rune.remove(), 500);
        }
      });
      
      document.body.appendChild(rune);
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
});
