import { getLinePathDefinition } from './line-values';

import { data, xScale, yScale } from '@test/unit/mock-data';

describe('line-values', () => {
  it('should generate a path definition string', () => {
    const pathDefinition = getLinePathDefinition(
      1,
      [data[0].values[0].value, data[0].values[1].value],
      xScale,
      yScale
    );

    // should return a string
    expect(typeof pathDefinition).toBe('string');

    // shouldn't have any NaNs - otherwise something would be wrong
    expect(pathDefinition?.includes('NaN')).toBeFalsy();
  });
});
