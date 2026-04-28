let video;
let handpose;
let predictions = [];

function setup() {
  // 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像內容
  video = createCapture(VIDEO);
  video.size(width, height);

  // 初始化 handpose 模型
  handpose = ml5.handpose(video, modelReady);

  // 監聽 handpose 的 'predict' 事件，但我們不會在這裡繪製任何東西
  handpose.on("predict", results => {
    predictions = results;
  });
  
  // 隱藏預設的 HTML 影片元素
  video.hide();
  
  // 設定影像繪製模式為中心點
  imageMode(CENTER);
}

function modelReady() {
  console.log("Handpose 模型已載入！");
}

function draw() {
  // 設定畫布的背景顏色為 #e7c6ff
  background('#e7c6ff');
  
  // 顯示擷取的影像內容：放置在視窗中間，寬高為整個畫布寬高的 60%
  image(video, width / 2, height / 2, width * 0.6, height * 0.6);

  // 這部分刻意留空，以確保不會繪製任何手指關節的特效。
  // 偵測到的手部資料儲存在 `predictions` 陣列中，供後續使用。
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}