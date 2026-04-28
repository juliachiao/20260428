// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

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
      }
    }
  }
}
