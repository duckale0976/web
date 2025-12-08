// js/music.js
import { CONFIG } from "./config.js";
import { Utils } from "./utils.js";

export class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('bgAudio');
        this.idx = parseInt(localStorage.getItem('mdk_music_idx') || 0);
        this.playlist = CONFIG.playlist;
        this.isPlaying = false;
        this.isShuffle = false;
        this.repeatMode = 0; // 0: None, 1: One, 2: All
        this.ambienceAudio = {};

        // DOM Elements
        this.progressBar = document.getElementById('progressBar');
        this.currTime = document.getElementById('currentTime');
        this.totalDur = document.getElementById('duration');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');

        const savedVol = localStorage.getItem('mdk_music_vol');
        if (savedVol) {
            this.audio.volume = parseFloat(savedVol);
            document.getElementById('volSlider').value = savedVol;
        }

        this.initEvents();
        this.loadTrack(this.idx);
        this.renderPlaylist();
    }

    initEvents() {
        // Auto next khi hết bài
        this.audio.addEventListener('ended', () => {
            if (this.repeatMode === 1) {
                this.audio.play(); // Lặp lại bài hiện tại
            } else {
                this.next();
            }
        });

        // Cập nhật thanh thời gian
        this.audio.addEventListener('timeupdate', () => {
            if (this.audio.duration) {
                const progress = (this.audio.currentTime / this.audio.duration) * 100;
                this.progressBar.value = progress;
                this.currTime.innerText = this.formatTime(this.audio.currentTime);
                this.totalDur.innerText = this.formatTime(this.audio.duration);
            }
        });

        // Xử lý khi kéo thanh tua
        this.progressBar.addEventListener('input', () => {
            const seekTime = (this.audio.duration / 100) * this.progressBar.value;
            this.audio.currentTime = seekTime;
        });
    }

    formatTime(seconds) {
        if (!seconds) return "00:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
    }

    loadTrack(i) {
        this.idx = i;
        const track = this.playlist[this.idx];
        this.audio.src = track.u;
        document.getElementById('musicTitle').innerText = track.t;
        document.getElementById('musicArtist').innerText = track.a;
        localStorage.setItem('mdk_music_idx', this.idx);
        
        this.renderPlaylist();
        this.updatePlayState();
    }

    updatePlayState() {
        const disc = document.getElementById('musicDisc');
        const btn = document.getElementById('playBtnIcon');
        const visualizer = document.getElementById('musicVisualizer');

        if (this.isPlaying) {
             disc.classList.add('animate-spin-slow');
             visualizer.classList.remove('paused');
             btn.innerHTML = '<i class="fa-solid fa-pause text-xl ml-0"></i>';
        } else {
             disc.classList.remove('animate-spin-slow');
             visualizer.classList.add('paused');
             btn.innerHTML = '<i class="fa-solid fa-play text-xl ml-1"></i>';
        }
    }

    toggle() {
        if (this.audio.paused) {
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    this.isPlaying = true;
                    this.updatePlayState();
                }).catch(error => {
                    Utils.showToast("Lỗi phát nhạc: " + error.message, "error");
                });
            }
        } else {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayState();
        }
    }

    next() {
        if (this.isShuffle) {
            let randomIdx;
            do {
                randomIdx = Math.floor(Math.random() * this.playlist.length);
            } while (randomIdx === this.idx);
            this.idx = randomIdx;
        } else {
            this.idx = (this.idx + 1) % this.playlist.length;
        }
        this.loadTrack(this.idx);
        if(this.isPlaying) this.audio.play();
    }

    prev() {
        this.idx = (this.idx - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.idx);
        if(this.isPlaying) this.audio.play();
    }
    
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle('active', this.isShuffle);
        Utils.showToast(this.isShuffle ? "🔀 Đã bật trộn bài" : "Đã tắt trộn bài");
    }

    toggleRepeat() {
        // 0: None -> 1: One -> 2: All -> 0
        this.repeatMode = (this.repeatMode + 1) % 3;
        const icons = ['fa-repeat', 'fa-1', 'fa-repeat']; // Icon logic
        
        this.repeatBtn.innerHTML = `<i class="fa-solid ${this.repeatMode === 1 ? 'fa-1' : 'fa-repeat'}"></i>`;
        
        if (this.repeatMode === 0) {
            this.repeatBtn.classList.remove('active');
            Utils.showToast("Không lặp lại");
        } else if (this.repeatMode === 1) {
            this.repeatBtn.classList.add('active');
            Utils.showToast("🔂 Lặp lại 1 bài");
        } else {
            this.repeatBtn.classList.add('active');
            Utils.showToast("🔁 Lặp lại danh sách");
        }
    }

    setVolume(val) {
        this.audio.volume = parseFloat(val);
        localStorage.setItem('mdk_music_vol', val);
    }

    switchTab(tab) {
        document.querySelectorAll('.music-tab').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab-music-${tab}`).classList.add('active');
        document.getElementById('music-view-local').classList.toggle('hidden', tab !== 'local');
        document.getElementById('music-view-online').classList.toggle('hidden', tab !== 'online');
        if (tab === 'online' && !this.audio.paused) this.toggle();
    }

    togglePlaylist() { document.getElementById('playlistView').classList.toggle('hidden'); }
    
    renderPlaylist() {
        const list = document.getElementById('playlistItems');
        list.innerHTML = this.playlist.map((s, i) => `
            <div onclick="app.music.select(${i})" class="p-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 transition ${i === this.idx ? 'bg-blue-100 dark:bg-slate-600 font-bold' : ''}">
                <div class="text-[10px] font-bold text-slate-400 w-4">${i + 1}</div>
                <div class="flex-1 min-w-0"><p class="text-sm truncate">${s.t}</p><p class="text-[10px] text-slate-500">${s.a}</p></div>
                ${i === this.idx ? '<i class="fa-solid fa-chart-simple text-blue-500 animate-pulse"></i>' : ''}
            </div>`).join('');
    }
    
    select(i) { this.loadTrack(i); this.toggle(); document.getElementById('playlistView').classList.add('hidden'); }

    playCustomVideo() { /* Giữ nguyên code cũ */
        const input = document.getElementById('youtubeInput').value;
        if (!input) return Utils.showToast("Hãy nhập Link hoặc Từ khóa!", "error");
        if (this.isPlaying) { this.toggle(); Utils.showToast("Đã tắt nhạc nền để phát Youtube", "info"); }
        let videoId = "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = input.match(regExp);
        if (match && match[2].length === 11) {
            videoId = match[2];
            document.getElementById('radioFrame').src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        } else {
            document.getElementById('radioFrame').src = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(input)}&autoplay=1`;
        }
    }

    toggleAmbience(type, btn) { /* Giữ nguyên code cũ */
        if (this.ambienceAudio[type]) {
            this.ambienceAudio[type].pause();
            delete this.ambienceAudio[type];
            btn.classList.remove('active');
        } else {
            const audio = new Audio(CONFIG.ambience[type]);
            audio.loop = true; audio.volume = 0.5; audio.preload = 'auto'; 
            const playPromise = audio.play();
            if (playPromise !== undefined) playPromise.catch(e => console.error(e));
            this.ambienceAudio[type] = audio;
            btn.classList.add('active');
        }
    }
}
