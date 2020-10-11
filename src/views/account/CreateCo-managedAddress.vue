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
      <div class="title">CREATE A CO-MANAGED ADDRESS</div>
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

          <el-form-item
            label="Number of Signatures"
            prop="sign_count"
            class="number-of-signatures title"
          >
            <el-radio-group class="signature-area" v-model="address.sign_count">
              <el-radio
                class="signature-item"
                v-for="sign_count in allSignCounts"
                :key="sign_count"
                :label="sign_count"
              >{{ sign_count }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="Name of Address" prop="address_name" class="name-of-address title">
            <el-input
              class="name-of-address-input item-width"
              type="text"
              v-model="address.address_name"
            ></el-input>
          </el-form-item>

          <div class="co-signers-section-title">CO-SIGNERS</div>

          <div class="inline-select">
            <el-form-item
              label="Withdraw Co-signer 1"
              prop="co_signer1"
              class="title inline-select-left"
            >
              <el-select
                class="item-width"
                v-model="address.co_signer1"
                placeholder="Please choose co-signer 1"
              >
                <el-option
                  v-for="(value, index) in co_signerCandidates"
                  :key="index"
                  :value="value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="this.address.sign_count >= 2"
              label="Withdraw Co-signer 2"
              prop="co_signer2"
              class="title"
            >
              <el-select
                class="item-width"
                v-model="address.co_signer2"
                placeholder="Please choose co-signer 2"
              >
                <el-option
                  v-for="(value, index) in co_signerCandidates"
                  :key="index"
                  :value="value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>

          <el-form-item label="Withdraw Co-signer 3" class="title">
            <div class="co-signer-platform">Onchain Custodian Platform</div>
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
      message="Before creating any address, please go to &quot;User Management&quot; under &quot;Setting&quot; to create a &quot;co-signer&quot; account (if needed) and an &quot;Approver&quot; account, and then go to &quot;Approver Setting&quot; to set up the universal &quot;Approver&quot;."
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
        sign_count: 1,
        co_signer1: null,
        co_signer2: null,
        security_code: "",
      },
      rules: {
        address_name: [{ required: true, message: "Please input address name", trigger: "change" }],
        security_code: [{ required: true, validator: checkSecurityCode, trigger: "blur" }],
        co_signer1: [
          {
            required: true,
            message: "Please select co-signer",
            trigger: "change",
          },
        ],
        co_signer2: [
          {
            required: true,
            message: "Please select co-signer",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    approver() {
      return this.$store.getters.approver || {};
    },
    co_signerCandidates() {
      return this.$store.getters.co_signerCandidates || [];
    },
    allCoinTypes() {
      return ["BTC", "LTC", "ETH"];
    },
    allSignCounts() {
      return [1, 2];
    },
  },
  created() {
    Promise.all([
      this.$store.dispatch("getApprover"),
      this.$store.dispatch("getCo_signerCandidates"),
    ]).then(() => {
      if (!this.approver.email || this.co_signerCandidates.length === 0) {
        this.$refs.confirmDialog.show();
      }
    });
  },
  methods: {
    async submitForm(formName) {
      await this.$refs[formName].validate();
      try {
        this.createAddressRequesting = true;
        const co_signers =
          this.address.sign_count === 1
            ? [this.address.co_signer1]
            : [this.address.co_signer1, this.address.co_signer2];

        await this.$store.dispatch("createAddress", {
          ga: this.address.security_code,
          data: {
            custodian_type: "joint-managed",
            coin_type: this.address.coin_type,
            address_name: this.address.address_name,
            co_signers: co_signers,
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
