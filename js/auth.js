// js/auth.js
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, onValue, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { Utils } from "./utils.js";

export class AuthManager {
    constructor(app) {
        this.app = app;
        this.user = null;
        this.isAdmin = false;
        
        // NEW: HARDCODED ADMIN LIST
        this.ADMIN_EMAILS = [
            "minhduc.kale@gmail.com",
            "bancuaban@gmail.com",
            "emailcuaban@gmail.com"
        ];
    }

    init() {
        onAuthStateChanged(this.app.authObj, (user) => {
            this.user = user;
            this.updateUI();
            if (user) {
                this.checkRole();
                this.app.data.loadUserData();
                this.app.data.listenToData();
            } else {
                this.app.data.resetData();
                this.isAdmin = false;
            }
        });
    }

    handleLogin() {
        signInWithPopup(this.app.authObj, this.app.provider)
            .then(() => this.logAction("Đăng nhập"))
            .catch(e => Utils.showToast(e.message, 'error'));
    }

    async handleLogout() {
        if(this.user) await this.logAction("Đăng xuất");
        await signOut(this.app.authObj);
        Utils.showToast("Đã đăng xuất", "info");
        document.getElementById('logoutPanel').classList.add('hidden');
    }

    async handleSwitchAccount() {
        await signOut(this.app.authObj);
        this.handleLogin();
    }

    checkRole() {
        this.isAdmin = false;
        const badge = document.getElementById('roleBadge');

        // Check Hardcoded list
        if (this.user && this.ADMIN_EMAILS.includes(this.user.email)) {
            this.isAdmin = true;
            this.setAdminUI(badge, "ADMIN (Friend)");
            return;
        }

        // Fallback check DB
        onValue(ref(this.app.db, `users/${this.user.uid}/role`), snap => {
            const role = snap.val() || "user";
            if (role === 'admin') {
                this.isAdmin = true;
                this.setAdminUI(badge, "ADMIN");
            } else {
                this.setUserUI(badge);
            }
        });
    }

    setAdminUI(badge, text) {
        badge.innerText = text;
        badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white w-fit shadow-sm";
        document.getElementById('adminPanelBtn').classList.remove("hidden");
        document.getElementById('adminToolsCard').classList.remove("hidden");
        document.getElementById('publicDocWrapper').classList.remove("opacity-50", "pointer-events-none");
        this.app.admin.loadAdminData();
    }

    setUserUI(badge) {
        badge.innerText = "USER";
        badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-green-500 text-white w-fit shadow-sm";
    }

    updateUI() {
        const els = {
            loginBtn: document.getElementById('loginBtn'),
            profile: document.getElementById('userProfile'),
            avatar: document.getElementById('userAvatar'),
            name: document.getElementById('userName'),
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

    logAction(text) {
        if(!this.user) return;
        push(ref(this.app.db, `users/${this.user.uid}/logs`), {
            text, time: Utils.formatDate()
        });
    }
}
