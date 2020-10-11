<template>
  <div class="create-account-container">
    <div class="Grid">
      <div class="Grid Grid-cell Grid--justifyCenter">
        <div class="input-block">
          <el-form
            autocomplete="on"
            :model="joinForm"
            :rules="joinRules"
            ref="joinForm"
            label-position="top"
          >
            <el-form-item label="Corporate Name" prop="cust_name">
              <el-input v-model="joinForm.cust_name" autocomplete="on" :disabled="loading"/>
            </el-form-item>

            <el-form-item
              label="Email (this should be a permanent corporate email for super admin)"
              prop="email"
            >
              <el-input v-model="joinForm.email" autocomplete="on" :disabled="loading"/>
            </el-form-item>

            <el-form-item label="Password" prop="password">
              <el-input
                type="password"
                v-model="joinForm.password"
                autocomplete="on"
                :disabled="loading"
              />
            </el-form-item>

            <el-form-item label="Confirm Password" prop="confirmPwd">
              <el-input
                type="password"
                v-model="joinForm.confirmPwd"
                autocomplete="on"
                :disabled="loading"
              />
            </el-form-item>

            <div class="Grid">
              <div class="Grid Grid--top">
                <el-form-item prop="checked">
                  <el-checkbox v-model="joinForm.checked" :disabled="loading"></el-checkbox>
                </el-form-item>
              </div>
              <div class="Grid Grid--top">
                <div class="checkbox-txt">
                  We have read and agree to the
                  <custodian-dialog
                    :btnName="$t('footer.terms')"
                    :btnColor="'blue'"
                    :title="$t('footer.termsTit')"
                    :content="$t('footer.termsTxt')"
                  ></custodian-dialog>,
                  <custodian-dialog
                    :btnName="$t('footer.policy')"
                    :btnColor="'blue'"
                    :title="$t('footer.policyTit')"
                    :content="$t('footer.policyTxt')"
                  ></custodian-dialog>and
                  <custodian-dialog
                    :btnName="$t('footer.agreement')"
                    :btnColor="'blue'"
                    :title="$t('footer.agreementTit')"
                    :content="$t('footer.agreementTxt')"
                  ></custodian-dialog>
                </div>
              </div>
            </div>

            <div id="captchaBox"></div>

            <el-form-item>
              <div class="Grid Grid-cell Grid--justifyCenter">
                <el-button
                  class="go-back-btn"
                  :loading="loading"
                  @click.native.prevent="goBack"
                >Back</el-button>
                <el-button
                  class="to-login-btn"
                  type="primary"
                  :loading="loading"
                  @click.native.prevent="signUp"
                >Next</el-button>
              </div>
            </el-form-item>

            <div class="the-line"></div>

            <div class="sign-up-div">
              Already have an account?
              <router-link :to="{ name: 'login' }">Log in</router-link>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validateAccount, validatePassword, validateChecked } from "@/utils/rules";
import { validatePassword as validatePwd } from "@/utils/validate";

export default {
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (!validatePwd(value)) {
        callback(new Error("The password is invalid"));
      } else {
        if (value !== this.joinForm.password) {
          callback(new Error("Two passwords are inconsistent"));
        } else {
          callback();
        }
      }
    };

    return {
      joinForm: {
        cust_name: "",
        email: "",
        password: "",
        confirmPwd: "",
        geetest_challenge: "",
        geetest_validate: "",
        geetest_seccode: "",
        checked: false,
      },
      joinRules: {
        cust_name: [{ required: true, trigger: "blur", message: "Please Input corporate name" }],
        email: [{ required: true, max: 50, trigger: "blur", validator: validateAccount }],
        password: [{ required: true, trigger: "blur", validator: validatePassword }],
        confirmPwd: [{ required: true, trigger: "blur", validator: validateConfirmPassword }],
        checked: [{ required: true, trigger: "blur", validator: validateChecked }],
      },
      loading: false,
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: "login" });
    },
    async signUp() {
      await this.$refs.joinForm.validate();
      try {
        this.loading = true;
        const result = await this.$store.dispatch("getCaptchaCode");
        const geetestParams = {
          gt: result.gt,
          challenge: result.challenge,
          offline: !result.success,
          new_captcha: true,
          product: "popup",
          width: "352px",
          lang: "en",
        };
        const geetestResult = await new Promise((resolve, reject) => {
          window.initGeetest(geetestParams, captchaObj => {
            captchaObj
              .appendTo("#captchaBox")
              .onSuccess(() => {
                resolve(captchaObj.getValidate());
                captchaObj.destroy();
              })
              .onError(error => {
                reject(error);
                captchaObj.destroy();
              });
          });
        });
        await this.$store.dispatch("customerJoin", {
          data: {
            cust_name: this.joinForm.cust_name,
            email: this.joinForm.email,
            password: this.joinForm.password,
          },
          geetest_challenge: geetestResult.geetest_challenge,
          geetest_validate: geetestResult.geetest_validate,
          geetest_seccode: geetestResult.geetest_seccode,
        });
        this.$router.push({ name: "email-activation" });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "../../styles/mixin.scss";
@import "../../styles/variables.scss";

.create-account-container {
  @include relative;
  input {
    border: 1px solid $disable_gray;
    -webkit-appearance: none;
    border-radius: 0;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 40px !important;
    margin-bottom: 6px;
  }

  .el-form-item {
    margin-bottom: 12px;
  }

  .el-form--label-top .el-form-item__label {
    color: #6987a7;
    font-size: 14px;
    padding: 0;
    width: 500px;
  }

  height: auto;

  .input-block {
    width: 352px;
    text-align: left;
  }
  .input-tit {
    color: #6987a7;
    font-size: 14px;
    margin: 8px 0;
  }
  .checkbox-txt {
    margin-left: 16px;
    color: $light_gray;
    font-size: 14px;
  }
  .checkbox-txt > a {
    color: $custodian_blue;
  }
  .the-line {
    height: 1px;
    background-color: $disable_gray;
  }
  .sign-up-div {
    margin-top: 15px;
    text-align: center;
    font-size: 14px;
    color: $light_gray;
    a {
      color: $custodian_blue;
    }
  }
  .el-login-btn {
    background-color: white;
    width: 157px;
    text-align: center;
    margin: 0 auto;
  }
  .el-button {
    width: 157px;
    height: 36px;
    line-height: 10px;
    background: rgba(0, 120, 250, 1);
    border-radius: 18px;
    margin: 32px 0;
    font-size: 18px;
  }
  .checkbox-txt {
    width: 400px;

    .el-button {
      color: #0078fa;
      background: transparent;
      margin: 0;
      width: auto;
      height: auto;
    }
    .custodian-dialog {
      display: inline;
    }
  }
  .el-form-item__error {
    min-width: 600px;
  }
  .el-checkbox {
    margin-right: 0;
  }
  .go-back-btn {
    margin-right: 15px;
    background-color: white;
    color: #0078fa;
    border: 1px solid rgba(0, 120, 250, 1);
  }
  .to-login-btn {
    margin-left: 15px;
  }

  #captchaBox {
    margin: 20px 0;
  }
}
</style>
