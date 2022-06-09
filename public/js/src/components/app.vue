<template>
  <div class="root">
    <h1>Chart showroom</h1>
    <select
      v-model="selection"
      style="margin-bottom: 16px;"
    >
      <option value="single">
        single dataset
      </option>
      <option value="multi">
        multiple dataset
      </option>
    </select>
    <select
      v-model="type"
      style="margin-bottom: 16px;"
    >
      <option value="grouped">
        grouped
      </option>
      <option value="stacked">
        stacked
      </option>
    </select>
    <select
      v-model="orientation"
      style="margin-bottom: 16px;"
    >
      <option value="vertical">
        vertical
      </option>
      <option value="horizontal">
        horizontal
      </option>
    </select>
    <div class="row">
      <bar-chart
        :data="data"
        :type="type"
        :orientation="orientation"
        :labels="barChartLabels"
      />
      <line-chart
        :data="data"
        :labels="barChartLabels"
      />
    </div>
    <div class="row">
      <box-plot
        :data="boxPlotData"
        :margins="boxPlotConfig.margins"
        :group-by-label="boxPlotConfig.groupByLabel"
        :value-label="boxPlotConfig.valueLabel"
      />
      <sparkline :data="barChartData" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import BarChart from '@/charts/bar-chart/bar-chart.vue';
import LineChart from '@/charts/line-chart/line-chart.vue';
import BoxPlot from '@/charts/box-plot/box-plot.vue';
import Sparkline from '@/charts/sparkline-chart/sparkline-chart.vue';

export default defineComponent({
  components: {
    BarChart,
    LineChart,
    BoxPlot,
    Sparkline,
  },
  data: () => ({
    selection: 'multi',
    type: 'grouped',
    orientation: 'horizontal',
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
    barChartData: [
      {
        values: [30, -10, 20, 70, 50, null, 40],
        color: '02',
        label: 'Hot dogs',
      },
    ],
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
  computed: {
    data() {
      switch (this.selection) {
      case 'multi':
        return this.lineChartData;
      case 'single':
      default:
        return this.barChartData;
      }
    },
  },
});
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
