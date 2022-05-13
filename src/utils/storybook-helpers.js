import { boolean, number, select, text } from '@storybook/addon-knobs';

const AXIS_GROUP = 'Axis';
const SIZE_GROUP = 'Size';

const TICK_FORMATS = {
  Null: null,
  Percentage: '~p',
};

/**
 * Provides knob properties to control a chart container size.
 */
export const SizeKnobsMixin = (defaultWidth, defaultHeight) => ({
  width: {
    type: Number,
    default: number('Width', defaultWidth || 540, {}, SIZE_GROUP),
  },
  height: {
    type: Number,
    default: number('Height', defaultHeight || 320, {}, SIZE_GROUP),
  },
});

/**
 * Provides knob properties to control axis options.
 * @param {('x'|'y')} type The axis type.
 */
export const AxisOptionsMixin = (type, isHorizontal = false) => {
  // Dev note: for the current `@storybook/addon-knobs` version (5.0.0) knobs need to have different names
  // even if their groupIds are different. This is was fixed on version [5.2.0](https://github.com/storybookjs/storybook/releases/tag/v5.2.0-alpha.36)
  const groupId = `${type} ` + AXIS_GROUP;
  const defaultGridLines =
    (type === 'y' && !isHorizontal) || (type === 'x' && isHorizontal);
  const prefix = (str) => type + str;

  return {
    [prefix('withLabel')]: {
      type: Boolean,
      default: boolean(type + ' With label', true, groupId),
    },
    [prefix('label')]: {
      type: String,
      default: text(type + ' Lines', '', groupId),
    },
    [prefix('gridLines')]: {
      type: Boolean,
      default: boolean(type + ' Grid lines', defaultGridLines, groupId),
    },
    [prefix('showTicks')]: {
      type: Boolean,
      default: boolean(type + ' Show ticks', true, groupId),
    },
    [prefix('tickCount')]: {
      type: Number,
      default: number(type + ' Tick count', undefined, {}, groupId),
    },
    [prefix('tickFormat')]: {
      type: String,
      default: select(
        type + ' Tick format',
        TICK_FORMATS,
        TICK_FORMATS.Null,
        groupId
      ),
    },
    [prefix('tickPadding')]: {
      type: Number,
      default: number(type + ' Tick padding', 8, {}, groupId),
    },
  };
};

/**
 * Converts prefixed knob properties into regular axis options.
 * This is required since `@storybook/addon-knobs` can't handle same name properties.
 * @param {Object} props Story component properties.
 * @param {('x'|'y')} type The axis type.
 * @returns {Object} An axis options object.
 */
export const convertAxisPropsIntoOptions = (props, type) => {
  const keys = Object.keys(props).filter((key) => key.startsWith(type));
  return keys.reduce((options, key) => {
    options[key.substring(1)] = props[key];
    return options;
  }, {});
};
