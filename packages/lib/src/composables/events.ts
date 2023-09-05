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
];

interface EventBusInstance {
  $on: (
    event: string | Array<string>,
    fn: (...args: Array<unknown>) => void
  ) => void;
  $emit: (event: string, ...args: Array<unknown>) => void;
}

interface EventBusInstanceConstructor {
  new (): EventBusInstance;
}

let eventBus: EventBusInstance | null = null;

// Used to propagate events from the top-most component (needed for Vue 2)
export const useEvents = (
  emit: (e: string, p: unknown) => void,
  chartID: string
) => {
  async function initEventBus() {
    if (__VUE_VERSION__ === 3) return null;

    const Vue = (await import('vue')).default;
    eventBus = new (Vue as unknown as EventBusInstanceConstructor)();
  }

  async function busEmit(eventName: string, ...args: Array<unknown>) {
    if (!eventBus) await initEventBus();

    eventBus.$emit(`${chartID}_${eventName}`, ...args);
  }

  async function busListen(
    eventName: string,
    listener: (...args: Array<unknown>) => void
  ) {
    if (!eventBus) await initEventBus();

    eventBus.$on(`${chartID}_${eventName}`, listener);
  }

  const componentEventPropagator =
    __VUE_VERSION__ === 2
      ? CHART_EVENTS.reduce((obj, event) => {
        obj[event] = (payload) => emit(event, payload);
        return obj;
      }, {})
      : {};

  return { componentEventPropagator, busEmit, busListen };
};
