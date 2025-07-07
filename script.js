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

// Optimized particle creation with throttling
let resizeTimeout;
const particleCount = Math.min(30, Math.floor(window.innerWidth / 30));

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

function createParticles() {
    const container = document.querySelector('.particles');
    container.innerHTML = '';
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 5 + 1;
        const posX = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * -20;
        const opacity = Math.random() * 0.5 + 0.1;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${posX}%;
            top: 100%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: ${opacity};
        `;
        
        container.appendChild(particle);
    }
}

function handleScroll() {
    document.querySelectorAll('.section').forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        
        if (isVisible) {
            section.classList.add('visible');
        } else {
            // Optional: Uncomment if you want sections to hide when scrolled past
            // section.classList.remove('visible');
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    updateClock();
    initBirthdayConverter();
    handleScroll();
    
    // Throttled resize handler
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            createParticles();
        }, 200);
    });
    
    window.addEventListener('scroll', handleScroll);
});

// Update clock every second
setInterval(updateClock, 1000);
