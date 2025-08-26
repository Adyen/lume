import ResizeObserver from 'resize-observer-polyfill';

// Jest cannot find these functionalities natively, so we pad them in as best we need to
global.ResizeObserver = ResizeObserver;
global.structuredClone = (object) => JSON.parse(JSON.stringify(object));
global.waitFor = (assertion, { interval = 20, timeout = 1000 } = {}) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const tryAgain = () => {
      setTimeout(() => {
        try {
          resolve(assertion());
        } catch (err) {
          if (Date.now() - startTime > timeout) reject(err);
          else tryAgain();
        }
      }, interval);
    };

    tryAgain();
  });
};

export {};
