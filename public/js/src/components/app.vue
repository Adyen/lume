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
      <div class="u-width-full"></div>
    </div>
  </div>
</template>

<script>
import BarChart from '@/bar-chart/bar-chart.vue';
import StackedBarChart from '@/stacked-bar-chart/stacked-bar-chart.vue';
import GroupedBarChart from '@/grouped-bar-chart/grouped-bar-chart.vue';
import LineChart from '@/line-chart/line-chart.vue';
import HorizontalBarChart from '@/horizontal-bar-chart/horizontal-bar-chart.vue';
import HorizontalStackedBarChart from '@/horizontal-stacked-bar-chart/horizontal-stacked-bar-chart.vue';
import HorizontalGroupedBarChart from '@/horizontal-grouped-bar-chart/horizontal-grouped-bar-chart.vue';

export default {
  components: {
    HorizontalGroupedBarChart,
    HorizontalBarChart,
    LineChart,
    GroupedBarChart,
    BarChart,
    StackedBarChart,
    HorizontalStackedBarChart
  },
  data: () => ({
    lineChartData: [
      { values: [10, 30, -20, 50, 40, 70, 60], color: '01', legend: 'Hamburgers' },
      { values: [30, 10, 20, 70, 50, null, 40], color: '02', legend: 'Hot dogs' },
    ],
    barChartData: [
      { value: 10 },
      { value: 40 },
      { value: null },
      { value: 30, color: '02' },
      { value: 60 },
      { value: 0 },
      { value: -26 }
    ],
    stackedBarChartData: [
      { values: [ 10, 20, 30 ] },
      { values: [ 20, 30, 40 ], colors: ['04', '05'] },
      { values: [ -10, 0, 30 ] },
      { values: [ -20, -30, 40 ], colors: ['06', '07'] },
      { values: [ 60, null, -50 ] },
      { values: [ 40, -10, 30 ] },
      { values: [ -50, 30, 20 ] }
    ],
    barChartLabels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    barsConfig: { color: '03' }
  })
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
