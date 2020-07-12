const app = new Vue({
  el: "#app",
  data: {
    timeUp: true,
    scoreBoard: false,
    reloading: false,
    monster: [],
    monsterStatus: [],
    bullet: [],
    Aim: [],
    aimStatus: [],
    score: 0,
    countdown: 3,
    bulletQty: 12,
    bulletNum: 12,
    vol: 0.5,
    topScore: JSON.parse(localStorage.getItem("topScore")) || 0,
    point: JSON.parse(localStorage.getItem("point")) || 0,
  },
  methods: {
    startGame() {
      this.timeUp = false;
      this.$refs.bgMusic.currentTime = 0;
      this.$refs.bgMusic.play();
      this.reset();
      this.countDown(3);
    },
    countDown(num) {
      this.countdown = num;
      if (num === 0) return this.monsterOut();
      setTimeout(() => {
        num -= 1;
        this.countDown(num);
      }, 1000);
    },
    monsterOut() {
      const showMt = window.setInterval(() => {
        this.showMonster();
      }, 450);
      setTimeout(() => {
        window.clearInterval(showMt);
        this.endGame();
      }, 12000);
    },
    showMonster() {
      const monsterNum = Math.floor(Math.random() * this.monster.length);
      const time = Math.random() * (3000 - 1200) + 1200;
      const rl = Math.random();
      rl > 0.5
        ? (this.monster[monsterNum].style.transform = "translateX(100px)")
        : (this.monster[monsterNum].style.transform = "translateX(-100px)");
      if (this.monsterStatus[monsterNum]) return this.showMonster();
      this.monsterStatus[monsterNum] = true;
      setTimeout(() => {
        this.monsterStatus[monsterNum] = false;
        this.monster[monsterNum].style.transform = "translateX(0)";
      }, time);
    },
    endGame() {
      setTimeout(() => {
        if (this.score > this.topScore) {
          localStorage.setItem("topScore", JSON.stringify(this.score));
          this.topScore = JSON.parse(localStorage.getItem("topScore"));
        }
        this.$refs.bgMusic.pause();
        this.timeUp = true;
        this.scoreBoard = true;
      }, 3000);
    },
    restart() {
      this.scoreBoard = false;
      this.startGame();
    },
    home() {
      this.timeUp = true;
      this.scoreBoard = false;
    },
    reset() {
      this.bulletNum = this.bulletQty;
      this.bullet.forEach((num) => (num.style.opacity = "1"));
      this.setScore(0);
    },
    clickHandler(num) {
      if (!this.monsterStatus[num] || this.reloading) return;
      this.monsterStatus[num] = false;
      this.monster[num].style.transform = "translateX(0)";
      this.setScore(this.score + 10);
      this.setPoint(this.point + 1);
    },
    shooting() {
      if (this.reloading) return;
      this.bulletNum -= 1;
      this.bullet[this.bulletNum].style.opacity = "0.3";
      this.$refs.gun.currentTime = 0;
      this.$refs.gun.play();
      if (this.bulletNum === 0) {
        this.reload();
      }
    },
    reload() {
      this.reloading = true;
      this.$refs.reloadAudio.currentTime = 0;
      this.$refs.reloadAudio.play();
      setTimeout(() => {
        this.bulletNum = this.bulletQty;
        this.bullet.forEach((num) => (num.style.opacity = "1"));
        this.reloading = false;
      }, 1000);
    },
    setScore(s) {
      this.score = s;
    },
    setPoint(p) {
      this.point = p;
      localStorage.setItem("point", JSON.stringify(this.point));
      this.point = JSON.parse(localStorage.getItem("point"));
    },
    buyAim(num, price) {
      if (this.point < price) return;
      this.setPoint(this.point - price);
      this.aimStatus[num] = true;
      this.$refs.checkout.currentTime = 0;
      this.$refs.checkout.play();
    },
    chooseAim(num) {
      this.$refs.mouse.style.backgroundImage = `url(img/aim${num}.png)`;
      this.bulletQty = 12 + num * 2;
      this.reload();
    },
    minus() {
      this.vol -= 0.1;
      if (this.vol < 0) this.vol = 0;
      this.$refs.gun.volume = this.vol;
      this.$refs.reloadAudio.volume = this.vol;
      this.$refs.bgMusic.volume = this.vol;
      this.$refs.checkout.volume = this.vol;
    },
    plus() {
      this.vol += 0.1;
      if (this.vol > 1) this.vol = 1;
      this.$refs.gun.volume = this.vol;
      this.$refs.reloadAudio.volume = this.vol;
      this.$refs.bgMusic.volume = this.vol;
      this.$refs.checkout.volume = this.vol;
    },
    setObj() {
      this.monster = [...document.querySelectorAll(".monster")];
      this.monsterStatus = this.monster.reduce((prev, current, index) => {
        prev[index] = false;
        return prev;
      }, {});
      this.bullet = [...document.querySelectorAll(".bullet li")];
      this.Aim = [...document.querySelectorAll(".chooseAim")];
      this.aimStatus = this.Aim.reduce((prev, current, index) => {
        prev[index] = false;
        prev[0] = true;
        return prev;
      }, {});
    },
    mouseMove(e) {
      const aimX = e.pageX - 40;
      const aimY = e.pageY - 40;
      this.$refs.mouse.style.left = aimX + "px";
      this.$refs.mouse.style.top = aimY + "px";
      this.$refs.mouse.style.display = "block";
    },
    mouseLeave() {
      this.$refs.mouse.style.display = "none";
    },
    storageLock() {
      window.addEventListener("storage", function (e) {
        localStorage.setItem(e.key, e.oldValue);
      });
    },
  },
  mounted() {
    this.setObj();
    this.storageLock();
  },
  updated() {
    this.bullet = [...document.querySelectorAll(".bullet li")];
  },
});
