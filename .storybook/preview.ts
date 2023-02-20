import { useArgs } from '@storybook/client-api';

import '@/styles/font.scss';
import '@/styles/main.scss';
import './preview-styles.scss';

export const parameters = {
  passArgsFirst: false,
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

export const decorators = [
  (story, context) => {
    const [_, updateArgs] = useArgs();
    return story({ ...context, updateArgs });
  },
  () => ({
    template: `
      <div class="preview">
        <div class="card">
          <story />
        </div>
      </div>
      `,
  }),
];
