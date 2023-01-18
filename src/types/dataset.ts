import { Color } from '@/constants';

export type ChartType = 'grouped-bar' | 'line' | 'single-bar' | 'stacked-bar';

type DatasetValueType = number | string | Array<number>;

export interface DatasetValueObject<T extends DatasetValueType = number> {
  value: T;
  color?: Color;
  label?: string;
}

export type DatasetValue<T extends DatasetValueType = number> =
  | number
  | DatasetValueObject<T>
  | null;

export interface Dataset<T> {
  values: Array<T>;
  color?: Color;
  label?: string;
  areaColor?: Color;
  legend?: string;
  type?: ChartType;
  isDashed?: (index: number) => boolean; // for line datasets
}

export type Data<T extends DatasetValue = DatasetValue> = Array<Dataset<T>>;

export enum ColorPalette {
  Categorical = 'categorical',
  Sequential = 'sequential',
  Divergent = 'divergent',
}

export interface InternalDataset
  extends Omit<Dataset<DatasetValueObject>, 'values' | 'color'> {
  values: Array<DatasetValueObject>;
  color: string; // TODO: InternalColor type that contains all colors w/ variants (e.g. skyblue-40)
  __internal: true;
}

export type InternalData = Array<InternalDataset>;
