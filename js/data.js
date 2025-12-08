import { ref, push, remove, set, onValue, off } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { Utils } from "./utils.js";
import { CONFIG } from "./config.js";

export class DataManager {
    constructor(app) {
        this.app = app;
        this.dataStore = { publicDocs: [], privateDocs: [], meds: [] };
        this.listeners = {};
        this.currentFolder = null;
        this.activeFilter = 'All'; // Trạng thái bộ lọc hiện tại
    }

    loadUserData() {
        onValue(ref(this.app.db, `users/${this.app.auth.user.uid}/note`), snap => 
            document.getElementById('quickNote').value = snap.val() || ""
        );
        
        onValue(ref(this.app.db, `users/${this.app.auth.user.uid}/logs`), snap => {
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

        onValue(ref(this.app.db, "config/drive_id"), snap => {
            if(snap.val()) document.getElementById("driveFolderId").value = snap.val();
        });
    }

    listenToData() {
        document.getElementById('loadingDocs').classList.remove('hidden');
        
        // Public Docs
        if(this.listeners.pub) off(this.listeners.pub);
        this.listeners.pub = ref(this.app.db, 'library_public');
        onValue(this.listeners.pub, snap => {
            const data = snap.val();
            this.dataStore.publicDocs = data ? Object.entries(data).map(([k,v]) => ({...v, id:k, source:'public'})) : [];
            this.renderDocs();
            document.getElementById('loadingDocs').classList.add('hidden');
        });

        // Private Docs
        if(this.listeners.priv) off(this.listeners.priv);
        this.listeners.priv = ref(this.app.db, `users/${this.app.auth.user.uid}/docs`);
        onValue(this.listeners.priv, snap => {
            const data = snap.val();
            this.dataStore.privateDocs = data ? Object.entries(data).map(([k,v]) => ({...v, id:k, source:'private'})) : [];
            this.renderDocs();
        });

        // Meds
        document.getElementById('loadingMeds').classList.remove('hidden');
        if(this.listeners.meds) off(this.listeners.meds);
        this.listeners.meds = ref(this.app.db, 'library_meds');
        onValue(this.listeners.meds, snap => {
            const data = snap.val();
            this.dataStore.meds = data ? Object.entries(data).map(([k,v]) => ({...v, id:k})) : [];
            this.renderFilters(); // Tạo bộ lọc
            this.renderMeds();
            document.getElementById('loadingMeds').classList.add('hidden');
        });
    }

    resetData() {
        this.dataStore = { publicDocs: [], privateDocs: [], meds: [] };
        this.renderDocs();
        this.renderMeds();
    }

    // --- XỬ LÝ DOCS ---
    saveNewDoc() {
        const title = document.getElementById('newDocTitle').value;
        const folder = document.getElementById('newDocFolder').value;
        const url = document.getElementById('newDocLink').value;
        const isPub = document.getElementById('isPublicDoc').checked;

        if (!title || !url) return Utils.showToast("Thiếu thông tin!", "error");
        
        const path = isPub ? 'library_public' : `users/${this.app.auth.user.uid}/docs`;
        push(ref(this.app.db, path), {
            title, folder, url,
            createdAt: Date.now(),
            addedBy: this.app.auth.user.email
        }).then(() => {
            Utils.showToast("✅ Đã lưu thành công!", "success");
            this.app.ui.closeModal('addDocModal');
            document.getElementById('newDocTitle').value = '';
            document.getElementById('newDocLink').value = '';
        }).catch(e => Utils.showToast(e.message, "error"));
    }

    deleteDoc(id, isPub) {
        if(!confirm("Bạn chắc chắn muốn xóa?")) return;
        const path = isPub ? `library_public/${id}` : `users/${this.app.auth.user.uid}/docs/${id}`;
        remove(ref(this.app.db, path)).then(() => Utils.showToast("Đã xóa!", "success"));
    }

    saveNote() {
        const val = document.getElementById('quickNote').value;
        if(this.app.auth.user) {
            set(ref(this.app.db, `users/${this.app.auth.user.uid}/note`), val);
            const status = document.getElementById('saveStatus');
            status.style.opacity = '1';
            setTimeout(() => status.style.opacity = '0', 2000);
        }
    }

    renderFolders() {
        this.currentFolder = null;
        this.renderDocs();
    }

    renderDocs() {
        const listEl = document.getElementById('docsList');
        const term = Utils.removeAccents(document.getElementById('searchInput').value);
        const allDocs = [...this.dataStore.publicDocs, ...this.dataStore.privateDocs];
        
        if (!term && !this.currentFolder) {
            document.getElementById('breadcrumb').classList.add('hidden');
            let html = '';
            Object.entries(CONFIG.folders).forEach(([key, f]) => {
                const count = allDocs.filter(d => d.folder === key).length;
                html += `
                <div onclick="app.data.currentFolder='${key}'; app.data.renderDocs()" class="glass-card p-5 rounded-3xl flex items-center gap-5 cursor-pointer hover:bg-white/90 dark:hover:bg-slate-700/80 transition group border-l-4 border-transparent hover:border-blue-500">
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
                    <a href="${Utils.escapeHTML(doc.url)}" target="_blank" onclick="app.auth.logAction('Mở: ${Utils.escapeHTML(doc.title).replace(/'/g,"")}')" class="text-xs font-bold text-blue-600 hover:underline uppercase tracking-wide">Mở tài liệu</a>
                </div>
                ${(!isPub || (isPub && this.app.auth.isAdmin)) ? `<button onclick="app.data.deleteDoc('${doc.id}', ${isPub})" class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-100 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-sm"><i class="fa-solid fa-trash-can text-sm"></i></button>` : ''}
            `;
            frag.appendChild(div);
        });
        listEl.innerHTML = '';
        listEl.appendChild(frag);
    }

    // --- RENDER BỘ LỌC (CHIPS) ---
    renderFilters() {
        const container = document.getElementById('medFilters');
        if (!container) return;

        // Lấy danh sách nhóm duy nhất & sắp xếp
        const groups = ['All', ...new Set(this.dataStore.meds.map(m => m.group ? m.group.trim() : 'Khác'))].sort();

        // Render dạng trượt ngang
        container.innerHTML = groups.map(g => 
            `<div onclick="app.data.filterByGroup('${g}')" 
                  class="filter-chip ${this.activeFilter === g ? 'active' : ''}">
                ${g === 'All' ? 'Tất cả' : g}
            </div>`
        ).join('');
    }

    filterByGroup(group) {
        this.activeFilter = group;
        this.renderFilters(); 
        this.renderMeds();
        // Scroll nhẹ về đầu danh sách khi chọn nhóm mới
        document.getElementById('medsList').scrollTop = 0;
    }

    // --- RENDER DANH SÁCH THUỐC (GIAO DIỆN MỚI) ---
    renderMeds() {
        const container = document.getElementById('medsList');
        const searchInput = document.getElementById('searchMedsInput');
        // Chuẩn hóa từ khóa: bỏ dấu, viết thường
        const term = Utils.removeAccents(searchInput ? searchInput.value.toLowerCase() : "");
        
        let list = this.dataStore.meds;

        // 1. Lọc theo Nhóm (Filter Chip)
        if (this.activeFilter !== 'All') {
            list = list.filter(m => (m.group ? m.group.trim() : 'Khác') === this.activeFilter);
        }

        // 2. TÌM KIẾM THÔNG MINH (Smart Search)
        if (term) {
            list = list.filter(m => {
                // Gộp tất cả thông tin thành 1 chuỗi để tìm
                const content = Utils.removeAccents(`
                    ${m.name} 
                    ${m.brand} 
                    ${m.group} 
                    ${m.indication} 
                    ${m.ingredient}
                `.toLowerCase());
                return content.includes(term);
            });
        }

        // Empty State (Nếu không có kết quả)
        if (list.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center py-10 opacity-60">
                    <div class="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                        <i class="fa-solid fa-magnifying-glass text-2xl text-slate-400"></i>
                    </div>
                    <p class="text-sm font-bold text-slate-500">Không tìm thấy thuốc nào</p>
                </div>`;
            return;
        }

        // 3. Render tối đa 50 kết quả (Lazy render logic đơn giản)
        const displayList = list.slice(0, 50);
        const frag = document.createDocumentFragment();

        displayList.forEach(m => {
            const div = document.createElement('div');
            // Class "med-card" đã định nghĩa ở CSS trên
            div.className = "med-card group animate-slideIn"; 
            
            // Xử lý dữ liệu an toàn
            const d = {
                id: m.id,
                name: Utils.escapeHTML(m.name || "Không tên"),
                brand: Utils.escapeHTML(m.brand || ""),
                group: Utils.escapeHTML(m.group || "Khác"),
                strength: Utils.escapeHTML(m.strength || ""),
                dosage: Utils.escapeHTML(m.dosage || "Đang cập nhật..."),
                indication: Utils.escapeHTML(m.indication || ""),
                ...m // Copy hết props để truyền vào modal
            };

            // HTML layout Card: Icon Trái | Nội dung Giữa | Nút Phải
            div.innerHTML = `
                <div class="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-lg shrink-0 border border-blue-200 dark:border-blue-800 shadow-sm">
                    ${d.name.substring(0, 1).toUpperCase()}
                </div>
                
                <div class="flex-1 min-w-0 flex flex-col justify-center" onclick='app.data.showMimsDetail(${JSON.stringify(d).replace(/'/g, "&#39;")})'>
                    <h4 class="font-bold text-slate-800 dark:text-slate-100 truncate text-[15px] leading-tight">
                        ${d.name} <span class="text-xs font-normal text-slate-400 ml-1 hidden sm:inline-block">(${d.strength})</span>
                    </h4>
                    
                    <div class="flex items-center gap-2 mt-1">
                         ${d.brand ? `<span class="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1.5 rounded truncate max-w-[120px]">${d.brand}</span>` : ''}
                         <span class="text-xs text-slate-500 dark:text-slate-400 truncate">${d.group}</span>
                    </div>
                </div>

                <div class="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-700">
                    <button onclick='app.data.showMimsDetail(${JSON.stringify(d).replace(/'/g, "&#39;")})' 
                        class="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-600 transition flex items-center justify-center">
                        <i class="fa-solid fa-angle-right"></i>
                    </button>
                    
                    ${this.app.auth.isAdmin ? `
                    <button onclick="event.stopPropagation(); if(confirm('Xóa thuốc: ${d.name}?')) app.admin.deleteMed('${d.id}')" 
                        class="w-9 h-9 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-300 hover:text-red-500 transition flex items-center justify-center">
                        <i class="fa-solid fa-trash-can text-sm"></i>
                    </button>` : ''}
                </div>
            `;
            frag.appendChild(div);
        });

        container.innerHTML = '';
        container.appendChild(frag);

        // Hiển thị số lượng kết quả
        if (list.length > 50) {
            const info = document.createElement('div');
            info.className = "text-center text-[10px] text-slate-400 py-2 italic";
            info.innerText = `Đang hiển thị 50 trên tổng số ${list.length} thuốc`;
            container.appendChild(info);
        }
    }

    showMimsDetail(d) {
        document.getElementById('mims-name').innerText = d.name;
        document.getElementById('mims-brand').innerText = `${d.brand} ${d.strength ? '(' + d.strength + ')' : ''}`;
        document.getElementById('mims-group').innerText = d.group;
        
        // Cập nhật nội dung các mục chi tiết
        document.getElementById('mims-dosage').innerText = d.dosage;
        document.getElementById('mims-indication').innerText = d.indication;
        document.getElementById('mims-contra').innerText = d.contra;
        document.getElementById('mims-caution').innerText = d.caution;
        document.getElementById('mims-side').innerText = d.side;
        document.getElementById('mims-inter').innerText = d.inter;
        
        this.app.ui.openModal('drugDetailModal');
    }
}
