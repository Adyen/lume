import { parameters as baseParameters } from 'storybook-utils/preview';

export { decorators } from 'storybook-utils/preview';

export const parameters = {
  ...baseParameters,
  docs: {
    ...baseParameters.docs,
    codePanel: true,
    source: {
      format: true,
    },
  },
};
