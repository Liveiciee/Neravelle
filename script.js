document.addEventListener('DOMContentLoaded', () => {
  // === Variabel Global ===
  const weatherTypes = ['rain', 'snow', 'sunny'];
  let currentWeather = null;
  let audioEnabled = false;
  let weatherAudio = null;

  // === Data Dunia Fantasi ===
  const DAYS = ["Elarion", "Velmora", "Tarsilune", "Dravendei", "Esmiradyn", "Lapliel", "Noxverra"];
  const MONTHS = [
    "Aethera", "Crystallina", "Aerius", "Floraison", "Luminosa", "Solaria",
    "Ignifera", "Abundantia", "Vestalia", "Terraverdea", "Nestaria", "Glimmeria"
  ];
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

  // === Fungsi Cuaca ===
  function toggleWeather(type) {
    const btn = document.querySelector(`.weather-btn[data-weather="${type}"]`);
    if (currentWeather === type) {
      // Matikan cuaca
      document.documentElement.style.setProperty('--weather-opacity', '0');
      currentWeather = null;
      stopWeatherAudio();

      // Reset tombol
      btn.classList.remove('active');
    } else {
      // Hidupkan cuaca baru
      document.documentElement.style.setProperty('--weather-opacity', '0.4');
      weatherTypes.forEach(t => {
        document.getElementById(`${t}-overlay`).style.display = t === type ? 'block' : 'none';
      });
      currentWeather = type;
      playWeatherAudio(type);

      // Update tombol
      document.querySelectorAll('.weather-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }

  function getWeatherIcon(type) {
    return {
      rain: '🌧️',
      snow: '❄️',
      sunny: '☀️'
    }[type];
  }

  // === Fungsi Suara ===
  function toggleAudio() {
    audioEnabled = !audioEnabled;
    document.querySelector('.audio-control').innerHTML = audioEnabled ? '🔊' : '🔇';

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
      rain: 'https://assets.mixkit.co/sfx/preview/mixkit-rain-loop-1246.mp3 ',
      snow: 'https://cdn.pixabay.com/audio/2021/11/25/audio_8a7ca25f6c.mp3 ',
      sunny: 'https://cdn.pixabay.com/audio/2022/03/15/audio_e5d287dc5c.mp3 '
    };

    if (sounds[type]) {
      weatherAudio = new Audio(sounds[type]);
      weatherAudio.loop = true;
      weatherAudio.volume = 0.3;
      weatherAudio.play().catch(console.error);
    }
  }

  function stopWeatherAudio() {
    if (weatherAudio) {
      weatherAudio.pause();
      weatherAudio.currentTime = 0;
      weatherAudio = null;
    }
  }

  // === Fungsi Kalender Fantasi ===
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
    document.getElementById('neravelleTime')?.textContent && 
      (document.getElementById('neravelleTime').textContent = nv.time);

    document.getElementById('neravelleDate')?.textContent && 
      (document.getElementById('neravelleDate').textContent = nv.date);

    document.getElementById('realWorldTime')?.textContent && 
      (document.getElementById('realWorldTime').textContent = new Date().toLocaleTimeString());
  }

  // === Hover Tooltip Hari Fantasi ===
  const dayDescriptionTooltip = document.getElementById('day-description-tooltip');
  const neravelleDateEl = document.getElementById('neravelleDate');

  if (neravelleDateEl && dayDescriptionTooltip) {
    neravelleDateEl.addEventListener('mouseenter', () => {
      const dayName = getNeravelleTime().dayName;
      dayDescriptionTooltip.textContent = DAY_DESCRIPTIONS[dayName] || "Deskripsi tidak tersedia.";
      dayDescriptionTooltip.style.display = 'block';
    });

    neravelleDateEl.addEventListener('mouseleave', () => {
      dayDescriptionTooltip.style.display = 'none';
    });

    neravelleDateEl.addEventListener('mousemove', e => {
      dayDescriptionTooltip.style.left = `${e.clientX + 15}px`;
      dayDescriptionTooltip.style.top = `${e.clientY - 50}px`;
    });
  }

  // === Particle Magis Mengikuti Mouse ===
  let particleInterval = null;

  function createParticle(x, y) {
    const p = document.createElement('div');
    p.className = 'glow-particle';
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.width = p.style.height = `${Math.random() * 8 + 4}px`;
    document.body.appendChild(p);

    setTimeout(() => p.remove(), 2000);
  }

  document.addEventListener('mousemove', e => {
    if (!particleInterval) {
      particleInterval = setInterval(() => createParticle(e.clientX, e.clientY), 100);
    }
    clearTimeout(window._particleTimeout);
    window._particleTimeout = setTimeout(() => clearInterval(particleInterval), 300);
  });

  // === Scroll Animation Enhancement ===
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.style.transition = 'opacity 1s ease, transform 1s ease';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach(section => {
    section.style.transform = 'translateY(50px)';
    section.style.opacity = '0';
    observer.observe(section);
  });

  // === Konverter Tanggal Lahir ===
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

    if (input && output) {
      input.addEventListener('change', (e) => {
        try {
          output.textContent = convertBirthday(e.target.value);
        } catch (error) {
          output.textContent = "Terjadi kesalahan dalam konversi";
          console.error(error);
        }
      });
    }
  }

  // === Inisialisasi Awal ===
  updateClock();
  initBirthdayConverter();
  setInterval(updateClock, 1000); // Setiap detik
});
