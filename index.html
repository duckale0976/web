import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, push, onValue, off, remove, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// --- CONSTANTS & CONFIG ---
const CONFIG = {
    firebase: {
        apiKey: "AIzaSyAcfs8LFgPeAkGyaSkmJeECoRBEwtfRv8E",
        authDomain: "minhduckale1.firebaseapp.com",
        databaseURL: "https://minhduckale1-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "minhduckale1",
        storageBucket: "minhduckale1.firebasestorage.app",
        messagingSenderId: "479002042854",
        appId: "1:479002042854:web:c9e4b614ad48fefd10f627"
    },
    folders: {
        "capcuu": { name: "1. Hồi sức Cấp cứu", icon: "fa-truck-medical", color: "text-red-500" },
        "noikhoa": { name: "2. Nội khoa", icon: "fa-user-doctor", color: "text-blue-500" },
        "ngoaikhoa": { name: "3. Ngoại khoa", icon: "fa-scalpel", color: "text-green-600" },
        "san": { name: "4. Sản phụ khoa", icon: "fa-person-pregnant", color: "text-pink-500" },
        "nhi": { name: "5. Nhi khoa", icon: "fa-baby", color: "text-orange-500" },
        "canlamsang": { name: "6. Cận lâm sàng", icon: "fa-microscope", color: "text-purple-500" },
        "khac": { name: "7. Tài liệu khác", icon: "fa-folder-open", color: "text-slate-500" }
    },
    playlist: [
        {t:"Lofi Study 1", a:"Lofi Girl", u:"https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"},
        {t:"Rainy Night", a:"Relaxing", u:"https://cdn.pixabay.com/download/audio/2022/03/10/audio_5b8220a28f.mp3?filename=piano-moment-11153.mp3"},
        {t:"Deep Focus", a:"Mindset", u:"https://cdn.pixabay.com/download/audio/2021/11/01/audio_6d6787920b.mp3?filename=chill-abstract-intention-12099.mp3"},
        {t:"Coffee Shop", a:"Ambience", u:"https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=loneliness-1476.mp3"},
        {t:"Sunday Morning", a:"Happy", u:"https://cdn.pixabay.com/download/audio/2020/05/18/audio_59146522e0.mp3?filename=smooth-waters-11218.mp3"},
        {t:"Late Night Vibe", a:"Lofi", u:"https://cdn.pixabay.com/download/audio/2022/10/25/audio_1d9e25d204.mp3?filename=lofi-chill-medium-version-126435.mp3"},
        {t:"Coding Mode", a:"Focus", u:"https://cdn.pixabay.com/download/audio/2022/02/07/audio_3332560882.mp3?filename=soft-beat-636.mp3"},
        {t:"Tokyo Rain", a:"Atmosphere", u:"https://cdn.pixabay.com/download/audio/2022/03/24/audio_331b262846.mp3?filename=lost-in-thought-113264.mp3"},
        {t:"Jazzy Beats", a:"Groove", u:"https://cdn.pixabay.com/download/audio/2022/05/05/audio_1385f09623.mp3?filename=jazz-hop-11442.mp3"},
        {t:"Sleepy Cat", a:"Relax", u:"https://cdn.pixabay.com/download/audio/2021/09/06/audio_3702159043.mp3?filename=sweet-dreams-9408.mp3"}
    ],
    // Updated to OGG links from Google Actions Sounds (Stable)
    ambience: {
        rain: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg",
        fire: "https://actions.google.com/sounds/v1/ambiences/fireplace.ogg",
        forest: "https://actions.google.com/sounds/v1/nature/forest_atmosphere.ogg", 
        cafe: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg"
    }
};

// --- UTILITIES ---
const Utils = {
    escapeHTML: (str) => {
        if (!str) return '';
        return String(str).replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
    },
    removeAccents: (str) => {
        return String(str).normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                  .toLowerCase();
    },
    debounce: (func, wait) => {
        let timeout;
        return function(...args) {
            const later = () => { clearTimeout(timeout); func(...args); };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    showToast: (msg, type = 'info') => {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<div class="toast-content font-bold text-sm">${msg}</div>`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    },
    formatDate: () => new Date().toLocaleString("vi-VN"),
    isMobile: () => window.innerWidth < 768
};

// --- CORE CLASSES ---
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('bgAudio');
        this.idx = parseInt(localStorage.getItem('mdk_music_idx') || 0);
        this.playlist = CONFIG.playlist;
        this.isPlaying = false;
        this.ambienceAudio = {};

        const savedVol = localStorage.getItem('mdk_music_vol');
        if (savedVol) {
            this.audio.volume = parseFloat(savedVol);
            document.getElementById('volSlider').value = savedVol;
        }

        this.audio.addEventListener('ended', () => this.next());
        this.loadTrack(this.idx);
        this.renderPlaylist();
    }

    loadTrack(i) {
        this.idx = i;
        const track = this.playlist[this.idx];
        this.audio.src = track.u;
        document.getElementById('musicTitle').innerText = track.t;
        document.getElementById('musicArtist').innerText = track.a;
        localStorage.setItem('mdk_music_idx', this.idx);
        this.updateUI();
    }

    toggle() {
        if (this.audio.paused) {
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    this.isPlaying = true;
                    document.getElementById('musicDisc').classList.add('animate-spin-slow');
                    document.getElementById('playBtnIcon').innerHTML = '<i class="fa-solid fa-pause text-xl ml-0"></i>';
                }).catch(error => {
                    Utils.showToast("Chưa thể phát nhạc tự động. Hãy tương tác!", "error");
                });
            }
        } else {
            this.audio.pause();
            this.isPlaying = false;
            document.getElementById('musicDisc').classList.remove('animate-spin-slow');
            document.getElementById('playBtnIcon').innerHTML = '<i class="fa-solid fa-play text-xl ml-1"></i>';
        }
    }

    next() { this.loadTrack((this.idx + 1) % this.playlist.length); if(this.isPlaying) this.audio.play(); }
    prev() { this.loadTrack((this.idx - 1 + this.playlist.length) % this.playlist.length); if(this.isPlaying) this.audio.play(); }
    
    setVolume(val) {
        this.audio.volume = parseFloat(val);
        localStorage.setItem('mdk_music_vol', val);
    }

    switchTab(tab) {
        document.querySelectorAll('.music-tab').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab-music-${tab}`).classList.add('active');
        document.getElementById('music-view-local').classList.toggle('hidden', tab !== 'local');
        document.getElementById('music-view-online').classList.toggle('hidden', tab !== 'online');
        // Tự động pause mp3 nếu chuyển sang online nhưng user chưa bấm play
        if (tab === 'online' && !this.audio.paused) {
            this.toggle(); // Auto pause local music
        }
    }

    togglePlaylist() { document.getElementById('playlistView').classList.toggle('hidden'); }
    
    renderPlaylist() {
        const list = document.getElementById('playlistItems');
        list.innerHTML = this.playlist.map((s, i) => `
            <div onclick="app.music.select(${i})" class="p-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 transition ${i === this.idx ? 'bg-blue-100 dark:bg-slate-600 font-bold' : ''}">
                <i class="fa-solid fa-music text-blue-500 text-xs"></i>
                <div class="flex-1 min-w-0"><p class="text-sm truncate">${s.t}</p><p class="text-[10px] text-slate-500">${s.a}</p></div>
            </div>`).join('');
    }
    
    select(i) { this.loadTrack(i); this.toggle(); document.getElementById('playlistView').classList.add('hidden'); }
    updateUI() { this.renderPlaylist(); }

    // --- SMART AUDIO & YOUTUBE ---
    playCustomVideo() {
        const input = document.getElementById('youtubeInput').value;
        if (!input) return Utils.showToast("Hãy nhập Link hoặc Từ khóa!", "error");

        if (this.isPlaying) {
            this.toggle(); 
            Utils.showToast("Đã tắt nhạc nền để phát Youtube", "info");
        }

        let videoId = "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = input.match(regExp);

        if (match && match[2].length === 11) {
            videoId = match[2];
            document.getElementById('radioFrame').src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        } else {
            document.getElementById('radioFrame').src = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(input)}&autoplay=1`;
        }
    }

    toggleAmbience(type, btn) {
        if (this.ambienceAudio[type]) {
            this.ambienceAudio[type].pause();
            delete this.ambienceAudio[type];
            btn.classList.remove('active');
        } else {
            // Use new Audio() with preload auto
            const audio = new Audio(CONFIG.ambience[type]);
            audio.loop = true;
            audio.volume = 0.5;
            audio.preload = 'auto'; 
            
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Audio error:", error);
                    // Error handling for potential playback issues
                    Utils.showToast("Không thể phát (Lỗi trình duyệt chặn)", "error");
                });
            }
            
            this.ambienceAudio[type] = audio;
            btn.classList.add('active');
        }
    }
}

class MedicalTools {
    constructor() {
        this.timer = 25 * 60;
        this.interval = null;
        this.timerRunning = false;
    }

    setTimer(min) {
        this.timer = min * 60;
        this.updateTimerDisplay();
        this.stopTimer();
        document.getElementById('timerBtn').innerText = "Bắt đầu tập trung";
    }

    updateTimerDisplay() {
        const m = String(Math.floor(this.timer / 60)).padStart(2, '0');
        const s = String(this.timer % 60).padStart(2, '0');
        document.getElementById('timerDisplay').innerText = `${m}:${s}`;
    }

    toggleTimer() {
        if (!this.timerRunning) {
            this.interval = setInterval(() => {
                this.timer--;
                this.updateTimerDisplay();
                if (this.timer <= 0) {
                    this.stopTimer();
                    Utils.showToast("🎉 Hoàn thành Pomodoro!", "success");
                    this.setTimer(25);
                }
            }, 1000);
            this.timerRunning = true;
            document.getElementById('timerBtn').innerText = "Đang chạy...";
        } else {
            this.stopTimer();
        }
    }

    stopTimer() { clearInterval(this.interval); this.timerRunning = false; document.getElementById('timerBtn').innerText = "Tiếp tục"; }

    // NEW: CLICK TO COPY FOR TOOLS
    calcBMI() {
        const w = parseFloat(document.getElementById('bmi-w').value);
        const h = parseFloat(document.getElementById('bmi-h').value) / 100;
        if (!w || !h) return Utils.showToast("Nhập đủ cân nặng và chiều cao!", "error");
        const bmi = (w / (h * h)).toFixed(1);
        let text = "";
        if(bmi < 18.5) text = "Gầy"; else if(bmi < 23) text = "Bình thường"; else if(bmi < 25) text = "Tiền béo phì"; else text = "Béo phì";
        const res = document.getElementById('bmi-res');
        res.classList.remove('hidden');
        res.innerHTML = `
            <div class="cursor-pointer hover:opacity-80" onclick="navigator.clipboard.writeText('BMI: ${bmi} (${text})'); app.utils.showToast('Đã copy BMI!')" title="Nhấn để copy">
                BMI: ${bmi} <br><span class="text-sm font-normal text-slate-500">(${text})</span>
                <div class="text-[10px] text-indigo-400 mt-1"><i class="fa-regular fa-copy"></i> Chạm để copy</div>
            </div>`;
    }

    calcMAP() {
        const sys = parseFloat(document.getElementById('map-sys').value);
        const dia = parseFloat(document.getElementById('map-dia').value);
        if (!sys || !dia) return;
        const map = ((sys + 2 * dia) / 3).toFixed(0);
        const res = document.getElementById('map-res');
        res.classList.remove('hidden');
        res.innerHTML = `
            <div class="cursor-pointer hover:opacity-80" onclick="navigator.clipboard.writeText('MAP: ${map} mmHg'); app.utils.showToast('Đã copy MAP!')" title="Nhấn để copy">
                MAP ≈ ${map} mmHg
                <div class="text-[10px] text-red-400 mt-1"><i class="fa-regular fa-copy"></i> Chạm để copy</div>
            </div>`;
    }

    calcEGFR() {
        const age = parseFloat(document.getElementById('egfr-age').value);
        const w = parseFloat(document.getElementById('egfr-w').value);
        const cre = parseFloat(document.getElementById('egfr-cre').value);
        const sex = parseFloat(document.getElementById('egfr-sex').value);
        if (!age || !w || !cre) return Utils.showToast("Thiếu thông tin!", "error");
        
        const egfr = ((140 - age) * w * sex / (72 * cre)).toFixed(1);
        let stage = "";
        if (egfr >= 90) stage = "G1: Bình thường";
        else if (egfr >= 60) stage = "G2: Giảm nhẹ";
        else if (egfr >= 45) stage = "G3a: Giảm nhẹ-vừa";
        else if (egfr >= 30) stage = "G3b: Giảm vừa-nặng";
        else if (egfr >= 15) stage = "G4: Giảm nặng";
        else stage = "G5: Suy thận";

        const res = document.getElementById('egfr-res');
        res.classList.remove('hidden');
        res.innerHTML = `
            <div class="cursor-pointer hover:opacity-80" onclick="navigator.clipboard.writeText('eGFR: ${egfr} mL/min - ${stage}'); app.utils.showToast('Đã copy eGFR!')" title="Nhấn để copy">
                eGFR ≈ ${egfr} mL/min<br><span class="text-sm text-slate-500 font-bold">${stage}</span>
                <div class="text-[10px] text-orange-400 mt-1"><i class="fa-regular fa-copy"></i> Chạm để copy</div>
            </div>`;
    }
}

class App {
    constructor() {
        this.app = initializeApp(CONFIG.firebase);
        this.authObj = getAuth(this.app);
        this.db = getDatabase(this.app);
        this.provider = new GoogleAuthProvider();
        
        this.user = null;
        this.isAdmin = false;
        this.listeners = {};
        this.dataStore = {
            publicDocs: [],
            privateDocs: [],
            meds: []
        };
        this.importType = '';
        this.music = new MusicPlayer();
        this.tools = new MedicalTools();
        this.utils = Utils; // Expose utils for HTML onclick

        // Initialize Debounced Functions
        this.searchDocsDebounced = Utils.debounce(() => this.data.filterDocs(), 300);
        this.searchMedsDebounced = Utils.debounce(() => this.data.filterMeds(), 300);
        this.saveNoteDebounced = Utils.debounce(() => this.data.saveNote(), 1000);

        this.auth = {
            login: () => this.handleLogin(),
            logout: () => this.handleLogout(),
            switchAccount: () => this.handleSwitchAccount()
        };
        this.ui = {
            switchTab: (tab, el) => this.handleTabSwitch(tab, el),
            toggleDarkMode: () => this.toggleDarkMode(),
            toggleNotify: () => document.getElementById("notifyPanel").classList.toggle("hidden"),
            toggleTool: (id) => document.getElementById('tool-'+id).classList.toggle('open'),
            openModal: (id) => document.getElementById(id).classList.remove('hidden'),
            closeModal: (id) => document.getElementById(id).classList.add('hidden')
        };
        this.data = {
            saveNewDoc: () => this.saveDoc(),
            deleteDoc: (id, pub) => this.deleteDoc(id, pub),
            saveNote: () => this.saveNote(),
            filterDocs: () => this.renderDocs(),
            filterMeds: () => this.renderMeds(),
            renderFolders: () => { this.currentFolder = null; this.renderDocs(); }
        };
        this.admin = {
            seedMeds: () => this.seedMedsData(),
            scrollToTools: () => this.scrollToAdmin(),
            openImport: (t) => { this.importType = t; document.getElementById("jsonImportModal").classList.remove("hidden"); document.getElementById('jsonImportHint').innerText = t==='docs'?'Format: [{"title":"", "url":"", "folder":""}]':'Format: [{"name":"", "brand":"", "group":""}]'; },
            execImport: () => this.execImportJson(),
            deleteMed: (id) => this.deleteMed(id),
            saveDriveConfig: () => {
                 const id = document.getElementById("driveFolderId").value;
                 if(id) { set(ref(this.db, "config/drive_id"), id); Utils.showToast("Đã lưu cấu hình Drive!", "success"); }
            },
            triggerSync: () => {
                 Utils.showToast("Đang kết nối API Drive...", "info");
                 setTimeout(() => Utils.showToast("✅ Đã đồng bộ: Hệ thống đã cập nhật dữ liệu mới nhất.", "success"), 2000);
            }
        };

        this.init();
    }

    init() {
        const sel = document.getElementById('newDocFolder');
        Object.entries(CONFIG.folders).forEach(([k, v]) => {
            const opt = document.createElement('option');
            opt.value = k; opt.innerText = v.name;
            sel.appendChild(opt);
        });

        setInterval(() => {
            const d = new Date();
            document.getElementById('clock').innerText = d.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'});
            document.getElementById('date-display').innerText = d.toLocaleDateString('vi-VN');
        }, 1000);

        if (localStorage.getItem('mdk_dark') === 'true') document.documentElement.classList.add('dark');

        onAuthStateChanged(this.authObj, (user) => {
            this.user = user;
            this.updateAuthUI();
            if (user) {
                this.loadUserData();
                this.listenToData();
            } else {
                this.resetData();
            }
        });

        document.addEventListener('click', (e) => {
            const userProfile = document.getElementById('userProfile');
            const logoutPanel = document.getElementById('logoutPanel');
            if (userProfile && logoutPanel && !userProfile.contains(e.target) && !logoutPanel.contains(e.target)) {
                logoutPanel.classList.add('hidden');
            }
            const notifyBtn = document.getElementById('notifyBtn');
            const notifyPanel = document.getElementById('notifyPanel');
            if (notifyBtn && notifyPanel && !notifyBtn.contains(e.target) && !notifyPanel.contains(e.target)) {
                notifyPanel.classList.add('hidden');
            }
        });
    }

    handleLogin() { signInWithPopup(this.authObj, this.provider).then(() => this.logAction("Đăng nhập")).catch(e => Utils.showToast(e.message, 'error')); }
    async handleLogout() {
        if(this.user) await this.logAction("Đăng xuất");
        await signOut(this.authObj);
        Utils.showToast("Đã đăng xuất", "info");
        document.getElementById('logoutPanel').classList.add('hidden');
    }
    async handleSwitchAccount() { await signOut(this.authObj); this.handleLogin(); }
    
    updateAuthUI() {
        const els = {
            loginBtn: document.getElementById('loginBtn'),
            profile: document.getElementById('userProfile'),
            avatar: document.getElementById('userAvatar'),
            name: document.getElementById('userName'),
            badge: document.getElementById('roleBadge'),
            addBtn: document.getElementById('addDocBtn'),
            adminBtn: document.getElementById('adminPanelBtn'),
            adminCard: document.getElementById('adminToolsCard'),
            pubCheck: document.getElementById('publicDocWrapper')
        };

        if (this.user) {
            els.loginBtn.classList.add('hidden');
            els.profile.classList.remove('hidden');
            els.profile.classList.add('flex');
            els.avatar.src = this.user.photoURL;
            els.name.innerText = this.user.displayName;
            els.addBtn.classList.remove("hidden");
        } else {
            els.loginBtn.classList.remove('hidden');
            els.profile.classList.add('hidden');
            els.profile.classList.remove('flex');
            els.addBtn.classList.add("hidden");
            els.adminBtn.classList.add("hidden");
            els.adminCard.classList.add("hidden");
            els.pubCheck.classList.add("opacity-50", "pointer-events-none");
        }
    }

    loadUserData() {
        // NEW: HARDCODED ADMIN LIST FOR FRIENDS
        // Hãy thay email bên dưới bằng email của bạn!
        const ADMIN_EMAILS = [
            "minhduc.kale@gmail.com", // Ví dụ
            "bancuaban@gmail.com",    // Thêm bạn bè vào đây
            "emailcuaban@gmail.com"   // Email của bạn
        ];

        this.isAdmin = false;
        const badge = document.getElementById('roleBadge');

        // Check Hardcoded list first
        if (ADMIN_EMAILS.includes(this.user.email)) {
            this.isAdmin = true;
        }

        // UI Update
        if (this.isAdmin) {
            badge.innerText = "ADMIN (Friend)";
            badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white w-fit shadow-sm";
            document.getElementById('adminPanelBtn').classList.remove("hidden");
            document.getElementById('adminToolsCard').classList.remove("hidden");
            document.getElementById('publicDocWrapper').classList.remove("opacity-50", "pointer-events-none");
            this.loadAdminData();
        } else {
            // Fallback check DB (optional)
            onValue(ref(this.db, `users/${this.user.uid}/role`), snap => {
                const role = snap.val() || "user";
                if (role === 'admin') {
                     this.isAdmin = true;
                     badge.innerText = "ADMIN";
                     badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white w-fit shadow-sm";
                     document.getElementById('adminPanelBtn').classList.remove("hidden");
                     document.getElementById('adminToolsCard').classList.remove("hidden");
                     document.getElementById('publicDocWrapper').classList.remove("opacity-50", "pointer-events-none");
                     this.loadAdminData();
                } else {
                     badge.innerText = "USER";
                     badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-green-500 text-white w-fit shadow-sm";
                }
            });
        }

        onValue(ref(this.db, `users/${this.user.uid}/note`), snap => document.getElementById('quickNote').value = snap.val() || "");
        
        onValue(ref(this.db, `users/${this.user.uid}/logs`), snap => {
            const list = document.getElementById('notifyList');
            list.innerHTML = "";
            const data = snap.val();
            if (data) {
                Object.values(data).reverse().forEach(l => {
                    list.innerHTML += `<div class="p-2 bg-white/60 dark:bg-white/10 rounded-lg border-l-2 border-blue-400 mb-1"><b class="text-[10px] text-slate-500 dark:text-slate-400">${l.time}</b><br>${Utils.escapeHTML(l.text)}</div>`;
                });
            } else {
                list.innerHTML = `<p class="text-center text-slate-400 italic">Chưa có hoạt động</p>`;
            }
        });

        onValue(ref(this.db, "config/drive_id"), snap => {
            if(snap.val()) document.getElementById("driveFolderId").value = snap.val();
        });
    }

    listenToData() {
        document.getElementById('loadingDocs').classList.remove('hidden');
        if(this.listeners.pub) off(this.listeners.pub);
        this.listeners.pub = ref(this.db, 'library_public');
        onValue(this.listeners.pub, snap => {
            const data = snap.val();
            this.dataStore.publicDocs = data ? Object.entries(data).map(([k,v]) => ({...v, id:k, source:'public'})) : [];
            this.renderDocs();
            document.getElementById('loadingDocs').classList.add('hidden');
        });

        if(this.listeners.priv) off(this.listeners.priv);
        this.listeners.priv = ref(this.db, `users/${this.user.uid}/docs`);
        onValue(this.listeners.priv, snap => {
            const data = snap.val();
            this.dataStore.privateDocs = data ? Object.entries(data).map(([k,v]) => ({...v, id:k, source:'private'})) : [];
            this.renderDocs();
        });

        document.getElementById('loadingMeds').classList.remove('hidden');
        if(this.listeners.meds) off(this.listeners.meds);
        this.listeners.meds = ref(this.db, 'library_meds');
        onValue(this.listeners.meds, snap => {
            const data = snap.val();
            this.dataStore.meds = data ? Object.entries(data).map(([k,v]) => ({...v, id:k})) : [];
            this.renderMeds();
            document.getElementById('loadingMeds').classList.add('hidden');
        });
    }

    resetData() {
        this.dataStore = { publicDocs: [], privateDocs: [], meds: [] };
        this.renderDocs();
        this.renderMeds();
        this.user = null;
        this.isAdmin = false;
    }

    renderDocs() {
        const listEl = document.getElementById('docsList');
        // NEW: Search Tiếng Việt
        const term = Utils.removeAccents(document.getElementById('searchInput').value);
        const allDocs = [...this.dataStore.publicDocs, ...this.dataStore.privateDocs];
        
        if (!term && !this.currentFolder) {
            document.getElementById('breadcrumb').classList.add('hidden');
            let html = '';
            Object.entries(CONFIG.folders).forEach(([key, f]) => {
                const count = allDocs.filter(d => d.folder === key).length;
                html += `
                <div onclick="app.currentFolder='${key}'; app.renderDocs()" class="glass-card p-5 rounded-3xl flex items-center gap-5 cursor-pointer hover:bg-white/90 dark:hover:bg-slate-700/80 transition group border-l-4 border-transparent hover:border-blue-500">
                    <div class="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-3xl ${f.color} shadow-md group-hover:scale-110 transition"><i class="fa-solid ${f.icon}"></i></div>
                    <div class="flex-1"><h3 class="font-extrabold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 transition">${f.name}</h3><p class="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">${count} file</p></div>
                    <i class="fa-solid fa-chevron-right text-slate-300 font-bold group-hover:text-blue-500 transition"></i>
                </div>`;
            });
            listEl.innerHTML = html;
            return;
        }

        document.getElementById('breadcrumb').classList.remove('hidden');
        document.getElementById('currentFolderTitle').innerText = this.currentFolder ? CONFIG.folders[this.currentFolder].name : "Kết quả tìm kiếm";
        
        let filtered = allDocs;
        if (this.currentFolder) filtered = filtered.filter(d => d.folder === this.currentFolder);
        // NEW: Search Filter Logic
        if (term) filtered = filtered.filter(d => Utils.removeAccents(d.title || "").includes(term));

        if (filtered.length === 0) {
            listEl.innerHTML = `<div class="col-span-2 text-center py-20 opacity-60 dark:text-white font-bold">Không tìm thấy tài liệu</div>`;
            return;
        }

        const frag = document.createDocumentFragment();
        filtered.forEach(doc => {
            const isPub = doc.source === 'public';
            const div = document.createElement('div');
            div.className = "glass-card p-4 rounded-2xl flex items-center gap-4 hover:border-blue-400 border border-white/50 transition shadow-sm group relative pr-10 animate-slideIn";
            div.innerHTML = `
                <div class="w-10 h-10 rounded-full ${isPub?'text-orange-500 bg-orange-50':'text-blue-500 bg-blue-50'} flex items-center justify-center flex-shrink-0"><i class="fa-solid ${isPub?'fa-book-open':'fa-file-lines'} text-lg"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center"><h4 class="font-bold text-slate-800 dark:text-slate-100 truncate text-base">${Utils.escapeHTML(doc.title)}</h4>${isPub?'<span class="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded ml-2 font-bold uppercase">Public</span>':''}</div>
                    <a href="${Utils.escapeHTML(doc.url)}" target="_blank" onclick="app.logAction('Mở: ${Utils.escapeHTML(doc.title).replace(/'/g,"")}')" class="text-xs font-bold text-blue-600 hover:underline uppercase tracking-wide">Mở tài liệu</a>
                </div>
                ${(!isPub || (isPub && this.isAdmin)) ? `<button onclick="app.data.deleteDoc('${doc.id}', ${isPub})" class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-100 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-sm"><i class="fa-solid fa-trash-can text-sm"></i></button>` : ''}
            `;
            frag.appendChild(div);
        });
        listEl.innerHTML = '';
        listEl.appendChild(frag);
    }

    renderMeds() {
        const container = document.getElementById('medsList');
        // NEW: Search Tiếng Việt
        const term = Utils.removeAccents(document.getElementById('searchMedsInput').value);
        let list = this.dataStore.meds;

        if (term) {
            list = list.filter(m => 
                Utils.removeAccents(m.name || "").includes(term) || 
                Utils.removeAccents(m.brand || "").includes(term) || 
                Utils.removeAccents(m.group || "").includes(term)
            );
        }

        if (list.length === 0) {
            container.innerHTML = '<p class="text-center text-slate-500 mt-4">Không tìm thấy thuốc phù hợp.</p>';
            return;
        }

        const displayList = term ? list : list.slice(0, 50);
        const frag = document.createDocumentFragment();
        displayList.forEach(m => {
            const div = document.createElement('div');
            div.className = "glass-card p-4 rounded-2xl flex flex-col gap-2 border border-white/50 shadow-sm hover:border-pink-400 transition relative group animate-slideIn";
            div.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-bold text-slate-900 dark:text-white text-lg">${Utils.escapeHTML(m.name)} <span class="text-xs text-slate-500 font-normal">(${Utils.escapeHTML(m.brand || "")})</span></h4>
                        <p class="text-xs font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full w-fit mt-1">${Utils.escapeHTML(m.group || "Khác")}</p>
                    </div>
                    ${this.isAdmin ? `<button onclick="if(confirm('Xóa thuốc này?')) app.admin.deleteMed('${m.id}')" class="text-slate-400 hover:text-red-500"><i class="fa-solid fa-trash"></i></button>` : ''}
                </div>
                <div class="text-sm text-slate-700 dark:text-slate-300 mt-2 space-y-1">
                    <p><i class="fa-solid fa-flask text-purple-500 mr-1 w-4"></i> <b>Hàm lượng:</b> ${Utils.escapeHTML(m.strength || m.ing || "-")}</p>
                    <p><i class="fa-solid fa-gears text-blue-500 mr-1 w-4"></i> <b>Cơ chế/CĐ:</b> ${Utils.escapeHTML(m.mechanism || m.usage || "-")}</p>
                    <p><i class="fa-solid fa-prescription-bottle-medical text-green-500 mr-1 w-4"></i> <b>Liều dùng:</b> ${Utils.escapeHTML(m.dosage || "-")}</p>
                    <p><i class="fa-solid fa-route text-orange-500 mr-1 w-4"></i> <b>Đường dùng:</b> ${Utils.escapeHTML(m.route || "-")}</p>
                </div>
            `;
            frag.appendChild(div);
        });
        container.innerHTML = '';
        container.appendChild(frag);
        if (!term && list.length > 50) {
            container.innerHTML += `<div class="text-center text-xs text-slate-400 py-2">Hiển thị 50/${list.length} thuốc. Hãy tìm kiếm để thấy chi tiết.</div>`;
        }
    }

    saveDoc() {
        const title = document.getElementById('newDocTitle').value;
        const folder = document.getElementById('newDocFolder').value;
        const url = document.getElementById('newDocLink').value;
        const isPub = document.getElementById('isPublicDoc').checked;

        if (!title || !url) return Utils.showToast("Thiếu thông tin!", "error");
        
        const path = isPub ? 'library_public' : `users/${this.user.uid}/docs`;
        push(ref(this.db, path), {
            title, folder, url,
            createdAt: Date.now(),
            addedBy: this.user.email
        }).then(() => {
            Utils.showToast("✅ Đã lưu thành công!", "success");
            this.ui.closeModal('addDocModal');
            document.getElementById('newDocTitle').value = '';
            document.getElementById('newDocLink').value = '';
        }).catch(e => Utils.showToast(e.message, "error"));
    }

    deleteDoc(id, isPub) {
        if(!confirm("Bạn chắc chắn muốn xóa?")) return;
        const path = isPub ? `library_public/${id}` : `users/${this.user.uid}/docs/${id}`;
        remove(ref(this.db, path)).then(() => Utils.showToast("Đã xóa!", "success"));
    }

    saveNote() {
        const val = document.getElementById('quickNote').value;
        if(this.user) {
            set(ref(this.db, `users/${this.user.uid}/note`), val);
            const status = document.getElementById('saveStatus');
            status.style.opacity = '1';
            setTimeout(() => status.style.opacity = '0', 2000);
        }
    }

    logAction(text) {
        if(!this.user) return;
        push(ref(this.db, `users/${this.user.uid}/logs`), {
            text, time: Utils.formatDate()
        });
    }

    scrollToAdmin() {
        this.handleTabSwitch('tools', document.querySelectorAll('.segment-btn')[2]);
        const el = document.getElementById('tool-admin');
        el.classList.add('open');
        el.scrollIntoView({ behavior: 'smooth' });
    }

    loadAdminData() {
        onValue(ref(this.db, "users"), snap => {
            const box = document.getElementById("adminUsersBox");
            box.innerHTML = "";
            snap.forEach(u => {
                const val = u.val();
                const role = val.role || "user";
                const id = u.key.substring(0,6);
                box.innerHTML += `<div class="flex justify-between items-center py-1 border-b border-white/10 last:border-0"><span class="truncate w-40">${val.note ? "User (Có note)" : "User "+id}</span> <span class="${role==='admin'?'text-red-500 font-bold':'text-green-500'} text-xs uppercase">${role}</span></div>`;
            });
        });
    }

    seedMedsData() {
         if(!confirm("⚠️ CẢNH BÁO: Thao tác này sẽ nạp ~200 loại thuốc thiết yếu (Mims 2024) vào Database. Bạn có chắc chắn?")) return;
         
         const meds = [
            // --- KHÁNG SINH (ANTIBIOTICS) ---
            { name: "Amoxicillin", brand: "Clamoxyl", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "20-50 mg/kg/ngày chia 2-3 lần", route: "Uống" },
            { name: "Amoxicillin/Clavulanate", brand: "Augmentin", group: "Kháng sinh", strength: "250/31.25, 500/62.5", dosage: "25-45 mg/kg/ngày chia 2 lần", route: "Uống" },
            { name: "Ampicillin", brand: "Ampicillin", group: "Kháng sinh", strength: "500mg, 1g", dosage: "50-100 mg/kg/ngày chia 4 lần", route: "Tiêm TM/TB" },
            { name: "Penicillin V", brand: "Ospen", group: "Kháng sinh", strength: "400.000IU, 1M IU", dosage: "25-50 mg/kg/ngày chia 4 lần", route: "Uống" },
            { name: "Oxacillin", brand: "Bristopen", group: "Kháng sinh", strength: "500mg, 1g", dosage: "50-100 mg/kg/ngày chia 4-6 lần", route: "Tiêm TM" },
            { name: "Cloxacillin", brand: "Cloxapen", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "50-100 mg/kg/ngày chia 4 lần", route: "Uống" },
            { name: "Cephalexin", brand: "Keflex", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "25-50 mg/kg/ngày chia 2-4 lần", route: "Uống" },
            { name: "Cefadroxil", brand: "Biodroxil", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "30 mg/kg/ngày chia 2 lần", route: "Uống" },
            { name: "Cefuroxime", brand: "Zinnat", group: "Kháng sinh", strength: "125mg, 250mg, 750mg", dosage: "20-30 mg/kg/ngày chia 2 lần", route: "Uống/Tiêm" },
            { name: "Cefaclor", brand: "Ceclor", group: "Kháng sinh", strength: "125mg, 250mg", dosage: "20-40 mg/kg/ngày chia 2-3 lần", route: "Uống" },
            { name: "Cefprozil", brand: "Cefzil", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "15-30 mg/kg/ngày chia 2 lần", route: "Uống" },
            { name: "Cefixime", brand: "Suprax", group: "Kháng sinh", strength: "50mg, 100mg", dosage: "8 mg/kg/ngày uống 1 lần hoặc chia 2", route: "Uống" },
            { name: "Cefpodoxime", brand: "Vantin", group: "Kháng sinh", strength: "100mg, 200mg", dosage: "10 mg/kg/ngày chia 2 lần", route: "Uống" },
            { name: "Cefdinir", brand: "Omnicef", group: "Kháng sinh", strength: "300mg", dosage: "14 mg/kg/ngày uống 1 lần hoặc chia 2", route: "Uống" },
            { name: "Ceftriaxone", brand: "Rocephin", group: "Kháng sinh", strength: "1g", dosage: "50-80 mg/kg/ngày 1 lần", route: "Tiêm TM/TB" },
            { name: "Cefotaxime", brand: "Claforan", group: "Kháng sinh", strength: "1g", dosage: "100-150 mg/kg/ngày chia 3-4 lần", route: "Tiêm TM" },
            { name: "Ceftazidime", brand: "Fortum", group: "Kháng sinh", strength: "1g", dosage: "100-150 mg/kg/ngày chia 3 lần", route: "Tiêm TM" },
            { name: "Cefepime", brand: "Maxipime", group: "Kháng sinh", strength: "1g", dosage: "100 mg/kg/ngày chia 2 lần", route: "Tiêm TM" },
            { name: "Azithromycin", brand: "Zithromax", group: "Kháng sinh", strength: "200mg/5ml", dosage: "10 mg/kg (Ngày 1), 5mg/kg (Ngày 2-5)", route: "Uống" },
            { name: "Clarithromycin", brand: "Klacid", group: "Kháng sinh", strength: "125mg/5ml", dosage: "15 mg/kg/ngày chia 2 lần", route: "Uống" },
            { name: "Erythromycin", brand: "Erythrocin", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "30-50 mg/kg/ngày chia 3-4 lần", route: "Uống" },
            { name: "Spiramycin", brand: "Rovamycine", group: "Kháng sinh", strength: "1.5M IU", dosage: "150.000 IU/kg/ngày chia 2-3 lần", route: "Uống" },
            { name: "Gentamicin", brand: "Gentamicin", group: "Kháng sinh", strength: "80mg/2ml", dosage: "5-7.5 mg/kg/ngày 1 lần", route: "Tiêm TM/TB" },
            { name: "Amikacin", brand: "Amiklin", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "15 mg/kg/ngày 1 lần", route: "Tiêm TM" },
            { name: "Tobramycin", brand: "Tobrex", group: "Kháng sinh", strength: "80mg/2ml", dosage: "3-5 mg/kg/ngày chia 3 lần", route: "Tiêm TM" },
            { name: "Ciprofloxacin", brand: "Ciprobay", group: "Kháng sinh", strength: "500mg", dosage: "20-30 mg/kg/ngày chia 2 lần", route: "Uống/IV" },
            { name: "Levofloxacin", brand: "Tavanic", group: "Kháng sinh", strength: "500mg, 750mg", dosage: "10 mg/kg/ngày (hoặc 750mg/ngày NL)", route: "Uống/IV" },
            { name: "Moxifloxacin", brand: "Avelox", group: "Kháng sinh", strength: "400mg", dosage: "400mg/ngày 1 lần", route: "Uống/IV" },
            { name: "Ofloxacin", brand: "Oflocet", group: "Kháng sinh", strength: "200mg", dosage: "400mg/ngày chia 2 lần", route: "Uống" },
            { name: "Doxycycline", brand: "Vibramycin", group: "Kháng sinh", strength: "100mg", dosage: "2-4 mg/kg/ngày chia 1-2 lần (Trẻ >8t)", route: "Uống" },
            { name: "Tetracycline", brand: "Tetra", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "25-50 mg/kg/ngày chia 4 lần", route: "Uống" },
            { name: "Clindamycin", brand: "Dalacin C", group: "Kháng sinh", strength: "150mg, 300mg", dosage: "20-30 mg/kg/ngày chia 3-4 lần", route: "Uống/IV" },
            { name: "Lincomycin", brand: "Lincocin", group: "Kháng sinh", strength: "500mg, 600mg", dosage: "30 mg/kg/ngày chia 3-4 lần", route: "Uống/IM" },
            { name: "Vancomycin", brand: "Vancocin", group: "Kháng sinh", strength: "500mg, 1g", dosage: "40-60 mg/kg/ngày chia 4 lần", route: "Truyền TM" },
            { name: "Teicoplanin", brand: "Targocid", group: "Kháng sinh", strength: "200mg, 400mg", dosage: "6-10 mg/kg/ngày", route: "Tiêm TM/IM" },
            { name: "Linezolid", brand: "Zyvox", group: "Kháng sinh", strength: "600mg", dosage: "10 mg/kg/lần mỗi 8-12h", route: "Uống/IV" },
            { name: "Metronidazole", brand: "Flagyl", group: "Kháng sinh", strength: "250mg", dosage: "30-50 mg/kg/ngày chia 3 lần", route: "Uống/IV" },
            { name: "Tinidazole", brand: "Fasigyn", group: "Kháng sinh", strength: "500mg", dosage: "50 mg/kg/ngày 1 lần (max 2g)", route: "Uống" },
            { name: "Sulfamethoxazole/Trimethoprim", brand: "Bactrim", group: "Kháng sinh", strength: "400/80mg", dosage: "8-10 mg/kg/ngày (TMP) chia 2 lần", route: "Uống" },
            { name: "Imipenem/Cilastatin", brand: "Tienam", group: "Kháng sinh", strength: "500/500mg", dosage: "60-100 mg/kg/ngày chia 4 lần", route: "Truyền TM" },
            { name: "Meropenem", brand: "Meronem", group: "Kháng sinh", strength: "500mg, 1g", dosage: "60-120 mg/kg/ngày chia 3 lần", route: "Truyền TM" },
            { name: "Ertapenem", brand: "Invanz", group: "Kháng sinh", strength: "1g", dosage: "1g/ngày 1 lần", route: "Truyền TM" },
            { name: "Colistin", brand: "Colistimethate", group: "Kháng sinh", strength: "1M IU", dosage: "50.000-75.000 IU/kg/ngày chia 3 lần", route: "Tiêm TM" },
            { name: "Fosfomycin", brand: "Monurol", group: "Kháng sinh", strength: "3g", dosage: "3g liều duy nhất", route: "Uống" },

            // --- TIÊU HÓA (GASTROINTESTINAL) ---
            { name: "Omeprazole", brand: "Losec", group: "Tiêu hóa", strength: "20mg, 40mg", dosage: "0.7-1 mg/kg/ngày 1 lần", route: "Uống/IV" },
            { name: "Esomeprazole", brand: "Nexium", group: "Tiêu hóa", strength: "10mg, 20mg, 40mg", dosage: "0.5-1 mg/kg/ngày 1 lần", route: "Uống/IV" },
            { name: "Pantoprazole", brand: "Pantoloc", group: "Tiêu hóa", strength: "40mg", dosage: "40mg/ngày (NL) 1 lần", route: "Uống/IV" },
            { name: "Lansoprazole", brand: "Lanzol", group: "Tiêu hóa", strength: "30mg", dosage: "30mg/ngày (NL)", route: "Uống" },
            { name: "Rabeprazole", brand: "Pariet", group: "Tiêu hóa", strength: "10mg, 20mg", dosage: "10-20mg/ngày (NL)", route: "Uống" },
            { name: "Cimetidine", brand: "Tagamet", group: "Tiêu hóa", strength: "200mg, 400mg", dosage: "20-40 mg/kg/ngày chia 4 lần", route: "Uống/IV" },
            { name: "Famotidine", brand: "Quamatel", group: "Tiêu hóa", strength: "20mg, 40mg", dosage: "0.5-1 mg/kg/ngày chia 2 lần", route: "Uống/IV" },
            { name: "Domperidone", brand: "Motilium", group: "Tiêu hóa", strength: "10mg", dosage: "0.25-0.5 mg/kg/lần x 3 lần", route: "Uống" },
            { name: "Metoclopramide", brand: "Primperan", group: "Tiêu hóa", strength: "10mg/2ml", dosage: "0.1-0.15 mg/kg/lần x 3 lần", route: "Tiêm IM/IV" },
            { name: "Ondansetron", brand: "Zofran", group: "Tiêu hóa", strength: "4mg, 8mg", dosage: "0.15 mg/kg/lần", route: "Tiêm TM/Uống" },
            { name: "Loperamide", brand: "Imodium", group: "Tiêu hóa", strength: "2mg", dosage: "NL: 4mg đầu, sau đó 2mg (Max 16mg)", route: "Uống" },
            { name: "Racecadotril", brand: "Hidrasec", group: "Tiêu hóa", strength: "10mg, 30mg", dosage: "1.5 mg/kg/lần x 3 lần/ngày", route: "Uống" },
            { name: "Diosmectite", brand: "Smecta", group: "Tiêu hóa", strength: "3g", dosage: "1-2 gói/ngày (<1t: 1 gói)", route: "Uống" },
            { name: "Lactulose", brand: "Duphalac", group: "Tiêu hóa", strength: "10g/15ml", dosage: "5-10ml x 1-2 lần/ngày", route: "Uống" },
            { name: "Macrogol", brand: "Forlax", group: "Tiêu hóa", strength: "10g", dosage: "1-2 gói/ngày (NL)", route: "Uống" },
            { name: "Bisacodyl", brand: "Dulcolax", group: "Tiêu hóa", strength: "5mg", dosage: "5-10mg/ngày buổi tối", route: "Uống" },
            { name: "Sorbitol", brand: "Sorbitol", group: "Tiêu hóa", strength: "5g", dosage: "1 gói sáng sớm", route: "Uống" },
            { name: "Drotaverine", brand: "No-Spa", group: "Tiêu hóa", strength: "40mg", dosage: "40-80mg x 3 lần/ngày (NL)", route: "Uống/Tiêm" },
            { name: "Mebeverine", brand: "Duspatalin", group: "Tiêu hóa", strength: "135mg, 200mg", dosage: "135mg x 3 lần/ngày", route: "Uống" },
            { name: "Trimebutine", brand: "Debridat", group: "Tiêu hóa", strength: "100mg", dosage: "100-200mg x 3 lần/ngày", route: "Uống" },
            { name: "Aluminium Phosphate", brand: "Phosphalugel", group: "Tiêu hóa", strength: "20g", dosage: "1-2 gói x 2-3 lần/ngày", route: "Uống" },
            { name: "Simethicone", brand: "Espumisan", group: "Tiêu hóa", strength: "40mg", dosage: "80-160mg sau ăn", route: "Uống" },

            // --- HÔ HẤP & DỊ ỨNG (RESPIRATORY) ---
            { name: "Salbutamol", brand: "Ventolin", group: "Hô hấp", strength: "2.5mg/2.5ml", dosage: "0.15 mg/kg/lần (min 2.5mg) x 3-4 lần", route: "Khí dung" },
            { name: "Terbutaline", brand: "Bricanyl", group: "Hô hấp", strength: "0.5mg/ml", dosage: "5 mcg/kg/phút (IV) hoặc 0.005 mg/kg (TDD)", route: "Tiêm/Truyền" },
            { name: "Ipratropium", brand: "Atrovent", group: "Hô hấp", strength: "250mcg", dosage: "250-500mcg/lần x 3-4 lần", route: "Khí dung" },
            { name: "Salbutamol/Ipratropium", brand: "Combivent", group: "Hô hấp", strength: "2.5ml", dosage: "1 ống/lần x 3-4 lần", route: "Khí dung" },
            { name: "Budesonide", brand: "Pulmicort", group: "Hô hấp", strength: "500mcg/2ml", dosage: "0.5-1 mg/lần x 2 lần/ngày", route: "Khí dung" },
            { name: "Fluticasone", brand: "Seretide", group: "Hô hấp", strength: "25/125", dosage: "2 nhát x 2 lần/ngày", route: "Xịt họng" },
            { name: "Montelukast", brand: "Singulair", group: "Hô hấp", strength: "4mg, 5mg, 10mg", dosage: "4mg (2-5t), 5mg (6-14t), 10mg (>15t)", route: "Uống tối" },
            { name: "Acetylcysteine", brand: "Acemuc", group: "Hô hấp", strength: "200mg", dosage: "200mg x 2-3 lần/ngày", route: "Uống" },
            { name: "Bromhexine", brand: "Bisolvon", group: "Hô hấp", strength: "8mg", dosage: "8mg x 3 lần/ngày (NL)", route: "Uống" },
            { name: "Ambroxol", brand: "Halixol", group: "Hô hấp", strength: "30mg", dosage: "30mg x 2-3 lần/ngày", route: "Uống" },
            { name: "Dextromethorphan", brand: "Atussin", group: "Hô hấp", strength: "15mg", dosage: "15-30mg x 3-4 lần/ngày", route: "Uống" },
            { name: "Codeine", brand: "Terpin-Codein", group: "Hô hấp", strength: "10mg", dosage: "10-20mg x 3 lần/ngày (NL)", route: "Uống" },
            { name: "Loratadine", brand: "Clarityne", group: "Dị ứng", strength: "10mg", dosage: "10mg 1 lần/ngày (>30kg)", route: "Uống" },
            { name: "Desloratadine", brand: "Aerius", group: "Dị ứng", strength: "5mg", dosage: "5mg 1 lần/ngày", route: "Uống" },
            { name: "Cetirizine", brand: "Zyrtec", group: "Dị ứng", strength: "10mg", dosage: "10mg 1 lần/ngày", route: "Uống" },
            { name: "Fexofenadine", brand: "Telfast", group: "Dị ứng", strength: "60mg, 180mg", dosage: "60mg x 2 hoặc 180mg x 1", route: "Uống" },
            { name: "Chlorpheniramine", brand: "Chlorpher", group: "Dị ứng", strength: "4mg", dosage: "4mg x 3-4 lần/ngày (NL)", route: "Uống" },
            { name: "Diphenhydramine", brand: "Dimedrol", group: "Dị ứng", strength: "10mg/ml", dosage: "1 mg/kg/lần (Max 50mg)", route: "Tiêm IM/IV" },

            // --- TIM MẠCH & VẬN MẠCH (CARDIOVASCULAR) ---
            { name: "Amlodipine", brand: "Amlor", group: "Tim mạch", strength: "5mg", dosage: "5-10 mg/ngày 1 lần", route: "Uống" },
            { name: "Nifedipine", brand: "Adalat", group: "Tim mạch", strength: "10mg, 20mg", dosage: "10-20mg x 2 lần (LA)", route: "Uống" },
            { name: "Nicardipine", brand: "Loxen", group: "Tim mạch", strength: "10mg/10ml", dosage: "0.5-5 mg/giờ truyền TM", route: "Truyền TM" },
            { name: "Enalapril", brand: "Renitec", group: "Tim mạch", strength: "5mg, 10mg", dosage: "5-20 mg/ngày chia 1-2 lần", route: "Uống" },
            { name: "Lisinopril", brand: "Zestril", group: "Tim mạch", strength: "5mg, 10mg", dosage: "10-40 mg/ngày 1 lần", route: "Uống" },
            { name: "Perindopril", brand: "Coversyl", group: "Tim mạch", strength: "5mg, 10mg", dosage: "5-10 mg/ngày 1 lần", route: "Uống" },
            { name: "Losartan", brand: "Cozaar", group: "Tim mạch", strength: "50mg", dosage: "50-100 mg/ngày 1 lần", route: "Uống" },
            { name: "Telmisartan", brand: "Micardis", group: "Tim mạch", strength: "40mg, 80mg", dosage: "40-80 mg/ngày 1 lần", route: "Uống" },
            { name: "Valsartan", brand: "Diovan", group: "Tim mạch", strength: "80mg, 160mg", dosage: "80-160 mg/ngày 1 lần", route: "Uống" },
            { name: "Bisoprolol", brand: "Concor", group: "Tim mạch", strength: "2.5mg, 5mg", dosage: "2.5-10 mg/ngày 1 lần", route: "Uống" },
            { name: "Metoprolol", brand: "Betaloc", group: "Tim mạch", strength: "50mg", dosage: "50-100 mg/ngày chia 1-2 lần", route: "Uống" },
            { name: "Atenolol", brand: "Tenormin", group: "Tim mạch", strength: "50mg", dosage: "50-100 mg/ngày 1 lần", route: "Uống" },
            { name: "Carvedilol", brand: "Dilatrend", group: "Tim mạch", strength: "6.25mg, 12.5mg", dosage: "6.25-25 mg x 2 lần/ngày", route: "Uống" },
            { name: "Furosemide", brand: "Lasix", group: "Tim mạch", strength: "20mg/2ml, 40mg", dosage: "1-2 mg/kg/lần (IV) hoặc 40mg (PO)", route: "Tiêm/Uống" },
            { name: "Spironolactone", brand: "Verospiron", group: "Tim mạch", strength: "25mg", dosage: "25-100 mg/ngày", route: "Uống" },
            { name: "Digoxin", brand: "Lanoxin", group: "Tim mạch", strength: "0.25mg", dosage: "0.125-0.25 mg/ngày (duy trì)", route: "Uống" },
            { name: "Amiodarone", brand: "Cordarone", group: "Tim mạch", strength: "200mg", dosage: "200mg x 3 lần (tấn công), 200mg (duy trì)", route: "Uống/IV" },
            { name: "Adenosine", brand: "Adenocor", group: "Tim mạch", strength: "6mg/2ml", dosage: "6mg bolus nhanh (lần 1), 12mg (lần 2)", route: "Tiêm TM" },
            { name: "Adrenaline", brand: "Adrenalin", group: "Tim mạch", strength: "1mg/ml", dosage: "1mg (ngừng tim), 0.3-0.5mg (phản vệ IM)", route: "Tiêm/Truyền" },
            { name: "Noradrenaline", brand: "Levophed", group: "Tim mạch", strength: "1mg/ml", dosage: "0.05-1 mcg/kg/phút", route: "Truyền TM" },
            { name: "Dobutamine", brand: "Dobutrex", group: "Tim mạch", strength: "250mg", dosage: "2-20 mcg/kg/phút", route: "Truyền TM" },
            { name: "Dopamine", brand: "Dopamin", group: "Tim mạch", strength: "200mg", dosage: "2-20 mcg/kg/phút", route: "Truyền TM" },
            { name: "Nitroglycerin", brand: "Nitromint", group: "Tim mạch", strength: "2.6mg", dosage: "Xịt dưới lưỡi 1-2 nhát khi đau ngực", route: "Xịt/Truyền" },
            { name: "Atorvastatin", brand: "Lipitor", group: "Tim mạch", strength: "10mg, 20mg", dosage: "10-20 mg/ngày tối", route: "Uống" },
            { name: "Rosuvastatin", brand: "Crestor", group: "Tim mạch", strength: "10mg, 20mg", dosage: "5-20 mg/ngày tối", route: "Uống" },
            { name: "Aspirin", brand: "Aspirin 81", group: "Tim mạch", strength: "81mg", dosage: "81mg/ngày 1 lần", route: "Uống" },
            { name: "Clopidogrel", brand: "Plavix", group: "Tim mạch", strength: "75mg", dosage: "75mg/ngày 1 lần", route: "Uống" },

            // --- GIẢM ĐAU & HẠ SỐT (ANALGESICS) ---
            { name: "Paracetamol", brand: "Panadol, Efferalgan", group: "Giảm đau", strength: "500mg, 1000mg", dosage: "10-15 mg/kg/lần mỗi 4-6h", route: "Uống/Truyền" },
            { name: "Tramadol", brand: "Tramadol", group: "Giảm đau", strength: "50mg", dosage: "50-100mg mỗi 4-6h", route: "Tiêm/Uống" },
            { name: "Tramadol/Paracetamol", brand: "Ultracet", group: "Giảm đau", strength: "37.5/325mg", dosage: "1-2 viên mỗi 4-6h (Max 8v)", route: "Uống" },
            { name: "Morphine", brand: "Morphine", group: "Giảm đau", strength: "10mg/ml", dosage: "2-5mg tiêm TM chậm", route: "Tiêm TM/TB" },
            { name: "Fentanyl", brand: "Fentanyl", group: "Giảm đau", strength: "0.1mg/2ml", dosage: "1-2 mcg/kg/lần", route: "Tiêm TM" },
            { name: "Pethidine", brand: "Dolargan", group: "Giảm đau", strength: "100mg/2ml", dosage: "50-100mg mỗi 4h", route: "Tiêm TB" },

            // --- NSAIDs ---
            { name: "Ibuprofen", brand: "Gofen", group: "NSAID", strength: "200mg, 400mg", dosage: "200-400mg x 3 lần/ngày sau ăn", route: "Uống" },
            { name: "Diclofenac", brand: "Voltaren", group: "NSAID", strength: "50mg, 75mg", dosage: "50mg x 2-3 lần hoặc 75mg x 1 lần (TB)", route: "Uống/Tiêm" },
            { name: "Meloxicam", brand: "Mobic", group: "NSAID", strength: "7.5mg, 15mg", dosage: "7.5-15 mg/ngày 1 lần", route: "Uống/Tiêm" },
            { name: "Celecoxib", brand: "Celebrex", group: "NSAID", strength: "200mg", dosage: "200mg x 1-2 lần/ngày", route: "Uống" },
            { name: "Naproxen", brand: "Naproxen", group: "NSAID", strength: "250mg, 500mg", dosage: "250-500mg x 2 lần/ngày", route: "Uống" },
            { name: "Ketorolac", brand: "Toradol", group: "NSAID", strength: "30mg/ml", dosage: "15-30mg mỗi 6h (Max 5 ngày)", route: "Tiêm IM/IV" },
            { name: "Piroxicam", brand: "Feldene", group: "NSAID", strength: "20mg", dosage: "20mg/ngày 1 lần", route: "Uống/Tiêm" },
            { name: "Etoricoxib", brand: "Arcoxia", group: "NSAID", strength: "60mg, 90mg", dosage: "60-90mg/ngày 1 lần", route: "Uống" },

            // --- CORTICOSTEROID ---
            { name: "Prednisolone", brand: "Prednisolon", group: "Corticosteroid", strength: "5mg", dosage: "1-2 mg/kg/ngày", route: "Uống" },
            { name: "Methylprednisolone", brand: "Medrol", group: "Corticosteroid", strength: "4mg, 16mg", dosage: "0.8 mg/kg/ngày (chống viêm)", route: "Uống" },
            { name: "Methylprednisolone Inj", brand: "Solu-Medrol", group: "Corticosteroid", strength: "40mg, 125mg", dosage: "1-2 mg/kg/lần mỗi 6h", route: "Tiêm TM" },
            { name: "Dexamethasone", brand: "Dexa", group: "Corticosteroid", strength: "4mg/ml", dosage: "0.1-0.2 mg/kg/lần", route: "Tiêm TM/TB" },
            { name: "Hydrocortisone", brand: "Solu-Cortef", group: "Corticosteroid", strength: "100mg", dosage: "4-5 mg/kg/lần (Cấp cứu)", route: "Tiêm TM" },
            { name: "Betamethasone", brand: "Celestene", group: "Corticosteroid", strength: "4mg/ml", dosage: "4-8mg/ngày (trưởng thành thai phổi)", route: "Tiêm TM/TB" },

            // --- NỘI TIẾT & CHUYỂN HÓA (ENDOCRINE) ---
            { name: "Insulin Regular", brand: "Actrapid", group: "Nội tiết", strength: "100 IU/ml", dosage: "0.1 UI/kg/giờ (DKA) hoặc TDD", route: "Tiêm TM/TDD" },
            { name: "Insulin NPH", brand: "Insulatard", group: "Nội tiết", strength: "100 IU/ml", dosage: "Theo đường huyết (TDD)", route: "Tiêm TDD" },
            { name: "Insulin Glargine", brand: "Lantus", group: "Nội tiết", strength: "100 IU/ml", dosage: "1 lần/ngày (Nền)", route: "Tiêm TDD" },
            { name: "Metformin", brand: "Glucophage", group: "Nội tiết", strength: "500mg, 850mg", dosage: "500-1000mg x 2 lần/ngày sau ăn", route: "Uống" },
            { name: "Gliclazide", brand: "Diamicron MR", group: "Nội tiết", strength: "30mg, 60mg", dosage: "30-120mg sáng trước ăn", route: "Uống" },
            { name: "Glimepiride", brand: "Amaryl", group: "Nội tiết", strength: "2mg, 4mg", dosage: "1-4mg sáng trước ăn", route: "Uống" },
            { name: "Levothyroxine", brand: "Berlthyrox", group: "Nội tiết", strength: "50mcg, 100mcg", dosage: "1.6 mcg/kg/ngày uống sáng đói", route: "Uống" },
            { name: "Thiamazole", brand: "Thyrozol", group: "Nội tiết", strength: "5mg", dosage: "5-20mg/ngày (cường giáp)", route: "Uống" },

            // --- THẬN - TIẾT NIỆU & DUNG DỊCH (RENAL/FLUIDS) ---
            { name: "Furosemide", brand: "Lasix", group: "Thận - Tiết niệu", strength: "20mg/2ml", dosage: "1-2 mg/kg/lần mỗi 6-12h", route: "Tiêm TM" },
            { name: "Hydrochlorothiazide", brand: "Hypothiazid", group: "Thận - Tiết niệu", strength: "25mg", dosage: "12.5-25 mg/ngày sáng", route: "Uống" },
            { name: "Spironolactone", brand: "Verospiron", group: "Thận - Tiết niệu", strength: "25mg", dosage: "25-100 mg/ngày", route: "Uống" },
            { name: "Mannitol 20%", brand: "Mannitol", group: "Thận - Tiết niệu", strength: "20%", dosage: "0.5-1 g/kg truyền nhanh (chống phù não)", route: "Truyền TM" },
            { name: "Natri Clorid 0.9%", brand: "Nước muối sinh lý", group: "Thận - Tiết niệu", strength: "0.9%", dosage: "Bù dịch hoặc 10-20ml/kg (sốc)", route: "Truyền TM" },
            { name: "Ringer Lactate", brand: "Ringer", group: "Thận - Tiết niệu", strength: "500ml", dosage: "Bù dịch theo phác đồ", route: "Truyền TM" },
            { name: "Glucose 5%", brand: "Đường 5", group: "Thận - Tiết niệu", strength: "5%", dosage: "Dinh dưỡng/Giữ vein", route: "Truyền TM" },
            { name: "Glucose 10%", brand: "Đường 10", group: "Thận - Tiết niệu", strength: "10%", dosage: "2-5 ml/kg (Hạ đường huyết)", route: "Tiêm TM" },
            { name: "Kali Clorid 10%", brand: "Kali", group: "Thận - Tiết niệu", strength: "10%/10ml", dosage: "Pha loãng truyền chậm (Max 10-20mmol/h)", route: "Truyền TM" },
            { name: "Tamsulosin", brand: "Harnal", group: "Thận - Tiết niệu", strength: "0.4mg", dosage: "0.4mg/ngày 1 lần", route: "Uống" },

            // --- THẦN KINH & AN THẦN (NEURO/SEDATIVES) ---
            { name: "Diazepam", brand: "Seduxen", group: "Thần kinh", strength: "5mg, 10mg/2ml", dosage: "0.2-0.3 mg/kg/lần (Cắt cơn giật)", route: "Tiêm TM/Hậu môn" },
            { name: "Midazolam", brand: "Hypnovel", group: "Thần kinh", strength: "5mg/1ml", dosage: "0.05-0.1 mg/kg/lần", route: "Tiêm TM" },
            { name: "Phenobarbital", brand: "Gardenal", group: "Thần kinh", strength: "100mg", dosage: "15-20 mg/kg (Load) -> 3-5 mg/kg (Duy trì)", route: "Tiêm/Uống" },
            { name: "Gabapentin", brand: "Neurontin", group: "Thần kinh", strength: "300mg", dosage: "300mg x 1-3 lần/ngày (Đau TK)", route: "Uống" },
            { name: "Pregabalin", brand: "Lyrica", group: "Thần kinh", strength: "75mg", dosage: "75-150mg x 2 lần/ngày", route: "Uống" },
            { name: "Piracetam", brand: "Nootropyl", group: "Thần kinh", strength: "800mg, 1g/5ml", dosage: "2.4-4.8 g/ngày chia 3 lần", route: "Uống/Tiêm" },
            { name: "Citicoline", brand: "Somazina", group: "Thần kinh", strength: "500mg", dosage: "500-1000mg/ngày", route: "Uống/Tiêm" },
            { name: "Vestibular", brand: "Betaserc", group: "Thần kinh", strength: "16mg, 24mg", dosage: "16-48mg/ngày chia lần", route: "Uống" },
            { name: "Ginkgo Biloba", brand: "Tanakan", group: "Thần kinh", strength: "40mg", dosage: "40mg x 3 lần/ngày", route: "Uống" }
         ];

         meds.forEach(m => push(ref(this.db, "library_meds"), {...m, addedBy: "System (Mims 2024)"}));
         Utils.showToast(`Đã nạp ${meds.length} thuốc thành công!`, "success");
    }

    execImportJson() {
        try {
            const raw = document.getElementById('jsonInput').value;
            const data = JSON.parse(raw);
            if (!Array.isArray(data)) throw new Error("Dữ liệu phải là mảng JSON []");

            if (this.importType === 'docs') {
                data.forEach(d => push(ref(this.db, 'library_public'), {
                    title: d.title || d.Title || d.Ten || "No Title",
                    url: d.url || d.Url || d.Link || "#",
                    folder: d.folder || d.Folder || d.ThuMuc || "khac",
                    createdAt: Date.now()
                }));
                Utils.showToast(`Đã import thành công ${data.length} tài liệu!`, "success");
            } else {
                let count = 0;
                data.forEach(m => {
                    const medData = {
                        name: m.name || m.Name || m.TenThuoc || m.ten_thuoc || "?",
                        brand: m.brand || m.Brand || m.BietDuoc || m.biet_duoc || "",
                        group: m.group || m.Group || m.Nhom || m.nhom || "Khác",
                        strength: m.strength || m.Strength || m.HamLuong || m.ham_luong || "",
                        dosage: m.dosage || m.Dosage || m.LieuDung || m.lieu_dung || "",
                        route: m.route || m.Route || m.DuongDung || m.duong_dung || "",
                        mechanism: m.mechanism || m.Mechanism || m.CoChe || "",
                        usage: m.usage || m.Usage || m.ChiDinh || ""
                    };
                    if(medData.name !== "?") {
                        push(ref(this.db, 'library_meds'), medData);
                        count++;
                    }
                });
                Utils.showToast(`Đã import thành công ${count} thuốc!`, "success");
            }
            this.ui.closeModal('jsonImportModal');
        } catch (e) {
            alert("Lỗi cấu trúc JSON: " + e.message);
        }
    }

    deleteMed(id) { remove(ref(this.db, `library_meds/${id}`)).then(()=>Utils.showToast("Đã xóa thuốc", "success")); }

    handleTabSwitch(tab, el) {
        document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
        ['docs', 'meds', 'tools'].forEach(t => document.getElementById(`view-${t}`).classList.add('hidden'));
        document.getElementById(`view-${tab}`).classList.remove('hidden');
    }

    toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('mdk_dark', document.documentElement.classList.contains('dark'));
    }
}

window.app = new App();
