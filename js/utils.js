// js/utils.js
export const Utils = {
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
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<div class="toast-content font-bold text-sm">${msg}</div>`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    },
    formatDate: () => new Date().toLocaleString("vi-VN"),
    isMobile: () => window.innerWidth < 768
};
export class Utils {
    // Hàm tạo ID ngẫu nhiên
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Hàm xử lý chuỗi an toàn để chống lỗi XSS khi render HTML
    static escapeHTML(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Hiển thị thông báo (Toast)
    static showToast(msg, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const div = document.createElement('div');
        div.className = `toast ${type} fade-in`;
        
        let icon = 'fa-circle-info';
        if (type === 'success') icon = 'fa-circle-check';
        if (type === 'error') icon = 'fa-circle-exclamation';

        div.innerHTML = `<i class="fa-solid ${icon} text-xl"></i> <span class="font-bold text-sm">${msg}</span>`;
        
        container.appendChild(div);

        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            div.style.opacity = '0';
            div.style.transform = 'translateY(20px)';
            setTimeout(() => div.remove(), 300);
        }, 3000);
    }

    // --- QUAN TRỌNG: Hàm xử lý Tiếng Việt cho Tìm kiếm ---
    static removeAccents(str) {
        if (!str) return "";
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .toLowerCase();
    }
}
