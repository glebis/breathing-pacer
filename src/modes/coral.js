export const meta = { name: 'coral bloom', cool: false, order: 27 };

export function draw(p, phase, ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  const t = Date.now() * 0.001;
  const baseColor = phase === 'inhale' ? 0.85 : 0.4;
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, `rgba(30, 5, 0, ${0.8 + baseColor * 0.1})`);
  bg.addColorStop(1, 'rgba(5, 1, 0, 1)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const colonyCount = 6;
  for (let i = 0; i < colonyCount; i++) {
    const seed = i * 4.1;
    const baseX = (w / (colonyCount + 1)) * (i + 1) + Math.sin(t * 0.2 + seed) * 40;
    const baseY = h * (0.6 + 0.25 * Math.sin(seed + t * 0.3));
    const arms = 20;
    const baseRadius = Math.min(w, h) * (0.08 + i * 0.02);

    for (let arm = 0; arm < arms; arm++) {
      const angle = (arm / arms) * Math.PI * 2 + Math.sin(seed + arm * 0.9 + t * 0.5) * 0.4;
      const length = baseRadius * (1.5 + Math.sin(arm * 1.3 + t * 1.1) * 0.5) * (0.8 + p * 0.7);
      const segments = 18;
      let x = baseX;
      let y = baseY;

      for (let s = 0; s < segments; s++) {
        const frac = s / segments;
        const bend = Math.sin(frac * 4 + seed + arm) * 0.4 + Math.sin(t * 2 + arm) * 0.1;
        const jitter = Math.sin(frac * 12 + t * 3 + arm) * 0.08;
        const step = (length / segments) * (0.8 + frac * 0.4);
        const nx = x + Math.cos(angle + bend * 0.5 + jitter) * step;
        const ny = y + Math.sin(angle + bend * 0.5 + jitter) * step;

        const heat = 0.3 + 0.7 * (1 - frac);
        const r = 255;
        const g = Math.round(120 + 60 * heat);
        const b = Math.round(40 + 30 * heat);
        const alpha = 0.1 + 0.4 * heat * (0.4 + p * 0.6);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = (4 - frac * 3.2) * (0.7 + p * 0.3);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        // polyp tips
        if (s % 4 === 2) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${255}, ${170 + arm % 60}, ${90 + arm % 30}, ${0.3 + 0.3 * (1 - frac)})`;
          ctx.arc(nx, ny, 1.6 + (1 - frac) * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        x = nx;
        y = ny;
      }
    }
  }

  // floating dust
  const motes = 90;
  for (let i = 0; i < motes; i++) {
    const px = ((i * 173 + 11) % 1000) / 1000 * w + Math.sin(t * 0.2 + i) * 10;
    const py = h - ((i * 211 + 19) % 1000) / 1000 * h * (0.7 + 0.3 * p);
    const alpha = 0.02 + 0.12 * (0.5 + 0.5 * Math.sin(t * 1.5 + i * 2));
    ctx.fillStyle = `rgba(255, 180, 120, ${alpha})`;
    ctx.fillRect(px, py, 1 + (i % 3) * 0.5, 1 + (i % 2) * 0.5);
  }
}
