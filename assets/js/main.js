const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const heading = $("header h2");
const cdThumd = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const ramdomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
// console.log(ramdomBtn);

const app = {
   currentIndex: 0,
   isPlaying: false,
   isRamdom: false,
   isRepeat: false,
   songs: [
      {
         name: "Chay ngay di",
         singer: "Son tung mtp",
         path: "../../assets/music/ChayNgayDi-SonTungMTP-5468704.mp3",
         image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
      },
      {
         name: "Chung ta cua tuong lai",
         singer: "Son tung mtp",
         path: "../../assets/music/ChungTaCuaTuongLai-SonTungMTP-14032595.mp3",
         image: "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg",
      },
      {
         name: "Nơi này có anh",
         singer: "Son tung mtp",
         path: "../../assets/music/NoiNayCoAnh-SonTungMTP-4772041.mp3",
         image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
      },
      {
         name: "Chac ai do se ve",
         singer: "Son tung mtp",
         path: "../../assets/music/ChacAiDoSeVeNewVersion-SonTungMTP-3698905.mp3",
         image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
      },
      {
         name: "Hay trao cho anh",
         singer: "Son tung mtp",
         path: "../../assets/music/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3",
         image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
      },
   ],
   render: function () {
      const htmls = this.songs.map((item, index) => {
         return `
         <div class="song ${
            index === this.currentIndex ? "active" : ""
         }" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${item.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${item.name}</h3>
                    <p class="author">${item.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
         `;
      });
      playlist.innerHTML = htmls.join("");
   },
   defineProperties: function () {
      Object.defineProperty(this, "currentSong", {
         get: function () {
            return this.songs[this.currentIndex];
         },
      });
   },
   handleEvents: function () {
      const cdWidth = cd.offsetWidth;
      const _this = this;

      // Xử lý cd quay và dừng
      const cdThumdAnimate = cdThumd.animate(
         [{ transform: "rotate(360deg)" }],
         {
            duration: 10000,
            iterations: Infinity,
         }
      );
      cdThumdAnimate.pause();

      // Xử lý phóng to thu nhỏ
      document.onscroll = function () {
         const scrollTop = window.scrollY || document.documentElement.scrollTop;
         const newWidth = cdWidth - scrollTop;
         cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
         cd.style.opacity = newWidth / cdWidth;
      };

      // Xử lý khi click vào playlist
      playBtn.onclick = () => {
         if (app.isPlaying) {
            audio.pause();
         } else {
            audio.play();
         }
      };

      // Khi Song được play
      audio.onplay = function () {
         app.isPlaying = true;
         player.classList.add("playing");
         cdThumdAnimate.play();
      };

      // khi song bị pause
      audio.onpause = function () {
         app.isPlaying = false;
         player.classList.remove("playing");
         cdThumdAnimate.pause();
      };

      // Khi tiến độ bài hát thay đổi
      audio.ontimeupdate = function () {
         if (audio.duration) {
            const progressPercent = Math.floor(
               (audio.currentTime / audio.duration) * 100
            );
            progress.value = progressPercent;
         }
      };

      // Xử lý khi tua Song
      progress.oninput = function (e) {
         const seekTime = (audio.duration * e.target.value) / 100;
         audio.currentTime = seekTime;
      };

      // Xử lý khi click vào next
      nextBtn.onclick = () => {
         if (_this.isRamdom) {
            _this.ramdomSong();
         } else {
            app.nextSong();
         }
         audio.play();
         _this.render();
         _this.srollToActiveSong();
      };

      // Xử lý khi click vào prev
      prevBtn.onclick = () => {
         if (_this.isRamdom) {
            _this.ramdomSong();
         } else {
            app.prevSong();
         }
         audio.play();
         _this.render();
      };

      // Xử lý khi bật/tắt vào random
      ramdomBtn.onclick = () => {
         _this.isRamdom = !_this.isRamdom;
         ramdomBtn.classList.toggle("active", _this.isRamdom);
      };

      // Xử lý next song khi audio ended
      audio.onended = () => {
         if (_this.isRepeat) {
            audio.play();
         } else {
            nextBtn.click();
         }
      };

      // Xử lý khi click vào repeat
      repeatBtn.onclick = () => {
         _this.isRepeat = !_this.isRepeat;
         repeatBtn.classList.toggle("active", _this.isRepeat);
      };

      // Lắng nghe hành vi click vào playlist
      playlist.onclick = (e) => {
         const songNode = e.target.closest(".song:not(.active)");
         if (songNode || e.target.closest(".option")) {
            // Xử lý khi click vào song
            if (songNode) {
               _this.currentIndex = Number(songNode.dataset.index);
               _this.loadCurrentSong();
               audio.play();
               _this.render();
            }
            // Xử lý khi click vào song option
            if (e.target.closest(".option")) {
            }
         }
      };
   },
   loadCurrentSong: function () {
      heading.textContent = this.currentSong.name;
      cdThumd.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.path;
   },
   nextSong: function () {
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length) {
         this.currentIndex = 0;
      }
      this.loadCurrentSong();
   },
   prevSong: function () {
      this.currentIndex--;
      if (this.currentIndex < 0) {
         this.currentIndex = this.songs.length - 1;
      }
      this.loadCurrentSong();
   },
   ramdomSong: function () {
      let newIndex;
      do {
         newIndex = Math.floor(Math.random() * this.songs.length);
      } while (newIndex === this.currentIndex);
      this.currentIndex = newIndex;
      this.loadCurrentSong();
   },
   srollToActiveSong: function () {
      setTimeout(() => {
         $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "nearest",
         });
      }, 500);
   },

   start: function () {
      // Định nghĩa thuộc tính cho object
      this.defineProperties();
      // Tải thông tin bài hát đầu tiên vào UI khi đang chạy ứng dụng
      this.loadCurrentSong();
      // Lắng nghe/ xử lý các sự kiện (Dom events)
      this.handleEvents();
      //Render playlist
      this.render();
   },
};

app.start();
