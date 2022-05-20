import { Color } from '@/types/colors';

interface DatasetValueObject {
  value: number;
  color?: Color;
}

export type DatasetValue = number | DatasetValueObject | Array<number>;

interface Dataset {
  values: Array<DatasetValue>;
  color?: Color;
  legend?: string;
}

export type Data = Array<Dataset>;
