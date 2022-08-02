const AXIS_GROUP = 'Axis';
const SIZE_GROUP = 'Size';

const TICK_FORMATS = {
  Null: null,
  Percentage: '~p',
};

/**
 * Provides knob properties to control a chart container size.
 */

export const withSizeArgTypes = () => ({
  width: {
    control: { type: 'number', step: 10 },
    description: 'Chart width value (px).',
  },
  height: {
    control: { type: 'number', step: 10 },
    description: 'Chart height value (px).',
  },
});

export const withSizeArgs = (
  defaultWidth?: number,
  defaultHeight?: number
) => ({
  width: defaultWidth || 540,
  height: defaultHeight || 360,
});
