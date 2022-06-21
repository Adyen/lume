const DEFAULTS = {
  TICK_PADDING: 8,
};

export const options = {
  /**
   * Displays a line for each tick. If not specified but axis type is `y`, will show grid lines.
   * @type {Boolean}
   */
  gridLines: false,
  //
  //// Tick settings
  //
  /**
   * Controls if the tick labels should be displayed.
   * @type {Boolean}
   */
  showTicks: true,
  /**
   * Amount of ticks to display in the axis.
   * @type {Number}
   */
  tickCount: null,
  /**
   * Formatting string/function for the tick label. -- currently UNUSED
   * @type {(String|Function)}
   */
  tickFormat: null,
  /**
   * Space between the tick label and the axis line.
   * @type {Number}
   */
  tickPadding: DEFAULTS.TICK_PADDING,
};
