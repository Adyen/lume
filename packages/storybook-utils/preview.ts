import iFrameResizer from './decorators/iframe-resizer';

import '../lib/src/styles/font.scss';
import '../lib/src/styles/main.scss';

export const parameters = {
  controls: {
    expanded: true,
    hideNoControlsWarning: true,
    sort: 'requiredFirst',
    exclude: /<undefined>/g,
  },
  docs: {
    story: {
      inline: true,
      iframeHeight: 600,
    },
  },
  selectedPanel: 'storybook/actions/panel',
  backgrounds: {
    disable: true,
  },
};

export const decorators = [iFrameResizer()];
