export enum Colors {
  Skyblue = 'skyblue',
  Royalblue = 'royalblue',
  Violet = 'violet',
  Darkteal = 'darkteal',
  Gold = 'gold',
}

export enum DivergentColors {
  SkyTeal = 'skyblue-darkteal',
  VioletRoyal = 'violet-royalblue',
  VioletTeal = 'violet-darkteal',
  GoldTeal = 'gold-darkteal',
  GoldRoyal = 'gold-royalblue',
}

export enum OtherColors {
  Grey = 'grey',
  Green = 'green',
  Orange = 'orange',
  Red = 'red',
}

export enum LegacyColors {
  '01' = '01',
  '02' = '02',
  '03' = '03',
  '04' = '04',
  '05' = '05',
  '06' = '06',
  '07' = '07',
  '08' = '08',
  '09' = '09',
}

export type Color = Colors | DivergentColors | LegacyColors;

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
