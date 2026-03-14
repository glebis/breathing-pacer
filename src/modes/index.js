// Mode registry — import all modes and expose them as an ordered array.
// To add a new mode: create a file in src/modes/, export meta + draw/applyStyle,
// then add it to the imports and MODES array below.

import { meta as solidMeta, applyStyle as solidStyle } from './solid-fill.js';
import { meta as circleMeta, draw as circleDraw } from './circle.js';
import { meta as squareMeta, draw as squareDraw } from './square.js';
import { meta as diamondMeta, draw as diamondDraw } from './diamond.js';
import { meta as ringsMeta, draw as ringsDraw } from './rings.js';
import { meta as diagonalMeta, draw as diagonalDraw } from './diagonal.js';
import { meta as oceanMeta, draw as oceanDraw } from './ocean.js';
import { meta as frostMeta, draw as frostDraw } from './frost.js';
import { meta as coolSolidMeta, applyStyle as coolSolidStyle } from './cool-solid-fill.js';

// Each mode: { name, cool, type: 'canvas'|'fill', draw?, applyStyle? }
export const MODES = [
  { ...solidMeta, applyStyle: solidStyle },
  { ...circleMeta, type: 'canvas', draw: circleDraw },
  { ...squareMeta, type: 'canvas', draw: squareDraw },
  { ...diamondMeta, type: 'canvas', draw: diamondDraw },
  { ...ringsMeta, type: 'canvas', draw: ringsDraw },
  { ...diagonalMeta, type: 'canvas', draw: diagonalDraw },
  { ...oceanMeta, type: 'canvas', draw: oceanDraw },
  { ...frostMeta, type: 'canvas', draw: frostDraw },
  { ...coolSolidMeta, applyStyle: coolSolidStyle },
];
