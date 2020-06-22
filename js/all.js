let topscore = JSON.parse(localStorage.getItem("topscore")) || 0;
let getpoint = JSON.parse(localStorage.getItem("point")) || 0;

let bulletLi = "";
for (let i = 0; i < 10; i++) {
  bulletLi += '<li><img src="./img/bullet.png" alt=""></li>';
}
document.querySelector(".bullet").innerHTML = bulletLi;

let batDiv = "";
for (let i = 0; i < 15; i++) {
  batDiv += '<div class="site">\
    <div class="monster"></div>\
    </div>';
}
document.querySelector(".bat").innerHTML = batDiv;


const startBtn = document.querySelector(".gamestart");
const againBtn = document.querySelector(".again");
const homeBtn = document.querySelector(".home");
const beforegame = document.querySelector(".beforegame");
const aftergame = document.querySelector(".aftergame");
const inthegame = document.querySelector(".inthegame");
const bgMusic = document.querySelector(".bgmusic");
const bestScore = document.querySelector(".bestScore");
const endscore = document.querySelector(".endscore");
const endbestScore = document.querySelector(".endbestScore");
const point = document.querySelector(".point");

const gameMonster = [...document.querySelectorAll(".monster")];
const status = gameMonster.reduce((prev, current, index) => {
  prev[index] = false;
  return prev;
}, {});
let score = 0;
let timeUp = true;

const gameMonsterProxy = new Proxy(status, {
  get(target, key) {
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;
    gameMonster[key].removeEventListener("click", clickHandler);
    if (value) {
      gameMonster[key].addEventListener("click", clickHandler);
      gameMonster[key].classList.add("fadein");
    } else {
      gameMonster[key].classList.remove("fadein");
    }
  },
});

bestScore.textContent = topscore;


function initial() {
//   bestScore.textContent = JSON.parse(localStorage.getItem("topscore")) || 0;
  setScore(0);
  bulletQty = 10;
  bullet.forEach((num) => (num.style.opacity = "1"));
  // gameMonster.forEach((num) =>{
  //     num.style.transform="translate(0)"
  //     // num = false;
  // });
  countdown.style.display = "block";
}
function endgame() {
  setBuyAim();
  bgMusic.pause();
  if (score > topscore) {
    localStorage.setItem("topscore", JSON.stringify(score));
  }
  endscore.textContent = score;
  bestScore.textContent = JSON.parse(localStorage.getItem("topscore")) || 0;
  endbestScore.textContent = JSON.parse(localStorage.getItem("topscore"));
  inthegame.style.display = "none";
  aftergame.style.display = "block";
}

function clickHandler() {
  if (gameMonsterProxy[gameMonster.indexOf(this)]) {
    setScore(score + 10);
    setPoint(1);
    gameMonsterProxy[gameMonster.indexOf(this)] = false;
  }
}
startBtn.addEventListener("click", startGame);
function startGame() {
  if (!timeUp) return;
  beforegame.style.display = "none";
  inthegame.style.display = "block";
  bgMusic.currentTime = 0;
  bgMusic.play();
  timeUp = false;
  initial();
  count(3);
  setTimeout(() => {
    monsterOut();
  }, 3000);
}
function monsterOut() {
  const showRM = setInterval(showRandomMonster, 500);
  setTimeout(() => {
    timeUp = true;
    clearInterval(showRM);
    setTimeout(() => {
      endgame();
    }, 3000);
  }, 10000);
}
function setScore(s) {
  score = s;
  const gameScore = document.querySelector(".score");
  gameScore.textContent = score;
}
function setPoint(p) {
  getpoint += p;
  localStorage.setItem("point", JSON.stringify(getpoint));
  point.textContent = getpoint;
}
point.textContent = getpoint;
function showRandomMonster() {
  const monster = Math.floor(Math.random() * gameMonster.length);
  const time = Math.random() * (2500 - 1500) + 1500;
  const rl = Math.random();
  rl > 0.5
    ? (gameMonster[monster].style.transform = "translateX(100px)")
    : (gameMonster[monster].style.transform = "translateX(-100px)");
  if (gameMonsterProxy[monster]) {
    return showRandomMonster();
  }
  gameMonsterProxy[monster] = true;
  setTimeout(() => {
    gameMonsterProxy[monster] = false;
    gameMonster[monster].style.transform = "translateX(0px)";
  }, time);
  // setTimeout(() => {
  //     if(!timeUp) showRandomMonster();
  // }, 500);
}

const gameboard = document.querySelector(".gameboard");
const mouse = document.querySelector(".mouse");
gameboard.addEventListener("mousemove", function (e) {
  const aimX = e.pageX - 40;
  const aimY = e.pageY - 40;
  mouse.style.left = aimX + "px";
  mouse.style.top = aimY + "px";
  mouse.style.display = "block";
});
gameboard.addEventListener("mouseleave", function () {
  mouse.style.display = "none";
});
inthegame.addEventListener("click", fire);
const gun = document.querySelector(".gun");
function fire() {
  gun.currentTime = 0;
  gun.play();
  bulletQty -= 1;
  bullet[bulletQty].style.opacity = "0.3";
  if (bulletQty == 0) Reload();
}
againBtn.addEventListener("click", function () {
  aftergame.style.display = "none";
  startGame();
});
homeBtn.addEventListener("click", function () {
  aftergame.style.display = "none";
  beforegame.style.display = "block";
});

const bullet = [...document.querySelectorAll(".bullet li")];
let bulletQty;
// console.log(bulletQty)
const reload = document.querySelector(".reload");
function Reload() {
  // console.log(123)
  reload.play();
  inthegame.removeEventListener("click", fire);
  setTimeout(() => {
    bulletQty = 10;
    bullet.forEach((num) => (num.style.opacity = "1"));
    inthegame.addEventListener("click", fire);
  }, 1000);
}

const countdown = document.querySelector(".countdown");
function count(num) {
  countdown.textContent = num;
  if (num >= 1) {
    setTimeout(() => {
      num -= 1;
      count(num);
    }, 1000);
  } else {
    // timeUp = false;
    countdown.style.display = "none";
  }
}
window.addEventListener("storage", function (e) {
  localStorage.setItem(e.key, e.oldValue);
});

const buyAim = [...document.querySelectorAll('.buyAim')];
const aimStatus = buyAim.reduce((prev, current, index) => {
    prev[index] = false;
    return prev;
  }, {});
// console.log(aimStatus);
// console.log(buyAim[0].dataset.price);
const buyAimProxy = new Proxy(aimStatus, {
    get(target, key) {
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      buyAim[key].removeEventListener("click", BuyAim);
      if (value) {
        buyAim[key].addEventListener("click", BuyAim);
      } return
    },
  });

function BuyAim(){
  getpoint -=  buyAim[buyAim.indexOf(this)].dataset.price;
  localStorage.setItem("point", JSON.stringify(getpoint));
  point.textContent = getpoint;
  chooseAim[buyAim.indexOf(this)].addEventListener('click',choose);
  chooseAim[buyAim.indexOf(this)].style.display='block';
  buyAim[buyAim.indexOf(this)].style.display='none';
  setBuyAim();
}


function setBuyAim(){
  for(let i=0; i<buyAim.length; i++){
    if(buyAim[i].dataset.price<=JSON.parse(localStorage.getItem("point"))){
        buyAimProxy[i]=true;
        buyAim[i].style.opacity="1";
    }else{
      buyAim[i].style.opacity="0.4";
    }
  }
}
setBuyAim();

const chooseAim = [...document.querySelectorAll('.chooseAim')];
const defaultAim = document.querySelector('.defaultAim');
defaultAim.addEventListener('click',function(){
  mouse.style.backgroundImage='url(../img/aim1.png)'
})
function choose(){
    const num = chooseAim.indexOf(this)+2
    mouse.style.backgroundImage=`url(../img/aim${num}.png)`
}


let vol = 0.5;
const minus = document.querySelector('.minus');
minus.addEventListener('click',function(){
  vol-=0.1;
  if(vol<0){vol=0; minus.style.opacity='0.3'}
  plus.style.opacity='1'
  bgMusic.volume = vol;
  reload.volume = vol;
  gun.volume = vol;
})
const plus = document.querySelector('.plus');
plus.addEventListener('click',function(){
  vol+=0.1;
  if(vol>1){vol=1; plus.style.opacity='0.3'}
  minus.style.opacity='1'
  bgMusic.volume = vol;
  reload.volume = vol;
  gun.volume = vol;
})





