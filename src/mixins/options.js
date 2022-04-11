export default function OptionsMixin(defaultOptions = {}) {
    // @vue/component
    return {
        props: {
            showAxes: {
                type: Boolean,
                default: true
            }
        }
    };
}
