// Enhanced World Building Script
document.addEventListener('DOMContentLoaded', function() {
  // Weather System
  const weatherTypes = ['rain', 'snow', 'sunny'];
  let currentWeather = null;
  let audioEnabled = false;
  let weatherAudio = null;
  
  // Create weather overlay divs
  weatherTypes.forEach(type => {
    const overlay = document.createElement('div');
    overlay.className = `weather-overlay ${type}`;
    overlay.id = `${type}-overlay`;
    document.body.appendChild(overlay);
  });
  
  // Create floating islands
  for (let i = 0; i < 3; i++) {
    const island = document.createElement('div');
    island.className = 'floating-island';
    island.style.left = `${Math.random() * 100}%`;
    island.style.top = `${Math.random() * 70}%`;
    document.body.appendChild(island);
  }
  
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
  
  // Weather functions
  function toggleWeather(type) {
    if (currentWeather === type) {
      // Turn off weather
      document.documentElement.style.setProperty('--weather-opacity', '0');
      currentWeather = null;
      stopWeatherAudio();
    } else {
      // Change weather
      document.documentElement.style.setProperty('--weather-opacity', '1');
      weatherTypes.forEach(t => {
        document.getElementById(`${t}-overlay`).style.display = t === type ? 'block' : 'none';
      });
      currentWeather = type;
      playWeatherAudio(type);
    }
    
    // Update button states
    document.querySelectorAll('.weather-btn').forEach(btn => {
      btn.classList.toggle('active', btn.innerHTML === getWeatherIcon(type) && currentWeather === type);
    });
  }
  
  function getWeatherIcon(type) {
    const icons = {
      rain: '🌧️',
      snow: '❄️',
      sunny: '☀️'
    };
    return icons[type] || '✨';
  }
  
  // Audio functions
  function toggleAudio() {
    audioEnabled = !audioEnabled;
    audioControl.innerHTML = audioEnabled ? '🔊' : '🔇';
    
    if (audioEnabled && currentWeather) {
      playWeatherAudio(currentWeather);
    } else {
      stopWeatherAudio();
    }
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
      weatherAudio.play().catch(e => console.log('Audio play failed:', e));
    }
  }
  
  function stopWeatherAudio() {
    if (weatherAudio) {
      weatherAudio.pause();
      weatherAudio.currentTime = 0;
      weatherAudio = null;
    }
  }
  
  // Enhanced Calendar Display
  function updateCalendar() {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    // Real world date display
    const realDate = now.toLocaleDateString('id-ID', options);
    
    // Add to existing time display
    const realTimeElement = document.getElementById('realWorldTime');
    if (realTimeElement) {
      const dateElement = document.createElement('div');
      dateElement.style.fontSize = '0.8em';
      dateElement.style.marginTop = '5px';
      dateElement.style.color = 'var(--text-secondary)';
      dateElement.textContent = realDate;
      
      // Only add once
      if (!realTimeElement.nextElementSibling || 
          !realTimeElement.nextElementSibling.classList.contains('real-date')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'real-date';
        wrapper.style.display = 'inline-block';
        wrapper.appendChild(dateElement);
        realTimeElement.insertAdjacentElement('afterend', wrapper);
      }
    }
  }
  
  // Initialize
  updateCalendar();
  setInterval(updateCalendar, 60000); // Update every minute
  
  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
});

// Existing calendar functions remain unchanged
const DAYS = Object.freeze(["Elarion", "Velmora", "Tarsilune", "Dravendei", "Esmiradyn", "Lapliel", "Noxverra"]);
const MONTHS = Object.freeze([
    "Aethera", "Crystallina", "Aerius", "Floraison", "Luminosa", "Solaria",
    "Ignifera", "Abundantia", "Vestalia", "Terraverdea", "Nestaria", "Glimmeria"
]);
const DAY_DESCRIPTIONS = {
    "Elarion": "Hari cahaya baru, awal dari segala usaha.",
    "Velmora": "Waktu ilmu pengetahuan dan kebijaksanaan.",
    "Tarsilune": "Hari refleksi, meditasi, dan ritual kecil.",
    "Dravendei": "Hari kekuatan, kehormatan, dan keteguhan hati.",
    "Esmiradyn": "Hari keberuntungan dan kemakmuran.",
    "Lapliel": "Hari kedamaian dan ekspresi seni.",
    "Noxverra": "Hari istirahat dan doa yang sakral."
};

const BASE_DATE = new Date('2025-06-29T00:00:00');
const BASE_YEAR = 800;
const DAYS_IN_MONTH = 30;
const DAYS_IN_YEAR = DAYS_IN_MONTH * MONTHS.length;
const MS_PER_DAY = 86400000;

function getNeravelleTime(realDate = new Date()) {
    const timeDiff = realDate - BASE_DATE;
    const daysPassed = Math.floor(timeDiff / MS_PER_DAY);
    
    const year = BASE_YEAR + Math.floor(daysPassed / DAYS_IN_YEAR);
    const monthIdx = Math.floor((daysPassed % DAYS_IN_YEAR) / DAYS_IN_MONTH);
    const day = (daysPassed % DAYS_IN_MONTH) + 1;
    const dayName = DAYS[daysPassed % DAYS.length];
    
    const totalSecs = Math.floor(timeDiff / 1000);
    const time = [
        Math.floor(totalSecs / 3600) % 24,
        Math.floor((totalSecs % 3600) / 60),
        totalSecs % 60
    ].map(n => String(n).padStart(2, '0')).join(':');
    
    return {
        time,
        date: `${dayName}, ${day} ${MONTHS[monthIdx]} ${year} KHL`,
        dayName,
        realTime: realDate.toLocaleTimeString()
    };
}

function updateClock() {
    const nv = getNeravelleTime();
    document.getElementById('neravelleTime').textContent = nv.time;
    document.getElementById('neravelleDate').textContent = nv.date;
    document.getElementById('realWorldTime').textContent = nv.realTime;
    document.getElementById('dayDescription').textContent = DAY_DESCRIPTIONS[nv.dayName] || "";
}

function convertBirthday(birthdate) {
    if (!birthdate) return "Tanggal tidak boleh kosong";
    
    const realDate = new Date(birthdate);
    if (isNaN(realDate.getTime())) return "Format tanggal salah";

    const timeDiff = realDate - BASE_DATE;
    const daysPassed = Math.floor(timeDiff / MS_PER_DAY);
    
    if (daysPassed < 0) {
        const positiveDays = Math.abs(daysPassed);
        const yearsBefore = Math.floor(positiveDays / DAYS_IN_YEAR);
        const remainingDays = positiveDays % DAYS_IN_YEAR;
        
        const year = BASE_YEAR - yearsBefore - (remainingDays > 0 ? 1 : 0);
        const monthIdx = (MONTHS.length - 1) - Math.floor((remainingDays || DAYS_IN_YEAR) / DAYS_IN_MONTH);
        const day = DAYS_IN_MONTH - ((remainingDays || DAYS_IN_YEAR) % DAYS_IN_MONTH);
        const dayName = DAYS[(DAYS.length - (positiveDays % DAYS.length)) % DAYS.length];
        
        return `${dayName}, ${day} ${MONTHS[monthIdx]} ${year} KHL`;
    } else {
        const year = BASE_YEAR + Math.floor(daysPassed / DAYS_IN_YEAR);
        const monthIdx = Math.floor((daysPassed % DAYS_IN_YEAR) / DAYS_IN_MONTH);
        const day = (daysPassed % DAYS_IN_MONTH) + 1;
        const dayName = DAYS[daysPassed % DAYS.length];
        
        return `${dayName}, ${day} ${MONTHS[monthIdx]} ${year} KHL`;
    }
}

function initBirthdayConverter() {
    const input = document.getElementById('birthdayInput');
    const output = document.getElementById('birthdayOutput');
    
    input.addEventListener('change', (e) => {
        try {
            output.textContent = convertBirthday(e.target.value);
        } catch (error) {
            output.textContent = "Terjadi kesalahan dalam konversi";
            console.error(error);
        }
    });
}

// Initialize existing functions
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    initBirthdayConverter();
    setInterval(updateClock, 1000);
});
