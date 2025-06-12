// NERAVELLE: Optimized Calendar, Sky, Sidebar, Accordion, Accessibility, and Debounced Clock

// --- Konstanta dan Konfigurasi ---
const DAYS = Object.freeze(["Elarion", "Velmora", "Tarsilune", "Dravendei", "Esmiradyn", "Lapliel", "Noxverra"]);
const MONTHS = Object.freeze([
    "Luthenya", "Caelurest", "Virellan", "Emberleth", "Solmareth", "Ashdelyr",
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
const BASE_REAL_DATE = new Date('2025-05-17T00:00:00');
const BASE_NV_YEAR = 1045;
const BASE_NV_MONTH = 0;
const BASE_NV_DAY = 1;
const BASE_NV_DAY_NAME = "Elarion";
const BASE_DAY_INDEX = DAYS.indexOf(BASE_NV_DAY_NAME);
const DAYS_IN_MONTH = 35;
const DAYS_IN_YEAR = DAYS_IN_MONTH * MONTHS.length;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const CELESTIAL_CONFIG = {
    size: 120,
    colors: Object.freeze(['#fffbe8', '#d0bfff', '#b8c0ff', '#8ecae6', '#f1c0e8', '#caf0f8', '#ffe066', '#f7cad0']),
    nebulaGradients: Object.freeze([
        'radial-gradient(circle at 40% 60%, #b8c0ff77 0%, #5e60ce44 70%, transparent 100%)',
        'radial-gradient(circle at 60% 40%, #f1c0e899 0%, #a2d2ff44 80%, transparent 100%)',
        'radial-gradient(circle at 70% 30%, #ffe06655 0%, #ffb4a2bb 60%, transparent 100%)',
        'radial-gradient(circle at 20% 80%, #d0bfff77 0%, #b8c0ff55 90%, transparent 100%)'
    ])
};

// --- DOM Cache ---
const domCache = {
    starsContainer: null,
    sunMoon: null,
    sunsetGlow: null,
    dawnGlow: null,
    stars: null,
    body: null,
    neravelleTimeEl: null,
    neravelleDateEl: null,
    realWorldTimeEl: null,
    dayDescriptionEl: null,
    birthdayInput: null,
    birthdayOutput: null,
    menuToggle: null,
    sidebar: null
};

// --- Utilitas Kalender & Waktu ---
function calculateNeravelleDate(realWorldDate = new Date()) {
    const timeDiff = realWorldDate - BASE_REAL_DATE;
    const totalNeravelleDaysPassed = Math.floor((timeDiff * 2) / MS_PER_DAY);
    const yearsPassed = Math.floor(totalNeravelleDaysPassed / DAYS_IN_YEAR);
    const remainingDays = totalNeravelleDaysPassed % DAYS_IN_YEAR;
    const nvYear = BASE_NV_YEAR + yearsPassed;
    const nvMonthIndex = Math.floor(remainingDays / DAYS_IN_MONTH);
    const nvDay = (remainingDays % DAYS_IN_MONTH) + 1;
    const dayIndex = (BASE_DAY_INDEX + totalNeravelleDaysPassed) % DAYS.length;
    const nvDayName = DAYS[dayIndex < 0 ? dayIndex + DAYS.length : dayIndex];
    return {
        year: nvYear,
        month: MONTHS[nvMonthIndex],
        day: nvDay,
        dayName: nvDayName
    };
}

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

// --- Sky & Bintang ---
function createStars() {
    if (!domCache.starsContainer) return;
    domCache.starsContainer.innerHTML = '';
    const starFragment = document.createDocumentFragment();
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
        starFragment.appendChild(star);
    }
    domCache.starsContainer.appendChild(starFragment);
    const nebulaFragment = document.createDocumentFragment();
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
        nebulaFragment.appendChild(neb);
    }
    domCache.starsContainer.appendChild(nebulaFragment);
}

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

function updateSkyAnimation(nvHours, nvDay, nvDayName) {
    if (!domCache.sunMoon || !domCache.stars || !domCache.body) return;
    const isNight = nvHours < 5 || nvHours >= 19;
    const isDawn = nvHours >= 5 && nvHours < 7;
    const isDay = nvHours >= 7 && nvHours < 17;
    const isSunset = nvHours >= 17 && nvHours < 19;
    let celestialX, celestialY;
    const progress = (nvHours >= 5) ? (nvHours - 5) : (nvHours + 19);
    celestialX = (progress / 14) * 100;
    if (isDawn) celestialY = 80 - ((nvHours - 5) / 2) * 60;
    else if (isDay) celestialY = 20;
    else if (isSunset) celestialY = 20 + ((nvHours - 17) / 2) * 60;
    else { // Night
        const nightProgress = (nvHours >= 19) ? (nvHours - 19) : (nvHours + 5);
        celestialX = (nightProgress / 10) * 100;
        celestialY = 20 + Math.sin((nightProgress / 10) * Math.PI) * 50;
    }
    Object.assign(domCache.sunMoon.style, {
        left: `${celestialX}%`,
        top: `${celestialY}%`,
        width: `${CELESTIAL_CONFIG.size}px`,
        height: `${CELESTIAL_CONFIG.size}px`
    });
    if (isNight) {
        const moonPhase = getMoonPhase(nvDay);
        domCache.sunMoon.className = `sun-moon moon-${moonPhase}`;
        domCache.sunMoon.dataset.isSun = "false";
        domCache.stars.style.opacity = 1;
        domCache.body.style.background = 'var(--purple-dark)';
    } else {
        domCache.sunMoon.className = "sun-moon";
        domCache.sunMoon.dataset.isSun = "true";
        domCache.stars.style.opacity = 0;
        if (isDawn) domCache.body.style.background = 'var(--dawn-sky)';
        else if (isDay) domCache.body.style.background = 'var(--day-sky)';
        else if (isSunset) domCache.body.style.background = 'var(--sunset-sky)';
    }
}

// --- Birthday Converter ---
function initBirthdayConverter() {
    if (!domCache.birthdayInput || !domCache.birthdayOutput) return;
    domCache.birthdayInput.addEventListener('input', function() {
        if (!this.value) {
            domCache.birthdayOutput.textContent = "";
            return;
        }
        const realDate = new Date(this.value + 'T00:00:00');
        const nvDate = calculateNeravelleDate(realDate);
        domCache.birthdayOutput.textContent =
            `Di NeraVelle, lahirmu pada: ${nvDate.dayName}, ${nvDate.day} ${nvDate.month} ${nvDate.year} KSN`;
    });
}

// --- Sidebar dengan ARIA & Accessibility ---
function initSidebar() {
    if (!domCache.menuToggle || !domCache.sidebar) return;
    domCache.menuToggle.setAttribute('aria-expanded', 'false');
    domCache.menuToggle.setAttribute('aria-controls', 'sidebar');
    domCache.menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    domCache.sidebar.setAttribute('aria-label', 'Main navigation');
    domCache.sidebar.setAttribute('aria-modal', 'true');
    domCache.sidebar.setAttribute('role', 'dialog');
    domCache.menuToggle.addEventListener('click', () => {
        const isExpanded = domCache.sidebar.classList.toggle('open');
        domCache.menuToggle.setAttribute('aria-expanded', isExpanded.toString());
        if (isExpanded) {
            domCache.sidebar.removeAttribute('inert');
            const focusable = domCache.sidebar.querySelector('a, button');
            if (focusable) focusable.focus();
        } else {
            domCache.sidebar.setAttribute('inert', '');
        }
    });
}

// --- Accordion dengan ARIA & Accessibility ---
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        const button = header.querySelector('button') || header;
        const content = header.nextElementSibling;
        // Generate unique IDs if needed
        if (!button.id) button.id = `accordion-header-${Math.random().toString(36).substr(2, 9)}`;
        if (!content.id) content.id = `accordion-content-${Math.random().toString(36).substr(2, 9)}`;
        // Set ARIA attributes
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', content.id);
        content.setAttribute('aria-labelledby', button.id);
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', (!isExpanded).toString());
            header.classList.toggle('active');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.classList.remove('active');
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.classList.add('active');
            }
        });
    });
}

// --- Navigation Smooth Scroll & Sidebar Auto-close ---
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            if (window.innerWidth <= 1024 && domCache.sidebar) {
                domCache.sidebar.classList.remove('open');
                domCache.menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// --- Debounce Utility ---
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// --- Update Jam & Animasi Langit ---
let lastNvHours = null;
function updateClock() {
    const nv = getNeravelleTime();
    if (domCache.neravelleTimeEl) domCache.neravelleTimeEl.textContent = nv.time;
    if (domCache.neravelleDateEl) domCache.neravelleDateEl.textContent = nv.date;
    if (domCache.realWorldTimeEl) domCache.realWorldTimeEl.textContent = nv.realTime;
    if (domCache.dayDescriptionEl) domCache.dayDescriptionEl.textContent = DAY_DESCRIPTIONS[nv.dayName] || "";
    if (nv.nvHours !== lastNvHours) {
        updateSkyAnimation(nv.nvHours, nv.nvDay, nv.dayName);
        lastNvHours = nv.nvHours;
    }
}
const debouncedUpdateClock = debounce(updateClock, 1000);

// --- DOM Cache ---
function cacheDOMElements() {
    domCache.starsContainer = document.getElementById('stars');
    domCache.sunMoon = document.getElementById('sunMoon');
    domCache.sunsetGlow = document.getElementById('sunsetGlow');
    domCache.dawnGlow = document.getElementById('dawnGlow');
    domCache.stars = document.getElementById('stars');
    domCache.body = document.body;
    domCache.neravelleTimeEl = document.getElementById('neravelleTime');
    domCache.neravelleDateEl = document.getElementById('neravelleDate');
    domCache.realWorldTimeEl = document.getElementById('realWorldTime');
    domCache.dayDescriptionEl = document.getElementById('dayDescription');
    domCache.birthdayInput = document.getElementById('birthdayInput');
    domCache.birthdayOutput = document.getElementById('birthdayOutput');
    domCache.menuToggle = document.getElementById('menu-toggle');
    domCache.sidebar = document.getElementById('sidebar');
}

// --- Inisialisasi ---
document.addEventListener('DOMContentLoaded', () => {
    cacheDOMElements();
    initBirthdayConverter();
    initSidebar();
    initAccordion();
    initNavigation();
    createStars();
    setInterval(debouncedUpdateClock, 1000);
    updateClock();
});
