export const meta = { name: 'ink ripples', cool: true, order: 29 };

export function draw(p, phase, ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  const t = Date.now() * 0.001;

  // Dark water background
  ctx.fillStyle = 'rgba(0, 6, 20, 1)';
  ctx.fillRect(0, 0, w, h);

  // Wobbly concentric ripple rings expanding from multiple sources
  const sources = [
    { x: w * 0.3, y: h * 0.4, phase: 0 },
    { x: w * 0.65, y: h * 0.55, phase: 1.3 },
    { x: w * 0.5, y: h * 0.25, phase: 2.7 },
  ];

  for (const src of sources) {
    const sx = src.x + Math.sin(t * 0.2 + src.phase) * 40;
    const sy = src.y + Math.cos(t * 0.15 + src.phase) * 30;

    // Irregular ring count and spacing per source
    const ringCount = 6 + Math.floor(Math.sin(src.phase * 3) * 2);
    for (let ring = 0; ring < ringCount; ring++) {
      // Non-uniform spacing: some rings close, some far apart
      const spacingJitter = 1 + Math.sin(ring * 2.7 + src.phase) * 0.5;
      const baseR = (ring + 1) * 30 * spacingJitter * (0.2 + p * 0.9);
      const alpha = Math.max(0, 0.1 - ring * 0.01) * (0.3 + p * 0.7);

      ctx.beginPath();
      // Highly irregular shape — not a ring but an organic blob
      const points = 80;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        // Heavy distortion: large wobble relative to radius
        const wobble = Math.sin(angle * 2.3 + t * 0.7 + ring * 1.1 + src.phase) * (10 + ring * 5)
                     + Math.sin(angle * 4.7 + t * 0.4 + ring * 2.3) * (6 + ring * 3)
                     + Math.sin(angle * 1.1 + t * 1.2 + src.phase * 3) * (15 + ring * 2)
                     + Math.cos(angle * 6.3 + t * 0.9 + ring * 0.5) * (3 + ring);
        // Directional stretch: elliptical not circular
        const stretchX = 1 + 0.3 * Math.sin(src.phase * 2 + ring);
        const stretchY = 1 + 0.3 * Math.cos(src.phase * 2 + ring);
        const r = baseR + wobble;
        const x = sx + Math.cos(angle) * r * stretchX;
        const y = sy + Math.sin(angle) * r * stretchY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(50, 150, 220, ${alpha})`;
      ctx.lineWidth = 1.2 + Math.sin(ring * 1.5 + t * 0.5) * 0.6;
      ctx.stroke();
    }
  }

  // Horizontal flow lines — the wobbly element
  const lineCount = 25;
  for (let i = 0; i < lineCount; i++) {
    const baseY = h * (0.05 + 0.9 * (i / lineCount));
    const drift = Math.sin(t * 0.4 + i * 0.8) * 15;
    const flowAlpha = 0.04 + 0.08 * (0.5 + 0.5 * Math.sin(t * 0.7 + i * 1.5)) * (0.3 + p * 0.7);

    ctx.beginPath();
    for (let x = 0; x <= w; x += 3) {
      const wave = Math.sin(x * 0.005 + t * 0.6 + i * 0.9) * (20 + i * 3)
                 + Math.sin(x * 0.012 + t * 1.1 + i * 1.7) * (8 + i * 2)
                 + Math.sin(x * 0.025 + t * 0.4 + i * 2.3) * (4 + i);
      const y = baseY + drift + wave * (0.3 + p * 0.7);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(80, 190, 255, ${flowAlpha})`;
    ctx.lineWidth = 1.2 + Math.sin(t + i * 2) * 0.5;
    ctx.stroke();
  }

  // Scattered diffusion dots
  for (let i = 0; i < 60; i++) {
    const dx = ((i * 173 + 41) % 1000) / 1000 * w + Math.sin(t * 0.5 + i * 1.3) * 10;
    const dy = ((i * 211 + 67) % 1000) / 1000 * h + Math.cos(t * 0.3 + i * 0.9) * 8;
    const spread = 3 + Math.sin(t * 2 + i * 4) * 2;
    const dotAlpha = 0.03 + 0.07 * p * Math.sin(t * 1.5 + i * 3);

    ctx.fillStyle = `rgba(100, 200, 255, ${Math.max(0, dotAlpha)})`;
    ctx.beginPath();
    ctx.arc(dx, dy, spread * (0.5 + p * 0.5), 0, Math.PI * 2);
    ctx.fill();
  }
}
