// js/tools.js
import { Utils } from "./utils.js";

export class MedicalTools {
    constructor() {
        this.timer = 25 * 60;
        this.interval = null;
        this.timerRunning = false;
    }

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

    calcBMI() {
        const w = parseFloat(document.getElementById('bmi-w').value);
        const h = parseFloat(document.getElementById('bmi-h').value) / 100;
        if (!w || !h) return Utils.showToast("Nhập đủ cân nặng và chiều cao!", "error");
        const bmi = (w / (h * h)).toFixed(1);
        let text = "";
        if(bmi < 18.5) text = "Gầy"; else if(bmi < 23) text = "Bình thường"; else if(bmi < 25) text = "Tiền béo phì"; else text = "Béo phì";
        const res = document.getElementById('bmi-res');
        res.classList.remove('hidden');
        res.innerHTML = `
            <div class="cursor-pointer hover:opacity-80" onclick="navigator.clipboard.writeText('BMI: ${bmi} (${text})'); app.utils.showToast('Đã copy BMI!')" title="Nhấn để copy">
                BMI: ${bmi} <br><span class="text-sm font-normal text-slate-500">(${text})</span>
                <div class="text-[10px] text-indigo-400 mt-1"><i class="fa-regular fa-copy"></i> Chạm để copy</div>
            </div>`;
    }

    calcMAP() {
        const sys = parseFloat(document.getElementById('map-sys').value);
        const dia = parseFloat(document.getElementById('map-dia').value);
        if (!sys || !dia) return;
        const map = ((sys + 2 * dia) / 3).toFixed(0);
        const res = document.getElementById('map-res');
        res.classList.remove('hidden');
        res.innerHTML = `
            <div class="cursor-pointer hover:opacity-80" onclick="navigator.clipboard.writeText('MAP: ${map} mmHg'); app.utils.showToast('Đã copy MAP!')" title="Nhấn để copy">
                MAP ≈ ${map} mmHg
                <div class="text-[10px] text-red-400 mt-1"><i class="fa-regular fa-copy"></i> Chạm để copy</div>
            </div>`;
    }

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

        const res = document.getElementById('egfr-res');
        res.classList.remove('hidden');
        res.innerHTML = `
            <div class="cursor-pointer hover:opacity-80" onclick="navigator.clipboard.writeText('eGFR: ${egfr} mL/min - ${stage}'); app.utils.showToast('Đã copy eGFR!')" title="Nhấn để copy">
                eGFR ≈ ${egfr} mL/min<br><span class="text-sm text-slate-500 font-bold">${stage}</span>
                <div class="text-[10px] text-orange-400 mt-1"><i class="fa-regular fa-copy"></i> Chạm để copy</div>
            </div>`;
    }
}
