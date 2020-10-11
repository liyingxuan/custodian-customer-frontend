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
  <div class="dashboard-pane">
    <div class="title">{{ title }}</div>
    <div class="info">{{ empty_messages }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Self-managed Account >",
      empty_messages: "Available soon...",
      ops: {
        rail: {
          border: "none",
          /** Rail's size(Height/Width) , default -> 6px */
          size: "1px",
        },
        bar: {
          size: "1px",
        },
      },
    };
  },

  computed: {},
  methods: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.plus-circle {
  width: 74px;
  height: 74px;
  color: rgba(217, 233, 239, 1);
  margin-top: 90px;
}
.info {
  font-size: 14px;
  font-family: OpenSans-Semibold;
  font-weight: 600;
  color: #6987a7;
  line-height: 19px;
  margin-top: 153px;
}

.dashboard-pane {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 373px;
  width: 384px;
}

.title {
  font-size: 16px;
  font-family: OpenSans-Semibold;
  font-weight: 600;
  color: rgba(183, 200, 206, 1);
  line-height: 22px;
  margin-top: 16px;
}
</style>
