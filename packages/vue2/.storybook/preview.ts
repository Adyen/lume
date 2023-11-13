import { getDecorators } from 'storybook-utils/preview';

export { parameters } from 'storybook-utils/preview';

export const decorators = getDecorators(2);

// Fixes method "toJSON" is not defined on click event in storybook
// See https://github.com/storybookjs/storybook/issues/14933#issuecomment-920578274
const Vue = (await import('vue')).default;
Vue.prototype.toJSON = () => {};
