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

        // Lấy danh sách các nhóm thuốc duy nhất
        const groups = ['All', ...new Set(this.dataStore.meds.map(m => m.group ? m.group.trim() : 'Khác'))].sort();

        container.innerHTML = groups.map(g => 
            `<button onclick="app.data.filterByGroup('${g}')" 
                     class="filter-chip ${this.activeFilter === g ? 'active' : ''}">
                ${g === 'All' ? 'Tất cả' : g}
            </button>`
        ).join('');
    }

    filterByGroup(group) {
        this.activeFilter = group;
        this.renderFilters(); // Cập nhật màu nút active
        this.renderMeds();    // Render lại danh sách
    }

    // --- RENDER DANH SÁCH THUỐC (LIST VIEW) ---
    renderMeds() {
        const container = document.getElementById('medsList');
        const searchInput = document.getElementById('searchMedsInput');
        const term = Utils.removeAccents(searchInput ? searchInput.value : "");
        
        let list = this.dataStore.meds;

        // 1. Lọc theo Nhóm (Filter Chip)
        if (this.activeFilter !== 'All') {
            list = list.filter(m => (m.group ? m.group.trim() : 'Khác') === this.activeFilter);
        }

        // 2. Lọc theo Từ khóa tìm kiếm
        if (term) {
            list = list.filter(m => 
                Utils.removeAccents(m.name || "").includes(term) || 
                Utils.removeAccents(m.brand || "").includes(term) ||
                Utils.removeAccents(m.indication || "").includes(term)
            );
        }

        if (list.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center py-10 opacity-60">
                    <i class="fa-solid fa-box-open text-4xl mb-2 text-slate-400"></i>
                    <p class="text-sm font-bold text-slate-500">Không tìm thấy thuốc nào</p>
                </div>`;
            return;
        }

        // 3. Tối ưu hiển thị: Chỉ render tối đa 100 kết quả đầu tiên
        const displayList = list.slice(0, 100);
        const frag = document.createDocumentFragment();

        displayList.forEach(m => {
            const div = document.createElement('div');
            div.className = "med-item animate-slideIn"; // Sử dụng class CSS

            // Chuẩn bị dữ liệu hiển thị an toàn
            const d = {
                name: Utils.escapeHTML(m.name || "Không tên"),
                brand: Utils.escapeHTML(m.brand || "Generics"),
                group: Utils.escapeHTML(m.group || "Khác"),
                strength: Utils.escapeHTML(m.strength || ""),
                dosage: Utils.escapeHTML(m.dosage || "Đang cập nhật..."),
                indication: Utils.escapeHTML(m.indication || "Đang cập nhật..."),
                contra: Utils.escapeHTML(m.contra || "Đang cập nhật..."),
                caution: Utils.escapeHTML(m.caution || "Đang cập nhật..."),
                side: Utils.escapeHTML(m.side || "Đang cập nhật..."),
                inter: Utils.escapeHTML(m.inter || "Đang cập nhật...")
            };

            // HTML cho từng dòng thuốc (List Item)
            div.innerHTML = `
                <div class="flex items-center gap-3 flex-1 min-w-0" onclick='app.data.showMimsDetail(${JSON.stringify(d).replace(/'/g, "&#39;")})'>
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase shadow-md shadow-blue-500/30">
                        ${d.name.substring(0, 1)}
                    </div>
                    
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <h4 class="font-bold text-slate-900 dark:text-white truncate text-base">${d.name}</h4>
                        </div>
                        <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                            <span class="text-blue-600 dark:text-blue-400">${d.brand}</span> 
                            ${d.strength ? `<span class="mx-1 text-slate-300">|</span> ${d.strength}` : ''}
                        </p>
                    </div>
                </div>
                
                <div class="flex items-center gap-1 pl-2 border-l border-slate-100 dark:border-slate-700 ml-2">
                     <button onclick='app.data.showMimsDetail(${JSON.stringify(d).replace(/'/g, "&#39;")})' class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-600 transition flex items-center justify-center">
                        <i class="fa-solid fa-circle-info"></i>
                    </button>
                    ${this.app.auth.isAdmin ? `
                    <button onclick="if(confirm('Xóa thuốc: ${d.name}?')) app.admin.deleteMed('${m.id}')" class="w-8 h-8 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-300 hover:text-red-500 transition flex items-center justify-center">
                        <i class="fa-solid fa-trash"></i>
                    </button>` : ''}
                </div>
            `;
            frag.appendChild(div);
        });

        container.innerHTML = '';
        container.appendChild(frag);

        // Hiển thị thông báo nếu danh sách bị cắt bớt
        if (list.length > 100) {
            const notice = document.createElement('div');
            notice.className = "text-center text-[10px] text-slate-400 py-3 italic font-bold uppercase tracking-wider";
            notice.innerHTML = `Hiển thị 100 / ${list.length} kết quả`;
            container.appendChild(notice);
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
