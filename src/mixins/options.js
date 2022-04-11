export default function OptionsMixin(defaultOptions = {}) {
    // @vue/component
    return {
        props: {
            /**
             * Controls the display of chart axes.
             * @return {Boolean}
             */
            // eslint-disable-next-line vue/no-unused-properties -- mixin property
            showAxes: {
                type: Boolean,
                default: true
            }
        }
    };
}
