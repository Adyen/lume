import { Color } from '@/types/colors';

interface DatasetValueObject {
  value: number;
  color?: Color;
}

export type DatasetValue = number | DatasetValueObject | Array<number>;

interface DatasetEntry {
  values: Array<DatasetValue>;
  color?: Color;
  legend?: string;
}

export type Dataset = Array<DatasetEntry>;
