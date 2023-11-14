import { action } from '@storybook/addon-actions';

const CHART_EVENTS = [
  'axis-click',
  'axis-mouseenter',
  'axis-mouseleave',

  'rendered',
  'resize',

  'data-changed',
  'labels-changed',

  'chart-click',
  'chart-mouseenter',
  'chart-mouseleave',

  'legend-click',
  'legend-mouseenter',
  'legend-mouseleave',

  'bar-click',
  'line-click',
  'point-click',
  'node-click',
  'node-mouseenter',
  'node-mouseleave',
  'link-click',
  'link-mouseenter',
  'link-mouseleave',

  'tooltip-opened',
  'tooltip-moved',
  'tooltip-closed',
  'tooltip-mouseenter',
  'tooltip-mouseleave',

  'hovered-index-changed',
];

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

export const captureAction =
  (key: string) =>
    (...args) =>
      action(key)(...args);

export const actionEventHandlerTemplate = CHART_EVENTS.map(
  (key) =>
    `@${key}="(...args) => captureAction('${key.replace(/-/g, ' ')}')(...args)"`
).join(' ');
