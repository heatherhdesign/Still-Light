let glowCanvas;
let canvasContainer;
let particles = [];
let breath = 0;
let sound;
let isPlaying = false;

function preload() {
 sound = loadSound('./assets/RustlingLeaves.wav');
}

function toggleSound() {
  const soundToggle = document.getElementById("sound-toggle");
  const soundState = soundToggle.querySelector(".sound-toggle__state");

  if (!isPlaying) {
    sound.setVolume(0.12);
    sound.loop();
    isPlaying = true;

    soundToggle.classList.add("is-on");
    soundToggle.setAttribute("aria-pressed", "true");

    if (soundState) {
      soundState.textContent = "on";
    }

  } else {
    sound.stop();
    isPlaying = false;

    soundToggle.classList.remove("is-on");
    soundToggle.setAttribute("aria-pressed", "false");

    if (soundState) {
      soundState.textContent = "off";
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
  let centerY = height * 0.55;

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

  // The stillness makes the glow larger, but not heavier
  let softness = map(breathAmount, 0, 1, 1, 1.30);

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  // Outer atmosphere — very large, very faint
  let outerRadius = (size * 0.82) * softness;
  let outerGradient = ctx.createRadialGradient(
    x, y, 0,
    x, y, outerRadius
  );

  outerGradient.addColorStop(0, "rgba(255, 238, 205, 0.09)");
  outerGradient.addColorStop(0.22, "rgba(252, 228, 190, 0.065)");
  outerGradient.addColorStop(0.46, "rgba(248, 218, 180, 0.032)");
  outerGradient.addColorStop(0.68, "rgba(248, 218, 180, 0.012)");
  outerGradient.addColorStop(0.84, "rgba(248, 218, 180, 0)");
  outerGradient.addColorStop(1, "rgba(248, 218, 180, 0)");

  ctx.fillStyle = outerGradient;
  ctx.beginPath();
  ctx.arc(x, y, outerRadius, 0, TWO_PI);
  ctx.fill();

  // Middle warmth — soft body of the glow
  let middleRadius = (size * 0.50) * softness;
  let middleGradient = ctx.createRadialGradient(
    x, y, 0,
    x, y, middleRadius
  );

  let middleAlpha = map(breathAmount, 0, 1, 0.12, 0.18);

  middleGradient.addColorStop(0, `rgba(255, 240, 205, ${middleAlpha})`);
  middleGradient.addColorStop(0.38, "rgba(252, 228, 190, 0.09)");
  middleGradient.addColorStop(0.72, "rgba(248, 215, 175, 0.035)");
  middleGradient.addColorStop(1, "rgba(248, 215, 175, 0)");

  ctx.fillStyle = middleGradient;
  ctx.beginPath();
  ctx.arc(x, y, middleRadius, 0, TWO_PI);
  ctx.fill();

  // Tiny inner ember — keeps it from becoming a flat gray fog
  let coreRadius = size * 0.12;
  let coreGradient = ctx.createRadialGradient(
    x, y, 0,
    x, y, coreRadius
  );

  let coreAlpha = map(breathAmount, 0, 1, 0.16, 0.24);

  coreGradient.addColorStop(0, `rgba(255, 246, 218, ${coreAlpha})`);
  coreGradient.addColorStop(0.55, "rgba(255, 229, 190, 0.07)");
  coreGradient.addColorStop(1, "rgba(255, 229, 190, 0)");

  ctx.fillStyle = coreGradient;
  ctx.beginPath();
  ctx.arc(x, y, coreRadius, 0, TWO_PI);
  ctx.fill();

  ctx.restore();
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
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