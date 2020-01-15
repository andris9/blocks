const pixel = 20;
const width = 640;
const height = 480;
const lineWidth = Math.round(width / pixel);
const lineHeight = Math.round(height / pixel);

const canvasElm = document.getElementById("board");
canvasElm.height = height + 1;
canvasElm.width = width + 1;

const canvas = canvasElm.getContext("2d");

const filledMap = new Map();

let i = 0;
function fillRect(x, y, color) {
  if (x < 0 || y < 0 || x >= lineWidth || y >= lineHeight) {
    // out of bounds
    console.log("out of bounds", x, y);
    return false;
  }
  canvas.fillStyle = color || "#ccc";
  canvas.fillRect(x * pixel + 1, y * pixel + 1, pixel - 1, pixel - 1);

  writeText(x, y, [`${x < 10 ? " " : ""}${x}`, `${y < 10 ? " " : ""}${y}`]);
  if (!filledMap.has(x)) {
    filledMap.set(x, new Set());
  }
  filledMap.get(x).add(y);
}

function clearRect(x, y) {
  fillRect(x, y, "#fff");
  filledMap.get(x).delete(y);
}

function isFilled(x, y) {
  return filledMap.has(x) && filledMap.get(x).has(y);
}

function writeText(x, y, text, color) {
  if (x < 0 || y < 0 || x >= lineWidth || y >= lineHeight) {
    // out of bounds
    console.log("out of bounds", x, y);
    return false;
  }
  canvas.fillStyle = color || "#666";
  canvas.font = "6px monospace";
  canvas.textBaseline = "top";

  [].concat(text || []).forEach((line, i) => {
    canvas.fillText(line, x * pixel + 9, y * pixel + 3 + i * 8);
  });
}

function drawLine(x1, y1, x2, y2, color) {
  canvas.beginPath();
  canvas.moveTo(x1, y1);
  canvas.lineTo(x2, y2);
  canvas.lineWidth = 1;
  canvas.strokeStyle = color;
  canvas.stroke();
}

for (let i = 0; i <= lineHeight; i++) {
  drawLine(0, i * pixel, width + 1, i * pixel + 1, "#eee");
}

for (let i = 0; i <= lineWidth; i++) {
  drawLine(i * pixel, 0, i * pixel + 1, height + 1, "#eee");
}

for (let x = 0; x < lineWidth; x++) {
  for (let y = 0; y < lineHeight; y++) {
    writeText(x, y, [`${x < 10 ? " " : ""}${x}`, `${y < 10 ? " " : ""}${y}`]);
  }
}

let currentLoopCb = false;
let gameLoopTtl = 1000;

let looping = false;
let loopTimer = false;

let processLoop = () => {
  clearTimeout(loopTimer);
  if (!looping) {
    return;
  }
  try {
    if (typeof currentLoopCb === "function") {
      currentLoopCb();
    }
  } catch (err) {
    console.error(err);
  }
  if (!looping) {
    return;
  }
  loopTimer = setTimeout(() => processLoop(), gameLoopTtl);
};

let stop = () => {
  clearTimeout(loopTimer);
  looping = false;
};

let start = () => {
  clearTimeout(loopTimer);
  looping = true;
  loopTimer = setTimeout(() => processLoop(), gameLoopTtl);
};

let setGameLoop = (ttl, cb) => {
  currentLoopCb = cb;
  gameLoopTtl = ttl;
  start();
};

let handleKeyPress = cb => {
  keyPressCb = cb;
};

document.body.addEventListener("keydown", e => {
  console.log(e.code);
  if (typeof keyPressCb === "function") {
    keyPressCb(e.code);
  }
});
