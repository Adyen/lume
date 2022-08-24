export type Margins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type Orientation = 'horizontal' | 'vertical';

export const ORIENTATIONS: Record<string, Orientation> = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
};

export type BarType = 'single' | 'grouped' | 'stacked';

export const BAR_TYPES: Record<string, BarType> = {
  SINGLE: 'single',
  GROUPED: 'grouped',
  STACKED: 'stacked',
};

export const DEFAULT_MARGINS = {
  VERTICAL: {
    top: 16,
    right: 0,
    bottom: 28,
    left: 24,
  } as Margins,
  HORIZONTAL: {
    top: 16,
    right: 0,
    bottom: 28,
    left: 24,
  } as Margins,
};

export const NO_DATA = 'No data';

export const BAR_HEIGHT = 20;

export const PADDING_VERTICAL = 0.33; // space between bars is 1/2 of a bar's width
export const PADDING_HORIZONTAL = 0.5; // space between bars is a bar's width

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
