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
    <div class="cust__table-title">{{ $route.name.toUpperCase() }}</div>

    <div class="address">
      <div class="address-table">
        <el-radio-group :value="currentRow && currentRow.address">
          <el-table
            class="g-header"
            highlight-current-row
            @current-change="handleCurrentChange"
            :data="addressTableData"
          >
            <el-table-column width="100" align="center">
              <template slot-scope="scope">
                <el-radio :value="currentRow && currentRow.address" :label="scope.row.address"/>
              </template>
            </el-table-column>
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
        </el-radio-group>
        <div class="g-pagination-area">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="addressTableDataTotal"
            :current-page.sync="addressTableCurrentPage"
          />
        </div>
      </div>

      <div class="btn-area">
        <el-button type="primary" class="btn-next" size="mini" round @click="handleClick">Next</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addressTableCurrentPage: 1,
      currentRow: null,
    };
  },
  computed: {
    inWithdraw() {
      return this.$route.name === "withdraw";
    },
    queryParamsOfGetAddresses() {
      return {
        page_index: this.addressTableCurrentPage,
        page_offset: 10,
      };
    },
    addressTableData() {
      return this.$store.getters.selectAddresses(this.queryParamsOfGetAddresses) || [];
    },
    addressTableDataTotal() {
      return this.$store.getters.selectAddressesTotal(this.queryParamsOfGetAddresses) || 0;
    },
  },
  watch: {
    queryParamsOfGetAddresses: {
      handler(val) {
        this.$store.dispatch("getAddresses", val);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    handleClick() {
      if (!this.currentRow) {
        this.$message.error("Please select one row.");
      }
      this.$router.push({
        name: this.inWithdraw ? "withdraw-confirmation" : "deposit-confirmation",
        params: { address: this.currentRow.address, coin_type: this.currentRow.coin_type },
      });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/variables.scss";

.el-radio-group {
  width: 100%;

  /deep/ .el-radio__label {
    display: none;
  }
}

.search-input {
  width: 360px;
  margin: 14px;
}

.btn-area {
  height: 80px;
  width: 100%;
  background-color: $white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .btn-next {
    width: 120px;
  }
}
</style>
