// js/music.js
import { CONFIG } from "./config.js";
import { Utils } from "./utils.js";

export class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('bgAudio');
        this.idx = parseInt(localStorage.getItem('mdk_music_idx') || 0);
        this.playlist = CONFIG.playlist;
        this.isPlaying = false;
        this.ambienceAudio = {};

        const savedVol = localStorage.getItem('mdk_music_vol');
        if (savedVol) {
            this.audio.volume = parseFloat(savedVol);
            document.getElementById('volSlider').value = savedVol;
        }

        this.audio.addEventListener('ended', () => this.next());
        this.loadTrack(this.idx);
        this.renderPlaylist();
    }

    loadTrack(i) {
        this.idx = i;
        const track = this.playlist[this.idx];
        this.audio.src = track.u;
        document.getElementById('musicTitle').innerText = track.t;
        document.getElementById('musicArtist').innerText = track.a;
        localStorage.setItem('mdk_music_idx', this.idx);
        this.renderPlaylist(); // Update UI highlight
        
        // Cập nhật trạng thái nút Play/Pause
        if (this.isPlaying) {
             document.getElementById('musicDisc').classList.add('animate-spin-slow');
             document.getElementById('playBtnIcon').innerHTML = '<i class="fa-solid fa-pause text-xl ml-0"></i>';
        } else {
             document.getElementById('musicDisc').classList.remove('animate-spin-slow');
             document.getElementById('playBtnIcon').innerHTML = '<i class="fa-solid fa-play text-xl ml-1"></i>';
        }
    }

    toggle() {
        if (this.audio.paused) {
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    this.isPlaying = true;
                    document.getElementById('musicDisc').classList.add('animate-spin-slow');
                    document.getElementById('playBtnIcon').innerHTML = '<i class="fa-solid fa-pause text-xl ml-0"></i>';
                }).catch(error => {
                    Utils.showToast("Chưa thể phát nhạc tự động. Hãy tương tác!", "error");
                });
            }
        } else {
            this.audio.pause();
            this.isPlaying = false;
            document.getElementById('musicDisc').classList.remove('animate-spin-slow');
            document.getElementById('playBtnIcon').innerHTML = '<i class="fa-solid fa-play text-xl ml-1"></i>';
        }
    }

    next() { this.loadTrack((this.idx + 1) % this.playlist.length); if(this.isPlaying) this.audio.play(); }
    prev() { this.loadTrack((this.idx - 1 + this.playlist.length) % this.playlist.length); if(this.isPlaying) this.audio.play(); }
    
    setVolume(val) {
        this.audio.volume = parseFloat(val);
        localStorage.setItem('mdk_music_vol', val);
    }

    switchTab(tab) {
        document.querySelectorAll('.music-tab').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab-music-${tab}`).classList.add('active');
        document.getElementById('music-view-local').classList.toggle('hidden', tab !== 'local');
        document.getElementById('music-view-online').classList.toggle('hidden', tab !== 'online');
        if (tab === 'online' && !this.audio.paused) {
            this.toggle(); 
        }
    }

    togglePlaylist() { document.getElementById('playlistView').classList.toggle('hidden'); }
    
    renderPlaylist() {
        const list = document.getElementById('playlistItems');
        list.innerHTML = this.playlist.map((s, i) => `
            <div onclick="app.music.select(${i})" class="p-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 transition ${i === this.idx ? 'bg-blue-100 dark:bg-slate-600 font-bold' : ''}">
                <i class="fa-solid fa-music text-blue-500 text-xs"></i>
                <div class="flex-1 min-w-0"><p class="text-sm truncate">${s.t}</p><p class="text-[10px] text-slate-500">${s.a}</p></div>
            </div>`).join('');
    }
    
    select(i) { this.loadTrack(i); this.toggle(); document.getElementById('playlistView').classList.add('hidden'); }

    playCustomVideo() {
        const input = document.getElementById('youtubeInput').value;
        if (!input) return Utils.showToast("Hãy nhập Link hoặc Từ khóa!", "error");

        if (this.isPlaying) {
            this.toggle(); 
            Utils.showToast("Đã tắt nhạc nền để phát Youtube", "info");
        }

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

    toggleAmbience(type, btn) {
        if (this.ambienceAudio[type]) {
            this.ambienceAudio[type].pause();
            delete this.ambienceAudio[type];
            btn.classList.remove('active');
        } else {
            const audio = new Audio(CONFIG.ambience[type]);
            audio.loop = true;
            audio.volume = 0.5;
            audio.preload = 'auto'; 
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Audio error:", error);
                    Utils.showToast("Không thể phát (Lỗi trình duyệt chặn)", "error");
                });
            }
            this.ambienceAudio[type] = audio;
            btn.classList.add('active');
        }
    }
}
