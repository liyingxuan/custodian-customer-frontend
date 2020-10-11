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
    <div class="title">ADD USER</div>
    <div class="divider-line"></div>

    <el-form
      autocomplete="on"
      :model="addUserForm"
      :rules="addUserRules"
      ref="addUserForm"
      label-position="top"
    >
      <div class="input-row">
        <el-form-item label="Name" prop="acct_name">
          <el-input v-model="addUserForm.acct_name" placeholder="Please input name"/>
        </el-form-item>
        <el-form-item label="Position" prop="position">
          <el-input v-model="addUserForm.position" placeholder="Please input position"/>
        </el-form-item>
      </div>
      <div class="input-row">
        <el-form-item label="Email" prop="email">
          <el-input v-model="addUserForm.email" placeholder="Please input email"/>
        </el-form-item>
        <el-form-item label="Phone Number" prop="mobile">
          <el-input v-model="addUserForm.mobile" placeholder="Please input phone number"/>
        </el-form-item>
      </div>
      <div class="input-row">
        <el-form-item label="User Type" prop="acct_type">
          <el-select v-model="addUserForm.acct_type" placeholder="Please select a type">
            <el-option value="approver"/>
            <el-option value="co-signer"/>
          </el-select>
        </el-form-item>
        <div class="placeholder"></div>
      </div>
      <div class="permission">
        <div class="notice-tit">Please be noticed...</div>
        <div class="notice-txt" v-for="(noticeTxt, index) in notice" :key="index">{{ noticeTxt }}</div>
      </div>
      <div class="button-row">
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click.native.prevent="handleAddUser"
            round
          >Next</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validateAccount } from "@/utils/rules";

export default {
  data() {
    return {
      notice: [
        "Please create your approver user and co-signer user before starting any workflow. The approver has permission to review and approve all transactions. The co-signer has permission to sign transactions.",
        "For the safety of the platform, the creation of approvers need to be reviewed by the platform, and five approver is supported at the moment. Please choose carefully.",
      ],
      addUserForm: {
        acct_name: "",
        email: "",
        position: "",
        mobile: "",
        acct_type: "",
      },
      addUserRules: {
        acct_name: [{ required: true, max: 100, trigger: "blur" }],
        email: [{ required: true, max: 50, trigger: "blur", validator: validateAccount }],
        position: [{ required: true, max: 50, trigger: "blur" }],
        mobile: [{ required: true, max: 20, trigger: "blur" }],
        acct_type: [{ required: true, trigger: "blur" }],
      },
      loading: false,
    };
  },
  methods: {
    async handleAddUser() {
      await this.$refs.addUserForm.validate();
      try {
        this.loading = true;
        await this.$store.dispatch("addAccount", this.addUserForm);
        this.$message.success("Success");
        this.$router.back();
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

    /deep/ .el-form-item__label {
      padding: 0;
      font-size: 14px;
      font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
      font-weight: 600;
      color: rgba(105, 135, 167, 1);
      line-height: 19px;
    }
  }

  .input-row {
    margin-top: 32px;
    display: flex;
    justify-content: space-evenly;

    .el-input,
    .el-select,
    .placeholder {
      margin-top: 8px;
      width: 352px;
    }
  }

  .button-row {
    margin-top: 64px;
    display: flex;
    justify-content: center;

    .el-button {
      width: 141px;
    }
  }
}

.permission {
  width: 552px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 32px;
  padding-bottom: 24px;
  display: flex;
  flex-direction: column;
  background-color: rgba(245, 245, 245, 1);

  .notice-tit {
    margin-top: 24px;
    align-self: center;
    font-size: 14px;
    font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
    font-weight: 600;
    color: rgba(0, 51, 106, 1);
    line-height: 19px;
  }

  .notice-txt {
    margin-top: 16px;
    margin-left: 16px;
    font-size: 14px;
    font-family: OpenSans, "PingFang SC", "微软雅黑", sans-serif;
    color: rgba(105, 135, 167, 1);
    line-height: 19px;

    .prop-name {
      font-weight: bold;
    }
  }
}
</style>
