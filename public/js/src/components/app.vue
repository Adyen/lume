<template>
  <div class="root">
    <h1>Chart showroom</h1>
    <div class="row">
      <line-chart :data="lineChartData" :labels="barChartLabels" />
      <bar-chart :data="barChartData" :labels="barChartLabels" :bars-config="barsConfig" />
      <stacked-bar-chart :data="stackedBarChartData" :labels="barChartLabels" />
      <grouped-bar-chart :data="stackedBarChartData" :labels="barChartLabels" />
    </div>
    <div class="row">
      <horizontal-bar-chart
        :data="barChartData"
        :labels="barChartLabels"
        :bars-config="barsConfig"
      />
<!--      <horizontal-stacked-bar-chart :data="stackedBarChartData" :labels="barChartLabels" />-->
<!--      <horizontal-grouped-bar-chart :data="stackedBarChartData" :labels="barChartLabels" />-->
      <box-plot
          :data="boxPlotData"
          :margins="boxPlotConfig.margins"
          :group-by-label="boxPlotConfig.groupByLabel"
          :value-label="boxPlotConfig.valeLabel"
      />
      <div class="u-width-full"></div>
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

export default {
  components: {
    HorizontalGroupedBarChart,
    HorizontalBarChart,
    LineChart,
    GroupedBarChart,
    BarChart,
    StackedBarChart,
    HorizontalStackedBarChart,
    BoxPlot
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
    barsConfig: { color: '03', legend: 'Hot dogs' },
    boxPlotData:  [
      {
        "Sepal_Length": 5.1,
        "Sepal_Width": 3.5,
        "Petal_Length": 1.4,
        "Petal_Width": 0.2,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 4.9,
        "Sepal_Width": 3,
        "Petal_Length": 1.4,
        "Petal_Width": 0.2,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 4.7,
        "Sepal_Width": 3.2,
        "Petal_Length": 1.3,
        "Petal_Width": 0.2,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 4.6,
        "Sepal_Width": 3.1,
        "Petal_Length": 1.5,
        "Petal_Width": 0.2,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 5,
        "Sepal_Width": 3.6,
        "Petal_Length": 1.4,
        "Petal_Width": 0.2,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 5.4,
        "Sepal_Width": 3.9,
        "Petal_Length": 1.7,
        "Petal_Width": 0.4,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 4.6,
        "Sepal_Width": 3.4,
        "Petal_Length": 1.4,
        "Petal_Width": 0.3,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 5,
        "Sepal_Width": 3.4,
        "Petal_Length": 1.5,
        "Petal_Width": 0.2,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 4.4,
        "Sepal_Width": 2.9,
        "Petal_Length": 1.4,
        "Petal_Width": 0.2,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 4.9,
        "Sepal_Width": 3.1,
        "Petal_Length": 1.5,
        "Petal_Width": 0.1,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 5.4,
        "Sepal_Width": 3.7,
        "Petal_Length": 1.5,
        "Petal_Width": 0.2,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 4.8,
        "Sepal_Width": 3.4,
        "Petal_Length": 1.6,
        "Petal_Width": 0.2,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 4.8,
        "Sepal_Width": 3,
        "Petal_Length": 1.4,
        "Petal_Width": 0.1,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 4.3,
        "Sepal_Width": 3,
        "Petal_Length": 1.1,
        "Petal_Width": 0.1,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 5.8,
        "Sepal_Width": 4,
        "Petal_Length": 1.2,
        "Petal_Width": 0.2,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 5.7,
        "Sepal_Width": 4.4,
        "Petal_Length": 1.5,
        "Petal_Width": 0.4,
        "Species": "Type 1"
      },
      {
        "Sepal_Length": 5.4,
        "Sepal_Width": 3.9,
        "Petal_Length": 1.3,
        "Petal_Width": 0.4,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.1,
        "Sepal_Width": 3.5,
        "Petal_Length": 1.4,
        "Petal_Width": 0.3,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.7,
        "Sepal_Width": 3.8,
        "Petal_Length": 1.7,
        "Petal_Width": 0.3,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.1,
        "Sepal_Width": 3.8,
        "Petal_Length": 1.5,
        "Petal_Width": 0.3,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.4,
        "Sepal_Width": 3.4,
        "Petal_Length": 1.7,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.1,
        "Sepal_Width": 3.7,
        "Petal_Length": 1.5,
        "Petal_Width": 0.4,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 4.6,
        "Sepal_Width": 3.6,
        "Petal_Length": 1,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.1,
        "Sepal_Width": 3.3,
        "Petal_Length": 1.7,
        "Petal_Width": 0.5,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 4.8,
        "Sepal_Width": 3.4,
        "Petal_Length": 1.9,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5,
        "Sepal_Width": 3,
        "Petal_Length": 1.6,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5,
        "Sepal_Width": 3.4,
        "Petal_Length": 1.6,
        "Petal_Width": 0.4,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.2,
        "Sepal_Width": 3.5,
        "Petal_Length": 1.5,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.2,
        "Sepal_Width": 3.4,
        "Petal_Length": 1.4,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 4.7,
        "Sepal_Width": 3.2,
        "Petal_Length": 1.6,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 4.8,
        "Sepal_Width": 3.1,
        "Petal_Length": 1.6,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.4,
        "Sepal_Width": 3.4,
        "Petal_Length": 1.5,
        "Petal_Width": 0.4,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.2,
        "Sepal_Width": 4.1,
        "Petal_Length": 1.5,
        "Petal_Width": 0.1,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.5,
        "Sepal_Width": 4.2,
        "Petal_Length": 1.4,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 4.9,
        "Sepal_Width": 3.1,
        "Petal_Length": 1.5,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5,
        "Sepal_Width": 3.2,
        "Petal_Length": 1.2,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.5,
        "Sepal_Width": 3.5,
        "Petal_Length": 1.3,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 4.9,
        "Sepal_Width": 3.6,
        "Petal_Length": 1.4,
        "Petal_Width": 0.1,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 4.4,
        "Sepal_Width": 3,
        "Petal_Length": 1.3,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.1,
        "Sepal_Width": 3.4,
        "Petal_Length": 1.5,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5,
        "Sepal_Width": 3.5,
        "Petal_Length": 1.3,
        "Petal_Width": 0.3,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 4.5,
        "Sepal_Width": 2.3,
        "Petal_Length": 1.3,
        "Petal_Width": 0.3,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 4.4,
        "Sepal_Width": 3.2,
        "Petal_Length": 1.3,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5,
        "Sepal_Width": 3.5,
        "Petal_Length": 1.6,
        "Petal_Width": 0.6,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.1,
        "Sepal_Width": 3.8,
        "Petal_Length": 1.9,
        "Petal_Width": 0.4,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 4.8,
        "Sepal_Width": 3,
        "Petal_Length": 1.4,
        "Petal_Width": 0.3,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.1,
        "Sepal_Width": 3.8,
        "Petal_Length": 1.6,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 4.6,
        "Sepal_Width": 3.2,
        "Petal_Length": 1.4,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5.3,
        "Sepal_Width": 3.7,
        "Petal_Length": 1.5,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 5,
        "Sepal_Width": 3.3,
        "Petal_Length": 1.4,
        "Petal_Width": 0.2,
        "Species": "Type 2"
      },
      {
        "Sepal_Length": 7,
        "Sepal_Width": 3.2,
        "Petal_Length": 4.7,
        "Petal_Width": 1.4,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 6.4,
        "Sepal_Width": 3.2,
        "Petal_Length": 4.5,
        "Petal_Width": 1.5,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 6.9,
        "Sepal_Width": 3.1,
        "Petal_Length": 4.9,
        "Petal_Width": 1.5,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 5.5,
        "Sepal_Width": 2.3,
        "Petal_Length": 4,
        "Petal_Width": 1.3,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 6.5,
        "Sepal_Width": 2.8,
        "Petal_Length": 4.6,
        "Petal_Width": 1.5,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 5.7,
        "Sepal_Width": 2.8,
        "Petal_Length": 4.5,
        "Petal_Width": 1.3,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 6.3,
        "Sepal_Width": 3.3,
        "Petal_Length": 4.7,
        "Petal_Width": 1.6,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 4.9,
        "Sepal_Width": 2.4,
        "Petal_Length": 3.3,
        "Petal_Width": 1,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 6.6,
        "Sepal_Width": 2.9,
        "Petal_Length": 4.6,
        "Petal_Width": 1.3,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 5.2,
        "Sepal_Width": 2.7,
        "Petal_Length": 3.9,
        "Petal_Width": 1.4,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 5,
        "Sepal_Width": 2,
        "Petal_Length": 3.5,
        "Petal_Width": 1,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 5.9,
        "Sepal_Width": 3,
        "Petal_Length": 4.2,
        "Petal_Width": 1.5,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 6,
        "Sepal_Width": 2.2,
        "Petal_Length": 4,
        "Petal_Width": 1,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 6.1,
        "Sepal_Width": 2.9,
        "Petal_Length": 4.7,
        "Petal_Width": 1.4,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 5.6,
        "Sepal_Width": 2.9,
        "Petal_Length": 3.6,
        "Petal_Width": 1.3,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 6.7,
        "Sepal_Width": 3.1,
        "Petal_Length": 4.4,
        "Petal_Width": 1.4,
        "Species": "Type 3"
      },
      {
        "Sepal_Length": 5.6,
        "Sepal_Width": 3,
        "Petal_Length": 4.5,
        "Petal_Width": 1.5,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.8,
        "Sepal_Width": 2.7,
        "Petal_Length": 4.1,
        "Petal_Width": 1,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6.2,
        "Sepal_Width": 2.2,
        "Petal_Length": 4.5,
        "Petal_Width": 1.5,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.6,
        "Sepal_Width": 2.5,
        "Petal_Length": 3.9,
        "Petal_Width": 1.1,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.9,
        "Sepal_Width": 3.2,
        "Petal_Length": 4.8,
        "Petal_Width": 1.8,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6.1,
        "Sepal_Width": 2.8,
        "Petal_Length": 4,
        "Petal_Width": 1.3,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6.3,
        "Sepal_Width": 2.5,
        "Petal_Length": 4.9,
        "Petal_Width": 1.5,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6.1,
        "Sepal_Width": 2.8,
        "Petal_Length": 4.7,
        "Petal_Width": 1.2,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6.4,
        "Sepal_Width": 2.9,
        "Petal_Length": 4.3,
        "Petal_Width": 1.3,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6.6,
        "Sepal_Width": 3,
        "Petal_Length": 4.4,
        "Petal_Width": 1.4,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6.8,
        "Sepal_Width": 2.8,
        "Petal_Length": 4.8,
        "Petal_Width": 1.4,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6.7,
        "Sepal_Width": 3,
        "Petal_Length": 5,
        "Petal_Width": 1.7,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6,
        "Sepal_Width": 2.9,
        "Petal_Length": 4.5,
        "Petal_Width": 1.5,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.7,
        "Sepal_Width": 2.6,
        "Petal_Length": 3.5,
        "Petal_Width": 1,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.5,
        "Sepal_Width": 2.4,
        "Petal_Length": 3.8,
        "Petal_Width": 1.1,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.5,
        "Sepal_Width": 2.4,
        "Petal_Length": 3.7,
        "Petal_Width": 1,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.8,
        "Sepal_Width": 2.7,
        "Petal_Length": 3.9,
        "Petal_Width": 1.2,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6,
        "Sepal_Width": 2.7,
        "Petal_Length": 5.1,
        "Petal_Width": 1.6,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.4,
        "Sepal_Width": 3,
        "Petal_Length": 4.5,
        "Petal_Width": 1.5,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6,
        "Sepal_Width": 3.4,
        "Petal_Length": 4.5,
        "Petal_Width": 1.6,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6.7,
        "Sepal_Width": 3.1,
        "Petal_Length": 4.7,
        "Petal_Width": 1.5,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6.3,
        "Sepal_Width": 2.3,
        "Petal_Length": 4.4,
        "Petal_Width": 1.3,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.6,
        "Sepal_Width": 3,
        "Petal_Length": 4.1,
        "Petal_Width": 1.3,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.5,
        "Sepal_Width": 2.5,
        "Petal_Length": 4,
        "Petal_Width": 1.3,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.5,
        "Sepal_Width": 2.6,
        "Petal_Length": 4.4,
        "Petal_Width": 1.2,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6.1,
        "Sepal_Width": 3,
        "Petal_Length": 4.6,
        "Petal_Width": 1.4,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.8,
        "Sepal_Width": 2.6,
        "Petal_Length": 4,
        "Petal_Width": 1.2,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5,
        "Sepal_Width": 2.3,
        "Petal_Length": 3.3,
        "Petal_Width": 1,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.6,
        "Sepal_Width": 2.7,
        "Petal_Length": 4.2,
        "Petal_Width": 1.3,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.7,
        "Sepal_Width": 3,
        "Petal_Length": 4.2,
        "Petal_Width": 1.2,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.7,
        "Sepal_Width": 2.9,
        "Petal_Length": 4.2,
        "Petal_Width": 1.3,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6.2,
        "Sepal_Width": 2.9,
        "Petal_Length": 4.3,
        "Petal_Width": 1.3,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.1,
        "Sepal_Width": 2.5,
        "Petal_Length": 3,
        "Petal_Width": 1.1,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 5.7,
        "Sepal_Width": 2.8,
        "Petal_Length": 4.1,
        "Petal_Width": 1.3,
        "Species": "Type 4"
      },
      {
        "Sepal_Length": 6.3,
        "Sepal_Width": 3.3,
        "Petal_Length": 6,
        "Petal_Width": 2.5,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 5.8,
        "Sepal_Width": 2.7,
        "Petal_Length": 5.1,
        "Petal_Width": 1.9,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 7.1,
        "Sepal_Width": 3,
        "Petal_Length": 5.9,
        "Petal_Width": 2.1,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 6.3,
        "Sepal_Width": 2.9,
        "Petal_Length": 5.6,
        "Petal_Width": 1.8,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 6.5,
        "Sepal_Width": 3,
        "Petal_Length": 5.8,
        "Petal_Width": 2.2,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 7.6,
        "Sepal_Width": 3,
        "Petal_Length": 6.6,
        "Petal_Width": 2.1,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 4.9,
        "Sepal_Width": 2.5,
        "Petal_Length": 4.5,
        "Petal_Width": 1.7,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 7.3,
        "Sepal_Width": 2.9,
        "Petal_Length": 6.3,
        "Petal_Width": 1.8,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 6.7,
        "Sepal_Width": 2.5,
        "Petal_Length": 5.8,
        "Petal_Width": 1.8,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 7.2,
        "Sepal_Width": 3.6,
        "Petal_Length": 6.1,
        "Petal_Width": 2.5,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 6.5,
        "Sepal_Width": 3.2,
        "Petal_Length": 5.1,
        "Petal_Width": 2,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 6.4,
        "Sepal_Width": 2.7,
        "Petal_Length": 5.3,
        "Petal_Width": 1.9,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 6.8,
        "Sepal_Width": 3,
        "Petal_Length": 5.5,
        "Petal_Width": 2.1,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 5.7,
        "Sepal_Width": 2.5,
        "Petal_Length": 5,
        "Petal_Width": 2,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 5.8,
        "Sepal_Width": 2.8,
        "Petal_Length": 5.1,
        "Petal_Width": 2.4,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 6.4,
        "Sepal_Width": 3.2,
        "Petal_Length": 5.3,
        "Petal_Width": 2.3,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 6.5,
        "Sepal_Width": 3,
        "Petal_Length": 5.5,
        "Petal_Width": 1.8,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 7.7,
        "Sepal_Width": 3.8,
        "Petal_Length": 6.7,
        "Petal_Width": 2.2,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 7.7,
        "Sepal_Width": 2.6,
        "Petal_Length": 6.9,
        "Petal_Width": 2.3,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 6,
        "Sepal_Width": 2.2,
        "Petal_Length": 5,
        "Petal_Width": 1.5,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 6.9,
        "Sepal_Width": 3.2,
        "Petal_Length": 5.7,
        "Petal_Width": 2.3,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 5.6,
        "Sepal_Width": 2.8,
        "Petal_Length": 4.9,
        "Petal_Width": 2,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 7.7,
        "Sepal_Width": 2.8,
        "Petal_Length": 6.7,
        "Petal_Width": 2,
        "Species": "Type 5"
      },
      {
        "Sepal_Length": 6.3,
        "Sepal_Width": 2.7,
        "Petal_Length": 4.9,
        "Petal_Width": 1.8,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.7,
        "Sepal_Width": 3.3,
        "Petal_Length": 5.7,
        "Petal_Width": 2.1,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 7.2,
        "Sepal_Width": 3.2,
        "Petal_Length": 6,
        "Petal_Width": 1.8,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.2,
        "Sepal_Width": 2.8,
        "Petal_Length": 4.8,
        "Petal_Width": 1.8,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.1,
        "Sepal_Width": 3,
        "Petal_Length": 4.9,
        "Petal_Width": 1.8,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.4,
        "Sepal_Width": 2.8,
        "Petal_Length": 5.6,
        "Petal_Width": 2.1,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 7.2,
        "Sepal_Width": 3,
        "Petal_Length": 5.8,
        "Petal_Width": 1.6,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 7.4,
        "Sepal_Width": 2.8,
        "Petal_Length": 6.1,
        "Petal_Width": 1.9,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 7.9,
        "Sepal_Width": 3.8,
        "Petal_Length": 6.4,
        "Petal_Width": 2,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.4,
        "Sepal_Width": 2.8,
        "Petal_Length": 5.6,
        "Petal_Width": 2.2,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.3,
        "Sepal_Width": 2.8,
        "Petal_Length": 5.1,
        "Petal_Width": 1.5,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.1,
        "Sepal_Width": 2.6,
        "Petal_Length": 5.6,
        "Petal_Width": 1.4,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 7.7,
        "Sepal_Width": 3,
        "Petal_Length": 6.1,
        "Petal_Width": 2.3,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.3,
        "Sepal_Width": 3.4,
        "Petal_Length": 5.6,
        "Petal_Width": 2.4,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.4,
        "Sepal_Width": 3.1,
        "Petal_Length": 5.5,
        "Petal_Width": 1.8,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6,
        "Sepal_Width": 3,
        "Petal_Length": 4.8,
        "Petal_Width": 1.8,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.9,
        "Sepal_Width": 3.1,
        "Petal_Length": 5.4,
        "Petal_Width": 2.1,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.7,
        "Sepal_Width": 3.1,
        "Petal_Length": 5.6,
        "Petal_Width": 2.4,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.9,
        "Sepal_Width": 3.1,
        "Petal_Length": 5.1,
        "Petal_Width": 2.3,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 5.8,
        "Sepal_Width": 2.7,
        "Petal_Length": 5.1,
        "Petal_Width": 1.9,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.8,
        "Sepal_Width": 3.2,
        "Petal_Length": 5.9,
        "Petal_Width": 2.3,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.7,
        "Sepal_Width": 3.3,
        "Petal_Length": 5.7,
        "Petal_Width": 2.5,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.7,
        "Sepal_Width": 3,
        "Petal_Length": 5.2,
        "Petal_Width": 2.3,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.3,
        "Sepal_Width": 2.5,
        "Petal_Length": 5,
        "Petal_Width": 1.9,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.5,
        "Sepal_Width": 3,
        "Petal_Length": 5.2,
        "Petal_Width": 2,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 6.2,
        "Sepal_Width": 3.4,
        "Petal_Length": 5.4,
        "Petal_Width": 2.3,
        "Species": "Type 6"
      },
      {
        "Sepal_Length": 5.9,
        "Sepal_Width": 3,
        "Petal_Length": 5.1,
        "Petal_Width": 1.8,
        "Species": "Type 6"
      }
    ],
    boxPlotConfig: {
      groupByLabel: 'Species',
      valeLabel: 'Sepal_Length',
      margins: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    }
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
