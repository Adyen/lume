import { scaleBand, scaleLinear } from 'd3-scale';
import BarOverlay from './bar-overlay';

const defaultPadding = 0.33;
const pad = value => (!value && value !== 0 ? 0 : value);

export default function BarMixin(isStacked = false) {
  // @vue/component
  return {
    mixins: [BarOverlay],
    props: {
      barsConfig: {
        type: Object,
        default: () => ({}),
      },
      padding: {
        type: Number,
        default: defaultPadding,
      },
    },
    computed: {
      xScale() {
        const scale = this.isHorizontal
          ? scaleLinear().domain([this.minValue, this.maxValue]).nice()
          : scaleBand()
            .paddingInner(this.padding)
            .paddingOuter(this.padding / 2)
            .domain(this.domain);

        return scale.rangeRound([0, this.width]);
      },
      yScale() {
        const scale = this.isHorizontal
          ? scaleBand()
            .paddingInner(this.padding)
            .paddingOuter(this.padding / 2)
            .domain(this.domain)
          : scaleLinear().domain([this.maxValue, this.minValue]).nice(10);

        return scale.rangeRound([0, this.height]);
      },
      maxValue() {
        // Make sure we can handle both single values and arrays of values
        const accumulatedValues = this.paddedDataAsArray.map((valueSet) => {
          if (valueSet.length > 0) {
            return isStacked
              ? valueSet.reduce((acc, curr) => acc + curr, 0)
              : Math.max(...valueSet);
          }
          return valueSet;
        });

        return Math.max(...accumulatedValues);
      },
      minValue() {
        const accumulatedValues = this.paddedDataAsArray.map((valueSet) => {
          if (valueSet.length > 0) {
            return isStacked
              ? valueSet
                .filter(value => value < 0)
                .reduce((acc, curr) => acc + curr, 0)
              : Math.min(...valueSet);
          }
          return valueSet;
        });

        return Math.min(...(this.startOnZero ? [0] : []), ...accumulatedValues);
      },
      paddedData() {
        return this.data.map(record => ({
          ...record,
          values: record.values.map(pad),
        }));
      },
      paddedDataAsArray() {
        return this.paddedData.map(({ values }) => values)
      },
      hasNegativeValues() {
        return this.paddedDataAsArray.flat().some(value => value < 0);
      },
    },
  };
}
