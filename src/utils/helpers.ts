import { Data, DatasetValueObject } from '@/types/dataset';

/**
 * Returns an array with all numeric values present in a chart's `data` (array of datasets).
 * @param {Data<DatasetValueObject>} data A computed array of datasets.
 * @returns {Array<number>} An array of all numeric values.
 */
export function flatValues(data: Data<DatasetValueObject>): Array<number> {
  return data
    .map((dataset) =>
      dataset.values.map((datasetValue) => datasetValue?.value).flat()
    )
    .flat();
}
