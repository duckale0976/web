// js/ui.js
export class UIManager {
    constructor(app) {
        this.app = app;
    }

    init() {
        // Xử lý đóng các panel khi click ra ngoài
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

    switchTab(tab, el) {
        document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
        ['docs', 'meds', 'tools'].forEach(t => document.getElementById(`view-${t}`).classList.add('hidden'));
        document.getElementById(`view-${tab}`).classList.remove('hidden');
    }

    toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('mdk_dark', document.documentElement.classList.contains('dark'));
    }

    toggleNotify() {
        document.getElementById("notifyPanel").classList.toggle("hidden");
    }

    toggleTool(id) {
        document.getElementById('tool-'+id).classList.toggle('open');
    }

    openModal(id) {
        document.getElementById(id).classList.remove('hidden');
    }

    closeModal(id) {
        document.getElementById(id).classList.add('hidden');
    }
}
