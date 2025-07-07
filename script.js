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
        const dayName = DAYS[(DAYS.length - (daysPassed % DAYS.length)) % DAYS.length];
        
        return `${dayName}, ${day} ${MONTHS[monthIdx]} ${year} KHL (Sebelum Era Heliora)`;
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
            output.textContent = error.message;
        }
    });
}

// Initialize
setInterval(updateClock, 1000);
updateClock();
initBirthdayConverter();
