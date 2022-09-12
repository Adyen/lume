import { Color } from '@/types/colors';

type ChartType = 'bar' | 'line';

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
