export enum Colors {
  Skyblue = 'skyblue',
  Royalblue = 'royalblue',
  Violet = 'violet',
  Darkteal = 'darkteal',
  Gold = 'gold',
}

export enum SequentialColors {
  Skyblue10 = 'skyblue-10',
  Skyblue20 = 'skyblue-20',
  Skyblue30 = 'skyblue-30',
  Skyblue40 = 'skyblue-40',
  Skyblue50 = 'skyblue-50',
  Skyblue60 = 'skyblue-60',
  Skyblue70 = 'skyblue-70',
  Skyblue80 = 'skyblue-80',
  Skyblue90 = 'skyblue-90',
  Skyblue100 = 'skyblue-100',

  Royalblue10 = 'royalblue-10',
  Royalblue20 = 'royalblue-20',
  Royalblue30 = 'royalblue-30',
  Royalblue40 = 'royalblue-40',
  Royalblue50 = 'royalblue-50',
  Royalblue60 = 'royalblue-60',
  Royalblue70 = 'royalblue-70',
  Royalblue80 = 'royalblue-80',
  Royalblue90 = 'royalblue-90',
  Royalblue100 = 'royalblue-100',

  Violet10 = 'violet-10',
  Violet20 = 'violet-20',
  Violet30 = 'violet-30',
  Violet40 = 'violet-40',
  Violet50 = 'violet-50',
  Violet60 = 'violet-60',
  Violet70 = 'violet-70',
  Violet80 = 'violet-80',
  Violet90 = 'violet-90',
  Violet100 = 'violet-100',

  Darkteal10 = 'darkteal-10',
  Darkteal20 = 'darkteal-20',
  Darkteal30 = 'darkteal-30',
  Darkteal40 = 'darkteal-40',
  Darkteal50 = 'darkteal-50',
  Darkteal60 = 'darkteal-60',
  Darkteal70 = 'darkteal-70',
  Darkteal80 = 'darkteal-80',
  Darkteal90 = 'darkteal-90',
  Darkteal100 = 'darkteal-100',

  Gold10 = 'gold-10',
  Gold20 = 'gold-20',
  Gold30 = 'gold-30',
  Gold40 = 'gold-40',
  Gold50 = 'gold-50',
  Gold60 = 'gold-60',
  Gold70 = 'gold-70',
  Gold80 = 'gold-80',
  Gold90 = 'gold-90',
  Gold100 = 'gold-100',
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
