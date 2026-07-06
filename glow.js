let glowCanvas;
let canvasContainer;
let particles = [];
let breath = 0;
let sound;
let isPlaying = false;

function preload() {
 sound = loadSound('./assets/meditativetiger-deep-healing-frequency-459500.mp3');
}

function toggleSound() {
  const soundToggle = document.getElementById("sound-toggle");
  const soundState = soundToggle.querySelector(".sound-toggle__state");

  if (!isPlaying) {
    sound.setVolume(0.18);
    sound.loop();
    isPlaying = true;

    soundToggle.classList.add("is-on");
    soundToggle.setAttribute("aria-pressed", "true");

    if (soundState) {
      soundState.textContent = "On";
    }

  } else {
    sound.stop();
    isPlaying = false;

    soundToggle.classList.remove("is-on");
    soundToggle.setAttribute("aria-pressed", "false");

    if (soundState) {
      soundState.textContent = "Off";
    }
  }
}

function setup() {
  canvasContainer = document.getElementById("glow-canvas");

  const containerWidth = canvasContainer.offsetWidth;
  const containerHeight = canvasContainer.offsetHeight;

  glowCanvas = createCanvas(containerWidth, containerHeight);

  if (canvasContainer) {
    canvasContainer.appendChild(glowCanvas.canvas);
  }

  for (let i = 0; i < 35; i++) {
    particles.push(new Particle());
  }

  noStroke();
}

function draw() {
  clear();

  let centerX = width / 2;
  let centerY = height * 0.52;

  let baseGlowSize = min(width, height) * 0.60;

// Layer 3: ambient breathing glow
  breath = map(sin(frameCount * 0.015), -1, 1, 0, 1);

  let breathExpansion = map(breath, 0, 1, 0, 85);
  let glowSize = baseGlowSize + breathExpansion;

// Layer 1: main quiet glow
drawSoftGlow(centerX, centerY, glowSize, breath);

//Layer 2: soft particles
  for (let p of particles) {
    p.update();
    p.display();
  }
}

function drawSoftGlow(x, y, size, breathAmount) {
  let ctx = drawingContext;

  // Adds a slight delay so the outer glow blooms just after the breath expands
  let delayedBloom = map(sin(frameCount * 0.015 - 0.45), -1, 1, 0, 1);

  // Keeps the breathing movement gentle
  let coreSoftness = map(breathAmount, 0, 1, 1, 1.18);
  let outerSoftness = map(delayedBloom, 0, 1, 1, 1.34);

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  // Layer 1: Outer rose atmosphere
  let outerRadius = size * 1.05 * outerSoftness;
  let outerAlpha = map(delayedBloom, 0, 1, 0.055, 0.12);

  let outerGradient = ctx.createRadialGradient(
    x, y, 0,
    x, y, outerRadius
  );

  outerGradient.addColorStop(0, "rgba(247, 197, 173, " + outerAlpha + ")");
  outerGradient.addColorStop(0.25, "rgba(222, 161, 147, 0.075)");
  outerGradient.addColorStop(0.52, "rgba(203, 135, 134, 0.045)");
  outerGradient.addColorStop(0.78, "rgba(183, 110, 121, 0.018)");
  outerGradient.addColorStop(1, "rgba(183, 110, 121, 0)");

  ctx.fillStyle = outerGradient;
  ctx.beginPath();
  ctx.arc(x, y, outerRadius, 0, TWO_PI);
  ctx.fill();

  // Layer 2: Middle peach glow
  let middleRadius = size * 0.62 * coreSoftness;
  let middleAlpha = map(breathAmount, 0, 1, 0.12, 0.24);

  let middleGradient = ctx.createRadialGradient(
    x, y, 0,
    x, y, middleRadius
  );

  middleGradient.addColorStop(0, "rgba(255, 238, 205, " + middleAlpha + ")");
  middleGradient.addColorStop(0.32, "rgba(247, 197, 173, 0.13)");
  middleGradient.addColorStop(0.62, "rgba(222, 161, 147, 0.07)");
  middleGradient.addColorStop(0.86, "rgba(203, 135, 134, 0.028)");
  middleGradient.addColorStop(1, "rgba(203, 135, 134, 0)");

  ctx.fillStyle = middleGradient;
  ctx.beginPath();
  ctx.arc(x, y, middleRadius, 0, TWO_PI);
  ctx.fill();

  // Layer 3: Inner ember
  let coreRadius = size * 0.15;
  let coreAlpha = map(breathAmount, 0, 1, 0.45, 0.75);

  let coreGradient = ctx.createRadialGradient(
    x, y, 0,
    x, y, coreRadius
  );

  coreGradient.addColorStop(0, "rgba(255, 244, 215, " + coreAlpha + ")");
  coreGradient.addColorStop(0.35, "rgba(255, 226, 190, 0.18)");
  coreGradient.addColorStop(0.68, "rgba(247, 197, 173, 0.065)");
  coreGradient.addColorStop(1, "rgba(247, 197, 173, 0)");

  ctx.fillStyle = coreGradient;
  ctx.beginPath();
  ctx.arc(x, y, coreRadius, 0, TWO_PI);
  ctx.fill();

  ctx.restore();
}


function windowResized() {
  if (!canvasContainer) return;

  const containerWidth = canvasContainer.offsetWidth;
  const containerHeight = canvasContainer.offsetHeight;

  resizeCanvas(containerWidth, containerHeight);
}

// Particles

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    
    this.size = random(1.5, 4.5);
    this.alpha = random(15,55);

    this.xSpeed = random(-0.05, 0.05);
    this.ySpeed = random(-0.03, -0.1); //slight upward drift

    this.fadeOffset = random(TWO_PI);
  }

    update() {
      this.x += this.xSpeed;
      this.y += this.ySpeed;

      // subtle breathing fade
      let fade = map(sin(frameCount * 0.01 + this.fadeOffset), -1, 1, 0.6, 1);
      this.currentAlpha = this.alpha * fade;

      // reset when off screen
      if (this.y < -20) {
        this.y = height + 20;
        this.x = random(width);
      }

      if (this.x < -20) {
        this.x = width + 20;
      }

      if (this.x > width + 20) {
        this.x = -20;
      }
    }

    display() {
      noStroke();

      drawingContext.shadowBlur = 18;
      drawingContext.shadowColor = "rgba(255, 245, 220, 0.25)";

      fill(255, 245, 220, this.currentAlpha);
      ellipse(this.x, this.y, this.size, this.size);

      drawingContext.shadowBlur = 0;
    }
  }