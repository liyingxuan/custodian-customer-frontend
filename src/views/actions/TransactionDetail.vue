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
    <div class="action-detail-table">
      <el-table class="g-header" :data="[transactionDetail]" row-class-name="g-table-row-regular">
        <el-table-column
          label="Transaction Type"
          prop="tx_type"
          :formatter="(row, col, value) => $formatEnumType('TransactionType', value)"
        ></el-table-column>
        <el-table-column
          label="Status"
          prop="status"
          :formatter="(row, col, value) => $formatEnumType('TransactionStatusType', value)"
        ></el-table-column>
        <el-table-column label="Asset Type" prop="coin_type"></el-table-column>
        <el-table-column label="Amount" prop="amount"></el-table-column>
        <el-table-column label="Balance" prop="current_balance"></el-table-column>
        <el-table-column label="Service Fee" prop="fee"></el-table-column>
      </el-table>
    </div>

    <!--Note and Reject Reason-->
    <div class="notes">
      <div class="notes-row" v-if="transactionDetail.note">
        <div class="cust-notice__div">
          <div class="cust-notice__text">{{ transactionDetail.note }}</div>
        </div>
      </div>
      <div class="notes-row" v-if="transactionDetail.reject_reason">
        <div class="cust-warning__div">{{ transactionDetail.reject_reason }}</div>
      </div>
    </div>

    <div class="top-pane">
      <div class="tx-info-pane">
        <div class="title">Transaction ID:</div>
        <div class="txid">
          <copy-btn :value="tx_id"></copy-btn>
        </div>
      </div>

      <div class="row">
        <div class="tx-info-pane" v-if="transactionDetail.tx_hash">
          <div class="title">Transaction Hash:</div>
          <div class="txid">
            <copy-btn :value="transactionDetail.tx_hash"></copy-btn>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="sub-pane">
          <div class="title">FROM:</div>
          <div v-if="inWithdraw" class="inline">
            <div class="title">Address Name:</div>
            <div class="value">{{ transactionDetail.from_address_name }}</div>
          </div>
          <div class="inline">
            <div class="title">Address:</div>
            <div class="value">{{ transactionDetail.from_address }}</div>
          </div>
          <div v-if="inWithdraw" class="inline">
            <div class="title">Home Account:</div>
            <div class="value">{{ transactionDetail.custodian_type }}</div>
          </div>
        </div>
        <div class="sub-pane">
          <div class="title">TO:</div>
          <div v-if="inDeposit" class="inline">
            <div class="title">Address Name:</div>
            <div class="value">{{ transactionDetail.to_address_name }}</div>
          </div>
          <div class="inline">
            <div class="title">Address:</div>
            <div class="value">{{ transactionDetail.to_address }}</div>
          </div>
          <div v-if="inDeposit" class="inline">
            <div class="title">Home Account:</div>
            {{ $formatEnumType("CustodianType", transactionDetail.custodian_type) }}
            {{ transactionDetail.custodian_type ? "Account" : "" }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="inWithdraw" class="bottom-pane">
      <div class="left-flow">
        <div class="title">Approval:</div>
        <el-steps
          :space="62"
          direction="vertical"
          :active="approvalFlowData.active"
          :process-status="transactionDetail.activity === 'withdraw-review' ? processStatus : undefined"
        >
          <el-step v-for="(value, key, index) in approvalFlowData.list" :key="index" :title="value"></el-step>
        </el-steps>
      </div>
      <div class="right-flow">
        <div class="title">Multi-sig:</div>
        <el-steps
          :space="62"
          direction="vertical"
          :active="co_signFlowData.active"
          :process-status="transactionDetail.activity === 'withdraw-operate' ? processStatus : undefined"
        >
          <el-step v-for="(value, key, index) in co_signFlowData.list" :key="index" :title="value"></el-step>
        </el-steps>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    tx_id() {
      return this.$route.params.tx_id;
    },
    transactionDetail() {
      return this.$store.getters.selectTransactionDetail(this.tx_id) || {};
    },
    inWithdraw() {
      return this.transactionDetail.tx_type === "withdraw";
    },
    inDeposit() {
      return this.transactionDetail.tx_type === "deposit";
    },
    inBtcOrLtc() {
      return (
        this.transactionDetail.coin_type === "BTC" || this.transactionDetail.coin_type === "LTC"
      );
    },
    approvalFlowData() {
      return this.$formatApprovalFlow(
        this.$store.getters.selectTransactionApprovalFlow(this.tx_id) || {},
        { hideInitiator: false },
      );
    },
    co_signFlowData() {
      return this.$formatCo_signFlow(
        this.$store.getters.selectTransactionCo_signFlow(this.tx_id) || [],
        { hideInitiator: true },
      );
    },
    processStatus() {
      return this.transactionDetail.status === "rejected" ? "error" : "process";
    },
  },
  watch: {
    inWithdraw(val) {
      if (val) {
        this.$store.dispatch("getTransactionApprovalFlow", this.tx_id);
        this.$store.dispatch("getTransactionCo_signFlow", this.tx_id);
      }
    },
  },
  created() {
    this.$store.dispatch("getTransactionDetail", this.tx_id);
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/variables.scss";

%pane-padding {
  padding: 40px 0px 40px 92px;
}

.bottom-pane {
  min-height: 384px;
  display: flex;
  flex-direction: row;
  background-color: $white;
  border-top: solid 1px rgba(217, 233, 239, 1);

  @extend %pane-padding;

  .title {
    font-size: 14px;
    font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
    line-height: 19px;
    margin-bottom: 24px;
  }
  .left-flow {
    flex-basis: 50%;
  }
  .right-flow {
    flex-basis: 50%;
  }
}

.notes {
  display: flex;
  flex-direction: column;
  height: auto;
  background-color: $white;

  .notes-row {
    display: flex;
  }
}

.top-pane {
  display: flex;
  flex-direction: column;
  @extend %pane-padding;

  background-color: $white;

  .row {
    display: flex;
    flex-direction: row;
    margin-top: 32px;
    .sub-pane {
      flex-basis: 50%;

      .inline {
        display: flex;
        flex-direction: row;
        margin: 10px 0px;

        .title {
          width: 130px;
          font-size: 14px;
          font-family: OpenSans, "PingFang SC", "微软雅黑", sans-serif;
          color: rgba(95, 106, 118, 1);
          line-height: 19px;
        }
        .value {
          flex: 1;
          font-size: 14px;
          font-family: OpenSans, "PingFang SC", "微软雅黑", sans-serif;
          color: rgba(0, 0, 0, 1);
          line-height: 19px;
          word-wrap: break-word;
          word-break: break-all;
        }
      }
      .title {
        font-size: 14px;
        font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
        line-height: 19px;
      }
    }
    .to {
      flex-basis: 50%;
    }
  }
  .tx-info-pane {
    .title {
      font-size: 14px;
      font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
      font-weight: 600;
      color: rgba(0, 0, 0, 1);
      line-height: 19px;
    }

    .txid {
      font-size: 14px;
      font-family: OpenSans, "PingFang SC", "微软雅黑", sans-serif;
      color: rgba(0, 120, 250, 1);
      line-height: 19px;
      margin-top: 10px;
    }
  }
}
</style>
