export const meta = { name: 'ocean sweep', cool: true };

export function draw(p, phase, ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  const t = Date.now() * 0.001;
  const layers = 7;

  const layerSeeds = [0, 1.7, 0.4, 2.3, 1.1, 3.0, 0.8];
  const layerSpacing = [0.05, 0.12, 0.08, 0.18, 0.1, 0.22, 0.15];
  const layerDelay = [0, 0.3, 0.1, 0.5, 0.2, 0.7, 0.4];

  let cumY = 0;
  const layerBasePositions = [];
  for (let i = 0; i < layers; i++) {
    cumY += layerSpacing[i];
    layerBasePositions.push(cumY);
  }
  const totalSpan = cumY;

  for (let i = 0; i < layers; i++) {
    const normPos = layerBasePositions[i] / totalSpan;
    const restY = h * (1 - normPos * 0.15);

    const delay = layerDelay[i];
    const layerP = Math.max(0, Math.min(1, (p - delay * 0.3) / (1 - delay * 0.3)));
    const eased = layerP < 0.1
      ? layerP * layerP * 50
      : 0.5 + 0.5 * Math.pow((layerP - 0.1) / 0.9, 0.7);

    const riseAmount = normPos * 0.65 * eased;
    const y = restY - h * riseAmount;

    ctx.beginPath();
    ctx.moveTo(-10, y);

    const seed = layerSeeds[i];
    const amp1 = 15 + i * 7 + Math.sin(t * 0.25 + seed) * 8;
    const amp2 = 8 + i * 4 + Math.sin(t * 0.6 + seed * 2) * 5;
    const amp3 = 4 + Math.sin(t * 0.9 + seed * 3) * 4;
    const amp4 = 2 + Math.sin(t * 1.3 + seed) * 2;
    const freq1 = 0.002 + Math.sin(t * 0.15 + seed) * 0.001;
    const freq2 = 0.007 + i * 0.002;
    const freq3 = 0.018 + Math.sin(t * 0.4 + seed) * 0.005;
    const freq4 = 0.035 + i * 0.003;
    const ph1 = t * (0.3 + seed * 0.12);
    const ph2 = t * (0.6 + seed * 0.08) + seed * 2.1;
    const ph3 = t * (1.0 + seed * 0.06) + seed * 0.7;
    const ph4 = t * (1.5 + seed * 0.1) + seed * 1.3;

    for (let x = -10; x <= w + 10; x += 3) {
      const wave = Math.sin(x * freq1 + ph1) * amp1
                 + Math.sin(x * freq2 + ph2) * amp2
                 + Math.sin(x * freq3 + ph3) * amp3
                 + Math.sin(x * freq4 + ph4) * amp4;
      ctx.lineTo(x, y + wave);
    }

    ctx.lineTo(w + 10, h + 10);
    ctx.lineTo(-10, h + 10);
    ctx.closePath();

    const alpha = (0.04 + normPos * 0.08) * (0.3 + eased * 0.7);
    const colors = [
      `rgba(10, 40, 120, ${alpha})`,
      `rgba(20, 70, 160, ${alpha * 0.95})`,
      `rgba(40, 100, 190, ${alpha * 0.85})`,
      `rgba(15, 55, 145, ${alpha * 0.9})`,
      `rgba(35, 85, 175, ${alpha * 0.8})`,
      `rgba(55, 120, 200, ${alpha * 0.75})`,
      `rgba(25, 65, 155, ${alpha * 0.85})`,
    ];
    ctx.fillStyle = colors[i];
    ctx.fill();
  }

  // Shimmer lines
  const shimmerCount = 4;
  const shimmerGaps = [0.06, 0.14, 0.09, 0.2];
  let shimmerCumY = 0;
  for (let s = 0; s < shimmerCount; s++) {
    shimmerCumY += shimmerGaps[s];
    const shimmerDelay = s * 0.15;
    const sP = Math.max(0, Math.min(1, (p - shimmerDelay * 0.2) / (1 - shimmerDelay * 0.2)));
    const sEased = sP < 0.1 ? sP * sP * 50 : 0.5 + 0.5 * Math.pow((sP - 0.1) / 0.9, 0.7);

    const shimmerY = h * (0.92 - shimmerCumY * 0.8 * sEased);
    const shimmerAlpha = (0.15 + sEased * 0.35) * (1 - s * 0.2);
    ctx.strokeStyle = `rgba(140, 210, 255, ${shimmerAlpha})`;
    ctx.lineWidth = 3.5 - s * 0.6;
    ctx.beginPath();

    const sFreq1 = 0.004 + s * 0.003;
    const sFreq2 = 0.011 + s * 0.006;
    const sFreq3 = 0.022 + s * 0.005;
    const sFreq4 = 0.04 + s * 0.003;
    const sPhase = t * (0.6 + s * 0.35);

    for (let x = 0; x <= w; x += 2) {
      const wave = Math.sin(x * sFreq1 + sPhase) * (12 + s * 5)
                 + Math.sin(x * sFreq2 + sPhase * 1.4) * (6 + s * 3)
                 + Math.sin(x * sFreq3 + sPhase * 0.8 + s) * (4 + s * 2)
                 + Math.sin(x * sFreq4 + sPhase * 1.7) * (2 + s);
      if (x === 0) ctx.moveTo(x, shimmerY + wave);
      else ctx.lineTo(x, shimmerY + wave);
    }
    ctx.stroke();
  }

  // Scattered foam
  const seed = Math.floor(t * 1.5);
  for (let d = 0; d < 18; d++) {
    const dx = ((seed * 127 + d * 311 + d * d * 73) % w);
    const topWaveY = h * (0.92 - 0.49 * p);
    const dy = topWaveY + Math.sin(t * 1.8 + d * 1.7) * 20 - d * 5;
    const da = Math.max(0, 0.06 * p * (1 - (d / 18)));
    if (da > 0.01) {
      const size = 1 + (d % 3);
      ctx.fillStyle = `rgba(180, 220, 255, ${da})`;
      ctx.fillRect(dx, dy, size, size);
    }
  }
}
