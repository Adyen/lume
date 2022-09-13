import { scaleBand, scaleLinear } from 'd3-scale';
import { ref } from 'vue';

import {
  flatValues,
  getEmptyArrayFromData,
  getHighestValue,
  getScaleStep,
  isBandScale,
  isDatasetValueObject,
  isObject,
  mergeDeep,
  singleDatasetValidator
} from '@/utils/helpers';

describe('helpers.ts', () => {
  test('mergeDeep should merge target object into source object', () => {
    const source = { name: 'source' };
    const target = { level: 'root', children: [{ level: 'first', value: [5, 6, 7], children: [{ level: 'second', value: [8, 9, 10] } ] }] };
    const expectedMerger = { name: 'source', level: 'root', children: [{ level: 'first', value: [5, 6, 7], children: [{ level: 'second', value: [8, 9, 10] } ] }] };
    const merger = mergeDeep(source, target);

    expect(merger).toEqual(expectedMerger);
  });

  describe('flatValues', () => {
    test('should return empty array if dataset is null', () => {
      expect(flatValues(null)).toEqual([]);
    });

    test('should return flattened array of values', () => {
      const dataset = [{ values: [{ value: 1 }, { value: 2 }] }, { values: [{ value: 3 }, { value: 4 }] }];
      const flattened = flatValues(dataset);

      expect(flattened).toEqual([1, 2, 3, 4]);
    });
  })

  describe('getEmptyArrayFromData', () => {
    test('should throw an error if null is specified', () => {
      const t = () => getEmptyArrayFromData(null);

      expect(t).toThrow('No empty array can be created from specified data value');
    })

    test('should return empty array if empty array is given', () => {
      const emptyArrayFromData = getEmptyArrayFromData([]);

      expect(emptyArrayFromData).toEqual([]);
    })

    test('should return an empty array with the same length as specified array', () => {
      const arr = [{ values: [{ value: 1 }, { value: 2 }, { value: 3 }] }, { values: [{ value: 4 }, { value: 5 }] }];
      const emptyArray = getEmptyArrayFromData(arr);

      expect(emptyArray.length).toBe(arr[0].values.length);
      expect(emptyArray.every(record => !record)).toBe(true);
    })

    test('should return an empty array with the same length as specified array when argument is ref', () => {
      const arr = [{ values: [{ value: 1 }, { value: 2 }, { value: 3 }] }, { values: [{ value: 4 }, { value: 5 }] }];
      const arrWrappedInRef = ref(arr)
      const emptyArray = getEmptyArrayFromData(arrWrappedInRef);

      expect(emptyArray.length).toBe(arr[0].values.length);
      expect(emptyArray.every(record => !record)).toBe(true);
    })
  })

  describe('getHighestValue', () => {
    test('should throw an error when a falsy error is specified', () => {
      const t = () => getHighestValue(null, 0);

      expect(t).toThrow('Data is not a valid array')
    });

    test('should throw an error when an empty array is specified', () => {
      const t = () => getHighestValue([], 0);

      expect(t).toThrow('Cannot get highest value from empty array')
    });

    test('should throw an error when index is higher than the length of the datasets', () => {
      const dataset = [{ values: [{ value: 1 }, { value: 2 }] }, { values: [{ value: 3 }, { value: 4 }] }];
      const t = () => getHighestValue(dataset, 2);

      expect(t).toThrow('Index exceeds length of at least one of the datasets')
    });

    test('should return 20 as highest found value', () => {
      const dataset = [{ values: [{ value: 10 }, { value: 20 }] }, { values: [{ value: 15 }, { value: 5 }] }];
      const highestValue = getHighestValue(dataset, 1);

      expect(highestValue).toBe(20)
    });
  })

  describe('getScaleStep', () => {
    const maxVal = 1000;
    const width = 640;
    const labels = 'ABCDEFG'.split('');
    test('should return the correct step of a scale in case of a linear scale', () => {
      const scale = scaleLinear().range([0, maxVal]).domain([0, width]);

      expect(getScaleStep(scale)).toEqual(maxVal / width);
    })

    test('should return the correct step of a scale in case of a band scale', () => {
      const scale = scaleBand().range([0, maxVal]).domain(labels);

      expect(getScaleStep(scale)).toEqual(maxVal / labels.length);
    })
  })

  describe('isBandScale', () => {
    test('should return false if value is not a bandScale', () => {
      expect(isBandScale(null)).toBe(false);
    })

    test('should return true if value is a bandScale', () => {
      const scale = scaleBand();
      expect(isBandScale(scale)).toBe(true);
    })
  })

  describe('isDatasetValueObject', () => {
    test('should return false if value is null', () => {
      expect(isDatasetValueObject(null)).toBe(false);
    });

    test('should return false if value is only an object', () => {
      expect(isDatasetValueObject({})).toBe(false);
    });

    test('should return true if value is object with \'value\' as a member', () => {
      expect(isDatasetValueObject({ value: 1 })).toBe(true);
    })
  })

  describe('singleDatasetValidator', () => {
    test('should return true if length of array is one', () => {
      const dataset = [{ values: [] }];

      expect(singleDatasetValidator(dataset)).toBe(true);
    });

    test('singleDatasetValidator should return false if length of array is one', () => {
      const dataset = [{ values: [] }, { values: [] }];

      expect(singleDatasetValidator(dataset)).toBe(false);
    });
  });

  describe('isObject', () => {
    test('should return false if evaluated value is falsy', () => {
      expect(isObject(null)).toBe(false);
    })

    test('should return false if evaluated value is not an object', () => {
      expect(isObject(1)).toBe(false);
    })

    test('should return false if evaluated value is an array', () => {
      const arr = [];

      expect(isObject(arr)).toBe(false);
    });

    test('should return true if evaluated value is object', () => {
      const obj = {};

      expect(isObject(obj)).toBe(true);
    });
  });
})