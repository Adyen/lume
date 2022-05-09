import { storiesOf } from '@storybook/vue';
import { boolean, select } from '@storybook/addon-knobs';
import { AxisOptionsMixin, SizeKnobsMixin, convertAxisPropsIntoOptions } from '@/utils/storybook-helpers';
import BoxPlot from './box-plot.vue';
import data from './story-datasets';

const DATASETS = {
  Simple: data.boxPlotData,
}

storiesOf('Charts / Box plot', module) // eslint-disable-line
  .add('Basic', () => ({
    components: { BoxPlot },
    props: {
      dataset: {
        type: String,
        default: select('Dataset', Object.keys(DATASETS), Object.keys(DATASETS)[0]),
      },
      startOnZero: {
        type: Boolean,
        default: boolean('Start on zero', true)
      },
      ...AxisOptionsMixin('x'),
      ...AxisOptionsMixin('y'),
      ...SizeKnobsMixin(),
    },
    computed: {
      data() {
        return DATASETS[this.dataset];
      },
      labels() {
        return DATASETS[this.dataset].labels;
      },
      options() {
        return {
          xAxisOptions: convertAxisPropsIntoOptions(this.$props, 'x'),
          yAxisOptions: convertAxisPropsIntoOptions(this.$props, 'y'),
        }
      }
    },
    template: `
            <div :style="{ width: width + 'px', height: height + 'px' }">
                <box-plot
                    :data="data" :start-on-zero="startOnZero"
                    group-by-label="Species"
                    value-label="Sepal_Length"
                />
            </div>
        `,
  }), {  });
