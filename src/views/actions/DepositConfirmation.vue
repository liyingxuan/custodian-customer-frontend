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
    <div class="withdraw-confirmation-table">
      <el-table class="g-header" :data="[addressDetail]">
        <el-table-column label="Address Name" prop="address_name"></el-table-column>
        <el-table-column label="Asset Type" prop="coin_type"></el-table-column>
        <el-table-column label="Address" prop="address"></el-table-column>
        <el-table-column
          label="Account Type"
          prop="custodian_type"
          :formatter="(row, col, value) => $formatEnumType('CustodianType', value)"
        ></el-table-column>
        <el-table-column
          label="Sign Type"
          prop="algorithm"
          :formatter="(row, col, value) => $formatEnumType('AlgorithmType', value)"
        ></el-table-column>
        <el-table-column label="Current Balance" prop="current_balance"></el-table-column>
      </el-table>
    </div>

    <div class="addr-qr">
      <div class="title">Address QR Code:</div>
      <vue-qr :text="addressDetail.address || ''" :size="180" qid="qrCallback" class="qr"></vue-qr>
    </div>

    <div class="history">
      <div class="history-title">TRANSACTION HISTORY</div>
      <div class="transaction-history-table">
        <el-table
          class="g-header"
          :data="transactionTableData"
          row-class-name="g-table-row-regular"
        >
          <el-table-column
            label="Transaction Type"
            prop="tx_type"
            :formatter="(row, col, value) => $formatEnumType('TransactionType', value)"
          ></el-table-column>
          <el-table-column label="Asset Type" prop="coin_type"></el-table-column>
          <el-table-column label="Address" prop="address"></el-table-column>
          <el-table-column label="Amount" prop="amount"></el-table-column>
          <el-table-column
            label="Create Time"
            prop="create_time"
            :formatter="(row, col, value) => $formatDatetime(value)"
          ></el-table-column>
          <el-table-column
            label="Status"
            prop="status"
            :formatter="(row, col, value) => $formatEnumType('TransactionStatusType', value)"
          ></el-table-column>
          <el-table-column label="Operation">
            <template slot-scope="scope">
              <div class="g-table-actions">
                <div
                  class="g-table-action"
                  @click="handleSeeDetail(scope.$index, scope.row)"
                >See Detail</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="g-pagination-area">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="transactionTableDataTotal"
            :current-page.sync="transactionTableCurrentPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";

export default {
  data() {
    return {
      transactionTableCurrentPage: 1,
    };
  },
  computed: {
    address() {
      return this.$route.params.address;
    },
    coin_type() {
      return this.$route.params.coin_type;
    },
    addressDetail() {
      return (
        this.$store.getters.selectAddressDetail({
          address: this.address,
          queryParams: {
            coin_type: this.coin_type,
          },
        }) || {}
      );
    },
    queryParamsOfGetTransactions() {
      return {
        address_prefix: this.address,
        page_index: this.transactionTableCurrentPage,
        page_offset: 10,
      };
    },
    transactionTableData() {
      return this.$store.getters.selectTransactions(this.queryParamsOfGetTransactions) || [];
    },
    transactionTableDataTotal() {
      return this.$store.getters.selectTransactionsTotal(this.queryParamsOfGetTransactions) || 0;
    },
  },
  watch: {
    queryParamsOfGetTransactions: {
      handler(val) {
        this.$store.dispatch("getTransactions", val);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.$store.dispatch("getAddressDetail", {
      address: this.address,
      queryParams: {
        coin_type: this.coin_type,
      },
    });
  },
  methods: {
    handleSeeDetail(index, row) {
      this.$router.push({ name: "transaction-detail", params: { tx_id: row.tx_id } });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/variables.scss";

.addr-qr {
  height: 285px;
  background-color: $white;
  .title {
    padding-top: 40px;
    padding-left: 100px;
    font-size: 14px;
    font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
    line-height: 19px;
  }

  .qr {
    padding-left: 80px;
  }
}

.history {
  .history-title {
    font-size: 24px;
    color: rgba(105, 135, 167, 1);
    line-height: 33px;
    margin-bottom: 24px;
    margin-top: 32px;
  }
}
%pane-padding {
  padding: 40px 0px 40px 90px;
}
.el-form-item__label {
  color: rgba(95, 106, 118, 1) !important;
  font-size: 14px !important;
}
.bottom-pane {
  background-color: $white;
  border-top: solid 1px rgba(217, 233, 239, 1);

  .form-area {
    @extend %pane-padding;

    width: 60%;
  }
  .fee-info {
    display: flex;
    flex-direction: row;
    margin: 0px 0px 60px 0px;

    .inline {
      display: flex;
      flex-direction: row;
      margin-right: 70px;

      .title {
        color: rgba(95, 106, 118, 1);
        font-size: 14px;
        margin-right: 10px;
      }
      .value {
        font-size: 14px;
        color: rgba(0, 0, 0, 1);
      }
    }
  }

  .btn-area {
    height: 80px;
    border-top: solid 1px rgba(217, 233, 239, 1);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .first-btn {
      margin-right: 48px;
    }
  }
}
.top-pane {
  min-height: 384px;
  display: flex;
  flex-direction: row;
  background-color: $white;
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
</style>
