import { computed } from 'vue';
import { mount } from '@vue/test-utils';

import { useLineValues } from './line-values';

import { data, xScale, yScale } from '@test/unit/mock-data';

describe('line-values', () => {
  it('should convert index and values along with xScale and yScale into a path definition', () => {
    const expected = 'M36.857142857142854,121L110.57142857142856,242';
    const pathDefinition = useLineValues(
      1,
      [data[0].values[0], data[0].values[1]],
      xScale,
      yScale
    );
    expect(pathDefinition.value).toEqual(expected);
  });
});
