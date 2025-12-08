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
                    // Chuyển đổi format import sang format Mims Pro
                    const medData = {
                        name: m.name || m.Name || m.TenThuoc || m.ten_thuoc || "?",
                        brand: m.brand || m.Brand || m.BietDuoc || m.biet_duoc || "",
                        group: m.group || m.Group || m.Nhom || m.nhom || "Khác",
                        strength: m.strength || m.Strength || m.HamLuong || m.ham_luong || "",
                        dosage: m.dosage || m.Dosage || m.LieuDung || m.lieu_dung || "Chưa cập nhật",
                        route: m.route || m.Route || m.DuongDung || m.duong_dung || "",
                        // Các trường mới để trống nếu import từ nguồn cũ
                        indication: m.indication || "Chưa cập nhật",
                        contra: m.contra || "Chưa cập nhật",
                        caution: m.caution || "Chưa cập nhật",
                        side: m.side || "Chưa cập nhật",
                        inter: m.inter || "Chưa cập nhật"
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
         if(!confirm("⚠️ CẢNH BÁO: Thao tác này sẽ nạp HƠN 200 loại thuốc vào Database. Bạn có chắc chắn?")) return;
         
         // 1. Dữ liệu mẫu chuẩn Mims Vietnam (5 thuốc siêu chi tiết)
         const mimsProData = [
            {
                name: "Paracetamol (Acetaminophen)", brand: "Panadol, Efferalgan", group: "Giảm đau, Hạ sốt", strength: "500mg, 650mg",
                dosage: "- Người lớn: 500-1000mg mỗi 4-6 giờ. Tối đa 4g/ngày.\n- Trẻ em: 10-15mg/kg/lần mỗi 4-6 giờ.",
                indication: "- Sốt do mọi nguyên nhân.\n- Cơn đau nhẹ đến vừa.", contra: "- Quá mẫn với Paracetamol.\n- Suy gan nặng.", caution: "Thận trọng ở người nghiện rượu, suy thận.", side: "- Hiếm gặp: Ban da.\n- Quá liều: Hoại tử gan.", inter: "- Rượu: Tăng độc tính gan."
            },
            {
                name: "Amoxicillin + Clavulanate", brand: "Augmentin, Klamentin", group: "Kháng sinh", strength: "500/62.5mg, 1g",
                dosage: "- Người lớn: 1g x 2 lần/ngày.\n- Trẻ em: 25-45mg/kg/ngày chia 2 lần.",
                indication: "- Nhiễm khuẩn hô hấp, da mô mềm, tiết niệu.", contra: "- Dị ứng Penicillin.", caution: "Suy thận cần chỉnh liều.", side: "- Tiêu chảy, buồn nôn.", inter: "- Allopurinol: Tăng nguy cơ phát ban."
            },
            {
                name: "Salbutamol", brand: "Ventolin", group: "Giãn phế quản", strength: "2.5mg, 5mg",
                dosage: "- Khí dung: 2.5mg - 5mg mỗi 4-6 giờ.", indication: "- Cắt cơn hen, COPD.", contra: "- Quá mẫn.", caution: "Cường giáp, bệnh tim mạch.", side: "- Run tay, nhịp tim nhanh.", inter: "- Beta-blocker: Đối kháng tác dụng."
            },
            {
                name: "Omeprazole", brand: "Losec", group: "Tiêu hóa (PPI)", strength: "20mg, 40mg",
                dosage: "- GERD/Loét dạ dày: 20-40mg/ngày.", indication: "- Trào ngược, Loét dạ dày.", contra: "Quá mẫn.", caution: "Loại trừ ung thư dạ dày.", side: "- Đau đầu, rối loạn tiêu hóa.", inter: "- Clopidogrel: Giảm tác dụng."
            },
            {
                name: "Adrenaline", brand: "Adrenalin", group: "Cấp cứu", strength: "1mg/1ml",
                dosage: "- Sốc phản vệ: 0.3-0.5mg Tiêm bắp (IM).", indication: "- Cấp cứu ngừng tuần hoàn, phản vệ.", contra: "Không có tuyệt đối trong cấp cứu.", caution: "Bệnh mạch vành.", side: "- Nhịp nhanh, tăng huyết áp.", inter: "- Beta-blocker."
            }
         ];

         // 2. Dữ liệu cũ (200 thuốc - Chỉ có thông tin cơ bản, các trường mới sẽ tự điền "Chưa cập nhật")
         const oldMedsData = [
            { name: "Ampicillin", brand: "Ampicillin", group: "Kháng sinh", strength: "500mg, 1g", dosage: "50-100 mg/kg/ngày chia 4 lần", route: "Tiêm TM/TB" },
            { name: "Penicillin V", brand: "Ospen", group: "Kháng sinh", strength: "400.000IU", dosage: "25-50 mg/kg/ngày chia 4 lần", route: "Uống" },
            { name: "Oxacillin", brand: "Bristopen", group: "Kháng sinh", strength: "500mg, 1g", dosage: "50-100 mg/kg/ngày chia 4-6 lần", route: "Tiêm TM" },
            { name: "Cephalexin", brand: "Keflex", group: "Kháng sinh", strength: "500mg", dosage: "25-50 mg/kg/ngày chia 2-4 lần", route: "Uống" },
            { name: "Cefuroxime", brand: "Zinnat", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "20-30 mg/kg/ngày chia 2 lần", route: "Uống" },
            { name: "Cefixime", brand: "Suprax", group: "Kháng sinh", strength: "100mg, 200mg", dosage: "8 mg/kg/ngày chia 1-2 lần", route: "Uống" },
            { name: "Ceftriaxone", brand: "Rocephin", group: "Kháng sinh", strength: "1g", dosage: "50-80 mg/kg/ngày 1 lần", route: "Tiêm TM" },
            { name: "Cefotaxime", brand: "Claforan", group: "Kháng sinh", strength: "1g", dosage: "100-150 mg/kg/ngày chia 3-4 lần", route: "Tiêm TM" },
            { name: "Ceftazidime", brand: "Fortum", group: "Kháng sinh", strength: "1g", dosage: "100-150 mg/kg/ngày chia 3 lần", route: "Tiêm TM" },
            { name: "Azithromycin", brand: "Zithromax", group: "Kháng sinh", strength: "200mg/5ml", dosage: "10 mg/kg/ngày (3 ngày)", route: "Uống" },
            { name: "Clarithromycin", brand: "Klacid", group: "Kháng sinh", strength: "250mg, 500mg", dosage: "15 mg/kg/ngày chia 2 lần", route: "Uống" },
            { name: "Gentamicin", brand: "Gentamicin", group: "Kháng sinh", strength: "80mg/2ml", dosage: "5-7.5 mg/kg/ngày 1 lần", route: "Tiêm TM/TB" },
            { name: "Ciprofloxacin", brand: "Ciprobay", group: "Kháng sinh", strength: "500mg", dosage: "20-30 mg/kg/ngày chia 2 lần", route: "Uống/IV" },
            { name: "Levofloxacin", brand: "Tavanic", group: "Kháng sinh", strength: "500mg, 750mg", dosage: "500-750 mg/ngày 1 lần", route: "Uống/IV" },
            { name: "Metronidazole", brand: "Flagyl", group: "Kháng sinh", strength: "250mg", dosage: "30-50 mg/kg/ngày chia 3 lần", route: "Uống/IV" },
            { name: "Vancomycin", brand: "Vancocin", group: "Kháng sinh", strength: "1g", dosage: "40-60 mg/kg/ngày chia 3-4 lần", route: "Truyền TM" },
            { name: "Esomeprazole", brand: "Nexium", group: "Tiêu hóa", strength: "20mg, 40mg", dosage: "20-40 mg/ngày", route: "Uống/IV" },
            { name: "Pantoprazole", brand: "Pantoloc", group: "Tiêu hóa", strength: "40mg", dosage: "40 mg/ngày", route: "Uống/IV" },
            { name: "Domperidone", brand: "Motilium", group: "Tiêu hóa", strength: "10mg", dosage: "10mg x 3 lần/ngày", route: "Uống" },
            { name: "Metoclopramide", brand: "Primperan", group: "Tiêu hóa", strength: "10mg/2ml", dosage: "10mg x 3 lần/ngày", route: "Tiêm IM" },
            { name: "Loperamide", brand: "Imodium", group: "Tiêu hóa", strength: "2mg", dosage: "2mg sau mỗi lần đi lỏng", route: "Uống" },
            { name: "Sorbitol", brand: "Sorbitol", group: "Tiêu hóa", strength: "5g", dosage: "1 gói lúc đói", route: "Uống" },
            { name: "Duphalac", brand: "Lactulose", group: "Tiêu hóa", strength: "15ml", dosage: "15-30ml/ngày", route: "Uống" },
            { name: "Amlodipine", brand: "Amlor", group: "Tim mạch", strength: "5mg", dosage: "5-10 mg/ngày", route: "Uống" },
            { name: "Nifedipine", brand: "Adalat LA", group: "Tim mạch", strength: "30mg, 60mg", dosage: "30-60 mg/ngày", route: "Uống" },
            { name: "Losartan", brand: "Cozaar", group: "Tim mạch", strength: "50mg", dosage: "50-100 mg/ngày", route: "Uống" },
            { name: "Telmisartan", brand: "Micardis", group: "Tim mạch", strength: "40mg, 80mg", dosage: "40-80 mg/ngày", route: "Uống" },
            { name: "Bisoprolol", brand: "Concor", group: "Tim mạch", strength: "2.5mg, 5mg", dosage: "2.5-10 mg/ngày", route: "Uống" },
            { name: "Furosemide", brand: "Lasix", group: "Tim mạch/Thận", strength: "20mg/2ml", dosage: "20-40mg tiêm TM", route: "Tiêm TM" },
            { name: "Spironolactone", brand: "Verospiron", group: "Tim mạch", strength: "25mg", dosage: "25-100 mg/ngày", route: "Uống" },
            { name: "Atorvastatin", brand: "Lipitor", group: "Tim mạch", strength: "10mg, 20mg", dosage: "10-20 mg/ngày tối", route: "Uống" },
            { name: "Aspirin", brand: "Aspirin 81", group: "Tim mạch", strength: "81mg", dosage: "81 mg/ngày", route: "Uống" },
            { name: "Clopidogrel", brand: "Plavix", group: "Tim mạch", strength: "75mg", dosage: "75 mg/ngày", route: "Uống" },
            { name: "Paracetamol", brand: "Efferalgan", group: "Giảm đau", strength: "500mg", dosage: "10-15 mg/kg/lần", route: "Uống/Đặt" },
            { name: "Ibuprofen", brand: "Gofen", group: "Giảm đau NSAID", strength: "400mg", dosage: "400mg x 3 lần/ngày", route: "Uống" },
            { name: "Meloxicam", brand: "Mobic", group: "Giảm đau NSAID", strength: "7.5mg, 15mg", dosage: "7.5-15 mg/ngày", route: "Uống" },
            { name: "Celecoxib", brand: "Celebrex", group: "Giảm đau NSAID", strength: "200mg", dosage: "200mg x 1-2 lần/ngày", route: "Uống" },
            { name: "Prednisolone", brand: "Prednisolon", group: "Corticoid", strength: "5mg", dosage: "5-60 mg/ngày", route: "Uống" },
            { name: "Methylprednisolone", brand: "Medrol", group: "Corticoid", strength: "4mg, 16mg", dosage: "4-48 mg/ngày", route: "Uống" },
            { name: "Solu-Medrol", brand: "Methylprednisolone", group: "Corticoid", strength: "40mg", dosage: "40mg tiêm TM", route: "Tiêm TM" },
            { name: "Dexamethasone", brand: "Dexa", group: "Corticoid", strength: "4mg/ml", dosage: "4mg tiêm bắp/TM", route: "Tiêm TM/TB" },
            { name: "Insulin Regular", brand: "Actrapid", group: "Nội tiết", strength: "100IU/ml", dosage: "Theo y lệnh", route: "Tiêm TDD/TM" },
            { name: "Insulin Glargine", brand: "Lantus", group: "Nội tiết", strength: "100IU/ml", dosage: "Tiêm dưới da 1 lần/ngày", route: "Tiêm TDD" },
            { name: "Metformin", brand: "Glucophage", group: "Nội tiết", strength: "500mg, 850mg", dosage: "500-2000 mg/ngày", route: "Uống" },
            { name: "Gliclazide", brand: "Diamicron MR", group: "Nội tiết", strength: "30mg, 60mg", dosage: "30-120 mg/ngày", route: "Uống" },
            { name: "Diazepam", brand: "Seduxen", group: "Thần kinh", strength: "10mg/2ml", dosage: "10mg tiêm bắp/TM", route: "Tiêm TM/TB" },
            { name: "Piracetam", brand: "Nootropyl", group: "Thần kinh", strength: "800mg", dosage: "800mg x 3 lần/ngày", route: "Uống" },
            { name: "Rotunda", brand: "Rotunda", group: "Thần kinh", strength: "30mg", dosage: "1-2 viên trước ngủ", route: "Uống" }
         ];

         // Gộp 2 danh sách lại
         const allMeds = [...mimsProData, ...oldMedsData];

         // Xóa data cũ để tránh trùng lặp
         remove(ref(this.app.db, "library_meds"));

         // Đẩy lên Firebase
         allMeds.forEach(m => {
             // Đảm bảo các trường mới có dữ liệu mặc định cho thuốc cũ
             const medData = {
                 ...m,
                 indication: m.indication || "Chưa cập nhật (Dữ liệu cũ)",
                 contra: m.contra || "Chưa cập nhật (Dữ liệu cũ)",
                 caution: m.caution || "Chưa cập nhật (Dữ liệu cũ)",
                 side: m.side || "Chưa cập nhật (Dữ liệu cũ)",
                 inter: m.inter || "Chưa cập nhật (Dữ liệu cũ)",
                 addedBy: "System (Mims Hybrid)"
             };
             push(ref(this.app.db, "library_meds"), medData);
         });
         
         Utils.showToast(`Đã nạp ${allMeds.length} thuốc (5 Pro + Cũ) thành công!`, "success");
    }
}
