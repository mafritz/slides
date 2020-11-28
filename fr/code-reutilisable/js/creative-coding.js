function setup() {
  let myCanvas = createCanvas(800, 400);
  myCanvas.parent("p5js-canvas");
}

function draw() {
  if (mouseIsPressed) {
    let randomValue = Math.random();
    let randomSize = random(10, 100);
    fill(random(255), random(255), random(255));
    if (randomValue < 0.3333) {
      circle(mouseX, mouseY, randomSize);
    } else if (randomValue < 0.6666) {
      triangle(
        mouseX + randomSize / 2,
        mouseY + randomSize / 2,
        mouseX - randomSize / 2,
        mouseY + randomSize / 2,
        mouseX,
        mouseY - randomSize / 2
      );
    } else {
      square(mouseX - randomSize / 2, mouseY - randomSize / 2, randomSize);
    }
  }
}

function keyPressed() {
  if (keyCode === DELETE) {
    clear();
  }
}
