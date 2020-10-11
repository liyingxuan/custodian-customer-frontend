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
    <el-button type="text" class="title" @click="$emit('click')">{{ title }}</el-button>
    <div v-show="this.hasData" class="has-data">
      <div class="btcTotal">{{ btcTotal }}</div>
      <div class="usdTotal">{{ usdTotal }}</div>
      <div class="data-area">
        <vue-scroll :ops="ops">
          <div v-for="(value, coinName, index) in assets" :key="index">
            <div class="row">
              <div class="coin-type">{{ coinName }}</div>
              <div class="coin-count">{{ value }}</div>
            </div>
          </div>
        </vue-scroll>
      </div>
    </div>
    <div v-show="!this.hasData" class="has-data">
      <div @click="toCreate">
        <i class="fas fa-plus-circle plus-circle"></i>
      </div>
      <div class="info">{{ empty_messages }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hasData: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Co-managed Account >",
    },
    btcTotal: {
      type: String,
      default: "0 BTC",
    },
    usdTotal: {
      type: String,
      default: "0 USD",
    },
    assets: {
      type: Object,
      default: function() {
        return {};
      },
    },
    empty_messages: {
      type: String,
      default: "Create an Escrow Account",
    },
  },
  data() {
    return {
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
  methods: {
    toCreate() {
      if (this.title === "Escrow Account >") {
        this.$router.push({ name: "create-escrow-address" });
      } else {
        this.$router.push({ name: "create-co-managed-address" });
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.plus-circle {
  width: 74px;
  height: 74px;
  color: rgba(217, 233, 239, 1);
  margin-top: 90px;
}
.plus-circle:hover {
  cursor: pointer;
}
.info {
  font-size: 14px;
  color: rgba(53, 155, 7, 1);
  line-height: 19px;
  margin-top: 20px;
}

.dashboard-pane {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 373px;
  width: 384px;
}
.has-data {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title1 {
  font-size: 16px;
  font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
  font-weight: 600;
  color: rgba(183, 200, 206, 1);
  line-height: 22px;
  margin-top: 16px;
}
.title {
  height: 22px;
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 51, 106, 1);
  line-height: 22px;
  margin-top: 16px;
}

.btcTotal {
  font-size: 24px;
  color: rgba(105, 135, 167, 1);
  line-height: 33px;
  margin-top: 16px;
}

.usdTotal {
  font-size: 14px;
  color: rgba(105, 135, 167, 1);
  line-height: 19px;
  margin-top: 8px;
}
.data-area {
  height: 242px;
  margin-top: 16px;

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 323px;
    height: 48px;
    border-top: 1px solid rgba(217, 233, 239, 1);

    .coin-type {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 51, 106, 1);
      line-height: 22px;
    }

    .coin-count {
      font-size: 16px;
      color: rgba(0, 51, 106, 1);
      line-height: 22px;
      margin-right: 7px;
    }
  }
}
</style>
