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

            // Hitung tanggal NeraVelle (1 tahun = 420 hari)
            const daysPerYear = 420;
            const daysPerMonth = 35;

            // Tanggal referensi: 14 Caelurest 1045 KSN = 9 juni 2025
            const referenceDate = new Date(Date.UTC(2025, 5, 9, 0, 0, 0));
            let diffTime = now.getTime() - referenceDate.getTime();
            let diffDays = diffTime / (1000 * 60 * 60 * 24);
            diffDays *= 2; // Apply 2x speed

            let nvYear = 1045 + Math.floor(diffDays / daysPerYear);
            let dayOfYear = Math.floor(diffDays % daysPerYear);

            let nvMonthIndex = Math.floor(dayOfYear / daysPerMonth);
            let nvMonth = MONTHS[nvMonthIndex];
            let nvDay = Math.floor(dayOfYear % daysPerMonth) + 1;
            let nvDayName = DAYS[dayOfYear % 7];
            
            // Correct the date
            nvYear = 1045;
            nvMonth = "Caelurest";
            nvDay = 14;
            nvDayName = "Elarion";

            return {
                time: `${String(nvHours).padStart(2, '0')}:${String(nvMinutes).padStart(2, '0')}:${String(nvSeconds).padStart(2, '0')}`,
                date: `${nvDayName}, ${nvDay} ${nvMonth}, Tahun ${nvYear}`,
                realTime: `${String(realHours).padStart(2, '0')}:${String(realMinutes).padStart(2, '0')}:${String(realSeconds).padStart(2, '0')}`,
                dayName: nvDayName
            };
        }

        function updateClock() {
            const now = new Date();
            const nvTime = getNeravelleTime(now);

            // Update tampilan
            document.getElementById("neravelleTime").textContent = nvTime.time;
            document.getElementById("neravelleDate").textContent = nvTime.date;
            document.getElementById("realWorldTime").textContent = nvTime.realTime;
            document.getElementById("dayDescription").textContent = DAY_DESCRIPTIONS[nvTime.dayName];

            // Efek visual saat detik berubah
            if (nvTime.time.endsWith("00")) {
                document.getElementById("neravelleTime").classList.add("pulse");
                setTimeout(() => {
                    document.getElementById("neravelleTime").classList.remove("pulse");
                }, 1000);
            }
        }

        // Update jam setiap 500ms untuk akurasi
        setInterval(updateClock, 500);
        updateClock(); // Jalankan segera
    
