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
  <div class="join-container">
    <div class="Grid">
      <div class="Grid Grid-cell Grid--justifyCenter">
        <div class="sign-up">
          <h3 class="title">{{ title.toUpperCase() }}</h3>
          <p class="sign-up-step">Step {{ step }}/3</p>

          <div class="Grid Grid-cell Grid--justifyCenter">
            <div class>
              <div class="step-txt">Create Account</div>
              <div class="step-border-bottom"></div>
            </div>
            <div class>
              <div class="step-txt" :class="step > 1 ? '' : 'step-txt-disable'">Submit Information</div>
              <div
                class="step-border-bottom center-border-bottom"
                :class="step > 1 ? '' : 'step-border-bottom-disable'"
              ></div>
            </div>
            <div class>
              <div class="step-txt" :class="step > 2 ? '' : 'step-txt-disable'">Upload Information</div>
              <div class="step-border-bottom" :class="step > 2 ? '' : 'step-border-bottom-disable'"></div>
            </div>
          </div>

          <create-account v-if="step === 1"></create-account>
          <submit-info v-if="step === 2"></submit-info>
          <upload-info v-if="step === 3"></upload-info>
          <activate v-if="$route.name === 'activate-account'"></activate>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CreateAccount from "./CreateAccount";
import SubmitInfo from "./SubmitInfo";
import UploadInfo from "./UploadInfo";
import Activate from "./Activate";

export default {
  components: { CreateAccount, SubmitInfo, UploadInfo, Activate },
  computed: {
    step: function() {
      if (this.$route.name === "submit-info") return 2;
      if (this.$route.name === "upload-info") return 3;
      return 1;
    },
    title: function() {
      if (this.$route.name === "submit-info") return "Company Information";
      if (this.$route.name === "upload-info") return "Documentation Upload";
      return "SIGN UP";
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "../../styles/mixin.scss";
@import "../../styles/variables.scss";
$bg: #f5f5f5;
$dark_gray: #fff;
$step_font_family: OpenSans-Light, "PingFang SC", "微软雅黑", sans-serif;

.Grid {
  display: flex;
}
.Grid-cell {
  flex: 1;
}
.Grid--top {
  align-items: flex-start;
}
.Grid--bottom {
  align-items: flex-end;
}
.Grid-cell--bottom {
  align-self: flex-end;
}
.Grid--center {
  align-items: center;
}
.Grid--justifyCenter {
  justify-content: center;
}
.Grid-cell--center {
  align-self: center;
}

.join-container {
  @include relative;
  background-color: $bg;
  .sign-up {
    margin-top: 100px;
    background-color: white;
    width: 984px;
    padding: 32px;
    text-align: center;
  }
  .title {
    font-size: 38px;
    color: $custodian_blue;
    font-family: OpenSans-Light, "PingFang SC", "微软雅黑", sans-serif;
    margin: 0 auto 40px auto;
    text-align: center;
    font-weight: 300;
  }
  .sign-up-step {
    font-size: 16px;
    font-family: $step_font_family;
    color: $disable_gray;
    margin-bottom: 16px;
  }
  .step-txt {
    font-size: 16px;
    font-family: $step_font_family;
    color: $custodian_blue;
    line-height: 22px;
  }
  .step-border-bottom {
    width: 209px;
    height: 4px;
    background: $custodian_blue;
    margin: 9px 3px 42px;
  }
  .step-txt-disable {
    color: $light_gray;
  }
  .step-border-bottom-disable {
    background: $disable_gray;
  }
}
</style>
