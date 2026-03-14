export const meta = { name: 'solid fill', cool: false, type: 'fill', order: 0 };

export function applyStyle(fill, fillLine) {
  fill.style.background = '#e85d04';
  fillLine.style.background = 'none';
  fillLine.style.filter = 'none';
}
