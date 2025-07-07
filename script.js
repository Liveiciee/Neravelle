const DAYS = Object.freeze(["Elarion", "Velmora", "Tarsilune", "Dravendei", "Esmiradyn", "Lapliel", "Noxverra"]);
const MONTHS = Object.freeze([
    "Aethera", "Crystallina", "Aerius", "Floraison", "Luminosa", "Solaria",
    "Ignifera", "Abundantia", "Vestalia", "Terraverdea", "Nestaria", "Glimmeria"
]);
const DAY_DESCRIPTIONS = Object.freeze({
    "Elarion": "Hari cahaya baru, awal dari segala usaha.",
    "Velmora": "Waktu ilmu pengetahuan dan kebijaksanaan.",
    "Tarsilune": "Hari refleksi, meditasi, dan ritual kecil.",
    "Dravendei": "Hari kekuatan, kehormatan, dan keteguhan hati.",
    "Esmiradyn": "Hari keberuntungan dan kemakmuran.",
    "Lapliel": "Hari kedamaian dan ekspresi seni.",
    "Noxverra": "Hari istirahat dan doa yang sakral."
});

// Constants for date calculations
const BASE_REAL_DATE = new Date('2025-06-29T00:00:00');
const BASE_NV_YEAR = 800;
const BASE_NV_MONTH = 0;
const BASE_NV_DAY = 0;
const BASE_NV_DAY_NAME = "Elarion";
const BASE_DAY_INDEX = DAYS.indexOf(BASE_NV_DAY_NAME);
const DAYS_IN_MONTH = 30;
const DAYS_IN_YEAR = DAYS_IN_MONTH * MONTHS.length;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const domCache = {
    neravelleTimeEl: () => document.getElementById('neravelleTime'),
    neravelleDateEl: () => document.getElementById('neravelleDate'),
    realWorldTimeEl: () => document.getElementById('realWorldTime'),
    dayDescriptionEl: () => document.getElementById('dayDescription'),
    birthdayInput: () => document.getElementById('birthdayInput'),
    birthdayOutput: () => document.getElementById('birthdayOutput')
};

const calculateNeravelleDate = (() => {
    const dateCache = new Map();
    
    return (realWorldDate = new Date()) => {
        const cacheKey = realWorldDate.toISOString().split('T')[0];
        if (dateCache.has(cacheKey)) return dateCache.get(cacheKey);
        
        // Apply the 4-hour offset
        const adjustedDate = new Date(realWorldDate);
        adjustedDate.setHours(adjustedDate.getHours() + 0);
        
        const timeDiff = adjustedDate - BASE_REAL_DATE;
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

function getNeravelleTime(realWorldDate = new Date()) {
    // Calculate exact millisecond difference from base date
    const timeDiff = realWorldDate - BASE_REAL_DATE;
    
    // Convert to Neravelle time (2x faster)
    const totalNeravelleMs = timeDiff * 2;
    const totalNeravelleSeconds = Math.floor(totalNeravelleMs / 1000);
    
    const nvHours = Math.floor(totalNeravelleSeconds / 3600) % 24;
    const nvMinutes = Math.floor((totalNeravelleSeconds % 3600) / 60);
    const nvSeconds = Math.floor(totalNeravelleSeconds % 60);
    
    // Calculate date components
    const totalNeravelleDaysPassed = Math.floor(totalNeravelleSeconds / 86400);
    const nvDate = calculateNeravelleDate(realWorldDate);
    
    return {
        time: `${String(nvHours).padStart(2, '0')}:${String(nvMinutes).padStart(2, '0')}:${String(nvSeconds).padStart(2, '0')}`,
        date: `${nvDate.dayName}, ${nvDate.day} ${nvDate.month} ${nvDate.year} KHL`,
        realTime: realWorldDate.toLocaleTimeString(),
        dayName: nvDate.dayName,
        nvHours: nvHours,
        nvDay: nvDate.day
    };
}

const debouncedUpdateClock = (() => {
    let lastUpdate = 0;
    let timeoutId = null;
    
    return () => {
        const now = Date.now();
        const nv = getNeravelleTime();
        
        if (domCache.neravelleTimeEl()) domCache.neravelleTimeEl().textContent = nv.time;
        if (domCache.neravelleDateEl()) domCache.neravelleDateEl().textContent = nv.date;
        if (domCache.realWorldTimeEl()) domCache.realWorldTimeEl().textContent = nv.realTime;
        if (domCache.dayDescriptionEl()) {
            domCache.dayDescriptionEl().textContent = DAY_DESCRIPTIONS[nv.dayName] || "";
        }
        
        if (now - lastUpdate >= 1000) {
            lastUpdate = now;
            
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                timeoutId = null;
                debouncedUpdateClock();
            }, 1000 - (now - lastUpdate));
        }
    };
})();

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
            
            // Calculate the exact time difference
            const timeDiff = realDate - BASE_REAL_DATE;
            const totalNeravelleDaysPassed = Math.floor((timeDiff * 2) / MS_PER_DAY);
            
            // Calculate Neravelle date components
            const yearsPassed = Math.floor(totalNeravelleDaysPassed / DAYS_IN_YEAR);
            const remainingDays = totalNeravelleDaysPassed % DAYS_IN_YEAR;
            
            const nvYear = BASE_NV_YEAR + yearsPassed;
            const nvMonthIndex = Math.floor(remainingDays / DAYS_IN_MONTH);
            const nvDay = (remainingDays % DAYS_IN_MONTH) + 1;
            
            const dayIndex = (BASE_DAY_INDEX + totalNeravelleDaysPassed) % DAYS.length;
            const nvDayName = DAYS[dayIndex < 0 ? dayIndex + DAYS.length : dayIndex];
            
            output.textContent = `Di NeraVelle, lahirmu pada: ${nvDayName}, ${nvDay} ${MONTHS[nvMonthIndex]} ${nvYear} KSN`;
        } catch (e) {
            output.textContent = "Format tanggal tidak valid";
        }
    });
}

function init() {
    setInterval(debouncedUpdateClock, 500);
    debouncedUpdateClock();
    initBirthdayConverter();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
