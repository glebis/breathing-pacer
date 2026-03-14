export const meta = { name: 'frost field', cool: true };

export function draw(p, phase, ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  const hexR = 40;
  const rowH = hexR * Math.sqrt(3);
  const cols = Math.ceil(w / (hexR * 1.5)) + 2;
  const rows = Math.ceil(h / rowH) + 2;

  const centerX = w / 2, centerY = h / 2;
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const x = col * hexR * 1.5;
      const y = row * rowH + (col % 2 ? rowH / 2 : 0);

      const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const normDist = dist / maxDist;

      const threshold = p * 1.3;
      if (normDist > threshold) continue;

      const fadeIn = Math.max(0, 1 - (normDist / threshold));
      const alpha = fadeIn * (0.08 + p * 0.12);

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = x + hexR * 0.7 * Math.cos(angle);
        const hy = y + hexR * 0.7 * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();

      ctx.strokeStyle = `rgba(100, 180, 240, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}
