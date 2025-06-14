// Kalender dan waktu Neravelle - Fully Optimized
const DAYS = Object.freeze(["Elarion", "Velmora", "Tarsilune", "Dravendei", "Esmiradyn", "Lapliel", "Noxverra"]);
const MONTHS = Object.freeze(["Luthenya", "Caelurest", "Virellan", "Emberleth", "Solmareth", "Ashdelyr",
    "Zephandor", "Thundareen", "Mystralis", "Velouren", "Aurevanthe", "Nyxoria"
]);
const DAY_DESCRIPTIONS = Object.freeze({
    "Elarion": "Hari cahaya awal. Melambangkan harapan dan permulaan.",
    "Velmora": "Hari angin dan bisikan. Hari untuk merenung dan menerima ilham.",
    "Tarsilune": "Hari bulan jatuh. Menggambarkan keindahan malam dan kelembutan hati.",
    "Dravendei": "Hari kekuatan. Didedikasikan untuk semangat, kerja keras, dan keberanian.",
    "Esmiradyn": "Hari kristal dan sihir. Hari para penyihir dan pemurnian jiwa.",
    "Lapliel": "Hari langit dan roh. Digunakan untuk berdoa, bermeditasi, dan terhubung dengan kekuatan luhur.",
    "Noxverra": "Hari bintang dan malam hidup. Hari perayaan, kenangan, dan malam penuh makna."
});

// Constants for date calculations
const BASE_REAL_DATE = new Date('2025-05-17T00:00:00');
const BASE_NV_YEAR = 1045;
const BASE_NV_MONTH = 0;
const BASE_NV_DAY = 1;
const BASE_NV_DAY_NAME = "Elarion";
const BASE_DAY_INDEX = DAYS.indexOf(BASE_NV_DAY_NAME);
const DAYS_IN_MONTH = 35;
const DAYS_IN_YEAR = DAYS_IN_MONTH * MONTHS.length;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Celestial configuration
const CELESTIAL_CONFIG = Object.freeze({
    size: 120,
    colors: Object.freeze(['#fffbe8', '#d0bfff', '#b8c0ff', '#8ecae6', '#f1c0e8', '#caf0f8', '#ffe066', '#f7cad0']),
    nebulaGradients: Object.freeze([
        'radial-gradient(circle at 40% 60%, #b8c0ff77 0%, #5e60ce44 70%, transparent 100%)',
        'radial-gradient(circle at 60% 40%, #f1c0e899 0%, #a2d2ff44 80%, transparent 100%)',
        'radial-gradient(circle at 70% 30%, #ffe06655 0%, #ffb4a2bb 60%, transparent 100%)',
        'radial-gradient(circle at 20% 80%, #d0bfff77 0%, #b8c0ff55 90%, transparent 100%)'
    ])
});

// DOM Cache with null checks
const domCache = {
    starsContainer: () => document.getElementById('stars'),
    sunMoon: () => document.getElementById('sunMoon'),
    sunsetGlow: () => document.getElementById('sunsetGlow'),
    dawnGlow: () => document.getElementById('dawnGlow'),
    stars: () => document.getElementById('stars'),
    body: () => document.body,
    neravelleTimeEl: () => document.getElementById('neravelleTime'),
    neravelleDateEl: () => document.getElementById('neravelleDate'),
    realWorldTimeEl: () => document.getElementById('realWorldTime'),
    dayDescriptionEl: () => document.getElementById('dayDescription'),
    birthdayInput: () => document.getElementById('birthdayInput'),
    birthdayOutput: () => document.getElementById('birthdayOutput'),
    menuToggle: () => document.getElementById('menu-toggle'),
    sidebar: () => document.getElementById('sidebar'),
    mainContent: () => document.getElementById('main-content')
};

// Date calculations with memoization
const calculateNeravelleDate = (() => {
    const dateCache = new Map();
    
    return (realWorldDate = new Date()) => {
        const cacheKey = realWorldDate.toISOString().split('T')[0];
        if (dateCache.has(cacheKey)) return dateCache.get(cacheKey);
        
        const timeDiff = realWorldDate - BASE_REAL_DATE;
        const totalNeravelleDaysPassed = Math.floor((timeDiff * 2) / MS_PER_DAY);
        
        const yearsPassed = Math.floor(totalNeravelleDaysPassed / DAYS_IN_YEAR);
        const remainingDays = totalNeravelleDaysPassed % DAYS_IN_YEAR;
        
        const nvYear = BASE_NV_YEAR + yearsPassed;
        const nvMonthIndex = Math.floor(remainingDays / DAYS_IN_MONTH);
        const nvDay = (remainingDays % DAYS_IN_MONTH) + 1;
        
        const dayIndex = (BASE_DAY_INDEX + totalNeravelleDaysPassed) % DAYS.length;
        const nvDayName = DAYS[dayIndex < 0 ? dayIndex + DAYS.length : dayIndex];

        const result = {
            year: nvYear,
            month: MONTHS[nvMonthIndex],
            day: nvDay,
            dayName: nvDayName
        };
        
        dateCache.set(cacheKey, result);
        return result;
    };
})();

// Time calculations with performance optimization
function getNeravelleTime(realWorldDate = new Date()) {
    const realHours = realWorldDate.getHours();
    const realMinutes = realWorldDate.getMinutes();
    const realSeconds = realWorldDate.getSeconds();
    
    const totalNeravelleSeconds = (realHours * 3600 + realMinutes * 60 + realSeconds) * 2;
    const nvHours = Math.floor(totalNeravelleSeconds / 3600) % 24;
    const nvMinutes = Math.floor((totalNeravelleSeconds % 3600) / 60);
    const nvSeconds = Math.floor(totalNeravelleSeconds % 60);
    
    const nvDate = calculateNeravelleDate(realWorldDate);
    
    return {
        time: `${String(nvHours).padStart(2, '0')}:${String(nvMinutes).padStart(2, '0')}:${String(nvSeconds).padStart(2, '0')}`,
        date: `${nvDate.dayName}, ${nvDate.day} ${nvDate.month} ${nvDate.year} KSN`,
        realTime: `${String(realHours).padStart(2, '0')}:${String(realMinutes).padStart(2, '0')}:${String(realSeconds).padStart(2, '0')}`,
        dayName: nvDate.dayName,
        nvHours: nvHours,
        nvDay: nvDate.day
    };
}

// Star creation with performance optimization
function createStars() {
    const container = domCache.starsContainer();
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create stars using DocumentFragment
    const fragment = document.createDocumentFragment();
    
    // Create 160 stars
    for (let i = 0; i < 160; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 3.5 + 2;
        const color = CELESTIAL_CONFIG.colors[Math.floor(Math.random() * CELESTIAL_CONFIG.colors.length)];
        
        Object.assign(star.style, {
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 ${7 + Math.random() * 22}px ${color}, 0 0 4px #fff`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.7 + Math.random() * 0.3
        });
        
        fragment.appendChild(star);
    }
    
    // Create 5 nebulae
    for (let i = 0; i < 5; i++) {
        const neb = document.createElement('div');
        neb.className = 'nebula';
        
        const s = 120 + Math.random() * 160;
        const gradient = CELESTIAL_CONFIG.nebulaGradients[
            Math.floor(Math.random() * CELESTIAL_CONFIG.nebulaGradients.length)
        ];
        
        Object.assign(neb.style, {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${s}px`,
            height: `${s * (0.5 + Math.random())}px`,
            background: gradient,
            opacity: 0.27 + Math.random() * 0.25,
            filter: `blur(${24 + Math.random() * 18}px)`,
            animationDelay: `${Math.random() * 12}s`
        });
        
        fragment.appendChild(neb);
    }
    
    container.appendChild(fragment);
}

// Moon phase calculation
function getMoonPhase(day) {
    const phase = ((day - 1) % 35) / 35;
    
    if (phase < 0.05 || phase >= 0.95) return "new";
    if (phase < 0.25) return "crescent";
    if (phase < 0.45) return "half";
    if (phase < 0.5) return "gibbous";
    if (phase < 0.55) return "full";
    if (phase < 0.75) return "gibbous";
    if (phase < 0.95) return "half";
    return "crescent";
}

// [PERBAIKAN] Fungsi updateSkyAnimation dengan class-based
function updateSkyAnimation(nvHours, nvDay) {
    const sunMoon = domCache.sunMoon();
    const stars = domCache.stars();
    const body = domCache.body();
    
    if (!sunMoon || !stars || !body) return;
    
    const isNight = nvHours < 5 || nvHours >= 19;
    const isDawn = nvHours >= 5 && nvHours < 7;
    const isDay = nvHours >= 7 && nvHours < 17;
    const isSunset = nvHours >= 17 && nvHours < 19;
    
    let celestialX, celestialY;
    const progress = (nvHours >= 5) ? (nvHours - 5) : (nvHours + 19);
    celestialX = (progress / 14) * 100;
    
    if (isDawn) {
        celestialY = 80 - ((nvHours - 5) / 2) * 60;
    } else if (isDay) {
        celestialY = 20;
    } else if (isSunset) {
        celestialY = 20 + ((nvHours - 17) / 2) * 60;
    } else {
        const nightProgress = (nvHours >= 19) ? (nvHours - 19) : (nvHours + 5);
        celestialX = (nightProgress / 10) * 100;
        celestialY = 20 + Math.sin((nightProgress / 10) * Math.PI) * 50;
    }
    
    // Update sun/moon position
    Object.assign(sunMoon.style, {
        left: `${celestialX}%`,
        top: `${celestialY}%`,
        width: `${CELESTIAL_CONFIG.size}px`,
        height: `${CELESTIAL_CONFIG.size}px`
    });
    
    // Update body class based on time
    body.classList.remove('night-sky', 'dawn-sky', 'day-sky', 'sunset-sky');
    
    if (isNight) {
        const moonPhase = getMoonPhase(nvDay);
        sunMoon.className = `sun-moon moon-${moonPhase}`;
        sunMoon.dataset.isSun = "false";
        stars.style.opacity = '1';
        body.classList.add('night-sky');
    } else {
        sunMoon.className = "sun-moon";
        sunMoon.dataset.isSun = "true";
        stars.style.opacity = '0';
        
        if (isDawn) {
            body.classList.add('dawn-sky');
        } else if (isDay) {
            body.classList.add('day-sky');
        } else if (isSunset) {
            body.classList.add('sunset-sky');
        }
    }
}

// Clock update with debouncing
const debouncedUpdateClock = (() => {
    let lastUpdate = 0;
    let timeoutId = null;
    let lastNvHours = null;
    
    return () => {
        const now = Date.now();
        const nv = getNeravelleTime();
        
        // Update time displays immediately
        if (domCache.neravelleTimeEl()) domCache.neravelleTimeEl().textContent = nv.time;
        if (domCache.neravelleDateEl()) domCache.neravelleDateEl().textContent = nv.date;
        if (domCache.realWorldTimeEl()) domCache.realWorldTimeEl().textContent = nv.realTime;
        if (domCache.dayDescriptionEl()) {
            domCache.dayDescriptionEl().textContent = DAY_DESCRIPTIONS[nv.dayName] || "";
        }
        
        // Only update sky animation when hour changes or after 1 second
        if (nv.nvHours !== lastNvHours || now - lastUpdate >= 1000) {
            updateSkyAnimation(nv.nvHours, nv.nvDay);
            lastNvHours = nv.nvHours;
            lastUpdate = now;
            
            // Clear any pending updates
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        } else if (!timeoutId) {
            // Schedule next update if needed
            timeoutId = setTimeout(() => {
                timeoutId = null;
                debouncedUpdateClock();
            }, 1000 - (now - lastUpdate));
        }
    };
})();

// Birthday converter with input validation
function initBirthdayConverter() {
    const input = domCache.birthdayInput();
    const output = domCache.birthdayOutput();
    
    if (!input || !output) return;
    
    input.addEventListener('input', function() {
        if (!this.value) {
            output.textContent = "";
            return;
        }
        
        try {
            const realDate = new Date(this.value + 'T00:00:00');
            if (isNaN(realDate.getTime())) throw new Error("Invalid date");
            
            const nvDate = calculateNeravelleDate(realDate);
            output.textContent = `Di NeraVelle, lahirmu pada: ${nvDate.dayName}, ${nvDate.day} ${nvDate.month} ${nvDate.year} KSN`;
        } catch (e) {
            output.textContent = "Format tanggal tidak valid";
        }
    });
}
// [PERBAIKAN] Init semua komponen
function init() {
    createStars();
    setInterval(debouncedUpdateClock, 500);
    debouncedUpdateClock();
    initBirthdayConverter();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
