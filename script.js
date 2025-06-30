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
    starsContainer: () => document.getElementById('stars'),
    sunMoon: () => document.getElementById('sunMoon'),
    stars: () => document.getElementById('stars'),
    body: () => document.body,
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
    const realHours = realWorldDate.getHours();
    const realMinutes = realWorldDate.getMinutes();
    const realSeconds = realWorldDate.getSeconds();
    
    const totalNeravelleSeconds = ((realHours * 3600 + realMinutes * 60 + realSeconds) * 2) + (4 * 3600 * 2);
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

function createStars() {
    const container = domCache.starsContainer();
    if (!container) return;
    
    container.innerHTML = '';
    
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < 160; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 3.5 + 2;
        const color = '#fff';
        
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
    
    container.appendChild(fragment);
}

function getMoonPhase(day) {
    const phase = ((day - 1) % 25) / 25;
    
    if (phase < 0.05 || phase >= 0.95) return "new";
    if (phase < 0.25) return "crescent";
    if (phase < 0.45) return "half";
    if (phase < 0.5) return "gibbous";
    if (phase < 0.55) return "full";
    if (phase < 0.75) return "gibbous";
    if (phase < 0.95) return "half";
    return "crescent";
}

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
    
    Object.assign(sunMoon.style, {
        left: `${celestialX}%`,
        top: `${celestialY}%`,
        width: `120px`,
        height: `120px`,
        transform: 'translate(-50%, -50%)'
    });
    
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

const debouncedUpdateClock = (() => {
    let lastUpdate = 0;
    let timeoutId = null;
    let lastNvHours = null;
    
    return () => {
        const now = Date.now();
        const nv = getNeravelleTime();
        
        if (domCache.neravelleTimeEl()) domCache.neravelleTimeEl().textContent = nv.time;
        if (domCache.neravelleDateEl()) domCache.neravelleDateEl().textContent = nv.date;
        if (domCache.realWorldTimeEl()) domCache.realWorldTimeEl().textContent = nv.realTime;
        if (domCache.dayDescriptionEl()) {
            domCache.dayDescriptionEl().textContent = DAY_DESCRIPTIONS[nv.dayName] || "";
        }
        
        if (nv.nvHours !== lastNvHours || now - lastUpdate >= 1000) {
            updateSkyAnimation(nv.nvHours, nv.nvDay);
            lastNvHours = nv.nvHours;
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
            
            const adjustedDate = new Date(realDate);
            adjustedDate.setHours(adjustedDate.getHours() + 4);
            
            const nvDate = calculateNeravelleDate(adjustedDate);
            output.textContent = `Di NeraVelle, lahirmu pada: ${nvDate.dayName}, ${nvDate.day} ${nvDate.month} ${nvDate.year} KSN`;
        } catch (e) {
            output.textContent = "Format tanggal tidak valid";
        }
    });
}

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

function initGalaxy() {
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded, skipping galaxy effect');
        return;
    }
    
    const canvas = document.getElementById('cosmic-canvas');
    if (!canvas) {
        console.warn('Canvas element not found');
        return;
    }

    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(5000 * 3);
        const colors = new Float32Array(5000 * 3);
        
        for (let i = 0; i < 5000; i++) {
            positions[i*3] = (Math.random() - 0.5) * 2000;
            positions[i*3+1] = (Math.random() - 0.5) * 2000;
            positions[i*3+2] = (Math.random() - 0.5) * 2000;
            
            const color = new THREE.Color('#fff');
            colors[i*3] = color.r;
            colors[i*3+1] = color.g;
            colors[i*3+2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const stars = new THREE.Points(
            geometry,
            new THREE.PointsMaterial({ 
                size: 1.5,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true
            })
        );
        scene.add(stars);

        camera.position.z = 500;
        
        function animate() {
            requestAnimationFrame(animate);
            stars.rotation.x += 0.0005;
            stars.rotation.y += 0.001;
            renderer.render(scene, camera);
        }
        
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    } catch (e) {
        console.error('Error initializing galaxy:', e);
    }
}

function createMeteors() {
    const container = document.querySelector('.meteor-shower');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        meteor.style.left = `${Math.random() * 100}vw`;
        meteor.style.top = `${Math.random() * 100}vh`;
        meteor.style.animationDelay = `${Math.random() * 10}s`;
        container.appendChild(meteor);
    }
}

class MagicParticle {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'magic-particle';
        document.querySelector('.magic-particle-field').appendChild(this.element);
        this.reset();
    }
    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 10 + 5;
        this.life = 0;
        this.maxLife = Math.random() * 100 + 50;
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.background = `radial-gradient(circle, #fff, transparent 70%)`;
    }
    update() {
        this.life++;
        if (this.life >= this.maxLife) this.reset();
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.element.style.opacity = 1 - (this.life / this.maxLife);
    }
}

window.addEventListener('load', () => {
    setTimeout(() => {
        try {
            initGalaxy();
            createMeteors();
            
            const particleField = document.querySelector('.magic-particle-field');
            if (particleField) {
                const particles = Array.from({ length: 30 }, () => new MagicParticle());
                
                function animateParticles() {
                    particles.forEach(p => {
                        p.x += (Math.random() - 0.5) * 2;
                        p.y += (Math.random() - 0.5) * 2;
                        p.life++;
                        
                        if (p.life >= p.maxLife) {
                            p.reset();
                        } else {
                            p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
                            p.element.style.opacity = 1 - (p.life / p.maxLife);
                        }
                    });
                    requestAnimationFrame(animateParticles);
                }
                animateParticles();
            }
        } catch (e) {
            console.error('Error initializing effects:', e);
        }
    }, 500);
});
