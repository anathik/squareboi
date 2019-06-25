let playlist = [
  'js/BillyMarchiafavaRings&LilNasXNasaratiInstrumental(Prod.Robb2BxRayAyy).mp3',
  'js/GetItFast[FREE]PlayboiCartixPierreBourneTypeBeatProd.ByThatBoySlim97.mp3'
]
let playlistIndex = 0

let myAudio = new Audio(playlist[playlistIndex]);

function stopMusic() { }
function playMusic() {
  myAudio.play();
}
