declare const setImmediate: unknown;

const scheduler =
  typeof setImmediate === 'function' ? setImmediate : setTimeout;

export const flushPromises = () => new Promise((resolve) => scheduler(resolve));
