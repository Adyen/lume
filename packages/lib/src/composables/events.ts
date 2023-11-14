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

  'hovered-index-changed',
];

// Used to propagate events from the top-most component (needed for Vue 2)
export const useEvents = (
  emit: (e: string, p: unknown) => void,
  chartID: string
) => {
  function emitInternalEvent(eventName: string, ...args: Array<unknown>) {
    if (__VUE_VERSION__ === 2) {
      document.dispatchEvent(
        new CustomEvent(`${chartID}_${eventName}`, {
          detail: [...args],
        })
      );
    }
  }

  function listenInternalEvent(
    eventName: string,
    listener: (...args: Array<unknown>) => void
  ) {
    if (__VUE_VERSION__ === 2) {
      document.addEventListener(
        `${chartID}_${eventName}`,
        (e: CustomEventInit) => listener(...e.detail)
      );
    }
  }

  const componentEventPropagator =
    __VUE_VERSION__ === 2
      ? CHART_EVENTS.reduce((obj, event) => {
        obj[event] = (payload) => emit(event, payload);
        return obj;
      }, {})
      : {};

  return { componentEventPropagator, emitInternalEvent, listenInternalEvent };
};
