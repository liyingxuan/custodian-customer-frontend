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
    <div class="title">SETTINGS</div>
    <div class="divider-line"/>

    <div class="subtitle">User</div>
    <div class="description">{{ userDesc }}</div>
    <div class="buttons-row">
      <el-button type="text" size="medium" @click="onUserManagementClick">User Management</el-button>
      <el-button type="text" size="medium" @click="onAddUserClick">Add User</el-button>
      <el-button type="text" size="medium" @click="onSetApproverClick">Set Approver</el-button>
    </div>
    <div class="spacing-divider-line"/>

    <div class="subtitle">Password</div>
    <div class="description">{{ pwdDesc }}</div>
    <div class="buttons-row">
      <el-button type="text" size="medium" @click="onChangePasswordClick">Change</el-button>
    </div>
    <div class="spacing-divider-line"/>

    <div class="subtitle">Google Authenticator</div>
    <div class="description">{{ GADesc }}</div>
    <div class="buttons-row">
      <el-button type="text" size="medium" @click="onChangeGoogleAuthenticator">Change</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userDesc:
        "You can add and manage sub-accounts for the system here, such as the account for the auditor and the account for the operator.",
      pwdDesc: "This is the password used to log in.",
      GADesc: "Used for withdrawing, logging in, and security setting.",
    };
  },
  methods: {
    onUserManagementClick() {
      this.$router.push({ name: "user-management" });
    },
    onSetApproverClick() {
      this.$router.push({ name: "approver" });
    },
    onAddUserClick() {
      this.$router.push({ name: "add-user" });
    },
    onChangePasswordClick() {
      this.$router.push({ name: "password" });
    },
    onChangeGoogleAuthenticator() {
      this.$router.push({ name: "google-authenticator" });
    },
  },
};
</script>

<style lang="scss" scoped>
.no-fixed-width-container {
  padding-bottom: 20px;
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

.subtitle {
  margin-top: 24px;
  margin-left: 32px;
  font-size: 24px;
  font-family: OpenSans, "PingFang SC", "微软雅黑", sans-serif;
  color: rgba(0, 0, 0, 1);
  line-height: 33px;
}

.description {
  margin-top: 24px;
  margin-left: 32px;
  font-size: 16px;
  font-family: OpenSans, "PingFang SC", "微软雅黑", sans-serif;
  color: rgba(95, 106, 118, 1);
  line-height: 22px;
}

.buttons-row {
  display: flex;
  margin-top: 24px;
  margin-bottom: 24px;

  .el-button {
    padding: 0;
    margin-left: 40px;
    font-size: 16px;

    &:first-child {
      margin-left: 32px;
    }
  }
}

.spacing-divider-line {
  margin: 0 32px;
  border: 1px solid rgba(183, 200, 206, 0.5);
  transform: scaleY(0.5);
  transform-origin: 0 100%;
}
</style>
