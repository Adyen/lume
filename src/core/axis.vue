<template>
  <g ref="root"></g>
</template>

<script>
const allowedValues = ['left', 'top', 'right', 'bottom'];

export default {
  props: {
    scale: {
      type: Function,
      required: true
    },
    orientation: {
      type: String,
      validator: value => !!value && allowedValues.includes(value)
    },
  },
  watch: {
    'scale': 'recallAxis'
  },
  computed: {
    axis() {
      switch(this.orientation) {
        case 'left':
          return d3.axisLeft(this.scale);
        case 'top':
          return d3.axisTop(this.scale);
        case 'right':
          return d3.axisRight(this.scale);
        case 'bottom':
          return d3.axisBottom(this.scale);
          default:
            throw new Error('Illegal orientation type specified')
      }
    }
  },
  mounted() {
    this.root = d3.select(this.$refs.root)
      .call(this.axis);
  },
  methods: {
    recallAxis() {
      if (this.root) {
        this.root
            .transition()
            .call(this.axis);
      }
    }
  }
}
</script>
