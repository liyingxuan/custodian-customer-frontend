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
    <div class="title-area">
      <div class="title">CREATE AN ESCROW ADDRESS</div>
    </div>
    <div class="area-inner-container">
      <div class="area-inner">
        <el-form :model="address" :rules="rules" ref="coAddressForm" label-position="top">
          <el-form-item label="Asset Type" prop="coinType" class="co-address-area title">
            <el-radio-group class="asset-type-area" v-model="address.coin_type">
              <el-radio
                class="asset-item"
                v-for="coin_type in allCoinTypes"
                :key="coin_type"
                :label="coin_type"
              >{{ coin_type }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="Name of Address" prop="address_name" class="name-of-address title">
            <el-input
              class="name-of-address-input item-width"
              type="text"
              v-model="address.address_name"
            ></el-input>
          </el-form-item>

          <div class="sep-ga">
            <el-form-item label="Google Authenticator Code" prop="security_code" class="ga">
              <security-code v-model="address.security_code" :blurOnComplete="true"></security-code>
            </el-form-item>
            <el-form-item>
              <el-button
                class="create-btn"
                type="primary"
                @click="submitForm('coAddressForm')"
                round
                :loading="createAddressRequesting"
              >Create</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <confirm-dialog
      ref="confirmDialog"
      title="CONFIRM"
      message="Before creating any address, please go to &quot;User Management&quot; under &quot;Setting&quot; to create an &quot;Approver&quot; account, and then go to &quot;Approver Setting&quot; to set up the universal &quot;Approver&quot;."
      :okOnly="true"
    />
  </div>
</template>

<script>
export default {
  data() {
    var checkSecurityCode = (rule, value, callback) => {
      if (!value || value.length < 6) {
        callback(new Error("SecurityCode is not right"));
      } else {
        callback();
      }
    };
    return {
      createAddressRequesting: false,
      address: {
        coin_type: "BTC",
        address_name: "",
        security_code: "",
      },
      rules: {
        address_name: [{ required: true, message: "Please input address name", trigger: "change" }],
        security_code: [{ required: true, validator: checkSecurityCode, trigger: "blur" }],
      },
    };
  },
  computed: {
    approver() {
      return this.$store.getters.approver || {};
    },
    allCoinTypes() {
      return ["BTC", "LTC", "ETH"];
    },
    allSignCounts() {
      return [1, 2];
    },
  },
  created() {
    this.$store.dispatch("getApprover").then(() => {
      if (!this.approver.email) {
        this.$refs.confirmDialog.show();
      }
    });
  },
  methods: {
    async submitForm(formName) {
      await this.$refs[formName].validate();
      try {
        this.createAddressRequesting = true;
        await this.$store.dispatch("createAddress", {
          ga: this.address.security_code,
          data: {
            custodian_type: "platform-managed",
            coin_type: this.address.coin_type,
            address_name: this.address.address_name,
          },
        });
        this.$message.success("Success");
        this.$router.replace({ name: "workflow" });
      } finally {
        this.createAddressRequesting = false;
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/variables.scss";

$titleColor: rgba(105, 135, 167, 1);

.sep-ga {
  border-top: 1px solid rgba(183, 200, 206, 1);
  margin: 65px 0 31px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .ga {
    margin: 31px 0 16px 0;
  }

  .create-btn {
    margin-top: 48px;
    width: 159px;
  }
}
.item-width {
  width: 352px;
}

.inline-select {
  display: flex;
  flex-direction: row;
  .inline-select-left {
    margin-right: 48px;
  }
}

.co-signer-platform {
  width: 352px;
  height: 28px;
  background: rgba(245, 245, 245, 1);
  font-size: 16px;
  font-family: OpenSans, "PingFang SC", "微软雅黑", sans-serif;
  color: rgba(105, 135, 167, 1);
  line-height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
}

%form-title {
  font-family: OpenSans-Semibold, "PingFang SC", "微软雅黑", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: rgba(105, 135, 167, 1);
  line-height: 19px;
}

%form-inner-margin {
  margin: 0;
}

.el-form-item__label {
  display: block !important;
}

.title-area {
  background-color: $contentAreaColor;
  height: 98px;
  border-bottom: 1px solid rgba(183, 200, 206, 1);
  padding: 24px 0 0 32px;

  .title {
    font-size: 38px;
    font-weight: 300;
    color: $co-managedAccountColor;
    line-height: 52px;
  }
}

/*增加一个container让其内部（按照最宽的组件的宽度）居中*/
.area-inner-container {
  background-color: $contentAreaColor;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.co-signers-section-title {
  font-size: 18px;
  font-family: OpenSans, "PingFang SC", "微软雅黑", sans-serif;
  color: rgba(105, 135, 167, 1);
  line-height: 24px;
  margin: 52px 0 16px 0;
}
.area-inner {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  .title {
    @extend %form-title;
  }
  .name-of-address {
    display: flex;
    flex-direction: column;

    .name-of-address-input {
      @extend %form-inner-margin;
    }
  }
  .number-of-signatures {
    display: flex;
    flex-direction: column;

    .title {
      @extend %form-title;
    }

    .signature-area {
      display: flex;
      flex-direction: row;
      @extend %form-inner-margin;

      .signature-item {
        margin-right: 56px;
      }
    }
  }

  .co-address-area {
    margin-top: 45px;
    display: flex;
    flex-direction: column;

    .asset-type-area {
      display: flex;
      flex-direction: row;
      @extend %form-inner-margin;

      .asset-item {
        margin-right: 30px;
      }
    }
  }
}
</style>
