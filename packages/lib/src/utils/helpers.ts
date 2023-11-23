import { isRef, Ref, Slots } from 'vue';
import { ScaleBand } from 'd3';

import {
  Data,
  DatasetValueObject,
  InternalData,
  InternalDataset,
} from '@/types/dataset';
import { Scale } from '@/composables/scales';
import { warn, Warnings } from '@/utils/warnings';

// Slots from <lume-chart>
const CHART_SLOTS = [
  'controls',
  'legend',
  'axes',
  'groups',
  'tooltip',
  'tooltip-content',
];

export function isProd() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Returns an array with all numeric values present in a chart's `data` (array of datasets).
 * @param {Data<DatasetValueObject>} data A computed array of datasets.
 * @returns {Array<number>} An array of all numeric values.
 */
export function flatValues(data: InternalData): Array<number> {
  return (
    data
      ?.map((dataset) =>
        dataset.values.map((datasetValue) => datasetValue?.value).flat()
      )
      .flat() || []
  );
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
 * Checks if provided data is valid for a chart legend.
 * @param {InternalData} data The data prop.
 * @returns {boolean} True if valid data.
 */
export function dataValidator(data: InternalData): boolean {
  return (
    !!data &&
    data.every(
      (dataset: InternalDataset<DatasetValueObject>) => 'color' in dataset
    )
  );
}

/**
 * Checks if provided item is an object.
 * @param {unknown} item
 * @returns {boolean} True if item is an object.
 */
export function isObject(item: unknown): item is Record<string, unknown> {
  return !!item && typeof item === 'object' && !Array.isArray(item);
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
  const object = { ...target }; // structuredClone doesn't work for objects that have functions

  Object.entries(source).forEach(([key, value]) => {
    object[key] =
      isObject(target[key]) && isObject(value)
        ? mergeDeep(target[key] as Record<string, unknown>, value)
        : value;
  });

  return object;
}

/**
 * Checks if provided item is a DatasetValueObject.
 * @param {unknown} object
 * @returns {boolean} True if item is a DatasetValueObject.
 */
export function isDatasetValueObject(
  object: unknown
): object is DatasetValueObject {
  return (
    object != null &&
    isObject(object) &&
    'value' in (object as unknown as DatasetValueObject)
  );
}

export function isBandScale(scale: Scale): scale is ScaleBand<string | number> {
  return (scale as ScaleBand<string | number>)?.bandwidth !== undefined;
}

export function getScaleStep(scale: Scale) {
  if (isBandScale(scale)) return scale.step();
  return Math.max(...scale.range()) / Math.max(...scale.domain());
}

const validateGetHighestValueArguments = (
  data: InternalData,
  index: number
) => {
  if (!data) {
    throw new Error('Data is not a valid array');
  }

  if (data.length === 0) {
    throw new Error('Cannot get highest value from empty array');
  }

  const isIndexPresentInGroup = data.some(
    ({ values }) => values.length - 1 >= index
  );
  if (!isIndexPresentInGroup) {
    warn(Warnings.IndexExceedsLengthOfDataSets);
  }
};

/**
 * Returns the highest value of all provided datasets in a given index.
 *
 * @param {Data} data The data to use.
 * @param {number} index THe index to check for.
 * @returns {number} The highest value.
 */
export function getHighestValue(data: InternalData, index: number): number {
  validateGetHighestValueArguments(data, index);

  return (
    data.reduce((max, point) =>
      (max.values[index]?.value ?? 0) > (point.values[index]?.value ?? 0)
        ? max
        : point
    ).values[index]?.value || 0
  );
}

/**
 * Returns an empty array with length equal to that of the dataset.
 *
 * @param data A data group.
 * @returns An empty array.
 */
export function getEmptyArrayFromData(
  data: (Data | InternalData) | Ref<Data | InternalData>
) {
  const dataArray = isRef(data) ? data.value : data;
  if (!dataArray) {
    throw new Error('No empty array can be created from specified data value');
  }

  // Use max length in case datasets have different lengths
  const maxLength = Math.max(
    ...dataArray.map((dataset) => dataset.values.length),
    0
  );

  return Array(maxLength).fill(null);
}

/**
 * Returns the length of a scale domain.
 *
 * @param scale The scale to get the length from.
 * @returns The domain length.
 */
export function getDomainLength(scale: Scale): number {
  return isBandScale(scale)
    ? scale.domain().length
    : Math.max(...scale.domain());
}

/**
 * Generates an interpolator from `start` to `end`, this is equivalent to d3-interpolate interpolateRound function.
 * @param start {number}
 * @param end {number}
 */
export function interpolateRound(start: number, end: number) {
  return (t: number) => Math.round(start * (1 - t) + end * t);
}

/**
 * Shifts all items in an array N number of indexes.
 * Default direction is to the left (e.g [1, 2, 3] -> [2, 3, 1])
 * @param array An array to shift.
 * @param amount N number of indexes to move.
 * @param toRight If true, moves items to the right instead.
 * @returns A same length array with its items moved.
 */
export function shiftItems(
  array: Array<unknown>,
  amount: number,
  toRight?: boolean
) {
  const N = toRight ? array.length - amount : amount;
  const front = array.slice(0, N);
  const back = array.slice(N);
  return back.concat(front);
}

/**
 * @param slots
 * @returns all slots except the groups
 */
export function excludeGroups(slots: Slots) {
  if (slots.groups) {
    const keys = Object.keys(slots);
    return Object.assign(
      {},
      ...keys.map((key) => (key !== 'groups' ? { [key]: slots[key] } : {}))
    );
  }
  return slots;
}

/**
 * @param slots
 * @returns all slots except the ones present in LumeChart
 */
export function excludeChartSlots(slots: Slots) {
  return Object.assign(
    {},
    ...Object.keys(slots).map((key) =>
      CHART_SLOTS.includes(key) ? {} : { [key]: slots[key] }
    )
  );
}

/**
 * Generates a random string.
 * https://github.com/ai/nanoid/blob/main/nanoid.js
 *
 * @param t String length.
 * @returns Random string of characters.
 */
export const nanoid = (n = 21) =>
  crypto
    .getRandomValues(new Uint8Array(n))
    .reduce(
      (n, e) =>
        (n +=
          (e &= 63) < 36
            ? e.toString(36)
            : e < 62
              ? (e - 26).toString(36).toUpperCase()
              : e > 62
                ? '-'
                : '_'),
      ''
    );
