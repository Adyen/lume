import { AxisOptions } from '@/mixins/options';

const options: AxisOptions = {
  /** Displays a line for each tick. If not specified but axis type is `y`, will show grid lines. */
  gridLines: false,
  /** Displays the axis title. */
  withTitle: true,
  //
  //// Tick settings
  //
  /** Controls if the tick labels should be displayed. */
  showTicks: true,
  /** Amount of ticks to display in the axis. */
  tickCount: 10,
  /** Formatting string/function for the tick label. */
  tickFormat: null,
  /** Space between the tick label and the axis line. */
  tickPadding: 8,
};

export const xOptions: AxisOptions = {
  ...options,
  withTitle: false,
  skip: true,
};

export const yOptions: AxisOptions = {
  ...options,
};
