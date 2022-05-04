import { number } from '@storybook/addon-knobs';

export const SizeKnobsMixin = () => ({
    width: {
        type: Number,
        default: number('Width', 540, {}, 'Size')
    },
    height: {
        type: Number,
        default: number('Height', 320, {}, 'Size')
    }
})