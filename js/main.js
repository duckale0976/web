// js/main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import { CONFIG } from "./config.js";
import { Utils } from "./utils.js";
import { AuthManager } from "./auth.js";
import { DataManager } from "./data.js";
import { UIManager } from "./ui.js";
import { MusicPlayer } from "./music.js";
import { MedicalTools } from "./tools.js";
import { AdminManager } from "./admin.js";

class App {
    constructor() {
        this.app = initializeApp(CONFIG.firebase);
        this.authObj = getAuth(this.app);
        this.db = getDatabase(this.app);
        this.provider = new GoogleAuthProvider();
        
        // Khởi tạo các module con
        this.utils = Utils;
        this.ui = new UIManager(this);
        this.data = new DataManager(this);
        this.auth = new AuthManager(this);
        this.music = new MusicPlayer();
        this.tools = new MedicalTools();
        this.admin = new AdminManager(this);

        this.init();
    }

    init() {
        this.ui.init();
        this.auth.init();
        
        // Kiểm tra Dark Mode từ LocalStorage
        if (localStorage.getItem('mdk_dark') === 'true') {
            document.documentElement.classList.add('dark');
        }
    }
}

// Gán app vào window để HTML có thể gọi (onclick="app.xxx")
window.app = new App();
