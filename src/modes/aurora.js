export const meta = { name: 'aurora', cool: true, order: 13 };

export function draw(p, phase, ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  const t = Date.now() * 0.001;

  // 4 curtains of light, each with distinct color and motion
  const curtains = [
    { color: [80, 140, 255],  seed: 0.0, speed: 0.18, width: 0.28 },
    { color: [100, 220, 200], seed: 1.7, speed: 0.14, width: 0.24 },
    { color: [140, 100, 220], seed: 3.2, speed: 0.21, width: 0.22 },
    { color: [60, 180, 240],  seed: 5.1, speed: 0.16, width: 0.26 },
  ];

  // Height factor: curtains rise on inhale, recede on exhale
  const heightFactor = 0.3 + p * 0.55;

  // Alpha modulation: brighter on inhale
  const breathAlpha = 0.25 + p * 0.55;

  for (let ci = 0; ci < curtains.length; ci++) {
    const c = curtains[ci];
    const [cr, cg, cb] = c.color;
    const seed = c.seed;

    // Horizontal center of curtain sways over time
    const centerX = w * (0.15 + ci * 0.22) + Math.sin(t * c.speed + seed) * w * 0.08;

    // Draw curtain as a filled vertical shape using bezier-like sampling
    const steps = 60;
    const baseY = h; // bottom of screen
    const topY = h * (1 - heightFactor); // how high the curtain reaches

    // Build left and right edges of the curtain
    const leftPoints = [];
    const rightPoints = [];
    const halfWidth = w * c.width * 0.5;

    for (let i = 0; i <= steps; i++) {
      const frac = i / steps; // 0 = bottom, 1 = top
      const y = baseY - frac * (baseY - topY);

      // Sway increases toward the top (more movement at top of curtain)
      const swayScale = frac * frac;
      const sway1 = Math.sin(frac * 3.5 + t * 0.4 + seed) * 30 * swayScale;
      const sway2 = Math.sin(frac * 5.2 + t * 0.7 + seed * 1.3) * 18 * swayScale;
      const sway3 = Math.sin(frac * 8.0 + t * 1.1 + seed * 2.7) * 8 * swayScale;
      const totalSway = sway1 + sway2 + sway3;

      // Width tapers toward top
      const taper = 1 - frac * 0.4;
      const hw = halfWidth * taper;

      // Shimmer: rapid small noise
      const shimmer = Math.sin(frac * 25 + t * 4.5 + seed * 3) * 2
                    + Math.sin(frac * 40 + t * 7.2 + seed * 5) * 1;

      leftPoints.push({ x: centerX + totalSway - hw + shimmer, y });
      rightPoints.push({ x: centerX + totalSway + hw - shimmer, y });
    }

    // Draw the curtain as a gradient-filled shape with varying alpha
    // Split into horizontal bands for gradient alpha effect
    const bands = 20;
    for (let b = 0; b < bands; b++) {
      const bStart = Math.floor(b * steps / bands);
      const bEnd = Math.floor((b + 1) * steps / bands);
      const bandFrac = (b + 0.5) / bands; // 0=bottom, 1=top

      // Alpha peaks in the middle-upper part of the curtain, fades at edges
      const verticalAlpha = Math.sin(bandFrac * Math.PI) * (0.6 + 0.4 * bandFrac);
      // Combine with breath modulation
      const alpha = breathAlpha * verticalAlpha * (0.12 + ci * 0.02);

      // Extra shimmer pulse
      const shimmerPulse = 1 + 0.15 * Math.sin(t * 3 + bandFrac * 10 + seed * 2);

      const finalAlpha = Math.min(1, alpha * shimmerPulse);
      if (finalAlpha < 0.005) continue;

      ctx.beginPath();
      // Left edge going up
      ctx.moveTo(leftPoints[bStart].x, leftPoints[bStart].y);
      for (let i = bStart + 1; i <= bEnd; i++) {
        ctx.lineTo(leftPoints[i].x, leftPoints[i].y);
      }
      // Right edge going down
      for (let i = bEnd; i >= bStart; i--) {
        ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
      }
      ctx.closePath();

      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${finalAlpha.toFixed(4)})`;
      ctx.fill();
    }

    // Bright core line along the center of each curtain
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const mx = (leftPoints[i].x + rightPoints[i].x) * 0.5;
      const my = leftPoints[i].y;
      if (i === 0) ctx.moveTo(mx, my);
      else ctx.lineTo(mx, my);
    }
    const bandFracMid = 0.5;
    const coreAlpha = breathAlpha * 0.25 * (0.5 + 0.5 * Math.sin(t * 1.2 + seed));
    ctx.strokeStyle = `rgba(${Math.min(255, cr + 80)}, ${Math.min(255, cg + 60)}, ${Math.min(255, cb + 40)}, ${coreAlpha.toFixed(4)})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Star-like shimmer particles scattered across the sky
  const particleCount = 25;
  for (let i = 0; i < particleCount; i++) {
    // Deterministic but time-varying positions
    const px = ((i * 397 + 53) % 1000) / 1000 * w;
    const pyBase = ((i * 613 + 29) % 1000) / 1000 * h * 0.7;
    const py = pyBase + Math.sin(t * 0.5 + i * 1.3) * 10;
    const flicker = 0.5 + 0.5 * Math.sin(t * (2 + i * 0.3) + i * 2.1);
    const pa = breathAlpha * 0.12 * flicker;
    if (pa < 0.01) continue;
    const size = 1 + (i % 3) * 0.5;
    ctx.fillStyle = `rgba(200, 230, 255, ${pa.toFixed(4)})`;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
}
