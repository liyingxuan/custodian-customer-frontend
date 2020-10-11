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
    <div class="pane">
      <div class="title">DEPOSIT AND WITHDRAW</div>

      <div class="row">
        <div class="left">
          <div class="total">Total Assets</div>
          <div class="btc">{{ assetsDepositWithdrawStat.total_btc }} BTC</div>
          <div class="usd">≈ {{ assetsDepositWithdrawStat.total_usd }} USD</div>
        </div>

        <div class="right">
          <div class="title">Current Month</div>
          <div class="bar bar-withdraw">
            <div class="title">Withdraw</div>
            <div class="bg">
              <div
                class="fg"
                v-bind:style="{ backgroundColor: wdColor, minWidth: wdAndDpWidth.wdWidth }"
              >{{ assetsDepositWithdrawStat.total_withdrawal }} BTC</div>
            </div>
          </div>
          <div class="bar bar-deposit">
            <div class="title">Deposit</div>
            <div class="bg">
              <div
                class="fg"
                v-bind:style="{ backgroundColor: dpColor, minWidth: wdAndDpWidth.dpWidth }"
              >{{ assetsDepositWithdrawStat.total_deposit }} BTC</div>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom">
        <el-button
          class="firstBtn"
          type="primary"
          round
          size="medium"
          @click="handleDeposit"
        >Deposit</el-button>
        <el-button plain size="medium" @click="handleWithdraw" round>Withdraw</el-button>
      </div>
    </div>

    <div class="history">
      <div class="history-title">TRANSACTION HISTORY</div>
      <div class="transaction-history-table">
        <div class="search-bar">
          <el-input
            v-model="transactionSearchStringTemp"
            placeholder="Address"
            @keyup.enter.native="onTransactionSearchClick"
          >
            <el-button slot="append" icon="el-icon-search" @click="onTransactionSearchClick"/>
          </el-input>
          <el-date-picker
            v-model="transactionSearchRange"
            type="datetimerange"
            range-separator="-"
            start-placeholder="Start Date"
            end-placeholder="End Date"
          ></el-date-picker>
          <div style="flex: 1"/>
          <el-button type="primary" size="mini" round @click="onTransactionResetClick">Reset</el-button>
        </div>
        <el-table
          class="g-header"
          ref="transactionTable"
          :data="transactionTableData"
          row-class-name="g-table-row-regular"
          @filter-change="onTransactionFilterChange"
        >
          <el-table-column
            label="Transaction Type"
            prop="tx_type"
            :formatter="(row, col, value) => $formatEnumType('TransactionType', value)"
            :filters="allTransactionTypeFilters"
            :filter-multiple="false"
            :filtered-value="transactionTransactionType ? [transactionTransactionType] : []"
            column-key="tx_type"
          ></el-table-column>
          <el-table-column
            label="Asset Type"
            prop="coin_type"
            :filters="allCoinTypeFilters"
            :filter-multiple="false"
            :filtered-value="transactionCoinType ? [transactionCoinType] : []"
            column-key="coin_type"
          ></el-table-column>
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
            :filters="allTransactionStatusTypeFilters"
            :filter-multiple="false"
            :filtered-value="transactionTransactionStatusType ? [transactionTransactionStatusType] : []"
            column-key="status"
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
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import simplifyParams from "@/utils/simplifyParams";

export default {
  data() {
    return {
      wdColor: "rgba(255,123,97,1)",
      dpColor: "rgba(15,221,161,1)",
      transactionSearchStringTemp: this.$route.query.transactionSearchString,
      transactionSearchString: this.$route.query.transactionSearchString,
      transactionSearchRange: this.$route.query.transactionStartDate &&
        this.$route.query.transactionEndDate && [
          new Date(Number(this.$route.query.transactionStartDate)),
          new Date(Number(this.$route.query.transactionEndDate)),
        ],
      transactionTransactionType: this.$route.query.transactionTransactionType,
      transactionCoinType: this.$route.query.transactionCoinType,
      transactionTransactionStatusType: this.$route.query.transactionTransactionStatusType,
      transactionTableCurrentPage: Number(this.$route.query.transactionTableCurrentPage) || 1,
    };
  },
  computed: {
    queryParamsOfGetTransactions() {
      return simplifyParams({
        address: this.transactionSearchString || undefined,
        start_date:
          (this.transactionSearchRange && this.transactionSearchRange[0].getTime()) || undefined,
        end_date:
          (this.transactionSearchRange && this.transactionSearchRange[1].getTime()) || undefined,
        tx_type: this.transactionTransactionType || undefined,
        coin_type: this.transactionCoinType || undefined,
        status_type: this.transactionTransactionStatusType || undefined,
        page_index: this.transactionTableCurrentPage,
        page_offset: 10,
      });
    },
    transactionTableData() {
      return this.$store.getters.selectTransactions(this.queryParamsOfGetTransactions) || [];
    },
    transactionTableDataTotal() {
      return this.$store.getters.selectTransactionsTotal(this.queryParamsOfGetTransactions) || 0;
    },
    assetsDepositWithdrawStat() {
      return this.$store.getters.assetsDepositWithdrawStat || {};
    },
    wdAndDpWidth() {
      let wd = this.assetsDepositWithdrawStat.total_withdrawal;
      let dp = this.assetsDepositWithdrawStat.total_deposit;
      let wdWidth = "0%";
      let dpWidth = "0%";

      if (wd === 0 && dp !== 0) {
        dpWidth = "100%";
      } else if (wd !== 0 && dp === 0) {
        wdWidth = "100%";
      } else if (wd === 0 && dp === 0) {
        wdWidth = "0%";
        dpWidth = "0%";
      } else if (wd === dp) {
        wdWidth = "100%";
        dpWidth = "100%";
      } else {
        if (wd > dp) {
          wdWidth = "100%";
          dpWidth = (dp / wd).toString() + "%";
        } else {
          wdWidth = (wd / dp).toString() + "%";
          dpWidth = "100%";
        }
      }

      return {
        wdWidth: wdWidth,
        dpWidth: dpWidth,
      };
    },
    allCoinTypes() {
      return ["BTC", "LTC", "ETH"];
    },
    allCoinTypeFilters() {
      return this.allCoinTypes.map(item => ({ text: item, value: item }));
    },
    allTransactionTypes() {
      return ["withdraw", "deposit"];
    },
    allTransactionTypeFilters() {
      return this.allTransactionTypes.map(item => ({
        text: this.$formatEnumType("TransactionType", item),
        value: item,
      }));
    },
    allTransactionStatusTypes() {
      return [
        "succeed",
        "failed",
        "rejected",
        "pending-for-approval",
        "pending-for-sign",
        "in-process",
        "blockchain-confirming",
      ];
    },
    allTransactionStatusTypeFilters() {
      return this.allTransactionStatusTypes.map(item => ({
        text: this.$formatEnumType("TransactionStatusType", item),
        value: item,
      }));
    },
  },
  watch: {
    queryParamsOfGetTransactions: {
      handler(val) {
        this.$router.replace({
          name: this.$route.name,
          query: simplifyParams({
            ...this.$route.query,
            transactionSearchString: val.address,
            transactionStartDate: val.start_date,
            transactionEndDate: val.end_date,
            transactionTransactionType: val.tx_type,
            transactionCoinType: val.coin_type,
            transactionTransactionStatusType: val.status_type,
            transactionTableCurrentPage: val.page_index,
          }),
        });
        this.$store.dispatch("getTransactions", val);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.$store.dispatch("getAssetsDepositWithdrawStat");
  },
  methods: {
    handleSeeDetail(index, row) {
      this.$router.push({ name: "transaction-detail", params: { tx_id: row.tx_id } });
    },
    handleWithdraw() {
      this.$router.push({ name: "withdraw" });
    },
    handleDeposit() {
      this.$router.push({ name: "deposit" });
    },
    onTransactionFilterChange(filters) {
      if (filters.tx_type) {
        this.transactionTransactionType = filters.tx_type[0];
      }
      if (filters.coin_type) {
        this.transactionCoinType = filters.coin_type[0];
      }
      if (filters.status) {
        this.transactionTransactionStatusType = filters.status[0];
      }
      this.transactionTableCurrentPage = 1;
    },
    onTransactionSearchClick() {
      this.transactionSearchString = this.transactionSearchStringTemp;
      this.transactionTableCurrentPage = 1;
    },
    onTransactionResetClick() {
      this.transactionSearchStringTemp = "";
      this.transactionSearchString = "";
      this.transactionSearchRange = null;
      this.transactionTransactionType = "";
      this.transactionCoinType = "";
      this.transactionTransactionStatusType = "";
      this.transactionTableCurrentPage = 1;
      this.$refs.transactionTable.clearFilter();
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/variables.scss";

.history {
  .history-title {
    font-size: 24px;
    color: rgba(105, 135, 167, 1);
    line-height: 33px;
    margin-bottom: 24px;
    margin-top: 32px;
  }
  .data-picker {
    margin: 14px 48px 14px 24px;
  }
  .address {
    width: 220px;
    margin-right: 24px;
  }
  .search {
    width: 88px;
    height: 26px;
  }
}
.pane {
  height: 293px;
  border-left: solid 4px rgba(0, 120, 250, 1);
  background-color: $white;
  display: flex;
  flex-direction: column;
  padding-top: 24px;
  padding-left: 30px;
  padding-right: 30px;

  .bottom {
    height: 68px;
    border-top: solid 1px rgba(217, 233, 239, 1);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .firstBtn {
      margin-right: 24px;
    }
  }

  .title {
    font-size: 38px;
    font-weight: 300;
    color: rgba(0, 120, 250, 1);
    line-height: 52px;
  }

  .row {
    display: flex;
    flex-direction: row;
    margin-top: 24px;

    .left {
      display: flex;
      flex-direction: column;
      flex-basis: 50%;

      .total {
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

    .right {
      .title {
        font-size: 14px;
        font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
        line-height: 19px;
        margin-right: 10px;
      }

      .bar-withdraw {
        margin-top: 20px;
      }
      .bar-deposit {
        margin: 15px 0px 24px 0px;
      }
      .bar {
        display: flex;
        flex-direction: row;

        .title {
          width: 75px;
          font-size: 16px;
          font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
          font-weight: 600;
          color: rgba(105, 135, 167, 1);
          line-height: 22px;
        }
        .bg {
          width: 360px;
          height: 20px;
          background: rgba(243, 250, 255, 1);
          .fg {
            width: fit-content;
            height: 20px;
            padding-left: 10px;
            padding-right: 10px;
            font-size: 14px;
            font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
            line-height: 20px;
          }
        }
      }
    }
  }
}

.transaction-history-table {
  background-color: white;

  .search-bar {
    padding: 10px;
    display: flex;
    align-items: center;

    .el-input {
      width: 450px;
    }

    .el-date-editor {
      margin-left: 10px;
    }
  }
}
</style>
