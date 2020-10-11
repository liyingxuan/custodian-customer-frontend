<!--
import { METHODS } from 'http';
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
    <div class="cust__table-title">USER MANAGEMENT</div>

    <div class="cust__table-top-add">
      <el-button class="cust__primary-btn" @click="onAddUserClick">Add User</el-button>
    </div>

    <div class="user-table">
      <el-table
        :data="accounts"
        header-cell-class-name="header-cell"
        :cell-class-name="cellClassName"
      >
        <el-table-column label="Name" prop="acct_name" align="center"/>
        <el-table-column label="Email" prop="email" align="center"/>
        <el-table-column label="User Type" prop="role_type" align="center"/>
        <el-table-column
          label="Status"
          prop="status"
          align="center"
          :formatter="(row, col, value) => $formatEnumType('AccountStatusType', value)"
        />
        <el-table-column
          label="Last Login"
          prop="last_login_time"
          :formatter="(row, col, value) => $formatDatetime(value)"
          align="center"
        />
        <el-table-column label="Operation" align="center">
          <template slot-scope="scope" v-if="scope.row.email !== myInfo.email">
            <div class="g-table-actions">
              <div
                v-if="!scope.row.is_frozen"
                class="g-table-action"
                @click="handleFreeze(scope.$index, scope.row, true)"
              >Freeze</div>
              <div
                v-if="scope.row.is_frozen"
                class="g-table-action"
                @click="handleFreeze(scope.$index, scope.row, false)"
              >Unfreeze</div>
              <div v-if="scope.row.status === 'pending-for-activation'" class="g-table-separate"></div>
              <div
                v-if="scope.row.status === 'pending-for-activation'"
                class="g-table-action"
                @click="handleResendEmail(scope.$index, scope.row)"
              >Resend email</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-row">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="accountsTotal"
          :current-page.sync="currentPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      freezeForm: {
        frozen_email: "",
        frozen: true,
      },
      resendEmailForm: {
        activated_email: "",
      },
    };
  },
  created() {
    this.getAccountList();
  },
  computed: {
    accounts() {
      return (
        this.$store.getters.selectAccounts({
          page_index: this.currentPage,
          page_offset: 10,
        }) || []
      );
    },
    accountsTotal() {
      return (
        this.$store.getters.selectAccountsTotal({
          page_index: this.currentPage,
          page_offset: 10,
        }) || 0
      );
    },
    myInfo() {
      return this.$store.getters.myInfo || {};
    },
  },
  methods: {
    async getAccountList() {
      await this.$store.dispatch("getAccounts", {
        page_index: this.currentPage,
        page_offset: 10,
      });
    },
    async handleFreeze(index, row, frozen) {
      this.freezeForm.frozen_email = row.email;
      this.freezeForm.frozen = frozen;
      await this.$store.dispatch("freezeAccount", this.freezeForm);
      await this.getAccountList();
    },
    async handleResendEmail(index, row) {
      this.resendEmailForm.activated_email = row.email;
      await this.$store.dispatch("resendAccountActivationEmail", this.resendEmailForm);
      this.$message.success("Success");
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAccountList();
    },
    cellClassName(o) {
      const { row, column, rowIndex, columnIndex } = o;
      let theClass = "body-cell normal";
      if (columnIndex === 0 || columnIndex === 3) {
        theClass = "body-cell bold";
      }
      return theClass;
    },
    onAddUserClick() {
      this.$router.push({ name: "add-user" });
    },
  },
};
</script>

<style lang="scss" scoped>
.no-fixed-width-container {
  background-color: rgba(255, 255, 255, 1);
}

.cust__table-top-add {
  padding: 22px 24px;
  background-color: white;
  font-size: 38px;
  font-family: OpenSans-Light, "PingFang SC", "微软雅黑", sans-serif;
  font-weight: 300;
  color: rgba(0, 51, 106, 1);
  line-height: 52px;
  border-bottom: solid 1px #b7c8ce;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.user-table {
  /deep/ .header-cell {
    height: 48px;
    background-color: rgba(105, 135, 167, 1);

    .cell {
      font-size: 14px;
      font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      line-height: 19px;

      i {
        color: rgba(255, 255, 255, 1);
      }
    }
  }

  /deep/ .body-cell {
    height: 48px;

    &.normal {
      .cell {
        color: rgba(95, 106, 118, 1);
      }
    }

    &.bold {
      .cell {
        color: rgba(0, 0, 0, 1);
      }
    }

    .cell {
      font-size: 14px;
      font-family: OpenSans, "PingFang SC", "微软雅黑", sans-serif;
      line-height: 19px;
    }
  }

  .pagination-row {
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
