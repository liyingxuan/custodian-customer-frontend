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

    <div class="top-pane">
      <div class="left-flow">
        <div class="title">Approval:</div>
        <el-steps :space="62" direction="vertical" :active="approvalFlowData.active">
          <el-step v-for="(value, key, index) in approvalFlowData.list" :key="index" :title="value"></el-step>
        </el-steps>
      </div>
      <div class="right-flow">
        <div class="title">Multi-sig:</div>
        <el-steps :space="62" direction="vertical" :active="co_signFlowData.active">
          <el-step v-for="(value, key, index) in co_signFlowData.list" :key="index" :title="value"></el-step>
        </el-steps>
      </div>
    </div>
    <div class="bottom-pane">
      <el-form
        label-width="200px"
        label-position="left"
        ref="formWithdraw"
        :model="withdraw"
        :rules="withdraw_rules"
      >
        <div class="form-area">
          <el-form-item label="Destination Address:" prop="destination_address">
            <el-input v-model="withdraw.destination_address"></el-input>
          </el-form-item>

          <div class="fee-info">
            <div class="inline">
              <div class="title">Frozen Balance:</div>
              <div class="value">{{ addressDetail.frozen_balance }} {{ addressDetail.coin_type }}</div>
            </div>

            <div class="inline">
              <div class="title">Available Balance:</div>
              <div class="value">{{ addressDetail.available_balance }} {{ addressDetail.coin_type }}</div>
            </div>
          </div>

          <el-form-item label="Amount:" prop="amount">
            <el-input v-model="withdraw.amount"></el-input>
          </el-form-item>

          <div class="fee-info">
            <div class="inline">
              <div class="title">Transaction Fee:</div>
              <div class="value">{{ transactionFee }} {{ addressDetail.coin_type }}</div>
            </div>

            <div class="inline">
              <div class="title">Actual Deduction:</div>
              <div class="value">{{ actualDeduction }} {{ addressDetail.coin_type }}</div>
            </div>

            <div class="inline">
              <div class="title">Amount by USD:</div>
              <div class="value">{{ amountByUSD }} USD</div>
            </div>
          </div>

          <el-form-item label="Note:" prop="note">
            <el-input type="textarea" v-model="withdraw.note"></el-input>
          </el-form-item>

          <el-form-item label="Email Code" prop="email_code">
            <div class="horizontal">
              <el-input v-model="withdraw.email_code"></el-input>
              <el-button
                size="mini"
                round
                type="primary"
                :loading="sendEmailCodeRequesting || sendEmailCodeWaitingTime > 0"
                @click="onSendEmailCodeClick"
              >{{ sendEmailButtonText }}</el-button>
            </div>
          </el-form-item>

          <el-form-item label="GA Code" prop="ga_code">
            <el-input v-model="withdraw.ga_code"></el-input>
          </el-form-item>
        </div>
        <div class="btn-area">
          <el-button size="medium" class="first-btn" round @click="handleBack">BACK</el-button>
          <el-button
            size="medium"
            round
            type="primary"
            :loading="withdrawRequesting"
            @click="submitForm('formWithdraw')"
          >CONFIRM</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import BigNumber from "bignumber.js";
import { DECIMAL_PLACES } from "@/utils/const";

export default {
  data() {
    return {
      withdrawRequesting: false,
      sendEmailCodeRequesting: false,
      sendEmailCodeWaitingTime: 0,
      withdraw: {
        destination_address: "",
        amount: "",
        note: "",
        email_code: "",
        ga_code: "",
      },
      withdraw_rules: {
        destination_address: [
          { required: true, message: "Please input destination address", trigger: "blur" },
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value === this.address) {
                return callback(
                  new Error("Destination address must be different with current address"),
                );
              }
              return callback();
            },
          },
        ],
        amount: [
          { required: true, message: "Please input amount", trigger: "blur" },
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              const number = BigNumber(value);
              const dp = DECIMAL_PLACES[this.addressDetail.coin_type] || 0;
              if (Number.isNaN()) {
                return callback(new Error("Amount must be a number"));
              }
              if (!(number.dp() <= dp)) {
                return callback(
                  new Error(`Amount decimal places must be less than or equal to ${dp}`),
                );
              }
              if (!number.isGreaterThan(0)) {
                return callback(new Error("Amount must be greater than 0"));
              }
              return callback();
            },
          },
        ],
        note: [{ min: 0, max: 200, message: "Input 0~200 chars", trigger: "blur" }],
        email_code: [{ required: true, message: "Please input email code", trigger: "blur" }],
        ga_code: [{ required: true, message: "Please input GA code", trigger: "blur" }],
      },
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
    approvalFlowData() {
      return this.$formatApprovalFlow(
        this.$store.getters.selectAddressApprovalFlow(this.address) || {},
        { hideInitiator: false },
      );
    },
    co_signFlowData() {
      return this.$formatCo_signFlow(
        this.$store.getters.selectAddressCo_signFlow(this.address) || {},
        { hideInitiator: true },
      );
    },
    queryParamsOfGetTransactionFee() {
      return (
        this.addressDetail.coin_type && {
          coin_type: this.addressDetail.coin_type,
        }
      );
    },
    transactionFee() {
      return this.$store.getters.selectTransactionFee(this.queryParamsOfGetTransactionFee) || 0;
    },
    actualDeduction() {
      return new BigNumber(this.withdraw.amount || 0).plus(this.transactionFee).toString();
    },
    coinPrice() {
      return this.$store.getters.coinPrice || {};
    },
    amountByUSD() {
      return new BigNumber(this.withdraw.amount || 0)
        .multipliedBy(this.coinPrice[this.addressDetail.coin_type] || 0)
        .toFixed(2)
        .toString();
    },
    sendEmailButtonText() {
      return (
        "GET-CODE" +
        (this.sendEmailCodeWaitingTime > 0 ? ` (${this.sendEmailCodeWaitingTime}s)` : "")
      );
    },
  },
  watch: {
    queryParamsOfGetTransactionFee: {
      handler(val) {
        if (val) {
          this.$store.dispatch("getTransactionFee", val);
        }
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
    this.$store.dispatch("getAddressApprovalFlow", this.address);
    this.$store.dispatch("getAddressCo_signFlow", this.address);
    this.$store.dispatch("getCoinPrice");
  },
  methods: {
    async onSendEmailCodeClick() {
      try {
        this.sendEmailCodeRequesting = true;
        await this.$store.dispatch("sendEmailCode");
      } finally {
        this.sendEmailCodeRequesting = false;
      }
      this.sendEmailCodeWaitingTime = 60;
      const interval = setInterval(() => {
        this.sendEmailCodeWaitingTime--;
        if (this.sendEmailCodeWaitingTime <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    },
    async submitForm(formName) {
      await this.$refs[formName].validate();
      try {
        this.withdrawRequesting = true;
        await this.$store.dispatch("withdraw", {
          data: {
            coin_type: this.addressDetail.coin_type,
            from_address: this.addressDetail.address,
            from_address_name: this.addressDetail.address_name,
            to_address: this.withdraw.destination_address,
            to_address_name: "",
            tx_amount: Number(this.withdraw.amount),
            fee: this.transactionFee,
            note: this.withdraw.note,
          },
          ga: this.withdraw.ga_code,
          emailCode: this.withdraw.email_code,
        });
        this.$message.success("Success");
        this.$router.replace({ name: "workflow" });
      } finally {
        this.withdrawRequesting = false;
      }
    },
    handleBack() {
      this.$router.back();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/variables.scss";

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
    margin: 0px 0px 30px 0px;
    width: 166%;

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

  .horizontal {
    display: flex;
    flex-direction: row;
    align-items: center;

    & > :not(:first-child) {
      margin-left: 20px;
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
