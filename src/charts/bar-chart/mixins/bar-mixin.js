import { scaleBand, scaleLinear } from 'd3-scale';

const pad = value => !value && value !== 0 ? 0 : value;

export default function BarMixin() {
  // @vue/component
  return {
    computed: {
      xScale() {
        const scale = this.isHorizontal ?
          scaleLinear()
            .domain([this.minValue, this.maxValue])
            .nice() :
          scaleBand()
            .paddingInner(this.padding)
            .paddingOuter(this.padding / 2)
            .domain(this.domain);

        return scale
          .rangeRound([0, this.width]);
      },
      yScale() {
        const scale = this.isHorizontal ?
          scaleBand()
            .paddingInner(this.padding)
            .paddingOuter(this.padding / 2)
            .domain(this.domain) :
          scaleLinear()
            .domain([this.maxValue, this.minValue])
            .nice(10);

        return scale
          .rangeRound([0, this.height])
      },
      paddedData() {
        return this.data.map(record => ({
          ...record,
          ...('value' in record ? { value: pad(record.value) } : {}),
          ...('values' in record ? { values: record.values.map(pad) } : {})
        }))
      },
      paddedDataAsArray() {
        return this.paddedData.map(record => 'value' in record ? record.value : record.values);
      },
      hasNegativeValues() {
        return this.paddedDataAsArray
          .flat()
          .some(value => value < 0);
      },
    }
  };
}

