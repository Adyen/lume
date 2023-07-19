import ResizeObserver from 'resize-observer-polyfill';

interface API {
  isSupported: boolean;
  disconnect: () => void;
}

function IframeResizer() {
  let scheduledObserver: number | null = null;
  let resizeObserver: API | null = null;
  let mutationObserver: API | null = null;

  function createObserver(
    Observer: typeof ResizeObserver | typeof MutationObserver,
    el: HTMLElement,
    notifier: (eventType?: string) => void,
    config?: MutationObserverInit
  ): API {
    const { name } = Observer;
    const api = {
      isSupported: false,
      disconnect: () => {},
    };

    if (name && name in window) {
      const observer = new Observer(() => notifier(name));

      if (config) {
        (observer as MutationObserver).observe(el, config);
      } else {
        observer.observe(el);
      }

      api.isSupported = true;
      api.disconnect = () => observer.disconnect();
    }

    return api;
  }

  function sendDataToParent(type, message) {
    const data = {
      type,
      message,
    };

    console.log('msg', data);
    window.top?.postMessage(data, '*');
  }

  function initNotifiers() {
    function notifyParent(eventType?: string) {
      cancelAnimationFrame(scheduledObserver as number);
      scheduledObserver = requestAnimationFrame(() =>
        sendDataToParent('RESIZED', {
          eventType,
          width: document.documentElement.offsetWidth,
          height: document.documentElement.offsetHeight,
          iframeHref: window.location.href,
        })
      );
    }

    resizeObserver = createObserver(
      ResizeObserver,
      document.body,
      notifyParent
    );

    mutationObserver = createObserver(
      MutationObserver,
      document.body,
      notifyParent,
      {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      }
    );

    notifyParent();

    if (!mutationObserver.isSupported) {
      sendDataToParent('NOT_SUPPORTED', null);
    }
  }

  function createNotifiers() {
    if (document.readyState != 'loading') {
      initNotifiers();
    } else {
      document.addEventListener('DOMContentLoaded', initNotifiers);
    }
  }

  function destroyNotifiers() {
    cancelAnimationFrame(scheduledObserver as number);

    if (resizeObserver) {
      resizeObserver.disconnect();
    }

    if (mutationObserver) {
      mutationObserver.disconnect();
    }
  }

  return {
    create: createNotifiers,
    destroy: destroyNotifiers,
  };
}

export default () => (Story, context) => {
  IframeResizer().create();
  return Story({ ...context });
};
