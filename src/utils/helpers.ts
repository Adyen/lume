import { isRef, Ref } from 'vue';
import { ScaleBand } from 'd3-scale';
import { SankeyNode } from 'd3-sankey';

import {
  SankeyNodeAdditionalProperties,
  SankeyLinkAdditionalProperties,
} from '@/types/alluvial';
import { Data, DatasetValueObject } from '@/types/dataset';
import { Scale } from '@/composables/scales';

/**
 * Returns an array with all numeric values present in a chart's `data` (array of datasets).
 * @param {Data<DatasetValueObject>} data A computed array of datasets.
 * @returns {Array<number>} An array of all numeric values.
 */
export function flatValues(data: Data<DatasetValueObject>): Array<number> {
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
  const object = structuredClone(target);

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
  if (isBandScale(scale)) return scale.bandwidth();
  return Math.max(...scale.range()) / Math.max(...scale.domain());
}

const validateGetHighestValueArguments = (
  data: Data<DatasetValueObject>,
  index: number
) => {
  if (!data) {
    throw new Error('Data is not a valid array');
  }

  if (data.length === 0) {
    throw new Error('Cannot get highest value from empty array');
  }

  data.forEach(({ values }) => {
    if (values.length - 1 < index) {
      throw new Error('Index exceeds length of at least one of the datasets');
    }
  });
};

/**
 * Returns the highest value of all provided datasets in a given index.
 *
 * @param {Data} data The data to use.
 * @param {number} index THe index to check for.
 * @returns {number} The highest value.
 */
export function getHighestValue(
  data: Data<DatasetValueObject>,
  index: number
): number {
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
export function getEmptyArrayFromData(data: Data | Ref<Data>) {
  const dataArray = isRef(data) ? data.value : data;
  if (!dataArray) {
    throw new Error('No empty array can be created from specified data value');
  }

  // Use max length in case datasets have different lengths
  const maxLength = Math.max(
    ...dataArray.map((dataset) => dataset.values.length),
    0
  );

  return Array(...Array(maxLength));
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
 * Gets the ID of an alluvial node.
 * @param node An alluvial node.
 * @returns The node ID.
 */
export function getAlluvialNodeId(
  node:
    | string
    | number
    | SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>
): number | string {
  if (typeof node === 'string' || typeof node === 'number') return node;
  return node.id ?? node.label;
}

/**
 * Checks if a given node or link is being hovered.
 * @param id The node/link ID.
 * @param highlightedIds An array of IDs currently hovered.
 * @returns True if node is being hovered.
 */
export function isNodeOrLinkFaded(id: string, highlightedIds: Array<string>) {
  return highlightedIds.length && highlightedIds.indexOf(id) === -1;
}
