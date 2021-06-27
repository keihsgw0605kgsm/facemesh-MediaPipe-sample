const player = document.getElementById('video');
const download = document.getElementById('download');
const p_text = document.getElementById('text');
var detections_json = "No Data";
var save_arr = [];
let labels = [
  'UnixTime(ms)',
  'face_score', 'face_boundingBox_x', 'face_boundingBox_y', 'face_boundingBox_width', 'face_boundingBox_height'
]

/**カメラを用いたビデオストリーミング**/
function startVideo() {
  var constraints = {
    audio: true,
    video: {
      width: player.width,
      height: player.height
    }
  };
  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    player.srcObject = stream;
    player.onloadedmetadata = function(e) {
      player.play();
    };
  })
  .catch(function(err) {
    console.log(err.name+": "+err.message);
  });
};

window.onload = function () {
  p_text.textContent = "before video on";
  startVideo();
}

/**カメラオン時のイベント**/
player.addEventListener('play', () => {
  p_text.textContent = "1";
  const model = facemesh.load();
  p_text.textContent = "2";
  setInterval(async () => {
    p_text.textContent = "3";
    const detections = await model.estimateFaces(player);
    p_text.textContent = JSON.stringify(detections);
  }, 1000)
  .catch((e) => {
    console.log('setIntervalでエラー：'+e);
  });
})
.catch((e) => {
  console.log('player.addEventListenerでエラー：'+e);
});

/** jsonファイルのダウンロード **/
function handleDownload() {
  var blob = new Blob([ detections_json ], { "type" : "text/plain" });
  var url = window.URL.createObjectURL(blob);
  download.href = url;
  window.navigator.msSaveBlob(blob, "test.json"); 
}