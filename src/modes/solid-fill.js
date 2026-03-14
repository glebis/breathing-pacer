export const meta = { name: 'solid fill', cool: false, type: 'fill' };

export function applyStyle(fill, fillLine) {
  fill.style.background = 'rgba(232, 93, 4, 0.35)';
  fillLine.style.background = '#ffd60a';
  fillLine.style.filter = 'blur(6px)';
}
