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
  <div class="no-fixed-width-container">
    <div class="title">USER INFORMATION</div>
    <div class="divider-line"></div>
    <div class="info-row first">
      <span class="prop-name">UserName:&nbsp;</span>
      {{ myInfo.cust_name }}
    </div>
    <div class="info-row">
      <span class="prop-name">Cooperation:&nbsp;</span>
      {{ myInfo.cust_name }}
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    myInfo() {
      return this.$store.getters.myInfo || {};
    },
  },
};
</script>

<style lang="scss" scoped>
.no-fixed-width-container {
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
}

.title {
  margin: 24px 32px;
  font-size: 38px;
  font-family: OpenSans-Light, "PingFang SC", "微软雅黑", sans-serif;
  font-weight: 300;
  color: rgba(74, 144, 226, 1);
  line-height: 52px;
}

.divider-line {
  border: 1px solid rgba(183, 200, 206, 0.5);
  transform: scaleY(0.5);
  transform-origin: 0 100%;
}

.info-row {
  margin-top: 24px;
  margin-left: 32px;
  font-size: 16px;
  font-family: OpenSans, "PingFang SC", "微软雅黑", sans-serif;
  color: rgba(105, 135, 167, 1);
  line-height: 22px;

  &.first {
    margin-top: 34px;
  }

  .prop-name {
    color: rgba(0, 0, 0, 1);
  }
}
</style>
