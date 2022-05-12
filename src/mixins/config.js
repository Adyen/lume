const CONFIGS = ['margins'];

export default function ConfigMixin(defaultConfig = {}) {
  // @vue/component
  return {
    props: {
      /**
       * Component config property.
       * Should not be accessed directly, use "computedConfig" instead.
       * @type {Object}
       */
      config: {
        type: Object,
        default: () => ({}),
        validator: (value) =>
          Object.keys(value).every((key) => CONFIGS.includes(key)),
      },
    },
    computed: {
      /**
       * Object with merged default and specified config.
       * @return {Object} Merged component config.
       */
      // eslint-disable-next-line vue/no-unused-properties -- mixin property
      computedConfig() {
        return { ...defaultConfig, ...this.config };
      },
    },
  };
}
