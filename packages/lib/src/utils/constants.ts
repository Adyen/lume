import type { BarType, Orientation } from '../types/utils';

export const ORIENTATIONS: Record<string, Orientation> = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
};

export const BAR_TYPES: Record<string, BarType> = {
  SINGLE: 'single',
  GROUPED: 'grouped',
  STACKED: 'stacked',
};

export const NO_DATA = 'No data';

export const BAR_HEIGHT = 20;

export const PADDING_VERTICAL = 0.33; // space between bars is 1/2 of a bar's width
export const PADDING_HORIZONTAL = 0.5; // space between bars is a bar's width

export const AXIS_TEXT_HEIGHT = 12;
export const AXIS_GHOST_PADDING = 8;

// Default radius for the tooltip anchor circle.
// Adding a negligible radius for tooltip anchor, as firefox doesn't respect tooltip element positioning without the circle having actual radius.
export const TOOLTIP_ANCHOR_RADIUS = 1;

export const TOOLTIP_POSITIONS = [
  'auto',
  'auto-start',
  'auto-end',
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
] as const; // so that type is not string[]
