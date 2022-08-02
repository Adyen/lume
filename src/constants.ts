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

export const DEFAULT_PADDING = 0.33;
