export default function(key = 'paddedData') {
  // @vue/component
  return {
    props: {
      useAnimation: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      dataWithSuspension: null,
      animate: false // Set to false initially so we can position all the elements properly on zero values
    }),
    watch: {
      [key]: '$handleDataChange'
    },
    beforeMount() {
      if (this.useAnimation) {
        this.dataWithSuspension = new Array(this.paddedData.length);
        this[key].forEach(({ values }, index) =>
          this.dataWithSuspension[index] = { values: new Array(values.length).fill(0) }
        );
      } else {
        this.$handleDataChange();
      }
    },
    async mounted() {
      if (this.useAnimation) {
        await this.$nextTick();
        this.animate = true;
        this.$handleDataChange();
      }
    },
    methods: {
      $handleDataChange() {
        this.dataWithSuspension = this[key];
      },
    }
  }
}