type Margins = {
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
    top: 44,
    right: 0,
    bottom: 32,
    left: 32,
  } as Margins,
  HORIZONTAL: {
    top: 44,
    right: 0,
    bottom: 32,
    left: 32,
  } as Margins,
};

export const NO_DATA = 'No data';
