// Moving Pots on the Shelf
// by ChatGPT (GPT-5)

// ---------------- VARIABLES ----------------
let pots = [];
let numPots = 5;
let shelfY = 480;
let dragging = null;
let score = 0;
let bgColor;
let timer = 10;          // seconds
let startTime;
let gameOver = false;

// ---------------- SETUP ----------------
function setup() {
  createCanvas(800, 600);
  bgColor = color(220, 200, 170);
  initPots();
  startTime = millis();
}

// ---------------- DRAW ----------------
function draw() {
  background(bgColor);

  drawShelf();

  // Timer
  let elapsed = (millis() - startTime) / 1000;
  let timeLeft = max(0, timer - elapsed);
  fill(50, 30, 10);
  textSize(24);
  textAlign(LEFT);
  text(`⏳ Time: ${timeLeft.toFixed(1)}s`, 30, 40);
  textAlign(RIGHT);
  text(`Score: ${score}/${numPots}`, width - 30, 40);

  // Title
  textAlign(CENTER);
  textSize(28);
  text("Move Pots to the Shelf ", width / 2, 80);

  // Update and draw pots
  for (let p of pots) {
    if (!p.placed && !p.dragging && !gameOver) {
      // Move pots automatically
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x < 60 || p.x > width - 60) p.vx *= -1;
      if (p.y < 120 || p.y > shelfY - 100) p.vy *= -1;

      // Wobble
      p.angle += 0.1;
      p.y += sin(p.angle) * 0.3;
    }

    // “Heavy” movement when dragging
    if (p.dragging && !gameOver) {
      p.x += (mouseX - p.x) * 0.1;
      p.y += (mouseY - p.y) * 0.1;
    }

    drawPot(p.x, p.y, p.size, p.color);
  }

  // Check if pots are placed
  for (let p of pots) {
    if (!p.placed && p.y > shelfY - 60 && abs(p.x - width / 2) < width / 2 - 100) {
      p.placed = true;
      score++;
    }
  }

  // Check win or lose
  if (timeLeft <= 0 && !gameOver) {
    gameOver = true;
    endGame(false);
  } else if (score === numPots && !gameOver) {
    gameOver = true;
    endGame(true);
  }
}

// ---------------- DRAW SHELF ----------------
function drawShelf() {
  // Shelf support legs
  fill(110, 70, 40);
  rectMode(CENTER);
  rect(150, shelfY + 80, 40, 160, 5);
  rect(width - 150, shelfY + 80, 40, 160, 5);

  // Shelf boards
  fill(160, 110, 70);
  rect(width / 2, shelfY, width - 100, 25, 5); // top board
  fill(120, 80, 40);
  rect(width / 2, shelfY + 15, width - 100, 10); // shadow edge
}

// ---------------- DRAW POT ----------------
function drawPot(x, y, s, c) {
  push();
  translate(x, y);
  noStroke();
  fill(c);
  ellipse(0, 0, s, s * 0.8); // body
  fill(100, 70, 40);
  rectMode(CENTER);
  rect(0, -s * 0.4, s * 0.7, s * 0.15, 10); // rim
  pop();
}

// ---------------- MOUSE PRESSED ----------------
function mousePressed() {
  if (gameOver) return;
  for (let p of pots) {
    if (dist(mouseX, mouseY, p.x, p.y) < p.size / 2) {
      dragging = p;
      p.dragging = true;
      break;
    }
  }
}

// ---------------- MOUSE RELEASED ----------------
function mouseReleased() {
  if (dragging) {
    dragging.dragging = false;
    dragging = null;
  }
}

// ---------------- INIT POTS ----------------
function initPots() {
  pots = [];
  score = 0;
  gameOver = false;
  for (let i = 0; i < numPots; i++) {
    pots.push({
      x: random(100, width - 100),
      y: random(150, 300),
      size: random(60, 90),
      color: color(random(140, 200), random(100, 160), random(80, 140)),
      angle: random(TWO_PI),
      placed: false,
      dragging: false,
      vx: random(-1.5, 1.5),
      vy: random(-1, 1)
    });
  }
}

// ---------------- END GAME ----------------
function endGame(win) {
  fill(0);
  textAlign(CENTER);
  textSize(36);
  if (win) {
    text("🎉 All pots are safely on the shelf!", width / 2, height / 2);
  } else {
    text("⏰ Time’s up! The pots got away!", width / 2, height / 2);
  }
}
