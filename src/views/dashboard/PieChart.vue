<!--
  - /***************************************************************************************
  - * Copyright © 2014-2018 Ontology Foundation Ltd.
  - * All rights reserved.
  - *
  - * This software is supplied only under the terms of a license agreement,
  - * nondisclosure agreement or other written agreement with Ontology Foundation Ltd.
  - * Use, redistribution or other disclosure of any parts of this
  - * software is prohibited except in accordance with the terms of such written
  - * agreement with Ontology Foundation Ltd. This software is confidential
  - * and proprietary information of Ontology Foundation Ltd.
  - *
  - ****************************************************************************************/
  -
  -->

<template>
  <div :style="{ height: '100%', width: '300px' }"/>
</template>

<script>
require("echarts/theme/macarons"); // echarts theme

// 引入 ECharts 主模块
const echarts = require("echarts/lib/echarts");

require("echarts/lib/chart/pie"); //引入饼图

// 引入提示框和标题组件
require("echarts/lib/component/tooltip"); //引入提示
require("echarts/lib/component/title"); //引入标题
require("echarts/lib/component/legend"); //引入图例

export default {
  props: {
    assets: {
      type: Array,
      default: function() {
        return [];
      },
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
    this.__resizeHandler = _.debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  watch: {
    assets: "initChart",
  },
  computed: {
    chartData() {
      let data = [];
      let names = [];

      for (let index in this.assets) {
        data.push({ value: this.assets[index].value_by_usd, name: this.assets[index].name });
        names.push(this.assets[index].name);
      }

      return {
        data: data,
        names: names,
      };
    },
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");

      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          left: "center",
          bottom: "10",
          data: this.chartData.names,
        },
        calculable: true,
        series: [
          {
            name: "Amount by USD",
            type: "pie",
            radius: ["45%", "60%"], // [ 内半径， 外半径 ]
            center: ["50%", "45%"],
            data: this.chartData.data,
            animationEasing: "cubicInOut",
            animationDuration: 2600,
          },
        ],
      });
    },
  },
};
</script>
