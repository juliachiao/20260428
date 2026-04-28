let video;
let handpose;
let predictions = [];

function setup() {
  // 適應手機螢幕大小
  createCanvas(windowWidth, windowHeight); 

  // 加入具體設定，強制要求視訊（前鏡頭）
  let constraints = {
    video: {
      facingMode: "user" 
    },
    audio: false
  };

  // 啟動攝影機
  video = createCapture(constraints, function(stream) {
    console.log("手機攝影機已啟動");
  });
  
  video.size(width, height);
  video.hide(); // 隱藏原生影片標籤
  
  // 初始化手勢辨識
  handpose = ml5.handpose(video, modelReady);

  // 監聽偵測結果
  handpose.on("predict", results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("模型載入成功！");
}

function draw() {
  // 1. 先畫出攝影機影像，填滿整個畫面
  image(video, 0, 0, width, height);

  // 2. 畫出偵測到的手指特徵點（粉紫色系）
  drawKeypoints();

  // 3. 在最上層加上學號與姓名
  drawUserText();
}

// 繪製學號姓名的函式
function drawUserText() {
  push();
  fill(255); // 白色文字
  stroke(0); // 黑色邊框，防止背景太亮看不見字
  strokeWeight(4);
  textSize(28);
  textAlign(CENTER, TOP);
  // 在畫面水平中心，距離頂部 20 像素的位置
  text("413737015 季子蕎", width / 2, 20); 
  pop();
}

// 繪製手指點點的函式
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i++) {
    let prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j++) {
      let keypoint = prediction.landmarks[j];
      fill(205, 180, 219); // 你喜歡的 Y2K 質感粉紫色
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}

// 當視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}