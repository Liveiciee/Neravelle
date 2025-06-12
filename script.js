// Konfigurasi Kalender NeraVelle
const DAYS = ["Elarion", "Velmora", "Tarsilune", "Dravendei", "Esmiradyn", "Lapliel", "Noxverra"];
const MONTHS = ["Luthenya", "Caelurest", "Virellan", "Emberleth", "Solmareth", "Ashdelyr", 
               "Zephandor", "Thundareen", "Mystralis", "Velouren", "Aurevanthe", "Nyxoria"];

const DAY_DESCRIPTIONS = {
    "Elarion": "Hari cahaya awal. Melambangkan harapan dan permulaan.",
    "Velmora": "Hari angin dan bisikan. Hari untuk merenung dan menerima ilham.",
    "Tarsilune": "Hari bulan jatuh. Menggambarkan keindahan malam dan kelembutan hati.",
    "Dravendei": "Hari kekuatan. Didedikasikan untuk semangat, kerja keras, dan keberanian.",
    "Esmiradyn": "Hari kristal dan sihir. Hari para penyihir dan pemurnian jiwa.",
    "Lapliel": "Hari langit dan roh. Digunakan untuk berdoa, bermeditasi, dan terhubung dengan kekuatan luhur.",
    "Noxverra": "Hari bintang dan malam hidup. Hari perayaan, kenangan, dan malam penuh makna."
};

// Base date for Neravelle calendar (real world date when Neravelle calendar started)
const BASE_REAL_DATE = new Date('2025-05-17T00:00:00');
const BASE_NV_YEAR = 1045;
const BASE_NV_MONTH = 0; // Luthenya
const BASE_NV_DAY = 1;
const BASE_NV_DAY_NAME = "Elarion";

// Calculate current Neravelle date based on real world time
function calculateNeravelleDate(realWorldDate) {
    const now = realWorldDate || new Date();
    const timeDiff = now - BASE_REAL_DATE;
    const nvTimeDiff = timeDiff * 2; // NeraVelle berjalan 2x lebih cepat
    const totalNeravelleDaysPassed = Math.floor(nvTimeDiff / (1000 * 60 * 60 * 24));

    let remainingDays = totalNeravelleDaysPassed;
    let nvYear = BASE_NV_YEAR;
    let nvMonthIndex = BASE_NV_MONTH;
    let nvDay = BASE_NV_DAY;

    // Mundur ke masa lalu jika remainingDays negatif
    if (remainingDays >= 0) {
        while (remainingDays > 0) {
            const daysInMonth = 35;
            if (nvDay + remainingDays > daysInMonth) {
                remainingDays -= (daysInMonth - nvDay);
                nvDay = 1;
                nvMonthIndex++;
                if (nvMonthIndex >= MONTHS.length) {
                    nvMonthIndex = 0;
                    nvYear++;
                }
            } else {
                nvDay += remainingDays;
                remainingDays = 0;
            }
        }
    } else {
        // Mundur ke masa lalu
        while (remainingDays < 0) {
            if (nvDay + remainingDays > 0) {
                nvDay += remainingDays;
                remainingDays = 0;
            } else {
                remainingDays += (nvDay - 1);
                nvMonthIndex--;
                if (nvMonthIndex < 0) {
                    nvMonthIndex = MONTHS.length - 1;
                    nvYear--;
                }
                nvDay = 35;
            }
        }
    }

    // Batas minimal 0 KSN
    if (nvYear < 0) {
        nvYear = 0;
        nvMonthIndex = 0;
        nvDay = 1;
    }

    // Hitung hari dalam seminggu Neravelle
    let totalDaysFromBaseInNeravelle = totalNeravelleDaysPassed + (typeof nvDayOffset === "number" ? nvDayOffset : 1);
    if (totalDaysFromBaseInNeravelle < 0) {
        // Mundur, index harus tetap positif
        const baseIndex = DAYS.indexOf(BASE_NV_DAY_NAME);
        let dayIndex = (baseIndex + totalDaysFromBaseInNeravelle) % DAYS.length;
        if (dayIndex < 0) dayIndex += DAYS.length;
        var nvDayName = DAYS[dayIndex];
    } else {
        const dayIndex = (DAYS.indexOf(BASE_NV_DAY_NAME) + totalDaysFromBaseInNeravelle) % DAYS.length;
        var nvDayName = DAYS[dayIndex];
    }

    return {
        year: nvYear,
        month: MONTHS[nvMonthIndex],
        day: nvDay,
        dayName: nvDayName
    };
}

// === Ulang Tahun NeraVelle ===
function convertBirthdate(realDate) {
    const nvDate = calculateNeravelleDate(new Date(realDate));
    return `Anda lahir di hari ${nvDate.dayName}, ${nvDate.day} ${nvDate.month}`;
}

const birthdayInput = document.getElementById('birthdayInput');
const birthdayOutput = document.getElementById('birthdayOutput');
if (birthdayInput && birthdayOutput) {
    birthdayInput.addEventListener('input', function() {
        const inputDate = birthdayInput.value;
        if (!inputDate) {
            birthdayOutput.textContent = "";
            return;
        }
        const realDate = new Date(inputDate + 'T00:00:00');
        const nvDate = calculateNeravelleDate(realDate);
        birthdayOutput.textContent = 
            `Ulang tahunmu di kalender NeraVelle: ${nvDate.dayName}, ${nvDate.day} ${nvDate.month} ${nvDate.year} KSN`;
    });
}

// Hitung waktu NeraVelle (2× lebih cepat)
function getNeravelleTime(realWorldDate) {
    const now = realWorldDate || new Date();

    // Waktu nyata
    const realHours = now.getHours();
    const realMinutes = now.getMinutes();
    const realSeconds = now.getSeconds();

    // Hitung total detik dunia nyata sejak tengah malam
    const totalRealSeconds = realHours * 3600 + realMinutes * 60 + realSeconds;

    // Kalikan 2 untuk waktu NeraVelle
    const totalNeravelleSeconds = totalRealSeconds * 2;

    // Hitung HH:MM:SS NeraVelle
    const nvHours = Math.floor(totalNeravelleSeconds / 3600) % 24;
    const nvMinutes = Math.floor((totalNeravelleSeconds % 3600) / 60);
    const nvSeconds = Math.floor(totalNeravelleSeconds % 60);

    // Calculate current Neravelle date
    const nvDate = calculateNeravelleDate(now);

    return {
        time: `${String(nvHours).padStart(2, '0')}:${String(nvMinutes).padStart(2, '0')}:${String(nvSeconds).padStart(2, '0')}`,
        date: `${nvDate.dayName}, ${nvDate.day} ${nvDate.month} ${nvDate.year} KSN`,
        realTime: `${String(realHours).padStart(2, '0')}:${String(realMinutes).padStart(2, '0')}:${String(realSeconds).padStart(2, '0')}`,
        dayName: nvDate.dayName,
        nvHours: nvHours,
        nvDay: nvDate.day
    };
}

// Create stars for night time
function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    starsContainer.innerHTML = '';

    for (let i = 0; i < 160; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        // Tidak pakai text, hanya div bulat
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        // Random size (diameter 2 - 5.5 px)
        const size = Math.random() * 3.5 + 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.borderRadius = '50%';
        // Random warna (soft)
        const colors = [
            '#fffbe8', '#d0bfff', '#b8c0ff', '#8ecae6',
            '#f1c0e8', '#caf0f8', '#ffe066', '#f7cad0'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        star.style.background = color;
        // Random glow
        star.style.boxShadow = `0 0 ${7 + Math.random() * 22}px ${color}, 0 0 4px #fff`;
        // Random twinkle delay
        star.style.animationDelay = `${Math.random() * 5}s`;
        // Opacity lebih tinggi
        star.style.opacity = 0.7 + Math.random() * 0.3;
        starsContainer.appendChild(star);
    }

    // Nebula/galaksi tetap
    for (let i = 0; i < 5; i++) {
        const neb = document.createElement('div');
        neb.className = 'nebula';
        neb.style.left = `${Math.random()*100}%`;
        neb.style.top = `${Math.random()*100}%`;
        const s = 120 + Math.random()*160;
        neb.style.width = `${s}px`;
        neb.style.height = `${s*(0.5+Math.random())}px`;
        const nebulaGradients = [
            'radial-gradient(circle at 40% 60%, #b8c0ff77 0%, #5e60ce44 70%, transparent 100%)',
            'radial-gradient(circle at 60% 40%, #f1c0e899 0%, #a2d2ff44 80%, transparent 100%)',
            'radial-gradient(circle at 70% 30%, #ffe06655 0%, #ffb4a2bb 60%, transparent 100%)',
            'radial-gradient(circle at 20% 80%, #d0bfff77 0%, #b8c0ff55 90%, transparent 100%)'
        ];
        neb.style.background = nebulaGradients[Math.floor(Math.random()*nebulaGradients.length)];
        neb.style.opacity = 0.27 + Math.random()*0.25;
        neb.style.filter = `blur(${24+Math.random()*18}px)`;
        neb.style.animationDelay = `${Math.random()*12}s`;
        starsContainer.appendChild(neb);
    }
}

// Get moon phase based on day of month
function getMoonPhase(day) {
    const phase = (day % 28) / 28; // Normalize to 0-1
    if (phase < 0.05 || phase >= 0.95) return "new";
    if (phase < 0.25) return "crescent";
    if (phase < 0.3) return "half";
    if (phase < 0.45) return "gibbous";
    if (phase < 0.55) return "full";
    if (phase < 0.7) return "gibbous";
    if (phase < 0.75) return "half";
    return "crescent";
}

// Update sky animation based on Neravelle time
function updateSkyAnimation(nvHours, nvDay, nvDayName) {
    const celestialBaseX = 10; // Define once
    const celestialBaseY = 20; // Define once
    let celestialX, celestialY;
    const sunMoon = document.getElementById('sunMoon');
    const sunsetGlow = document.getElementById('sunsetGlow');
    const dawnGlow = document.getElementById('dawnGlow');
    const stars = document.getElementById('stars');
    const body = document.body;

    if (!sunMoon || !sunsetGlow || !dawnGlow || !stars) return;

    // 1. Tentukan fase waktu dan inisialisasi variabel
    const isNight = (nvHours < 5 || nvHours >= 19);
    const isDawn = (nvHours >= 5 && nvHours < 7);
    const isDay = (nvHours >= 7 && nvHours < 17);
    const isSunset = (nvHours >= 17 && nvHours < 19);

    let celestialSize = 120;
    let glowSize = 300;

    // 2. Atur posisi celestial object (sun/moon)
    if (isDawn) {
        celestialX = 10 + ((nvHours - 5) / 2) * 40;
        celestialY = 80;
        celestialSize = 150;
    } 
    else if (isDay) {
        celestialX = celestialBaseX + ((nvHours - 5) / 12) * 80;
        celestialY = celestialBaseY;
    } 
    else if (isSunset) {
        celestialX = 10 + ((nvHours - 5) / 12) * 80;
        celestialY = 20 + ((nvHours - 17) / 2) * 60;
        celestialSize = 150;
    } 
    else { // Night
        celestialX = 10 + ((nvHours + 7) % 24 / 12) * 80;
        celestialY = 20 + ((nvHours < 5) ? (nvHours / 5) * 60 : 0);
    }

    // 3. Atur tampilan berdasarkan waktu
    if (isNight) {
        // Mode malam: bulan + bintang
        const moonPhase = getMoonPhase(nvDay);
        sunMoon.className = `sun-moon moon-${moonPhase}`;
        sunMoon.setAttribute('data-is-sun', "false");
        sunMoon.style.animation = 'moon-glow 4s infinite';
        stars.style.opacity = 1; 
        body.style.background = 'var(--purple-dark)';
        sunsetGlow.style.opacity = 0;
        dawnGlow.style.opacity = 0;

        // Efek khusus hari Tarsilune
        if (nvDayName === "Tarsilune") {
            sunMoon.style.boxShadow = '0 0 80px var(--moon-color), 0 0 160px rgba(224, 224, 255, 0.7)';
            stars.style.opacity = 0.1; 
        } else {
            sunMoon.style.boxShadow = '';
        }
    } 
    else {
        // Mode siang/senja/fajar: matahari
        sunMoon.className = "sun-moon";
        sunMoon.setAttribute('data-is-sun', "true");
        sunMoon.style.background = 'radial-gradient(circle, var(--sun-color) 30%, transparent 70%)';
        sunMoon.style.boxShadow = '0 0 60px var(--sun-color), 0 0 120px rgba(255, 158, 88, 0.5)';
        sunMoon.style.animation = 'none';

        if (isDawn) {
            dawnGlow.style.opacity = 0.8 - ((nvHours - 5) / 2) * 0.8;
            sunsetGlow.style.opacity = 0;
            stars.style.opacity = 0;
            body.style.background = 'var(--dawn-sky)';
        } 
        else if (isDay) {
            dawnGlow.style.opacity = 0;
            sunsetGlow.style.opacity = 0;
            stars.style.opacity = 0;
            body.style.background = 'var(--day-sky)';
        } 
        else if (isSunset) {
            sunsetGlow.style.opacity = 0.8 - ((19 - nvHours) / 2) * 0.8;
            dawnGlow.style.opacity = 0;
            stars.style.opacity = (nvHours - 17) / 2;
            body.style.background = 'var(--sunset-sky)';
        }

        // Reset efek yang tidak digunakan
        if (!isDawn) dawnGlow.style.opacity = 0;
        if (!isSunset) sunsetGlow.style.opacity = 0;
        if (!isSunset && !isNight) stars.style.opacity = 0;
    }

    // 4. Terapkan posisi dan ukuran
    sunMoon.style.left = `${celestialX}%`;
    sunMoon.style.top = `${celestialY}%`;
    sunMoon.style.width = `${celestialSize}px`;
    sunMoon.style.height = `${celestialSize}px`;
    
    sunsetGlow.style.left = `${celestialX}%`;
    sunsetGlow.style.top = `${celestialY}%`;
    sunsetGlow.style.width = `${glowSize}px`;
    sunsetGlow.style.height = `${glowSize}px`;
    sunsetGlow.style.transform = 'translate(-50%, -50%)';

    dawnGlow.style.left = `${celestialX}%`;
    dawnGlow.style.top = `${celestialY}%`;
    dawnGlow.style.width = `${glowSize}px`;
    dawnGlow.style.height = `${glowSize}px`;
    dawnGlow.style.transform = 'translate(-50%, -50%)';
}
// Update clock and UI
let lastNvHours = null;

function updateClock() {
    const nv = getNeravelleTime();

    // Update tampilan waktu setiap interval
    const neravelleTimeEl = document.getElementById('neravelleTime');
    const neravelleDateEl = document.getElementById('neravelleDate');
    const realWorldTimeEl = document.getElementById('realWorldTime');
    const dayDescriptionEl = document.getElementById('dayDescription');

    if (neravelleTimeEl) neravelleTimeEl.textContent = nv.time;
    if (neravelleDateEl) neravelleDateEl.textContent = nv.date;
    if (realWorldTimeEl) realWorldTimeEl.textContent = nv.realTime;
    if (dayDescriptionEl) dayDescriptionEl.textContent = DAY_DESCRIPTIONS[nv.dayName] || "";

    // Hanya update animasi jika jam berubah
    if (nv.nvHours !== lastNvHours) {
        updateSkyAnimation(nv.nvHours, nv.nvDay, nv.dayName);
        lastNvHours = nv.nvHours;
    }
}

// Initialize stars
createStars();

// Update jam setiap 500ms untuk akurasi
setInterval(updateClock, 500);
updateClock(); // Jalankan segera
