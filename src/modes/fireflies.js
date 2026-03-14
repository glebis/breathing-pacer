export const meta = { name: 'fireflies', cool: false, order: 28 };

export function draw(p, phase, ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  const t = Date.now() * 0.001;
  ctx.fillStyle = 'rgba(4, 2, 0, 1)';
  ctx.fillRect(0, 0, w, h);

  const trailCount = 80;
  for (let i = 0; i < trailCount; i++) {
    const seed = i * 12.7;
    const orbit = 0.2 + 0.7 * ((i % 20) / 20);
    const angle = t * (0.5 + 0.3 * Math.sin(seed)) + seed;
    const radius = Math.min(w, h) * orbit * (0.15 + 0.55 * p) * (0.8 + 0.2 * Math.sin(t * 0.4 + seed));
    const x = w * 0.5 + Math.cos(angle) * radius;
    const y = h * 0.5 + Math.sin(angle * 0.8) * radius * 0.7 + Math.sin(seed + t * 2) * 15;

    ctx.beginPath();
    const tail = 6;
    for (let tSeg = 0; tSeg < tail; tSeg++) {
      const backFrac = tSeg / tail;
      const tx = x - Math.cos(angle) * 10 * backFrac - Math.sin(seed + tSeg) * 4;
      const ty = y - Math.sin(angle) * 8 * backFrac + Math.cos(seed + tSeg) * 3;
      const alpha = 0.06 + 0.2 * (1 - backFrac) * (0.4 + p * 0.6);
      ctx.strokeStyle = `rgba(255, ${180 + (i % 3) * 30}, 80, ${alpha})`;
      ctx.lineWidth = 1.5 - backFrac * 1.2;
      if (tSeg === 0) ctx.moveTo(tx, ty);
      else ctx.lineTo(tx, ty);
    }
    ctx.stroke();
  }

  const fireflyCount = 60;
  for (let i = 0; i < fireflyCount; i++) {
    const orbit = 0.1 + 0.9 * (i / fireflyCount);
    const angle = t * (0.8 + orbit) + i;
    const radialPulse = 1 + 0.3 * Math.sin(t * 2 + i * 3);
    const radius = Math.min(w, h) * orbit * (0.1 + 0.45 * p) * radialPulse;
    const x = w * 0.5 + Math.cos(angle) * radius + Math.sin(i * 4.3) * 20;
    const y = h * 0.5 + Math.sin(angle * 0.9) * radius + Math.cos(i * 3.7) * 15;
    const twinkle = 0.5 + 0.5 * Math.sin(t * 6 + i * 5 + p * Math.PI);

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 200, 100, ${0.15 + twinkle * 0.35})`;
    ctx.arc(x, y, 1.5 + twinkle * 2.5, 0, Math.PI * 2);
    ctx.fill();

    const glow = ctx.createRadialGradient(x, y, 0, x, y, 20 + twinkle * 20);
    glow.addColorStop(0, `rgba(255, 200, 120, ${0.5 + twinkle * 0.4})`);
    glow.addColorStop(1, 'rgba(10, 5, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 20 + twinkle * 20, 0, Math.PI * 2);
    ctx.fill();
  }
}
