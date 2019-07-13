let playlist = [
  'assets/audio/BillyMarchiafavaRings&LilNasXNasaratiInstrumental(Prod.Robb2BxRayAyy).mp3',
  'assets/audio/GetItFast[FREE]PlayboiCartixPierreBourneTypeBeatProd.ByThatBoySlim97.mp3'
]

let myAudio = new Audio(playlist[getRandomInt(playlist.length - 1, 0)]);
myAudio.volume = 0.5;

const laser = new Audio('assets/audio/pewpew.mp3')
laser.volume = 0.2;

function stopMusic() { }

function playMusic() {
  myAudio.play();
  myAudio.onended = () => {
    console.log('shuffling music')
    myAudio = new Audio(playlist[getRandomInt(playlist.length - 1, 0)]);
    myAudio.currentTime = 0;
    myAudio.play();
  }
}
