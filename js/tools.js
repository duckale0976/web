// js/tools.js
import { Utils } from "./utils.js";

export class MedicalTools {
    constructor() {
        this.timer = 25 * 60;
        this.interval = null;
        this.timerRunning = false;
    }

    // --- POMODORO TIMER ---
    setTimer(min) {
        this.timer = min * 60;
        this.updateTimerDisplay();
        this.stopTimer();
        document.getElementById('timerBtn').innerText = "Bắt đầu tập trung";
    }

    updateTimerDisplay() {
        const m = String(Math.floor(this.timer / 60)).padStart(2, '0');
        const s = String(this.timer % 60).padStart(2, '0');
        document.getElementById('timerDisplay').innerText = `${m}:${s}`;
    }

    toggleTimer() {
        if (!this.timerRunning) {
            this.interval = setInterval(() => {
                this.timer--;
                this.updateTimerDisplay();
                if (this.timer <= 0) {
                    this.stopTimer();
                    Utils.showToast("🎉 Hoàn thành Pomodoro!", "success");
                    this.setTimer(25);
                }
            }, 1000);
            this.timerRunning = true;
            document.getElementById('timerBtn').innerText = "Đang chạy...";
        } else {
            this.stopTimer();
        }
    }

    stopTimer() { clearInterval(this.interval); this.timerRunning = false; document.getElementById('timerBtn').innerText = "Tiếp tục"; }

    // --- CÔNG CỤ TÍNH TOÁN ---

    // 1. BMI
    calcBMI() {
        const w = parseFloat(document.getElementById('bmi-w').value);
        const h = parseFloat(document.getElementById('bmi-h').value) / 100;
        if (!w || !h) return Utils.showToast("Nhập đủ cân nặng và chiều cao!", "error");
        const bmi = (w / (h * h)).toFixed(1);
        let text = "";
        if(bmi < 18.5) text = "Gầy"; else if(bmi < 23) text = "Bình thường"; else if(bmi < 25) text = "Tiền béo phì"; else text = "Béo phì";
        this.showResult('bmi-res', `BMI: ${bmi}`, text, 'text-indigo-700 dark:text-indigo-300');
    }

    // 2. MAP (Huyết áp trung bình)
    calcMAP() {
        const sys = parseFloat(document.getElementById('map-sys').value);
        const dia = parseFloat(document.getElementById('map-dia').value);
        if (!sys || !dia) return;
        const map = ((sys + 2 * dia) / 3).toFixed(0);
        this.showResult('map-res', `MAP ≈ ${map} mmHg`, '', 'text-red-700 dark:text-red-300');
    }

    // 3. eGFR (Độ lọc cầu thận)
    calcEGFR() {
        const age = parseFloat(document.getElementById('egfr-age').value);
        const w = parseFloat(document.getElementById('egfr-w').value);
        const cre = parseFloat(document.getElementById('egfr-cre').value);
        const sex = parseFloat(document.getElementById('egfr-sex').value);
        if (!age || !w || !cre) return Utils.showToast("Thiếu thông tin!", "error");
        
        const egfr = ((140 - age) * w * sex / (72 * cre)).toFixed(1);
        let stage = "";
        if (egfr >= 90) stage = "G1: Bình thường";
        else if (egfr >= 60) stage = "G2: Giảm nhẹ";
        else if (egfr >= 45) stage = "G3a: Giảm nhẹ-vừa";
        else if (egfr >= 30) stage = "G3b: Giảm vừa-nặng";
        else if (egfr >= 15) stage = "G4: Giảm nặng";
        else stage = "G5: Suy thận";

        this.showResult('egfr-res', `eGFR ≈ ${egfr} mL/min`, stage, 'text-orange-700 dark:text-orange-300');
    }

    // 4. IV DRIP (Tốc độ truyền dịch) - MỚI
    calcIV() {
        const vol = parseFloat(document.getElementById('iv-vol').value); // ml
        const time = parseFloat(document.getElementById('iv-time').value); // giờ
        const factor = parseFloat(document.getElementById('iv-factor').value); // giọt/ml
        
        if (!vol || !time || !factor) return Utils.showToast("Nhập đủ thông tin!", "error");

        // Công thức: (Tổng dịch x Hệ số giọt) / (Số giờ x 60 phút)
        const gtts = Math.round((vol * factor) / (time * 60));
        // Giây cho 1 giọt (để canh đồng hồ)
        const secPerDrop = (60 / gtts).toFixed(1);

        this.showResult('iv-res', `${gtts} giọt/phút`, `Canh: 1 giọt mỗi ${secPerDrop} giây`, 'text-cyan-700 dark:text-cyan-300');
    }

    // 5. GLASGOW (Thang điểm hôn mê) - MỚI
    calcGCS() {
        const e = parseInt(document.getElementById('gcs-e').value);
        const v = parseInt(document.getElementById('gcs-v').value);
        const m = parseInt(document.getElementById('gcs-m').value);
        
        const total = e + v + m;
        let text = "";
        if (total >= 13) text = "Chấn thương sọ não NHẸ";
        else if (total >= 9) text = "Chấn thương sọ não TRUNG BÌNH";
        else text = "Chấn thương sọ não NẶNG (Hôn mê)";

        this.showResult('gcs-res', `GCS: ${total} điểm`, `E${e} V${v} M${m} - ${text}`, 'text-emerald-700 dark:text-emerald-300');
    }

    // 6. CORRECTED CALCIUM (Canxi hiệu chỉnh) - MỚI
    calcCa() {
        const ca = parseFloat(document.getElementById('ca-total').value);
        const alb = parseFloat(document.getElementById('ca-alb').value); // g/L hoặc g/dL
        let albUnit = document.getElementById('ca-alb-unit').value; // 1: g/dL, 10: g/L

        if (!ca || !alb) return Utils.showToast("Nhập đủ Canxi và Albumin!", "error");

        // Chuẩn hóa Albumin về g/dL (nếu nhập g/L thì chia 10)
        const albNorm = albUnit === "10" ? alb / 10 : alb;

        // Công thức: Ca hiệu chỉnh = Ca đo được + 0.8 * (4 - Albumin)
        const caCorr = (ca + 0.8 * (4 - albNorm)).toFixed(2);

        this.showResult('ca-res', `Ca hiệu chỉnh: ${caCorr} mmol/L`, '(Bình thường: 2.1 - 2.6 mmol/L)', 'text-yellow-700 dark:text-yellow-300');
    }

    // Helper: Hiển thị kết quả chung
    showResult(id, title, subtitle, colorClass) {
        const el = document.getElementById(id);
        el.classList.remove('hidden');
        el.innerHTML = `
            <div class="cursor-pointer hover:opacity-80 p-2 bg-white/50 dark:bg-black/20 rounded-lg border border-current" onclick="navigator.clipboard.writeText('${title} - ${subtitle}'); app.utils.showToast('Đã copy!')" title="Nhấn để copy">
                <div class="font-extrabold text-xl ${colorClass}">${title}</div>
                <div class="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">${subtitle}</div>
                <div class="text-[9px] opacity-60 mt-1 uppercase tracking-wider"><i class="fa-regular fa-copy"></i> Chạm copy</div>
            </div>`;
    }
}
