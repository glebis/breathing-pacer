export const meta = { name: 'particle cloud', cool: false, order: 12 };

const NUM_PARTICLES = 72;
const TRAIL_LENGTH = 3;

// Deterministic seed per particle
function seeded(i) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Pre-compute particle properties
const particles = [];
for (let i = 0; i < NUM_PARTICLES; i++) {
  const angle = seeded(i) * Math.PI * 2;
  const minDist = 8 + seeded(i + 100) * 25;
  const maxDist = 80 + seeded(i + 200) * 180;
  const size = 1 + Math.floor(seeded(i + 300) * 4);
  const driftFreqX = 0.4 + seeded(i + 400) * 0.8;
  const driftFreqY = 0.3 + seeded(i + 500) * 0.7;
  const driftAmpX = 3 + seeded(i + 600) * 8;
  const driftAmpY = 3 + seeded(i + 700) * 8;
  const driftPhase = seeded(i + 800) * Math.PI * 2;
  const hasTrail = seeded(i + 900) > 0.6;
  const isOrange = i % 2 === 0;

  particles.push({
    angle, minDist, maxDist, size,
    driftFreqX, driftFreqY, driftAmpX, driftAmpY, driftPhase,
    hasTrail, isOrange,
    trail: []
  });
}

export function draw(p, phase, ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  const t = Date.now() * 0.001;
  const cx = w / 2;
  const cy = h / 2;

  for (let i = 0; i < NUM_PARTICLES; i++) {
    const pt = particles[i];

    const dist = pt.minDist + (pt.maxDist - pt.minDist) * p;
    const driftX = Math.sin(t * pt.driftFreqX + pt.driftPhase) * pt.driftAmpX;
    const driftY = Math.sin(t * pt.driftFreqY + pt.driftPhase + 1.3) * pt.driftAmpY;

    const x = cx + Math.cos(pt.angle) * dist + driftX;
    const y = cy + Math.sin(pt.angle) * dist + driftY;

    // Alpha fades with distance from center
    const distFromCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    const maxRadius = Math.max(w, h) * 0.45;
    const alpha = Math.max(0.05, 1 - distFromCenter / maxRadius) * (0.4 + p * 0.5);

    const r = pt.isOrange ? 232 : 255;
    const g = pt.isOrange ? 93 : 214;
    const b = pt.isOrange ? 4 : 10;

    // Draw trail if particle has one
    if (pt.hasTrail) {
      pt.trail.unshift({ x, y });
      if (pt.trail.length > TRAIL_LENGTH) pt.trail.length = TRAIL_LENGTH;

      for (let j = 1; j < pt.trail.length; j++) {
        const trailAlpha = alpha * (1 - j / TRAIL_LENGTH) * 0.4;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${trailAlpha})`;
        ctx.fillRect(pt.trail[j].x, pt.trail[j].y, pt.size, pt.size);
      }
    }

    // Draw particle (square, neobrutalist)
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.fillRect(x, y, pt.size, pt.size);
  }
}
