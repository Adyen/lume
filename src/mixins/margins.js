export default function MarginsMixin(defaultMargins = {}) {
    // @vue/component
    return {
        computed: {
            /**
             * Object with top, right, bottom and left side margins.
             * @return {Object} Merged component margins.
             */
            // eslint-disable-next-line vue/no-unused-properties -- mixin property
            margins() {
                return {
                    top: defaultMargins.top || 0,
                    right: defaultMargins.right || 0,
                    bottom: defaultMargins.bottom || 0,
                    left: defaultMargins.left || 0,
                }
            },
        },
    };
}
