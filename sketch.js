// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let bubbles = []; // 存放所有水泡的陣列

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480); // 明確設定視訊大小，避免部分瀏覽器無法正確顯示
  video.elt.setAttribute('playsinline', ''); // 確保手機（特別是 iOS）可以正常行內播放視訊
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 在畫布置中上方顯示文字
  push();
  fill(255);
  stroke(0);
  strokeWeight(3);
  textSize(32);
  textAlign(CENTER, TOP);
  text("413737015 季子蕎", width / 2, 20);
  pop();

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 依照要求的編號利用 line() 將關節點串接起來繪製手指骨架
        stroke(0, 255, 0); // 設定線條為綠色
        strokeWeight(3);   // 設定線條粗細
        let fingers = [
          [0, 1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 14, 15, 16],
          [17, 18, 19, 20]
        ];
        for (let finger of fingers) {
          for (let j = 0; j < finger.length - 1; j++) {
            let p1 = hand.keypoints[finger[j]];
            let p2 = hand.keypoints[finger[j + 1]];
            line(p1.x, p1.y, p2.x, p2.y);
          }
        }

        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // 在指尖 (4, 8, 12, 16, 20) 產生水泡
        let fingertips = [4, 8, 12, 16, 20];
        for (let tipIndex of fingertips) {
          let tipPoint = hand.keypoints[tipIndex];
          // 控制水泡產生的機率，避免每幀都產生太多
          if (random(1) < 0.1) {
            bubbles.push(new Bubble(tipPoint.x, tipPoint.y));
          }
        }
      }
    }
  }

  // 更新與繪製水泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    if (bubbles[i].popped) {
      bubbles.splice(i, 1); // 水泡破裂後從陣列中移除
    } else {
      bubbles[i].display();
    }
  }
}

// 水泡類別
class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = random(5, 15); // 水泡半徑
    this.speedY = random(1, 3); // 往上升的速度
    this.speedX = random(-0.5, 0.5); // 稍微左右飄動
    this.popped = false;
    this.popHeight = random(0, y - 50); // 設定每個水泡會破掉的隨機高度
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    // 當水泡上升到指定高度，或是超出畫面最上方時破裂
    if (this.y <= this.popHeight || this.y < -this.r) {
      this.popped = true;
    }
  }

  display() {
    push();
    stroke(255, 150);
    strokeWeight(1);
    fill(173, 216, 230, 120); // 帶有透明度的水藍色
    circle(this.x, this.y, this.r * 2);
    // 加上水泡上的白色亮點，增加立體感
    noStroke();
    fill(255, 200);
    circle(this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.5);
    pop();
  }
}
