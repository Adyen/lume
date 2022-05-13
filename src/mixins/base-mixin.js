import Axis from '@/core/axis';
import PopoverMixin from './popover';
import { ORIENTATIONS } from '@/constants';

export default function BaseMixin(orientation = ORIENTATIONS.VERTICAL) {
  // @vue/component
  return {
    components: { Axis },
    mixins: [PopoverMixin()],
    props: {
      startOnZero: {
        type: Boolean,
        default: true, // Guidelines state that baseline should be 0
      },
      data: {
        type: Array,
        required: true,
      },
      labels: {
        type: Array,
        default: null,
      },
    },
    data: () => ({
      hoveredIndex: -1,
      width: 0,
      height: 0,
    }),
    computed: {
      isHorizontal() {
        return orientation === ORIENTATIONS.HORIZONTAL;
      },
      domain() {
        return this.labels || this.data.map((value, index) => index);
      },
      containerSize() {
        return { width: this.width, height: this.height };
      },
    },
    methods: {
      $determineWidthAndHeight({ width, height }) {
        this.width = width;
        this.height = height;
      },
      $handleMouseover(index, event) {
        this.hoveredIndex = index;
        this.$showPopover(event.target);
        this.$emit('mouseover', index);
      },
      $handleMouseout() {
        this.hoveredIndex = -1;
        this.$hidePopover();
        this.$emit('mouseout');
      },
    },
  };
}
