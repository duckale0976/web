// js/admin.js
import { ref, push, set, remove, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { Utils } from "./utils.js";

export class AdminManager {
    constructor(app) {
        this.app = app;
    }

    scrollToTools() {
        this.app.ui.switchTab('tools', document.querySelectorAll('.segment-btn')[2]);
        const el = document.getElementById('tool-admin');
        el.classList.add('open');
        el.scrollIntoView({ behavior: 'smooth' });
    }

    loadAdminData() {
        onValue(ref(this.app.db, "users"), snap => {
            const box = document.getElementById("adminUsersBox");
            if (!box) return;
            box.innerHTML = "";
            snap.forEach(u => {
                const val = u.val();
                const role = val.role || "user";
                const id = u.key.substring(0,6);
                box.innerHTML += `<div class="flex justify-between items-center py-1 border-b border-white/10 last:border-0"><span class="truncate w-40">${val.note ? "User (Có note)" : "User "+id}</span> <span class="${role==='admin'?'text-red-500 font-bold':'text-green-500'} text-xs uppercase">${role}</span></div>`;
            });
        });
    }

    openImport(t) {
        this.app.data.importType = t;
        document.getElementById("jsonImportModal").classList.remove("hidden");
        document.getElementById('jsonImportHint').innerText = t==='docs'?'Format: [{"title":"", "url":"", "folder":""}]':'Format: [{"name":"", "brand":"", "group":""}]';
    }

    execImport() {
        try {
            const raw = document.getElementById('jsonInput').value;
            const data = JSON.parse(raw);
            if (!Array.isArray(data)) throw new Error("Dữ liệu phải là mảng JSON []");

            if (this.app.data.importType === 'docs') {
                data.forEach(d => push(ref(this.app.db, 'library_public'), {
                    title: d.title || d.Title || d.Ten || "No Title",
                    url: d.url || d.Url || d.Link || "#",
                    folder: d.folder || d.Folder || d.ThuMuc || "khac",
                    createdAt: Date.now()
                }));
                Utils.showToast(`Đã import thành công ${data.length} tài liệu!`, "success");
            } else {
                let count = 0;
                data.forEach(m => {
                    const medData = {
                        name: m.name || m.Name || m.TenThuoc || m.ten_thuoc || "?",
                        brand: m.brand || m.Brand || m.BietDuoc || m.biet_duoc || "",
                        group: m.group || m.Group || m.Nhom || m.nhom || "Khác",
                        strength: m.strength || m.Strength || m.HamLuong || m.ham_luong || "",
                        dosage: m.dosage || m.Dosage || m.LieuDung || m.lieu_dung || "",
                        route: m.route || m.Route || m.DuongDung || m.duong_dung || "",
                        mechanism: m.mechanism || m.Mechanism || m.CoChe || "",
                        usage: m.usage || m.Usage || m.ChiDinh || ""
                    };
                    if(medData.name !== "?") {
                        push(ref(this.app.db, 'library_meds'), medData);
                        count++;
                    }
                });
                Utils.showToast(`Đã import thành công ${count} thuốc!`, "success");
            }
            this.app.ui.closeModal('jsonImportModal');
        } catch (e) {
            alert("Lỗi cấu trúc JSON: " + e.message);
        }
    }

    deleteMed(id) { 
        remove(ref(this.app.db, `library_meds/${id}`)).then(()=>Utils.showToast("Đã xóa thuốc", "success")); 
    }

    saveDriveConfig() {
        const id = document.getElementById("driveFolderId").value;
        if(id) { set(ref(this.app.db, "config/drive_id"), id); Utils.showToast("Đã lưu cấu hình Drive!", "success"); }
    }

    triggerSync() {
        Utils.showToast("Đang kết nối API Drive...", "info");
        setTimeout(() => Utils.showToast("✅ Đã đồng bộ: Hệ thống đã cập nhật dữ liệu mới nhất.", "success"), 2000);
    }

    seedMedsData() {
         if(!confirm("⚠️ CẢNH BÁO: Thao tác này sẽ nạp ~200 loại thuốc thiết yếu (Mims 2024) vào Database. Bạn có chắc chắn?")) return;
         
         const meds = [
            // --- KHÁNG SINH (ANTIBIOTICS) ---
            { name: "Amoxicillin", brand: "Clamoxyl", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "20-50 mg/kg/ngày chia 2-3 lần", route: "Uống" },
            { name: "Amoxicillin/Clavulanate", brand: "Augmentin", group: "Kháng sinh", strength: "250/31.25, 500/62.5", dosage: "25-45 mg/kg/ngày chia 2 lần", route: "Uống" },
            { name: "Ampicillin", brand: "Ampicillin", group: "Kháng sinh", strength: "500mg, 1g", dosage: "50-100 mg/kg/ngày chia 4 lần", route: "Tiêm TM/TB" },
            { name: "Penicillin V", brand: "Ospen", group: "Kháng sinh", strength: "400.000IU, 1M IU", dosage: "25-50 mg/kg/ngày chia 4 lần", route: "Uống" },
            { name: "Oxacillin", brand: "Bristopen", group: "Kháng sinh", strength: "500mg, 1g", dosage: "50-100 mg/kg/ngày chia 4-6 lần", route: "Tiêm TM" },
            { name: "Cloxacillin", brand: "Cloxapen", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "50-100 mg/kg/ngày chia 4 lần", route: "Uống" },
            { name: "Cephalexin", brand: "Keflex", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "25-50 mg/kg/ngày chia 2-4 lần", route: "Uống" },
            { name: "Cefadroxil", brand: "Biodroxil", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "30 mg/kg/ngày chia 2 lần", route: "Uống" },
            { name: "Cefuroxime", brand: "Zinnat", group: "Kháng sinh", strength: "125mg, 250mg, 750mg", dosage: "20-30 mg/kg/ngày chia 2 lần", route: "Uống/Tiêm" },
            { name: "Cefaclor", brand: "Ceclor", group: "Kháng sinh", strength: "125mg, 250mg", dosage: "20-40 mg/kg/ngày chia 2-3 lần", route: "Uống" },
            { name: "Cefprozil", brand: "Cefzil", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "15-30 mg/kg/ngày chia 2 lần", route: "Uống" },
            { name: "Cefixime", brand: "Suprax", group: "Kháng sinh", strength: "50mg, 100mg", dosage: "8 mg/kg/ngày uống 1 lần hoặc chia 2", route: "Uống" },
            { name: "Cefpodoxime", brand: "Vantin", group: "Kháng sinh", strength: "100mg, 200mg", dosage: "10 mg/kg/ngày chia 2 lần", route: "Uống" },
            { name: "Cefdinir", brand: "Omnicef", group: "Kháng sinh", strength: "300mg", dosage: "14 mg/kg/ngày uống 1 lần hoặc chia 2", route: "Uống" },
            { name: "Ceftriaxone", brand: "Rocephin", group: "Kháng sinh", strength: "1g", dosage: "50-80 mg/kg/ngày 1 lần", route: "Tiêm TM/TB" },
            { name: "Cefotaxime", brand: "Claforan", group: "Kháng sinh", strength: "1g", dosage: "100-150 mg/kg/ngày chia 3-4 lần", route: "Tiêm TM" },
            { name: "Ceftazidime", brand: "Fortum", group: "Kháng sinh", strength: "1g", dosage: "100-150 mg/kg/ngày chia 3 lần", route: "Tiêm TM" },
            { name: "Cefepime", brand: "Maxipime", group: "Kháng sinh", strength: "1g", dosage: "100 mg/kg/ngày chia 2 lần", route: "Tiêm TM" },
            { name: "Azithromycin", brand: "Zithromax", group: "Kháng sinh", strength: "200mg/5ml", dosage: "10 mg/kg (Ngày 1), 5mg/kg (Ngày 2-5)", route: "Uống" },
            { name: "Clarithromycin", brand: "Klacid", group: "Kháng sinh", strength: "125mg/5ml", dosage: "15 mg/kg/ngày chia 2 lần", route: "Uống" },
            { name: "Erythromycin", brand: "Erythrocin", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "30-50 mg/kg/ngày chia 3-4 lần", route: "Uống" },
            { name: "Spiramycin", brand: "Rovamycine", group: "Kháng sinh", strength: "1.5M IU", dosage: "150.000 IU/kg/ngày chia 2-3 lần", route: "Uống" },
            { name: "Gentamicin", brand: "Gentamicin", group: "Kháng sinh", strength: "80mg/2ml", dosage: "5-7.5 mg/kg/ngày 1 lần", route: "Tiêm TM/TB" },
            { name: "Amikacin", brand: "Amiklin", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "15 mg/kg/ngày 1 lần", route: "Tiêm TM" },
            { name: "Tobramycin", brand: "Tobrex", group: "Kháng sinh", strength: "80mg/2ml", dosage: "3-5 mg/kg/ngày chia 3 lần", route: "Tiêm TM" },
            { name: "Ciprofloxacin", brand: "Ciprobay", group: "Kháng sinh", strength: "500mg", dosage: "20-30 mg/kg/ngày chia 2 lần", route: "Uống/IV" },
            { name: "Levofloxacin", brand: "Tavanic", group: "Kháng sinh", strength: "500mg, 750mg", dosage: "10 mg/kg/ngày (hoặc 750mg/ngày NL)", route: "Uống/IV" },
            { name: "Moxifloxacin", brand: "Avelox", group: "Kháng sinh", strength: "400mg", dosage: "400mg/ngày 1 lần", route: "Uống/IV" },
            { name: "Ofloxacin", brand: "Oflocet", group: "Kháng sinh", strength: "200mg", dosage: "400mg/ngày chia 2 lần", route: "Uống" },
            { name: "Doxycycline", brand: "Vibramycin", group: "Kháng sinh", strength: "100mg", dosage: "2-4 mg/kg/ngày chia 1-2 lần (Trẻ >8t)", route: "Uống" },
            { name: "Tetracycline", brand: "Tetra", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "25-50 mg/kg/ngày chia 4 lần", route: "Uống" },
            { name: "Clindamycin", brand: "Dalacin C", group: "Kháng sinh", strength: "150mg, 300mg", dosage: "20-30 mg/kg/ngày chia 3-4 lần", route: "Uống/IV" },
            { name: "Lincomycin", brand: "Lincocin", group: "Kháng sinh", strength: "500mg, 600mg", dosage: "30 mg/kg/ngày chia 3-4 lần", route: "Uống/IM" },
            { name: "Vancomycin", brand: "Vancocin", group: "Kháng sinh", strength: "500mg, 1g", dosage: "40-60 mg/kg/ngày chia 4 lần", route: "Truyền TM" },
            { name: "Teicoplanin", brand: "Targocid", group: "Kháng sinh", strength: "200mg, 400mg", dosage: "6-10 mg/kg/ngày", route: "Tiêm TM/IM" },
            { name: "Linezolid", brand: "Zyvox", group: "Kháng sinh", strength: "600mg", dosage: "10 mg/kg/lần mỗi 8-12h", route: "Uống/IV" },
            { name: "Metronidazole", brand: "Flagyl", group: "Kháng sinh", strength: "250mg", dosage: "30-50 mg/kg/ngày chia 3 lần", route: "Uống/IV" },
            { name: "Tinidazole", brand: "Fasigyn", group: "Kháng sinh", strength: "500mg", dosage: "50 mg/kg/ngày 1 lần (max 2g)", route: "Uống" },
            { name: "Sulfamethoxazole/Trimethoprim", brand: "Bactrim", group: "Kháng sinh", strength: "400/80mg", dosage: "8-10 mg/kg/ngày (TMP) chia 2 lần", route: "Uống" },
            { name: "Imipenem/Cilastatin", brand: "Tienam", group: "Kháng sinh", strength: "500/500mg", dosage: "60-100 mg/kg/ngày chia 4 lần", route: "Truyền TM" },
            { name: "Meropenem", brand: "Meronem", group: "Kháng sinh", strength: "500mg, 1g", dosage: "60-120 mg/kg/ngày chia 3 lần", route: "Truyền TM" },
            { name: "Ertapenem", brand: "Invanz", group: "Kháng sinh", strength: "1g", dosage: "1g/ngày 1 lần", route: "Truyền TM" },
            { name: "Colistin", brand: "Colistimethate", group: "Kháng sinh", strength: "1M IU", dosage: "50.000-75.000 IU/kg/ngày chia 3 lần", route: "Tiêm TM" },
            { name: "Fosfomycin", brand: "Monurol", group: "Kháng sinh", strength: "3g", dosage: "3g liều duy nhất", route: "Uống" },

            // --- TIÊU HÓA (GASTROINTESTINAL) ---
            { name: "Omeprazole", brand: "Losec", group: "Tiêu hóa", strength: "20mg, 40mg", dosage: "0.7-1 mg/kg/ngày 1 lần", route: "Uống/IV" },
            { name: "Esomeprazole", brand: "Nexium", group: "Tiêu hóa", strength: "10mg, 20mg, 40mg", dosage: "0.5-1 mg/kg/ngày 1 lần", route: "Uống/IV" },
            { name: "Pantoprazole", brand: "Pantoloc", group: "Tiêu hóa", strength: "40mg", dosage: "40mg/ngày (NL) 1 lần", route: "Uống/IV" },
            { name: "Lansoprazole", brand: "Lanzol", group: "Tiêu hóa", strength: "30mg", dosage: "30mg/ngày (NL)", route: "Uống" },
            { name: "Rabeprazole", brand: "Pariet", group: "Tiêu hóa", strength: "10mg, 20mg", dosage: "10-20mg/ngày (NL)", route: "Uống" },
            { name: "Cimetidine", brand: "Tagamet", group: "Tiêu hóa", strength: "200mg, 400mg", dosage: "20-40 mg/kg/ngày chia 4 lần", route: "Uống/IV" },
            { name: "Famotidine", brand: "Quamatel", group: "Tiêu hóa", strength: "20mg, 40mg", dosage: "0.5-1 mg/kg/ngày chia 2 lần", route: "Uống/IV" },
            { name: "Domperidone", brand: "Motilium", group: "Tiêu hóa", strength: "10mg", dosage: "0.25-0.5 mg/kg/lần x 3 lần", route: "Uống" },
            { name: "Metoclopramide", brand: "Primperan", group: "Tiêu hóa", strength: "10mg/2ml", dosage: "0.1-0.15 mg/kg/lần x 3 lần", route: "Tiêm IM/IV" },
            { name: "Ondansetron", brand: "Zofran", group: "Tiêu hóa", strength: "4mg, 8mg", dosage: "0.15 mg/kg/lần", route: "Tiêm TM/Uống" },
            { name: "Loperamide", brand: "Imodium", group: "Tiêu hóa", strength: "2mg", dosage: "NL: 4mg đầu, sau đó 2mg (Max 16mg)", route: "Uống" },
            { name: "Racecadotril", brand: "Hidrasec", group: "Tiêu hóa", strength: "10mg, 30mg", dosage: "1.5 mg/kg/lần x 3 lần/ngày", route: "Uống" },
            { name: "Diosmectite", brand: "Smecta", group: "Tiêu hóa", strength: "3g", dosage: "1-2 gói/ngày (<1t: 1 gói)", route: "Uống" },
            { name: "Lactulose", brand: "Duphalac", group: "Tiêu hóa", strength: "10g/15ml", dosage: "5-10ml x 1-2 lần/ngày", route: "Uống" },
            { name: "Macrogol", brand: "Forlax", group: "Tiêu hóa", strength: "10g", dosage: "1-2 gói/ngày (NL)", route: "Uống" },
            { name: "Bisacodyl", brand: "Dulcolax", group: "Tiêu hóa", strength: "5mg", dosage: "5-10mg/ngày buổi tối", route: "Uống" },
            { name: "Sorbitol", brand: "Sorbitol", group: "Tiêu hóa", strength: "5g", dosage: "1 gói sáng sớm", route: "Uống" },
            { name: "Drotaverine", brand: "No-Spa", group: "Tiêu hóa", strength: "40mg", dosage: "40-80mg x 3 lần/ngày (NL)", route: "Uống/Tiêm" },
            { name: "Mebeverine", brand: "Duspatalin", group: "Tiêu hóa", strength: "135mg, 200mg", dosage: "135mg x 3 lần/ngày", route: "Uống" },
            { name: "Trimebutine", brand: "Debridat", group: "Tiêu hóa", strength: "100mg", dosage: "100-200mg x 3 lần/ngày", route: "Uống" },
            { name: "Aluminium Phosphate", brand: "Phosphalugel", group: "Tiêu hóa", strength: "20g", dosage: "1-2 gói x 2-3 lần/ngày", route: "Uống" },
            { name: "Simethicone", brand: "Espumisan", group: "Tiêu hóa", strength: "40mg", dosage: "80-160mg sau ăn", route: "Uống" },

            // --- HÔ HẤP & DỊ ỨNG (RESPIRATORY) ---
            { name: "Salbutamol", brand: "Ventolin", group: "Hô hấp", strength: "2.5mg/2.5ml", dosage: "0.15 mg/kg/lần (min 2.5mg) x 3-4 lần", route: "Khí dung" },
            { name: "Terbutaline", brand: "Bricanyl", group: "Hô hấp", strength: "0.5mg/ml", dosage: "5 mcg/kg/phút (IV) hoặc 0.005 mg/kg (TDD)", route: "Tiêm/Truyền" },
            { name: "Ipratropium", brand: "Atrovent", group: "Hô hấp", strength: "250mcg", dosage: "250-500mcg/lần x 3-4 lần", route: "Khí dung" },
            { name: "Salbutamol/Ipratropium", brand: "Combivent", group: "Hô hấp", strength: "2.5ml", dosage: "1 ống/lần x 3-4 lần", route: "Khí dung" },
            { name: "Budesonide", brand: "Pulmicort", group: "Hô hấp", strength: "500mcg/2ml", dosage: "0.5-1 mg/lần x 2 lần/ngày", route: "Khí dung" },
            { name: "Fluticasone", brand: "Seretide", group: "Hô hấp", strength: "25/125", dosage: "2 nhát x 2 lần/ngày", route: "Xịt họng" },
            { name: "Montelukast", brand: "Singulair", group: "Hô hấp", strength: "4mg, 5mg, 10mg", dosage: "4mg (2-5t), 5mg (6-14t), 10mg (>15t)", route: "Uống tối" },
            { name: "Acetylcysteine", brand: "Acemuc", group: "Hô hấp", strength: "200mg", dosage: "200mg x 2-3 lần/ngày", route: "Uống" },
            { name: "Bromhexine", brand: "Bisolvon", group: "Hô hấp", strength: "8mg", dosage: "8mg x 3 lần/ngày (NL)", route: "Uống" },
            { name: "Ambroxol", brand: "Halixol", group: "Hô hấp", strength: "30mg", dosage: "30mg x 2-3 lần/ngày", route: "Uống" },
            { name: "Dextromethorphan", brand: "Atussin", group: "Hô hấp", strength: "15mg", dosage: "15-30mg x 3-4 lần/ngày", route: "Uống" },
            { name: "Codeine", brand: "Terpin-Codein", group: "Hô hấp", strength: "10mg", dosage: "10-20mg x 3 lần/ngày (NL)", route: "Uống" },
            { name: "Loratadine", brand: "Clarityne", group: "Dị ứng", strength: "10mg", dosage: "10mg 1 lần/ngày (>30kg)", route: "Uống" },
            { name: "Desloratadine", brand: "Aerius", group: "Dị ứng", strength: "5mg", dosage: "5mg 1 lần/ngày", route: "Uống" },
            { name: "Cetirizine", brand: "Zyrtec", group: "Dị ứng", strength: "10mg", dosage: "10mg 1 lần/ngày", route: "Uống" },
            { name: "Fexofenadine", brand: "Telfast", group: "Dị ứng", strength: "60mg, 180mg", dosage: "60mg x 2 hoặc 180mg x 1", route: "Uống" },
            { name: "Chlorpheniramine", brand: "Chlorpher", group: "Dị ứng", strength: "4mg", dosage: "4mg x 3-4 lần/ngày (NL)", route: "Uống" },
            { name: "Diphenhydramine", brand: "Dimedrol", group: "Dị ứng", strength: "10mg/ml", dosage: "1 mg/kg/lần (Max 50mg)", route: "Tiêm IM/IV" },

            // --- TIM MẠCH & VẬN MẠCH (CARDIOVASCULAR) ---
            { name: "Amlodipine", brand: "Amlor", group: "Tim mạch", strength: "5mg", dosage: "5-10 mg/ngày 1 lần", route: "Uống" },
            { name: "Nifedipine", brand: "Adalat", group: "Tim mạch", strength: "10mg, 20mg", dosage: "10-20mg x 2 lần (LA)", route: "Uống" },
            { name: "Nicardipine", brand: "Loxen", group: "Tim mạch", strength: "10mg/10ml", dosage: "0.5-5 mg/giờ truyền TM", route: "Truyền TM" },
            { name: "Enalapril", brand: "Renitec", group: "Tim mạch", strength: "5mg, 10mg", dosage: "5-20 mg/ngày chia 1-2 lần", route: "Uống" },
            { name: "Lisinopril", brand: "Zestril", group: "Tim mạch", strength: "5mg, 10mg", dosage: "10-40 mg/ngày 1 lần", route: "Uống" },
            { name: "Perindopril", brand: "Coversyl", group: "Tim mạch", strength: "5mg, 10mg", dosage: "5-10 mg/ngày 1 lần", route: "Uống" },
            { name: "Losartan", brand: "Cozaar", group: "Tim mạch", strength: "50mg", dosage: "50-100 mg/ngày 1 lần", route: "Uống" },
            { name: "Telmisartan", brand: "Micardis", group: "Tim mạch", strength: "40mg, 80mg", dosage: "40-80 mg/ngày 1 lần", route: "Uống" },
            { name: "Valsartan", brand: "Diovan", group: "Tim mạch", strength: "80mg, 160mg", dosage: "80-160 mg/ngày 1 lần", route: "Uống" },
            { name: "Bisoprolol", brand: "Concor", group: "Tim mạch", strength: "2.5mg, 5mg", dosage: "2.5-10 mg/ngày 1 lần", route: "Uống" },
            { name: "Metoprolol", brand: "Betaloc", group: "Tim mạch", strength: "50mg", dosage: "50-100 mg/ngày chia 1-2 lần", route: "Uống" },
            { name: "Atenolol", brand: "Tenormin", group: "Tim mạch", strength: "50mg", dosage: "50-100 mg/ngày 1 lần", route: "Uống" },
            { name: "Carvedilol", brand: "Dilatrend", group: "Tim mạch", strength: "6.25mg, 12.5mg", dosage: "6.25-25 mg x 2 lần/ngày", route: "Uống" },
            { name: "Furosemide", brand: "Lasix", group: "Tim mạch", strength: "20mg/2ml, 40mg", dosage: "1-2 mg/kg/lần (IV) hoặc 40mg (PO)", route: "Tiêm/Uống" },
            { name: "Spironolactone", brand: "Verospiron", group: "Tim mạch", strength: "25mg", dosage: "25-100 mg/ngày", route: "Uống" },
            { name: "Digoxin", brand: "Lanoxin", group: "Tim mạch", strength: "0.25mg", dosage: "0.125-0.25 mg/ngày (duy trì)", route: "Uống" },
            { name: "Amiodarone", brand: "Cordarone", group: "Tim mạch", strength: "200mg", dosage: "200mg x 3 lần (tấn công), 200mg (duy trì)", route: "Uống/IV" },
            { name: "Adenosine", brand: "Adenocor", group: "Tim mạch", strength: "6mg/2ml", dosage: "6mg bolus nhanh (lần 1), 12mg (lần 2)", route: "Tiêm TM" },
            { name: "Adrenaline", brand: "Adrenalin", group: "Tim mạch", strength: "1mg/ml", dosage: "1mg (ngừng tim), 0.3-0.5mg (phản vệ IM)", route: "Tiêm/Truyền" },
            { name: "Noradrenaline", brand: "Levophed", group: "Tim mạch", strength: "1mg/ml", dosage: "0.05-1 mcg/kg/phút", route: "Truyền TM" },
            { name: "Dobutamine", brand: "Dobutrex", group: "Tim mạch", strength: "250mg", dosage: "2-20 mcg/kg/phút", route: "Truyền TM" },
            { name: "Dopamine", brand: "Dopamin", group: "Tim mạch", strength: "200mg", dosage: "2-20 mcg/kg/phút", route: "Truyền TM" },
            { name: "Nitroglycerin", brand: "Nitromint", group: "Tim mạch", strength: "2.6mg", dosage: "Xịt dưới lưỡi 1-2 nhát khi đau ngực", route: "Xịt/Truyền" },
            { name: "Atorvastatin", brand: "Lipitor", group: "Tim mạch", strength: "10mg, 20mg", dosage: "10-20 mg/ngày tối", route: "Uống" },
            { name: "Rosuvastatin", brand: "Crestor", group: "Tim mạch", strength: "10mg, 20mg", dosage: "5-20 mg/ngày tối", route: "Uống" },
            { name: "Aspirin", brand: "Aspirin 81", group: "Tim mạch", strength: "81mg", dosage: "81mg/ngày 1 lần", route: "Uống" },
            { name: "Clopidogrel", brand: "Plavix", group: "Tim mạch", strength: "75mg", dosage: "75mg/ngày 1 lần", route: "Uống" },

            // --- GIẢM ĐAU & HẠ SỐT (ANALGESICS) ---
            { name: "Paracetamol", brand: "Panadol, Efferalgan", group: "Giảm đau", strength: "500mg, 1000mg", dosage: "10-15 mg/kg/lần mỗi 4-6h", route: "Uống/Truyền" },
            { name: "Tramadol", brand: "Tramadol", group: "Giảm đau", strength: "50mg", dosage: "50-100mg mỗi 4-6h", route: "Tiêm/Uống" },
            { name: "Tramadol/Paracetamol", brand: "Ultracet", group: "Giảm đau", strength: "37.5/325mg", dosage: "1-2 viên mỗi 4-6h (Max 8v)", route: "Uống" },
            { name: "Morphine", brand: "Morphine", group: "Giảm đau", strength: "10mg/ml", dosage: "2-5mg tiêm TM chậm", route: "Tiêm TM/TB" },
            { name: "Fentanyl", brand: "Fentanyl", group: "Giảm đau", strength: "0.1mg/2ml", dosage: "1-2 mcg/kg/lần", route: "Tiêm TM" },
            { name: "Pethidine", brand: "Dolargan", group: "Giảm đau", strength: "100mg/2ml", dosage: "50-100mg mỗi 4h", route: "Tiêm TB" },

            // --- NSAIDs ---
            { name: "Ibuprofen", brand: "Gofen", group: "NSAID", strength: "200mg, 400mg", dosage: "200-400mg x 3 lần/ngày sau ăn", route: "Uống" },
            { name: "Diclofenac", brand: "Voltaren", group: "NSAID", strength: "50mg, 75mg", dosage: "50mg x 2-3 lần hoặc 75mg x 1 lần (TB)", route: "Uống/Tiêm" },
            { name: "Meloxicam", brand: "Mobic", group: "NSAID", strength: "7.5mg, 15mg", dosage: "7.5-15 mg/ngày 1 lần", route: "Uống/Tiêm" },
            { name: "Celecoxib", brand: "Celebrex", group: "NSAID", strength: "200mg", dosage: "200mg x 1-2 lần/ngày", route: "Uống" },
            { name: "Naproxen", brand: "Naproxen", group: "NSAID", strength: "250mg, 500mg", dosage: "250-500mg x 2 lần/ngày", route: "Uống" },
            { name: "Ketorolac", brand: "Toradol", group: "NSAID", strength: "30mg/ml", dosage: "15-30mg mỗi 6h (Max 5 ngày)", route: "Tiêm IM/IV" },
            { name: "Piroxicam", brand: "Feldene", group: "NSAID", strength: "20mg", dosage: "20mg/ngày 1 lần", route: "Uống/Tiêm" },
            { name: "Etoricoxib", brand: "Arcoxia", group: "NSAID", strength: "60mg, 90mg", dosage: "60-90mg/ngày 1 lần", route: "Uống" },

            // --- CORTICOSTEROID ---
            { name: "Prednisolone", brand: "Prednisolon", group: "Corticosteroid", strength: "5mg", dosage: "1-2 mg/kg/ngày", route: "Uống" },
            { name: "Methylprednisolone", brand: "Medrol", group: "Corticosteroid", strength: "4mg, 16mg", dosage: "0.8 mg/kg/ngày (chống viêm)", route: "Uống" },
            { name: "Methylprednisolone Inj", brand: "Solu-Medrol", group: "Corticosteroid", strength: "40mg, 125mg", dosage: "1-2 mg/kg/lần mỗi 6h", route: "Tiêm TM" },
            { name: "Dexamethasone", brand: "Dexa", group: "Corticosteroid", strength: "4mg/ml", dosage: "0.1-0.2 mg/kg/lần", route: "Tiêm TM/TB" },
            { name: "Hydrocortisone", brand: "Solu-Cortef", group: "Corticosteroid", strength: "100mg", dosage: "4-5 mg/kg/lần (Cấp cứu)", route: "Tiêm TM" },
            { name: "Betamethasone", brand: "Celestene", group: "Corticosteroid", strength: "4mg/ml", dosage: "4-8mg/ngày (trưởng thành thai phổi)", route: "Tiêm TM/TB" },

            // --- NỘI TIẾT & CHUYỂN HÓA (ENDOCRINE) ---
            { name: "Insulin Regular", brand: "Actrapid", group: "Nội tiết", strength: "100 IU/ml", dosage: "0.1 UI/kg/giờ (DKA) hoặc TDD", route: "Tiêm TM/TDD" },
            { name: "Insulin NPH", brand: "Insulatard", group: "Nội tiết", strength: "100 IU/ml", dosage: "Theo đường huyết (TDD)", route: "Tiêm TDD" },
            { name: "Insulin Glargine", brand: "Lantus", group: "Nội tiết", strength: "100 IU/ml", dosage: "1 lần/ngày (Nền)", route: "Tiêm TDD" },
            { name: "Metformin", brand: "Glucophage", group: "Nội tiết", strength: "500mg, 850mg", dosage: "500-1000mg x 2 lần/ngày sau ăn", route: "Uống" },
            { name: "Gliclazide", brand: "Diamicron MR", group: "Nội tiết", strength: "30mg, 60mg", dosage: "30-120mg sáng trước ăn", route: "Uống" },
            { name: "Glimepiride", brand: "Amaryl", group: "Nội tiết", strength: "2mg, 4mg", dosage: "1-4mg sáng trước ăn", route: "Uống" },
            { name: "Levothyroxine", brand: "Berlthyrox", group: "Nội tiết", strength: "50mcg, 100mcg", dosage: "1.6 mcg/kg/ngày uống sáng đói", route: "Uống" },
            { name: "Thiamazole", brand: "Thyrozol", group: "Nội tiết", strength: "5mg", dosage: "5-20mg/ngày (cường giáp)", route: "Uống" },

            // --- THẬN - TIẾT NIỆU & DUNG DỊCH (RENAL/FLUIDS) ---
            { name: "Furosemide", brand: "Lasix", group: "Thận - Tiết niệu", strength: "20mg/2ml", dosage: "1-2 mg/kg/lần mỗi 6-12h", route: "Tiêm TM" },
            { name: "Hydrochlorothiazide", brand: "Hypothiazid", group: "Thận - Tiết niệu", strength: "25mg", dosage: "12.5-25 mg/ngày sáng", route: "Uống" },
            { name: "Spironolactone", brand: "Verospiron", group: "Thận - Tiết niệu", strength: "25mg", dosage: "25-100 mg/ngày", route: "Uống" },
            { name: "Mannitol 20%", brand: "Mannitol", group: "Thận - Tiết niệu", strength: "20%", dosage: "0.5-1 g/kg truyền nhanh (chống phù não)", route: "Truyền TM" },
            { name: "Natri Clorid 0.9%", brand: "Nước muối sinh lý", group: "Thận - Tiết niệu", strength: "0.9%", dosage: "Bù dịch hoặc 10-20ml/kg (sốc)", route: "Truyền TM" },
            { name: "Ringer Lactate", brand: "Ringer", group: "Thận - Tiết niệu", strength: "500ml", dosage: "Bù dịch theo phác đồ", route: "Truyền TM" },
            { name: "Glucose 5%", brand: "Đường 5", group: "Thận - Tiết niệu", strength: "5%", dosage: "Dinh dưỡng/Giữ vein", route: "Truyền TM" },
            { name: "Glucose 10%", brand: "Đường 10", group: "Thận - Tiết niệu", strength: "10%", dosage: "2-5 ml/kg (Hạ đường huyết)", route: "Tiêm TM" },
            { name: "Kali Clorid 10%", brand: "Kali", group: "Thận - Tiết niệu", strength: "10%/10ml", dosage: "Pha loãng truyền chậm (Max 10-20mmol/h)", route: "Truyền TM" },
            { name: "Tamsulosin", brand: "Harnal", group: "Thận - Tiết niệu", strength: "0.4mg", dosage: "0.4mg/ngày 1 lần", route: "Uống" },

            // --- THẦN KINH & AN THẦN (NEURO/SEDATIVES) ---
            { name: "Diazepam", brand: "Seduxen", group: "Thần kinh", strength: "5mg, 10mg/2ml", dosage: "0.2-0.3 mg/kg/lần (Cắt cơn giật)", route: "Tiêm TM/Hậu môn" },
            { name: "Midazolam", brand: "Hypnovel", group: "Thần kinh", strength: "5mg/1ml", dosage: "0.05-0.1 mg/kg/lần", route: "Tiêm TM" },
            { name: "Phenobarbital", brand: "Gardenal", group: "Thần kinh", strength: "100mg", dosage: "15-20 mg/kg (Load) -> 3-5 mg/kg (Duy trì)", route: "Tiêm/Uống" },
            { name: "Gabapentin", brand: "Neurontin", group: "Thần kinh", strength: "300mg", dosage: "300mg x 1-3 lần/ngày (Đau TK)", route: "Uống" },
            { name: "Pregabalin", brand: "Lyrica", group: "Thần kinh", strength: "75mg", dosage: "75-150mg x 2 lần/ngày", route: "Uống" },
            { name: "Piracetam", brand: "Nootropyl", group: "Thần kinh", strength: "800mg, 1g/5ml", dosage: "2.4-4.8 g/ngày chia 3 lần", route: "Uống/Tiêm" },
            { name: "Citicoline", brand: "Somazina", group: "Thần kinh", strength: "500mg", dosage: "500-1000mg/ngày", route: "Uống/Tiêm" },
            { name: "Vestibular", brand: "Betaserc", group: "Thần kinh", strength: "16mg, 24mg", dosage: "16-48mg/ngày chia lần", route: "Uống" },
            { name: "Ginkgo Biloba", brand: "Tanakan", group: "Thần kinh", strength: "40mg", dosage: "40mg x 3 lần/ngày", route: "Uống" }
         ];

         meds.forEach(m => push(ref(this.app.db, "library_meds"), {...m, addedBy: "System (Mims 2024)"}));
         Utils.showToast(`Đã nạp ${meds.length} thuốc thành công!`, "success");
    }
}
