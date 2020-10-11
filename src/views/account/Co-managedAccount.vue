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
    <div class="summary">
      <div class="title">{{ title }}</div>
      <div class="asset-title">Account Assets</div>
      <div class="btc-total">{{ assetsDetail.total_btc }} BTC</div>
      <div class="usd-total">≈ {{ assetsDetail.total_usd }} USD</div>

      <div class="row">
        <div class="inner-row" v-for="item in assetsDetailAssetList" :key="item.name">
          <div class="pane">
            <div class="coin-type">{{ item.name }}</div>
            <div class="count">{{ item.amount }}</div>
            <div class="usd">≈ {{ item.value_by_usd }} USD</div>
          </div>
          <div class="sep"></div>
        </div>
      </div>
    </div>

    <div class="address-info">
      <span class="address-title">ADDRESSES</span>
      <el-button @click="handleNewAddress" type="primary" size="mini" round>
        <i class="el-icon--left fal fa-plus g-vertical"></i>New
        Address
      </el-button>
    </div>

    <div class="address-table">
      <div class="search-bar">
        <el-input
          v-model="addressSearchStringTemp"
          placeholder="Name or address"
          @keyup.enter.native="onAddressSearchClick"
        >
          <el-button slot="append" icon="el-icon-search" @click="onAddressSearchClick"/>
        </el-input>
        <div style="flex: 1"/>
        <el-button type="primary" size="mini" round @click="onAddressResetClick">Reset</el-button>
      </div>
      <el-table
        class="g-header"
        ref="addressTable"
        :data="addressTableData"
        :cell-class-name="cellClassName"
        @filter-change="onAddressFilterChange"
      >
        <el-table-column label="Name" prop="address_name"></el-table-column>
        <el-table-column
          label="Asset Type"
          prop="coin_type"
          :filters="allCoinTypeFilters"
          :filter-multiple="false"
          :filtered-value="addressCoinType ? [addressCoinType] : []"
          column-key="coin_type"
        ></el-table-column>
        <el-table-column label="Address" prop="address"></el-table-column>
        <el-table-column
          label="Account Type"
          prop="custodian_type"
          :formatter="(row, col, value) => $formatEnumType('CustodianType', value)"
        ></el-table-column>
        <el-table-column label="Current Balance" prop="current_balance"></el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <div class="g-table-actions">
              <div class="g-table-action" @click="handleDetail(scope.$index, scope.row)">Detail</div>
              <div class="g-table-separate"></div>
              <div class="g-table-action" @click="handleDeposit(scope.$index, scope.row)">Deposit</div>
              <div class="g-table-separate"></div>
              <div class="g-table-action" @click="handleWithdraw(scope.$index, scope.row)">Withdraw</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="g-pagination-area">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="addressTableDataTotal"
          :current-page.sync="addressTableCurrentPage"
        />
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
          />
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
      title: "CO-MANAGED ACCOUNT",
      addressSearchStringTemp: this.$route.query.addressSearchString,
      addressSearchString: this.$route.query.addressSearchString,
      addressCoinType: this.$route.query.addressCoinType,
      addressTableCurrentPage: Number(this.$route.query.addressTableCurrentPage) || 1,
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
    assetsDetail() {
      return this.$store.getters.selectAssetsDetail({ custodian_type: "joint-managed" }) || {};
    },
    assetsDetailAssetList() {
      return this.assetsDetail.asset_list || [];
    },
    queryParamsOfGetAddresses() {
      return simplifyParams({
        custodian_type: "joint-managed",
        addr_and_addr_name: this.addressSearchString || undefined,
        coin_type: this.addressCoinType || undefined,
        page_index: this.addressTableCurrentPage,
        page_offset: 10,
      });
    },
    addressTableData() {
      return this.$store.getters.selectAddresses(this.queryParamsOfGetAddresses) || [];
    },
    addressTableDataTotal() {
      return this.$store.getters.selectAddressesTotal(this.queryParamsOfGetAddresses) || 0;
    },
    queryParamsOfGetTransactions() {
      return simplifyParams({
        custodian_type: "joint-managed",
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
    queryParamsOfGetAddresses: {
      handler(val) {
        this.$router.replace({
          name: this.$route.name,
          query: simplifyParams({
            ...this.$route.query,
            addressSearchString: val.addr_and_addr_name,
            addressCoinType: val.coin_type,
            addressTableCurrentPage: val.page_index,
          }),
        });
        this.$store.dispatch("getAddresses", val);
      },
      deep: true,
      immediate: true,
    },
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
    this.$store.dispatch("getAssetsDetail", { custodian_type: "joint-managed" });
  },
  methods: {
    handleNewAddress(e) {
      this.$router.push({ name: "create-co-managed-address" });
    },
    handleDetail(index, row) {
      this.$router.push({
        name: "address-detail",
        params: { address: row.address, coin_type: row.coin_type },
      });
    },
    handleDeposit(index, row) {
      this.$router.push({ name: "deposit-confirmation", params: { address: row.address } });
    },
    handleWithdraw(index, row) {
      this.$router.push({ name: "withdraw-confirmation", params: { address: row.address } });
    },
    handleSeeDetail(index, row) {
      this.$router.push({ name: "transaction-detail", params: { tx_id: row.tx_id } });
    },
    cellClassName(o) {
      const { row, column, rowIndex, columnIndex } = o;
      let theClass = "g-table-column-regular";
      if (columnIndex === 0 || columnIndex === 4) {
        theClass = "g-table-column-bold";
      }
      return theClass;
    },
    onAddressFilterChange(filters) {
      if (filters.coin_type) {
        this.addressCoinType = filters.coin_type[0];
      }
      this.addressTableCurrentPage = 1;
    },
    onAddressSearchClick() {
      this.addressSearchString = this.addressSearchStringTemp;
      this.addressTableCurrentPage = 1;
    },
    onAddressResetClick() {
      this.addressSearchStringTemp = "";
      this.addressSearchString = "";
      this.addressCoinType = "";
      this.addressTableCurrentPage = 1;
      this.$refs.addressTable.clearFilter();
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
  .address {
    width: 220px;
    margin-right: 24px;
  }
}
.address-info {
  margin-top: 32px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .address-title {
    font-size: 24px;
    font-family: OpenSans, "PingFang SC", "微软雅黑", sans-serif;
    color: rgba(105, 135, 167, 1);
    line-height: 33px;
    margin-right: 32px;
  }

  .icon {
    margin: 0 5px;
  }
}

.inner-row:last-of-type {
  .sep {
    display: none !important;
  }
}
.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 32px;

  .inner-row {
    display: flex;
    flex-direction: row;
    align-items: center;

    .pane {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 193px;
      height: 107px;

      .coin-type {
        padding-top: 16px;
        font-size: 18px;
        font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
        font-weight: 600;
        color: rgba(105, 135, 167, 1);
        line-height: 24px;
      }
      .count {
        margin-top: 8px;
        font-size: 16px;
        font-family: OpenSans, "PingFang SC", "微软雅黑", sans-serif;
        color: rgba(0, 51, 106, 1);
        line-height: 22px;
      }
      .usd {
        margin-top: 4px;
        font-size: 12px;
        font-family: OpenSans, "PingFang SC", "微软雅黑", sans-serif;
        color: rgba(105, 135, 167, 1);
        line-height: 17px;
      }
    }

    .sep {
      width: 2px;
      height: 67px;
      background-color: rgba(217, 233, 239, 1);
    }
  }
}

.summary {
  min-width: 1184px;
  min-height: 337px;
  background: rgba(255, 255, 255, 1);
  border-left: solid 4px $co-managedAccountColor;

  .title {
    font-size: 38px;
    font-family: OpenSans-Light, "PingFang SC", "微软雅黑", sans-serif;
    font-weight: 300;
    color: $co-managedAccountColor;
    line-height: 52px;
    padding-top: 24px;
    padding-left: 32px;
  }

  .asset-title {
    font-size: 14px;
    font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
    font-weight: 600;
    color: rgba(0, 51, 106, 1);
    line-height: 19px;
    padding-left: 32px;
    margin-top: 32px;
  }

  .btc-total {
    font-size: 24px;
    font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
    font-weight: 600;
    color: rgba(0, 51, 106, 1);
    line-height: 33px;
    padding-left: 32px;
    margin-top: 8px;
  }

  .usd-total {
    font-size: 16px;
    font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
    font-weight: 600;
    color: rgba(105, 135, 167, 1);
    line-height: 22px;
    padding-left: 32px;
    margin-top: 8px;
  }
}

.address-table,
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
