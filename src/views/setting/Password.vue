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
    <div class="title">CHANGE PASSWORD</div>
    <div class="divider-line"></div>

    <el-form
      autocomplete="on"
      :model="pwdForm"
      :rules="pwdRules"
      ref="pwdForm"
      label-position="top"
    >
      <div class="input-row">
        <el-form-item label="Old Password" prop="password">
          <el-input
            v-model="pwdForm.password"
            type="password"
            size="medium"
            placeholder="Please input the old password"
          />
        </el-form-item>
        <div class="placeholder"></div>
      </div>

      <div class="input-row">
        <el-form-item label="New Password" prop="new_password">
          <el-input
            v-model="pwdForm.new_password"
            type="password"
            size="medium"
            placeholder="Please input a new password"
          />
        </el-form-item>
        <el-form-item label="Confirm New Password" prop="confirmPassword">
          <el-input
            v-model="pwdForm.confirmPassword"
            type="password"
            size="medium"
            placeholder="Please input the new password again"
          />
        </el-form-item>
      </div>

      <div class="button-row">
        <el-form-item>
          <el-button type="primary" :loading="loading" @click.native.prevent="handlePwd" round
            >Next</el-button
          >
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validatePassword } from "@/utils/rules";
import { validatePassword as validatePwd } from "@/utils/validate";

export default {
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (!validatePwd(value)) {
        callback(new Error("The password is invalid"));
      } else {
        if (value !== this.pwdForm.new_password) {
          callback(new Error("Two passwords are inconsistent"));
        } else {
          callback();
        }
      }
    };

    return {
      pwdForm: {
        password: "",
        new_password: "",
        confirmPassword: "",
      },
      pwdRules: {
        password: [{ required: true, trigger: "blur", message: "Please input the old password" }],
        new_password: [{ required: true, trigger: "blur", validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: "blur", validator: validateConfirmPassword }],
      },
      loading: false,
    };
  },
  methods: {
    async handlePwd() {
      await this.$refs.pwdForm.validate();
      try {
        this.loading = true;
        await this.$store.dispatch("changePassword", this.pwdForm);
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
</style>
