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
    <div class="title">APPROVER SETTING</div>
    <div class="divider-line"/>

    <el-form
      autocomplete="on"
      :model="approverForm"
      :rules="approverRules"
      ref="approverForm"
      label-position="left"
      label-width="0px"
    >
      <div class="label-row">
        <div class="label">Approver</div>
      </div>
      <div class="select-row">
        <el-form-item prop="approver">
          <el-select
            v-model="approverForm.email"
            size="medium"
            placeholder="Please select a approver"
            :loading="optionLoading"
          >
            <el-option
              v-for="approver in approveCandidates"
              :key="approver"
              :label="approver"
              :value="approver"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="label-row">
        <div class="label">Google Authenticator Code</div>
      </div>
      <div class="select-row last">
        <div class="security-code-row">
          <security-code key="setApprover" v-model="approverForm.gaCode" value blur-on-complete/>
        </div>
      </div>

      <div class="divider-line"/>

      <el-form-item class="el-login-btn button-row">
        <el-button
          type="primary"
          :disabled="btnDisabled"
          :loading="loading"
          round
          @click.native.prevent="handleApprove"
        >Next</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  async created() {
    try {
      this.optionLoading = true;
      this.approveCandidates = await this.$store.dispatch("getApproverCandidates");
      this.approverForm.email = (await this.$store.dispatch("getApprover")).email;
    } finally {
      this.optionLoading = false;
    }
  },
  data() {
    return {
      approverForm: {
        email: "",
        gaCode: "",
      },
      approverRules: {
        email: [{ required: true, message: "Please set approver", trigger: "change" }],
      },
      approveCandidates: [],
      btnDisabled: true,
      loading: false,
      optionLoading: false,
    };
  },
  watch: {
    "approverForm.gaCode": function(newV, oldV) {
      this.btnDisabled = newV.length !== 6;
    },
  },
  methods: {
    async handleApprove() {
      await this.$refs.approverForm.validate();
      try {
        this.loading = true;
        await this.$store.dispatch("setApprover", {
          data: { email: this.approverForm.email },
          ga: this.approverForm.gaCode,
        });
        this.approverForm.gaCode = "";
        this.$message.success("Success");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.no-fixed-width-container {
  flex: 1;
  padding-bottom: 64px;
  background-color: rgba(255, 255, 255, 1);
}

.title {
  margin: 24px 32px;
  font-size: 38px;
  font-family: OpenSans-Light, "PingFang SC", "微软雅黑", sans-serif;
  font-weight: 300;
  color: rgba(74, 144, 226, 1);
  line-height: 52px;
}

.divider-line {
  border: 1px solid rgba(183, 200, 206, 0.5);
  transform: scaleY(0.5);
  transform-origin: 0 100%;
}

.el-form {
  .el-form-item {
    margin: 0;
  }

  .label-row {
    margin-top: 48px;
    display: flex;
    justify-content: center;

    &.first {
      margin-top: 32px;
    }

    .label {
      width: 352px;
      font-size: 14px;
      font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
      font-weight: 600;
      color: rgba(105, 135, 167, 1);
      line-height: 19px;
    }
  }

  .select-row {
    margin-top: 24px;
    display: flex;
    justify-content: center;

    &.last {
      margin-bottom: 52px;
    }

    .el-select {
      width: 352px;
    }
  }

  .button-row {
    margin-top: 48px;
    display: flex;
    justify-content: center;

    .el-button {
      width: 141px;
    }
  }

  .security-code-row {
    display: flex;
    justify-content: center;

    /deep/ .form-control {
      font-size: 18px !important;
      font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
      font-weight: 600;
      color: transparent;
      text-shadow: 0 0 0 rgba(105, 135, 167, 1);
      outline: none;
      border: 1px solid rgba(183, 200, 206, 0.5);

      &:focus {
        background-color: rgba(243, 250, 255, 1);
      }
    }
  }
}
</style>
