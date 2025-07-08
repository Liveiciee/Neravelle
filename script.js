// Core Systems
class LivingOcean {
  constructor() {
    this.timeSystem = new HelioraTime();
    this.ship = new SoulVessel();
    this.ocean = new DynamicOcean();
    this.sky = new MagicSky();
    this.particles = new ParticleMaster();
    
    this.init();
  }

  init() {
    this.setupCanvas();
    this.setupEventListeners();
    this.timeSystem.on('timeUpdate', this.updateEnvironment.bind(this));
    this.lastFrameTime = performance.now();
    this.animationFrame = requestAnimationFrame(this.render.bind(this));
  }

  setupCanvas() {
    this.canvas = document.getElementById('livingCanvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.resizeCanvas();
    
    this.shipBuffer = document.createElement('canvas');
    this.reflectionBuffer = document.createElement('canvas');
    this.lightBuffer = document.createElement('canvas');
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    [this.shipBuffer, this.reflectionBuffer, this.lightBuffer].forEach(b => {
      b.width = this.canvas.width;
      b.height = this.canvas.height;
    });
  }

  updateEnvironment(timeData) {
    const { hour, minute, dayProgress } = timeData;
    this.sky.updateTime(hour, minute, dayProgress);
    this.ocean.updateTime(hour);
    this.ship.updateActivityLevel(hour);
    
    if (this.timeSystem.isCelestialEvent()) {
      this.triggerCelestialEffects();
    }
  }

  render(currentTime) {
    const deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;
    
    this.ctx.fillStyle = this.sky.getSkyGradient();
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.sky.render(this.ctx, deltaTime);
    this.ocean.render(this.ctx, deltaTime);
    this.ship.render(this.ctx, deltaTime);
    this.particles.render(this.ctx, deltaTime);
    
    this.applyLensFlare();
    this.applyHeatDistortion();
    
    this.animationFrame = requestAnimationFrame(this.render.bind(this));
  }

  triggerCelestialEffects() {
    this.particles.spawnStardust();
    this.ship.activateRitualLights();
    this.ocean.addBioluminescence();
  }
}

// Ship System
class SoulVessel {
  constructor() {
    this.position = { x: 0.5, y: 0.6 };
    this.velocity = 0.0003;
    this.rockingAngle = 0;
    this.crewActivity = 0.5;
    this.cabinLights = new CabinLightSystem();
    this.navigationLights = new NavigationLights();
    this.smokeSystem = new SmokeEmitter();
    this.shadowSystem = new DynamicShadows();
    this.interior = new ShipInterior();
  }

  update(deltaTime) {
    this.rockingAngle = Math.sin(Date.now() * 0.001) * 0.05;
    this.position.x = 0.5 + Math.sin(Date.now() * this.velocity) * 0.3;
    this.position.y = 0.6 + Math.cos(Date.now() * this.velocity * 0.5) * 0.1;
    this.cabinLights.update(deltaTime);
    this.smokeSystem.update(deltaTime, this.velocity * 1000);
    this.shadowSystem.updateCloudPosition(deltaTime);
    this.interior.updateCrewActivity(this.crewActivity);
  }

  render(ctx, deltaTime) {
    this.update(deltaTime);
    const screenX = this.position.x * ctx.canvas.width;
    const screenY = this.position.y * ctx.canvas.height;
    const scale = ctx.canvas.height * 0.0015;
    
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(this.rockingAngle);
    ctx.scale(scale, scale);
    
    this.drawHull(ctx);
    this.interior.render(ctx);
    this.drawDeckDetails(ctx);
    this.smokeSystem.render(ctx);
    this.cabinLights.render(ctx);
    this.navigationLights.render(ctx);
    
    ctx.restore();
    this.shadowSystem.render(ctx, this.position);
  }

  drawHull(ctx) {
    ctx.beginPath();
    // Hull drawing logic...
    const hullGradient = ctx.createLinearGradient(0, -100, 0, 50);
    hullGradient.addColorStop(0, '#3a5f85');
    hullGradient.addColorStop(0.5, '#6d93bb');
    hullGradient.addColorStop(1, '#2a4466');
    ctx.fillStyle = hullGradient;
    ctx.fill();
    
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(40 - i * 15, -20, 4, 0, Math.PI * 2);
      ctx.fillStyle = this.cabinLights.getPortholeColor(i);
      ctx.fill();
    }
  }
}

// Ocean System
class DynamicOcean {
  constructor() {
    this.wavePoints = [];
    this.foamParticles = [];
    this.wakeSystem = new WakeEffect();
    this.timeOfDay = 12;
    this.initWaveSystem();
  }

  initWaveSystem() {
    const waveCount = Math.ceil(window.innerWidth / 30);
    for (let i = 0; i <= waveCount; i++) {
      this.wavePoints.push({
        x: i / waveCount,
        y: 0.7,
        vy: 0,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  update(deltaTime) {
    const windIntensity = this.getWindIntensity();
    
    this.wavePoints.forEach((point, i) => {
      const noiseValue = perlin.get(i * 0.1, Date.now() * 0.0005);
      const targetY = 0.7 + noiseValue * 0.05 * windIntensity;
      const dy = targetY - point.y;
      point.vy += dy * deltaTime * 2;
      point.vy *= 0.9;
      point.y += point.vy;
      point.phase += deltaTime * (0.5 + windIntensity * 0.3);
    });
    
    this.generateFoam(deltaTime, windIntensity);
    this.wakeSystem.update(deltaTime);
  }

  render(ctx, deltaTime) {
    this.update(deltaTime);
    this.drawWaterSurface(ctx);
    this.drawFoam(ctx);
    this.wakeSystem.render(ctx);
  }

  drawWaterSurface(ctx) {
    const canvas = ctx.canvas;
    const waveHeight = canvas.height * 0.3;
    const baseY = canvas.height * 0.7;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    
    this.wavePoints.forEach((point, i) => {
      const x = i / (this.wavePoints.length - 1) * canvas.width;
      const y = baseY - (point.y - 0.7) * waveHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const cpX = (x + this.wavePoints[i-1].x * canvas.width) / 2;
        const cpY = (y + this.wavePoints[i-1].y * waveHeight) / 2;
        ctx.quadraticCurveTo(cpX, cpY, x, y);
      }
    });
    
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    
    const waterGradient = ctx.createLinearGradient(0, baseY, 0, canvas.height);
    const timeColor = this.getWaterColor();
    waterGradient.addColorStop(0, timeColor.surface);
    waterGradient.addColorStop(1, timeColor.deep);
    ctx.fillStyle = waterGradient;
    ctx.fill();
    this.addWaveHighlights(ctx);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const oceanScene = new LivingOcean();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    oceanScene.resizeCanvas();
  });
  
  // Initialize wave canvas
  const waveCanvas = document.getElementById('waveCanvas');
  const waveCtx = waveCanvas.getContext('2d');
  
  function resizeWaveCanvas() {
    waveCanvas.width = window.innerWidth;
    waveCanvas.height = window.innerHeight * 0.3;
  }
  
  function animateWaves() {
    waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
    // Wave animation logic...
    requestAnimationFrame(animateWaves);
  }
  
  resizeWaveCanvas();
  animateWaves();
  
  // Create bubbles
  function createBubbles() {
    const container = document.querySelector('.ocean-container');
    for (let i = 0; i < 20; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.bottom = `${Math.random() * 20}%`;
      bubble.style.animationDuration = `${10 + Math.random() * 20}s`;
      container.appendChild(bubble);
    }
  }
  
  createBubbles();
});
