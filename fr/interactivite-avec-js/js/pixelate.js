const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = 700;
const canvasHeight = 500;

let image = new Image();
loadImage();

function loadImage() {
  const file = document.getElementById("file-input").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      image.onload = function () {
        drawImage();
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    image.src = "./images/jonction.jpg";
    image.onload = function () {
      drawImage();
    };
  }
}

function drawImage() {
  const aspectRatio = image.width / image.height;

  let width, height;
  if (aspectRatio > 1) {
    width = canvasWidth;
    height = canvasWidth / aspectRatio;
  } else {
    width = canvasHeight * aspectRatio;
    height = canvasHeight;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);
  pixelate();
}

function pixelate() {
  const size = 101 - parseInt(document.getElementById("pixel-slider").value);
  const w = canvas.width / size;
  const h = canvas.height / size;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, w, h);
  ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
}

// JavaScript
document.getElementById("uploadButton").addEventListener("click", function () {
  document.getElementById("file-input").click();
});
