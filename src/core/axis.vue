<template>
  <g ref="root" :transform.native="this.computedTransform"></g>
</template>

<script>
const allowedOrientations = ['left', 'top', 'right', 'bottom'];
const allowedPositions = ['left', 'top', 'right', 'bottom'];

export default {
  props: {
    scale: {
      type: Function,
      required: true
    },
    orientation: {
      type: String,
      validator: value => !!value && allowedOrientations.includes(value)
    },
    position: {
      type: String,
      validator: value => !!value && allowedPositions.includes(value)
    },
    containerSize: {
      type: Object,
      default: {}
    },
    transform: {
      type: String,
      default: null
    }
  },
  watch: {
    'scale': 'recallAxis'
  },
  computed: {
    axis() {
      switch (this.orientation) {
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
    },
    computedTransform() {
      if (this.transform) return this.transform;
      return this.getTransformByPosition(this.position);
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
    },
    getTransformByPosition(position) {
      if (position === 'bottom') {
        return `translate(0, ${this.containerSize?.height || 0})`
      }
    }
  }
}
</script>
