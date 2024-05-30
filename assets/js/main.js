const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const heading = $("header h2");
const cdThumd = $(".cd-thumb");
const audio = $("#audio");
console.log(audio);
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");

const app = {
   currentIndex: 0,
   isPlaying: false,
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
   ],
   render: function () {
      const htmls = this.songs.map((item, index) => {
         return `
         <div class="song">
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
      $(".playlist").innerHTML = htmls.join("");
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
            app.isPlaying = false;
            audio.pause();
            player.classList.remove("playing");
         } else {
            app.isPlaying = true;
            audio.play();
            player.classList.add("playing");
         }
      };
   },
   loadCurrentSong: function () {
      heading.textContent = this.currentSong.name;
      cdThumd.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.path;

      // console.log(heading, cdThumd, audio);
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
