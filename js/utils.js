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
