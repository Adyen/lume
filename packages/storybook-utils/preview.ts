import iFrameResizer from './decorators/iframe-resizer';

import '../lib/src/styles/font.scss';
import '../lib/src/styles/main.scss';

import './preview-styles.scss';

export const parameters = {
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#f3f6f9',
      },
      {
        name: 'dark',
        value: '#20304c',
      },
    ],
  },
  controls: {
    hideNoControlsWarning: true,
    expanded: true, // show all documentation with control input
  },
};

export function getDecorators(version: 2 | 3) {
  return [
    iFrameResizer(),
    () => ({
      template: `
      <div class="preview">
        <div class="card">
          <span class="version-tag">Vue ${version}</span>
          <story />
        </div>
      </div>
      `,
    }),
  ];
}
