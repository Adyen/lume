import { computed, Ref } from 'vue';
import { NO_DATA } from '@/utils/constants';
import type { DatasetValueObject, InternalData } from '@/types/dataset';

export function useLineNullValues(data: Ref<InternalData>) {
  /**
   * Returns an array of intervals where the data is null.
   * Each interval is an array containing the indexes of null values
   * E.g. for data of `[500, 400, null, 300, null, null, 200]` returns `[ [2], [4, 5] ]`
   */
  function getNullIntervals(values: DatasetValueObject<number>[]) {
    let currentInterval: Array<number> = null;

    return values?.reduce((intervals: Array<Array<number>>, value, index) => {
      // check for `null` or { value: null }
      if (value == null || value.value == null) {
        if (currentInterval) currentInterval.push(index);
        else currentInterval = [index];

        // If last value is `null`
        if (index === values?.length - 1) {
          intervals.push(currentInterval);
        }
      } else if (currentInterval) {
        intervals.push(currentInterval);
        currentInterval = null;
      }

      return intervals;
    }, []);
  }

  /**
   * Returns a value inbetween the start and end values, based on the index provided.
   * This is used to calculate the coordinates for null values between non-null values.
   *
   * @param {Number} start Interval start value
   * @param {Number} end Interval end value
   * @param {Number} length Interval length - how many steps between start and end values
   * @param {Number} index The current step
   * @returns Mid-way value between start and end.
   */
  function getMidValue(
    start: number,
    end: number,
    length: number,
    index: number
  ): number {
    const diff = Math.abs(start - end);
    const step = diff / (length + 1);
    const sum = step * (index + 1);

    if (start == null && end == null) return null;

    if (start > end) return start - sum;
    else return start + sum;
  }

  /**
   * Checks if the line at the current index should be dashed.
   * @param {Number} index The data point index.
   * @returns {Boolean} True if line at this point should be dashed.
   */
  function generateIsDashed(nullIntervals: number[][]) {
    return function isDashed(index: number): boolean {
      return !!nullIntervals.find(
        (interval) => interval.includes(index) || interval.includes(index - 1)
      );
    };
  }

  const computedLineData = computed(() => {
    return data.value.map((dataset) => {
      const nullIntervals = getNullIntervals(dataset.values);

      return {
        ...dataset,
        isDashed: generateIsDashed(nullIntervals),
        values: dataset.values.map((value, index) => {
          const nullInterval = nullIntervals.find((interval) =>
            interval.includes(index)
          );
          if (nullInterval) {
            const startIndex = nullInterval[0] - 1; // dataset value of index before the null interval starts
            const endIndex = nullInterval[nullInterval.length - 1] + 1; // dataset value of index after the null interval ends

            let start = dataset.values[startIndex]?.value;
            let end = dataset.values[endIndex]?.value;

            // If first/last value is `null`, use the first/last non-null value
            if (start == null) start = end;
            if (end == null) end = start;

            return {
              value: getMidValue(
                start,
                end,
                nullInterval.length,
                nullInterval.indexOf(index)
              ),
              label: NO_DATA,
            };
          }
          return value;
        }),
      };
    });
  });

  return { computedLineData };
}
