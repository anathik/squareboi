let playlist = [
  'assets/audio/BillyMarchiafavaRings&LilNasXNasaratiInstrumental(Prod.Robb2BxRayAyy).mp3',
  'assets/audio/GetItFast[FREE]PlayboiCartixPierreBourneTypeBeatProd.ByThatBoySlim97.mp3'
]
let playlistIndex = 0

let myAudio = new Audio(playlist[playlistIndex]);

const laser = new Audio('assets/audio/pewpew.mp3')
laser.volume = 0.2;

function stopMusic() { }
function playMusic() {
  myAudio.play();
}
