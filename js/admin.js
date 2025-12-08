import { ref, set, remove, push, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { Utils } from "./utils.js";

export class AdminManager {
    constructor(app) {
        this.app = app;
    }

    scrollToTools() {
        this.app.ui.switchTab('tools');
        setTimeout(() => {
            document.getElementById('tool-admin').classList.add('open');
            document.getElementById('adminToolsCard').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }

    // --- CẤU HÌNH DRIVE ---
    saveDriveConfig() {
        if (!this.app.auth.isAdmin) return Utils.showToast("Chỉ Admin mới được sửa!", "error");
        const id = document.getElementById("driveFolderId").value;
        if (!id) return Utils.showToast("Chưa nhập ID!", "error");
        
        set(ref(this.app.db, "config/drive_id"), id)
            .then(() => Utils.showToast("Đã lưu cấu hình Drive!", "success"))
            .catch(e => Utils.showToast("Lỗi: " + e.message, "error"));
    }

    // --- QUẢN LÝ THUỐC ---
    seedMeds() {
        if (!this.app.auth.isAdmin) return;
        if (!confirm("Hành động này sẽ thêm dữ liệu mẫu. Tiếp tục?")) return;

        // Dữ liệu mẫu chuẩn Mims
        const sampleMeds = {
            "m1": { name: "Paracetamol", brand: "Panadol", group: "Giảm đau hạ sốt", strength: "500mg", dosage: "10-15mg/kg/lần", indication: "Sốt, đau nhẹ" },
            "m2": { name: "Ibuprofen", brand: "Brufen", group: "NSAIDs", strength: "400mg", dosage: "20-30mg/kg/ngày", indication: "Đau viêm, hạ sốt" },
            "m3": { name: "Amoxicillin", brand: "Augmentin", group: "Kháng sinh", strength: "1g", dosage: "875/125mg x 2 lần/ngày", indication: "Nhiễm khuẩn hô hấp" },
            "m4": { name: "Omeprazole", brand: "Losec", group: "Tiêu hóa", strength: "20mg", dosage: "20mg uống trước ăn sáng", indication: "Trào ngược dạ dày (GERD)" },
            "m5": { name: "Amlodipine", brand: "Amlor", group: "Tim mạch", strength: "5mg", dosage: "5mg/ngày", indication: "Tăng huyết áp" }
        };

        update(ref(this.app.db, "library_meds"), sampleMeds)
            .then(() => Utils.showToast("Đã nạp 5 thuốc mẫu!", "success"));
    }

    deleteMed(id) {
        if (!this.app.auth.isAdmin) return Utils.showToast("Bạn không có quyền Admin!", "error");
        
        remove(ref(this.app.db, `library_meds/${id}`))
            .then(() => {
                Utils.showToast("Đã xóa thuốc thành công!", "success");
                // UI sẽ tự cập nhật nhờ listener trong data.js
            })
            .catch(err => Utils.showToast("Lỗi xóa: " + err.message, "error"));
    }

    // --- IMPORT / EXPORT ---
    openImport(type) {
        if (!this.app.auth.isAdmin) return Utils.showToast("Cần quyền Admin!", "error");
        this.importType = type; // 'docs' hoặc 'meds'
        
        const title = type === 'docs' ? 'Import Tài Liệu (JSON)' : 'Import Danh Mục Thuốc (JSON)';
        const hint = type === 'docs' 
            ? 'Format: [{"title":"Tên","url":"Link","folder":"ThuMuc"}]' 
            : 'Format: [{"name":"Tên","brand":"Biệt dược","group":"Nhóm","strength":"Hàm lượng"}]';
        
        document.querySelector('#jsonImportModal h2').innerHTML = `<i class="fa-solid fa-file-import text-blue-500"></i> ${title}`;
        document.getElementById('jsonImportHint').innerText = hint;
        document.getElementById('jsonInput').value = '';
        
        this.app.ui.openModal('jsonImportModal');
    }

    execImport() {
        const raw = document.getElementById('jsonInput').value;
        try {
            const data = JSON.parse(raw);
            if (!Array.isArray(data)) throw new Error("Phải là một mảng [] JSON");

            const updates = {};
            const root = this.importType === 'docs' ? 'library_public' : 'library_meds';
            
            data.forEach(item => {
                const newKey = push(ref(this.app.db, root)).key;
                updates[`${root}/${newKey}`] = item;
            });

            update(ref(this.app.db), updates)
                .then(() => {
                    Utils.showToast(`Đã import ${data.length} mục thành công!`, "success");
                    this.app.ui.closeModal('jsonImportModal');
                });

        } catch (e) {
            Utils.showToast("Lỗi JSON: " + e.message, "error");
        }
    }
    
    triggerSync() {
       Utils.showToast("Tính năng Sync Drive đang phát triển (Backend)", "info");
    }
}
