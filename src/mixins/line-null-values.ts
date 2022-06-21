import { computed, Ref } from '@vue/composition-api';
import { DatasetValue } from '@/types/dataset';

export function useLineNullValues(values: Ref<Array<DatasetValue>>) {
  /**
   * Returns an array of intervals where the data is null.
   * Each interval is an array containing the indexes of null values
   * E.g. for data of `[500, 400, null, 300, null, null, 200]` returns `[ [2], [4, 5] ]`
   */
  const nullIntervals = computed(() => {
    let currentInterval: Array<number> = null;

    return values.value?.reduce(
      (intervals: Array<Array<number>>, value: DatasetValue | null, index) => {
        if (value == null) {
          if (!currentInterval) {
            currentInterval = [index];
            if (index === values.value?.length - 1)
              intervals.push(currentInterval); // If last value is `null`
          } else currentInterval.push(index);
        } else if (currentInterval) {
          intervals.push(currentInterval);
          currentInterval = null;
        }
        return intervals;
      },
      []
    );
  });

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

    if (start > end) return start - sum;
    else return start + sum;
  }

  /**
   * Checks if the line at the current index should be dashed.
   * @param {Number} index The data point index.
   * @returns {Boolean} True if line at this point should be dashed.
   */
  function isDashed(index: number): boolean {
    return !!nullIntervals.value.find(
      (interval) => interval.includes(index) || interval.includes(index - 1)
    );
  }

  return { nullIntervals, getMidValue, isDashed };
}
