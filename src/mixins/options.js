export default function OptionsMixin(defaultOptions = {}) {
    // @vue/component
    return {
        props: {
            /**
             * Component options property.
             * Should not be accessed directly, use "allOptions" instead.
             * @type {Object}
             */
            options: {
                type: Object,
                default: () => ({}),
            },
        },
        computed: {
            /**
             * Object with merged default and specified options.
             * @return {Object} Merged component options.
             */
            // eslint-disable-next-line vue/no-unused-properties -- mixin property
            allOptions() {
                return { ...defaultOptions, ...this.options }
            },
        },
    };
}
