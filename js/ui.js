export class UIManager {
    constructor(app) {
        this.app = app;
    }

    init() {
        // Mặc định mở tab Tài liệu
        this.switchTab('docs');
        this.startClock();
    }

    // Chuyển Tab chính (Docs / Meds / Tools)
    switchTab(tabName, btnElement = null) {
        // 1. Ẩn tất cả view
        document.querySelectorAll('[id^="view-"]').forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('flex'); // Quan trọng để reset display
        });

        // 2. Hiện view được chọn
        const view = document.getElementById(`view-${tabName}`);
        if (view) {
            view.classList.remove('hidden');
            if (tabName === 'meds') {
                view.classList.add('flex'); // Meds dùng Flexbox layout
                // Fix lỗi hiển thị thanh lọc khi chuyển tab
                this.app.data.renderFilters();
            } else {
                view.classList.add('flex'); // Các tab khác cũng dùng flex
            }
        }

        // 3. Update style nút bấm (nếu có click từ nút)
        if (btnElement) {
            document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
            btnElement.classList.add('active');
        } else {
            // Update thủ công nếu gọi từ code
             document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
             const index = ['docs', 'meds', 'tools'].indexOf(tabName);
             if (index >= 0) document.querySelectorAll('.segment-btn')[index].classList.add('active');
        }
    }

    // Modal Control
    openModal(id) {
        document.getElementById(id).classList.remove('hidden');
    }

    closeModal(id) {
        document.getElementById(id).classList.add('hidden');
    }

    // Toggle (Tools Accordion)
    toggleTool(name) {
        const content = document.getElementById(`tool-${name}`);
        const arrow = content.previousElementSibling.querySelector('.tool-arrow'); // Tìm mũi tên
        
        if (content.classList.contains('open')) {
            content.classList.remove('open');
            content.style.maxHeight = '0';
            if(arrow) arrow.style.transform = 'rotate(0deg)';
        } else {
            // Đóng các tool khác (Accordion effect)
            document.querySelectorAll('.tool-content').forEach(el => {
                el.classList.remove('open');
                el.style.maxHeight = '0';
            });
            document.querySelectorAll('.tool-arrow').forEach(el => el.style.transform = 'rotate(0deg)');

            content.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
            if(arrow) arrow.style.transform = 'rotate(180deg)';
        }
    }

    toggleNotify() {
        document.getElementById('notifyPanel').classList.toggle('hidden');
    }

    toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('mdk_dark', isDark);
        
        const icon = document.getElementById('darkIcon');
        icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }

    startClock() {
        setInterval(() => {
            const now = new Date();
            document.getElementById('clock').innerText = now.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'});
            document.getElementById('date-display').innerText = now.toLocaleDateString('vi-VN', {weekday: 'short', day: '2-digit', month: '2-digit'});
        }, 1000);
    }
}
