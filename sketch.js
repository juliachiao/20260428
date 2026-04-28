let video;

function setup() {
  // 第一步驟：產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像內容
  video = createCapture(VIDEO);
  video.hide(); // 隱藏預設的 HTML 影片元素，確保只在畫布上渲染
  
  // 設定影像繪製模式為中心點，以方便將影像置中
  imageMode(CENTER);
}

function draw() {
  // 設定畫布的背景顏色為 #e7c6ff
  background('#e7c6ff');
  
  // 顯示擷取的影像內容：放置在視窗中間，寬高為整個畫布寬高的 60%
  image(video, width / 2, height / 2, width * 0.6, height * 0.6);
}

function windowResized() {
  // 當視窗大小改變時，自動調整畫布以維持全螢幕與置中比例
  resizeCanvas(windowWidth, windowHeight);
}