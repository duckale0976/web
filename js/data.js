// js/data.js
import { ref, push, remove, set, onValue, off } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { Utils } from "./utils.js";
import { CONFIG } from "./config.js";

export class DataManager {
    constructor(app) {
        this.app = app;
        this.dataStore = { publicDocs: [], privateDocs: [], meds: [] };
        this.listeners = {};
        this.currentFolder = null;
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
            this.renderMeds();
            document.getElementById('loadingMeds').classList.add('hidden');
        });
    }

    resetData() {
        this.dataStore = { publicDocs: [], privateDocs: [], meds: [] };
        this.renderDocs();
        this.renderMeds();
    }

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

    renderMeds() {
        const container = document.getElementById('medsList');
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
                    ${this.app.auth.isAdmin ? `<button onclick="if(confirm('Xóa thuốc này?')) app.admin.deleteMed('${m.id}')" class="text-slate-400 hover:text-red-500"><i class="fa-solid fa-trash"></i></button>` : ''}
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
}
