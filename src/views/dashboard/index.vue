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
  <div class="fixed-width-container">
    <div id="myAssets">
      <div class="left">
        <div class="title">{{ $t("mainPage.myAssets") }}</div>
        <div class="total">{{ $t("mainPage.total") }}</div>
        <div class="btc">{{ assetsDetail.total_btc }} BTC</div>
        <div class="usd">≈ {{ assetsDetail.total_usd }} USD</div>
      </div>
      <div class="chart-wrapper">
        <pie-chart :assets="assetsDetailAssetList" width="350px" height="350px"/>
      </div>
    </div>

    <div class="pane">
      <DashboardPane
        id="co"
        title="Co-managed Account >"
        v-bind="co_managedPaneData"
        empty_messages="Create a Co-managed Account"
        @click="onCo_managedClick"
      ></DashboardPane>
      <DashboardPane
        id="escrow"
        title="Escrow Account >"
        v-bind="escrowPaneData"
        empty_messages="Create an Escrow Account"
        @click="onEscrowClick"
      ></DashboardPane>
      <SelfDashboardPane id="self"></SelfDashboardPane>
    </div>

    <div class="assetTable">
      <el-table class="g-header" :data="assetsDetailAssetList" style="width: 100%">
        <el-table-column label="Asset Type" prop="name"></el-table-column>
        <el-table-column label="Amount" prop="amount"></el-table-column>
        <el-table-column label="Value By USD" prop="value_by_usd"></el-table-column>
        <el-table-column label="Percent" prop="percentage"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import PieChart from "./PieChart";
import SelfDashboardPane from "./SelfDashboardPane";
import DashboardPane from "./DashboardPane";

export default {
  name: "dashboard",
  components: { PieChart, DashboardPane, SelfDashboardPane },
  computed: {
    assetsDetail() {
      return this.$store.getters.selectAssetsDetail() || {};
    },
    assetsDetailAssetList() {
      return this.assetsDetail.asset_list || [];
    },
    assetsDetailOfJointManaged() {
      return this.$store.getters.selectAssetsDetail({ custodian_type: "joint-managed" }) || {};
    },
    co_managedPaneData() {
      return {
        hasData:
          this.assetsDetailOfJointManaged.asset_list &&
          this.assetsDetailOfJointManaged.asset_list.length > 0,
        btcTotal: this.assetsDetailOfJointManaged.total_btc + " BTC",
        usdTotal: this.assetsDetailOfJointManaged.total_usd + " USD",
        assets: (this.assetsDetailOfJointManaged.asset_list || []).reduce((result, item) => {
          return { ...result, [item.name]: item.amount };
        }, {}),
      };
    },
    assetsDetailOfPlatformManaged() {
      return this.$store.getters.selectAssetsDetail({ custodian_type: "platform-managed" }) || {};
    },
    escrowPaneData() {
      return {
        hasData:
          this.assetsDetailOfPlatformManaged.asset_list &&
          this.assetsDetailOfPlatformManaged.asset_list.length > 0,
        btcTotal: this.assetsDetailOfPlatformManaged.total_btc + " BTC",
        usdTotal: this.assetsDetailOfPlatformManaged.total_usd + " USD",
        assets: (this.assetsDetailOfPlatformManaged.asset_list || []).reduce((result, item) => {
          return { ...result, [item.name]: item.amount };
        }, {}),
      };
    },
  },
  created() {
    this.$store.dispatch("getAssetsDetail");
    this.$store.dispatch("getAssetsDetail", { custodian_type: "joint-managed" });
    this.$store.dispatch("getAssetsDetail", { custodian_type: "platform-managed" });
  },
  methods: {
    onCo_managedClick() {
      this.$router.push({ name: "co-managed" });
    },
    onEscrowClick() {
      this.$router.push({ name: "escrow" });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/variables.scss";

.assetTable {
  margin-top: 32px;
}

.pane {
  $pane_top: 32px;
  $pane_width: 384px;
  $pane_height: 369px;
  margin-top: $pane_top;

  display: flex;
  flex-direction: row;

  %pane_shared {
    grid-row: 1;
    flex-basis: 33%;
    min-height: $pane_height;
    background-color: white;
  }

  #co {
    border-top: solid 4px #00d1d0;
    @extend %pane_shared;
    margin-right: 16px;
  }

  #escrow {
    border-top: solid 4px #359b07;
    @extend %pane_shared;
    margin-right: 16px;
  }

  #self {
    border-top: solid 4px #843edc;
    @extend %pane_shared;
  }
}

#myAssets {
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-left: solid 4px rgba(0, 120, 250, 1);
  height: 350px;

  .left {
    display: flex;
    flex-direction: column;
    margin-left: 32px;

    .title {
      margin-top: 24px;
      font-size: 38px;
      font-weight: 300;
      color: rgba(0, 120, 250, 1);
      line-height: 52px;
    }

    .total {
      margin-top: 32 * 3px;
      font-size: 14px;
      font-weight: 600;
      color: rgba(0, 51, 106, 1);
      line-height: 19px;
    }

    .btc {
      margin-top: 8px;
      font-size: 24px;
      font-weight: 600;
      color: rgba(0, 51, 106, 1);
      line-height: 33px;
    }

    .usd {
      font-size: 16px;
      font-weight: 600;
      color: rgba(105, 135, 167, 1);
      line-height: 22px;
    }
  }
  .chart-wrapper {
    margin-right: 28px;
  }
}
</style>
