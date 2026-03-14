export const meta = { name: 'cool solid fill', cool: true, type: 'fill' };

export function applyStyle(fill, fillLine) {
  fill.style.background = 'rgba(58, 134, 255, 0.25)';
  fillLine.style.background = 'rgba(120, 200, 255, 0.6)';
  fillLine.style.filter = 'blur(8px)';
}
