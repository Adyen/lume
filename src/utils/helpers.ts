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

/**
 * Checks if provided data has only 1 dataset.
 * @param {Data} data The data prop
 * @returns {boolean} True if valid single dataset data
 */
export function singleDatasetValidator(data: Data): boolean {
  return data.length === 1;
}
