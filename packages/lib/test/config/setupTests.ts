// Jest cannot find these functionalities natively, so we pad them in as best we need to
global.ResizeObserver = require('resize-observer-polyfill');
global.structuredClone = (object) => JSON.parse(JSON.stringify(object));
global.waitFor = (assertion, { interval = 20, timeout = 1000 } = {}) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const tryAgain = () => {
      setTimeout(() => {
        try {
          resolve(assertion());
        } catch (err) {
          Date.now() - startTime > timeout ? reject(err) : tryAgain();
        }
      }, interval);
    };

    tryAgain();
  });
};

export {};
