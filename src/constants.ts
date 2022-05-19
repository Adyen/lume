type Orientation = 'horizontal' | 'vertical';

type Margins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const ORIENTATIONS = {
  HORIZONTAL: 'horizontal' as Orientation,
  VERTICAL: 'vertical' as Orientation,
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
