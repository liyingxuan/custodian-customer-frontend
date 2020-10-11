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
      <div class="left-pane">
        <div class="address-name">{{ addressDetail.address_name }}</div>

        <div class="address-asset">Address Asset</div>
        <div class="count">{{ addressDetail.current_balance }} {{ addressDetail.coin_type }}</div>
        <div class="usd">≈ {{ addressDetail.total_usd }} USD</div>
      </div>

      <div class="sep"></div>

      <div class="right-pane">
        <div class="title">Multi-Sig Address</div>
        <div class="address">
          <div class="address-info" id="copyAddress">{{ addressDetail.address }}</div>
          <div class="copy">
            <span v-if="copyBtnDisabled">
              <el-button
                type="text"
                class="copy-address"
                data-clipboard-target="#copyAddress"
                @click="copyAddressVal"
              >Copy</el-button>
            </span>
            <span v-else class="copied-style">Copied!</span>
          </div>
        </div>

        <div class="qr">
          <vue-qr :text="addressDetail.address || ''" :size="98" qid="qrCallback"></vue-qr>
        </div>
      </div>
    </div>

    <div class="history">
      <div class="history-title">TRANSACTION HISTORY</div>
      <div class="transaction-history-table">
        <div class="search-bar">
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
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import simplifyParams from "@/utils/simplifyParams";
import Clipboard from "clipboard";

export default {
  data() {
    return {
      copyBtnDisabled: true,
      transactionSearchRange: this.$route.query.transactionStartDate &&
        this.$route.query.transactionEndDate && [
          new Date(Number(this.$route.query.transactionStartDate)),
          new Date(Number(this.$route.query.transactionEndDate)),
        ],
      transactionTransactionType: this.$route.query.transactionTransactionType,
      transactionTransactionStatusType: this.$route.query.transactionTransactionStatusType,
      transactionTableCurrentPage: Number(this.$route.query.transactionTableCurrentPage) || 1,
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
      return simplifyParams({
        address: this.address,
        coin_type: this.coin_type,
        start_date:
          (this.transactionSearchRange && this.transactionSearchRange[0].getTime()) || undefined,
        end_date:
          (this.transactionSearchRange && this.transactionSearchRange[1].getTime()) || undefined,
        tx_type: this.transactionTransactionType || undefined,
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
            transactionStartDate: val.start_date,
            transactionEndDate: val.end_date,
            transactionTransactionType: val.tx_type,
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
    this.$store.dispatch("getAddressDetail", {
      address: this.address,
      queryParams: {
        coin_type: this.coin_type,
      },
    });
  },
  methods: {
    copyAddressVal() {
      let clipboard = new Clipboard(".copy-address");

      clipboard.on("success", function(e) {
        e.clearSelection();
      });

      this.copyBtnDisabled = false;
    },
    handleSeeDetail(index, row) {
      this.$router.push({ name: "transaction-detail", params: { tx_id: row.tx_id } });
    },
    onTransactionFilterChange(filters) {
      if (filters.tx_type) {
        this.transactionTransactionType = filters.tx_type[0];
      }
      if (filters.status) {
        this.transactionTransactionStatusType = filters.status[0];
      }
      this.transactionTableCurrentPage = 1;
    },
    onTransactionResetClick() {
      this.transactionSearchRange = null;
      this.transactionTransactionType = "";
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
  .address {
    width: 220px;
    margin-right: 24px;
  }
}
.pane {
  display: flex;
  flex-direction: row;

  background-color: rgba(255, 255, 255, 1);
  padding: 24px 24px 32px 32px;

  .sep {
    width: 1px;
    height: 164px;
    background-color: rgba(217, 233, 239, 1);
  }

  .right-pane {
    flex-basis: 50%;
    padding-left: 132px;

    .qr {
      width: 374px;
      display: flex;
      justify-content: center;
    }
    .title {
      font-size: 14px;
      font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
      font-weight: 600;
      color: rgba(0, 51, 106, 1);
      line-height: 19px;
      margin-bottom: 24px;
    }
    .address {
      width: 374px;
      height: 23px;
      background: rgba(245, 245, 245, 1);
      border-radius: 11px;

      display: flex;
      flex-direction: row;
      align-items: center;

      .address-info {
        width: 374px - 63px;
        font-size: 12px;
        font-family: OpenSans, "PingFang SC", "微软雅黑", sans-serif;
        color: rgba(105, 135, 167, 1);
        line-height: 17px;
        text-align: center;
      }

      .copy-address {
        padding: 0;
        color: white;
      }

      .copy {
        width: 63px;
        height: 23px;
        background: rgba(105, 135, 167, 1);
        border-radius: 0px 11px 11px 0px;

        font-size: 10px;
        font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 23px;
        text-align: center;
      }

      .copy:hover {
        cursor: pointer;
      }
    }
  }
  .left-pane {
    flex-basis: 50%;
    .address-name {
      font-size: 38px;
      font-family: OpenSans-Light, "PingFang SC", "微软雅黑", sans-serif;
      font-weight: 300;
      color: rgba(0, 209, 208, 1);
      line-height: 52px;
    }

    .address-asset {
      font-size: 14px;
      font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
      font-weight: 600;
      color: rgba(0, 51, 106, 1);
      line-height: 19px;

      margin-top: 32px;
    }

    .count {
      font-size: 24px;
      font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
      font-weight: 600;
      color: rgba(0, 51, 106, 1);
      line-height: 33px;
      margin: 8px 0px;
    }

    .usd {
      font-size: 16px;
      font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
      font-weight: 600;
      color: rgba(105, 135, 167, 1);
      line-height: 22px;
    }
  }
}

.transaction-history-table {
  background-color: white;

  .search-bar {
    padding: 10px;
    display: flex;
    align-items: center;
  }
}
</style>
