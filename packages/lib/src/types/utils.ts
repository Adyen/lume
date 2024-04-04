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
  White = 'white',
  Black = 'black',
  Green = 'green',
  Orange = 'orange',
  Red = 'red',
  Grey = 'grey',
  Grey10 = 'grey-10',
  Grey20 = 'grey-20',
  Grey30 = 'grey-30',
  Grey40 = 'grey-40',
  Grey50 = 'grey-50',
  Grey60 = 'grey-60',
  Grey70 = 'grey-70',
  Grey80 = 'grey-80',
  Grey90 = 'grey-90',
  Grey100 = 'grey-100',
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

export type Color = Colors | DivergentColors | LegacyColors | OtherColors;

export type Margins =
  | 'auto'
  | {
      top?: number | 'auto';
      right?: number | 'auto';
      bottom?: number | 'auto';
      left?: number | 'auto';
    };

export type InternalMargins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type Orientation = 'horizontal' | 'vertical';

export type BarType = 'single' | 'grouped' | 'stacked';

export type BarChartVariant = `${BarType}-bar`;

export type BarLineChartType = BarChartVariant | 'line';

export type AllChartType = 'bar' | BarLineChartType | 'alluvial' | 'sparkline';

export type ChartTypeWithoutVariant = Exclude<AllChartType, BarChartVariant>;
