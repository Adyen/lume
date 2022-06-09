<template>
  <div class="root">
    <h1>Chart showroom</h1>
    <div class="row">
      <line-chart
        :data="lineChartData"
        :labels="barChartLabels"
      />
      <bar-chart
        :data="barChartData"
        :labels="barChartLabels"
        :bars-config="barsConfig"
        :use-animation="false"
      />
      <stacked-bar-chart
        :data="stackedBarChartData"
        :labels="barChartLabels"
      />
      <grouped-bar-chart
        :data="stackedBarChartData"
        :labels="barChartLabels"
      />
    </div>
    <div class="row">
      <horizontal-bar-chart
        :data="barChartData"
        :labels="barChartLabels"
        :bars-config="barsConfig"
      />
      <horizontal-stacked-bar-chart
        :data="stackedBarChartData"
        :labels="barChartLabels"
      />
      <horizontal-grouped-bar-chart
        :data="stackedBarChartData"
        :labels="barChartLabels"
      />
      <box-plot
        :data="boxPlotData"
        :margins="boxPlotConfig.margins"
        :group-by-label="boxPlotConfig.groupByLabel"
        :value-label="boxPlotConfig.valueLabel"
      />
    </div>
  </div>
</template>

<script>
import BarChart from '@/charts/bar-chart/bar-chart.vue';
import StackedBarChart from '@/charts/stacked-bar-chart/stacked-bar-chart.vue';
import GroupedBarChart from '@/charts/grouped-bar-chart/grouped-bar-chart.vue';
import LineChart from '@/charts/line-chart/line-chart.vue';
import HorizontalBarChart from '@/charts/horizontal-bar-chart/horizontal-bar-chart.vue';
import HorizontalStackedBarChart from '@/charts/horizontal-stacked-bar-chart/horizontal-stacked-bar-chart.vue';
import HorizontalGroupedBarChart from '@/charts/horizontal-grouped-bar-chart/horizontal-grouped-bar-chart.vue';
import BoxPlot from '@/charts/box-plot/box-plot.vue';
import boxPlotData from './box-plot-data';

export default {
  components: {
    HorizontalGroupedBarChart,
    HorizontalBarChart,
    LineChart,
    GroupedBarChart,
    BarChart,
    StackedBarChart,
    HorizontalStackedBarChart,
    BoxPlot,
  },
  data: () => ({
    lineChartData: [
      {
        values: [10, 30, -20, 50, 40, 70, 60],
        color: '01',
        label: 'Hamburgers',
      },
      {
        values: [30, 10, 20, 70, 50, null, 40],
        color: '02',
        label: 'Hot dogs',
      },
    ],
    barChartData: [{
      values: [10, 40, null, 30, 60, 0, -26],
      color: '02'
    }],
    stackedBarChartData: [
      { values: [10, 20, 30] },
      { values: [20, 30, 40], colors: ['04', '05'] },
      { values: [-10, 0, 30] },
      { values: [-20, -30, 40], colors: ['06', '07'] },
      { values: [60, null, -50] },
      { values: [40, -10, 30] },
      { values: [-50, 30, 20] },
    ],
    barChartLabels: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    barsConfig: { color: '03', legend: 'Hot dogs' },
    boxPlotData,
    boxPlotConfig: {
      groupByLabel: 'Species',
      valueLabel: 'Sepal_Length',
      margins: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
  }),
  async mounted() {
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.barChartData[0].values.reverse();
    this.stackedBarChartData.reverse();
  }
};
</script>

<style>
.root {
  width: 80vw;
  padding-left: 24px;
}

.row {
  display: flex;
  height: 250px;
  width: 100%;
  justify-content: space-between;
}
</style>
