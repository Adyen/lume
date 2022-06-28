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

/**
 * Checks if provided item is an object.
 * @param {unknown} item
 * @returns {boolean} True if item is an object.
 */
export function isObject(item: unknown): item is Record<string, unknown> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merge n objects.
 * Clones both target and sources so that they don't get mutated.
 *
 * @param {Record<string, unknown>} target Object to merge to.
 * @param {Array<Record<string, unknown>>} source Object(s) to merge into target.
 */
export function mergeDeep(
  target: Record<string, unknown>,
  source: Record<string, unknown>
) {
  const object = structuredClone(target);

  Object.entries(source).forEach(([key, value]) => {
    object[key] =
      isObject(target[key]) && isObject(value)
        ? mergeDeep(target[key] as Record<string, unknown>, value)
        : value;
  });

  return object;
}
