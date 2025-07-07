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
    const timeDiff = (realDate - BASE_DATE) * 2;
    const daysPassed = Math.floor(timeDiff / MS_PER_DAY);
    
    const year = BASE_YEAR + Math.floor(daysPassed / DAYS_IN_YEAR);
    const monthIdx = Math.floor((daysPassed % DAYS_IN_YEAR) / DAYS_IN_MONTH);
    const day = (daysPassed % DAYS_IN_MONTH) + 1;
    const dayName = DAYS[(DAYS.indexOf("Elarion") + daysPassed) % DAYS.length];
    
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

function initBirthdayConverter() {
    const input = document.getElementById('birthdayInput');
    input.addEventListener('input', function() {
        const output = document.getElementById('birthdayOutput');
        if (!this.value) return output.textContent = "";
        
        try {
            const realDate = new Date(this.value + 'T00:00:00');
            const nv = getNeravelleTime(realDate);
            output.textContent = `Di Neravelle: ${nv.date}`;
        } catch {
            output.textContent = "Format tanggal tidak valid (Gunakan YYYY-MM-DD)";
        }
    });
}

// Init
setInterval(updateClock, 1000);
updateClock();
initBirthdayConverter();
