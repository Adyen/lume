export const COLOR_CLASS_MAP = {
  Yellow: '01',
  Green: '02',
  Turquoise: '03',
  Blue: '04',
  Navy: '05',
  Gray: '06',
  Orange: '07',
  Teal: '08',
  Red: '09',
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
