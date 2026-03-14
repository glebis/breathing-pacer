export const meta = { name: 'tendrils', cool: false, order: 14 };

export function draw(p, phase, ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  const t = Date.now() * 0.001;
  const cx = w / 2;
  const cy = h / 2;
  const maxLen = Math.min(w, h) * 0.48;
  const tendrilCount = 12;

  // Color palette: psychedelic warm — orange, magenta, violet, gold, cyan accents
  const palette = [
    [232, 93, 4],     // orange
    [255, 60, 120],   // hot pink
    [180, 50, 220],   // violet
    [255, 214, 10],   // gold
    [80, 220, 200],   // cyan
    [255, 120, 50],   // tangerine
    [160, 30, 180],   // purple
    [255, 180, 0],    // amber
    [100, 255, 180],  // mint
    [230, 40, 80],    // crimson
    [140, 80, 255],   // lavender
    [255, 200, 80],   // warm yellow
  ];

  for (let i = 0; i < tendrilCount; i++) {
    const baseAngle = (i / tendrilCount) * Math.PI * 2 + Math.sin(t * 0.2 + i) * 0.15;
    const segments = 80;
    const length = maxLen * (0.6 + 0.4 * Math.sin(i * 1.7 + t * 0.3)) * p;
    const baseWidth = 7 + Math.sin(i * 2.3 + t * 0.4) * 3;

    // Each tendril gets a base color that shifts over time
    const colorIdx = (i + Math.floor(t * 0.3)) % palette.length;
    const nextColorIdx = (colorIdx + 1) % palette.length;
    const baseColor = palette[colorIdx];
    const tipColor = palette[nextColorIdx];

    let prevX = cx;
    let prevY = cy;

    for (let s = 0; s < segments; s++) {
      const frac = s / segments;

      // More chaotic wobble with time-varying frequencies
      const wobble1 = Math.sin(frac * 3.5 + t * 0.8 + i * 1.3) * 0.5;
      const wobble2 = Math.sin(frac * 5.2 + t * 0.6 + i * 2.7) * 0.3;
      const wobble3 = Math.sin(frac * 8.1 + t * 1.4 + i * 0.9) * 0.18;
      const wobble4 = Math.sin(frac * 12.5 + t * 1.8 + i * 3.1) * 0.08;
      const angleOffset = wobble1 + wobble2 + wobble3 + wobble4;

      const angle = baseAngle + angleOffset;
      const stepLen = length / segments;

      const nextX = prevX + Math.cos(angle) * stepLen;
      const nextY = prevY + Math.sin(angle) * stepLen;

      // Thickness: thick at base, thin at tip, with pulse
      const pulseWidth = 1 + Math.sin(frac * 10 + t * 3 + i * 2) * 0.15;
      const widthScale = (1 - frac * 0.9) * pulseWidth;
      const lw = Math.max(0.5, baseWidth * widthScale);

      // Color: smooth interpolation with hue cycling
      const colorFrac = frac + Math.sin(t * 0.5 + i * 0.7) * 0.2;
      const cf = Math.max(0, Math.min(1, colorFrac));
      const r = Math.round(baseColor[0] + (tipColor[0] - baseColor[0]) * cf);
      const g = Math.round(baseColor[1] + (tipColor[1] - baseColor[1]) * cf);
      const b = Math.round(baseColor[2] + (tipColor[2] - baseColor[2]) * cf);
      const alpha = (0.7 - frac * 0.4) * (0.3 + p * 0.7);

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(nextX, nextY);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.lineWidth = lw;
      ctx.lineCap = 'round';
      ctx.stroke();

      prevX = nextX;
      prevY = nextY;
    }
  }

}
