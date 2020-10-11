<template>
  <div class="submit-info-container">
    <el-form
      autocomplete="on"
      :model="submitForm"
      :rules="submitRules"
      ref="submitForm"
      label-position="top"
    >
      <div class="tit-bg-block">{{ basicTit.toUpperCase() }}</div>
      <div class="Grid">
        <div class="Grid Grid-cell Grid--justifyCenter">
          <div class="input-block">
            <el-form-item label="Business Registration Number" prop="business_registration_number">
              <el-input v-model="submitForm.business_registration_number" autocomplete="on"/>
            </el-form-item>

            <el-form-item label="Business Legal Name" prop="customer_legal_name">
              <el-input v-model="submitForm.customer_legal_name" autocomplete="on"/>
            </el-form-item>

            <el-form-item label="Country of Origin" prop="country_of_origin">
              <el-select
                class="country-select"
                v-model="submitForm.country_of_origin"
                placeholder="Select"
              >
                <el-option
                  v-for="item in countryOption"
                  :key="item.locale"
                  :label="item.en"
                  :value="item.locale"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Business Registration Date" prop="business_registration_date">
              <el-date-picker
                class="date-select"
                v-model="submitForm.business_registration_date"
                type="date"
                placeholder="Pick a day"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="How many years since establishment" prop="year_of_establishment">
              <el-input v-model="submitForm.year_of_establishment" autocomplete="on"/>
            </el-form-item>
          </div>
        </div>
      </div>

      <div class="tit-bg-block margin-top-50">{{ applicantTit.toUpperCase() }}</div>
      <div class="Grid">
        <div class="Grid Grid-cell Grid--justifyCenter">
          <div class="input-block">
            <el-form-item label="Contact Person Name" prop="contact_person_name">
              <el-input v-model="submitForm.contact_person_name" autocomplete="on"/>
            </el-form-item>

            <el-form-item label="Holding Position" prop="holding_position">
              <el-input v-model="submitForm.holding_position" autocomplete="on"/>
            </el-form-item>

            <div class="Grid">
              <div class="Grid Grid-cell">
                <div>
                  <el-form-item label="Area Code" prop="area_code">
                    <el-select v-model="submitForm.area_code" placeholder="Select">
                      <el-option
                        v-for="item in countryOption"
                        :key="item.locale"
                        :label="'( ' + item.code + ' ) ' + item.en"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="Grid Grid--top">
                <div>
                  <el-form-item label="Phone Number" prop="mobile">
                    <el-input
                      v-model="submitForm.mobile"
                      onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"
                      autocomplete="on"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>

            <el-form-item label="Contact Email" prop="contact_email">
              <el-input v-model="submitForm.contact_email" autocomplete="on"/>
            </el-form-item>
          </div>
        </div>
      </div>

      <div class="tit-bg-block margin-top-50">{{ companyRegTit.toUpperCase() }}</div>
      <div class="Grid">
        <div class="Grid Grid-cell Grid--justifyCenter">
          <div class="input-block-552">
            <el-form-item label="Street Address" prop="registered_address_line_1">
              <el-input v-model="submitForm.registered_address_line_1" autocomplete="on"/>
            </el-form-item>

            <el-form-item label="City" prop="registered_address_line_2">
              <el-input v-model="submitForm.registered_address_line_2" autocomplete="on"/>
            </el-form-item>

            <el-form-item label="Province" prop="registered_address_line_3">
              <el-input v-model="submitForm.registered_address_line_3" autocomplete="on"/>
            </el-form-item>

            <div class="Grid">
              <div class="Grid Grid-cell">
                <div>
                  <el-form-item label="Postal Code" prop="postal_code">
                    <el-input v-model="submitForm.postal_code" autocomplete="on"/>
                  </el-form-item>
                </div>
              </div>
              <div class="Grid Grid--top">
                <div class="country-select-block">
                  <el-form-item label="Country" prop="country">
                    <el-select
                      class="country-select"
                      v-model="submitForm.country"
                      placeholder="Select"
                    >
                      <el-option
                        v-for="item in countryOption"
                        :key="item.locale"
                        :label="item.en"
                        :value="item.locale"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tit-bg-block margin-top-50">{{ otherInfo.toUpperCase() }}</div>
      <div class="Grid">
        <div class="Grid Grid-cell Grid--justifyCenter">
          <div class="input-block">
            <el-form-item label="Income Tax Number" prop="income_tax_number">
              <el-input v-model="submitForm.income_tax_number" autocomplete="on"/>
            </el-form-item>

            <el-form-item label="Business Industry" prop="business_industry">
              <el-select
                class="country-select"
                v-model="submitForm.business_industry"
                placeholder="Select"
              >
                <el-option
                  v-for="item in businessIndustryOption"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Number of Share Holders" prop="number_of_share_holders">
              <el-input
                v-model="submitForm.number_of_share_holders"
                onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"
                autocomplete="on"
              />
            </el-form-item>

            <el-form-item label="Number of Directors" prop="number_of_directors">
              <el-input
                v-model="submitForm.number_of_directors"
                onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"
                autocomplete="on"
              />
            </el-form-item>
          </div>
        </div>
      </div>

      <div class="tit-bg-block margin-top-50">{{ referralInfo.toUpperCase() }}</div>
      <div class="Grid">
        <div class="Grid Grid-cell Grid--justifyCenter">
          <div class="input-block">
            <el-form-item label="Referral Code" prop="referral_code">
              <el-input v-model="submitForm.referral_code" autocomplete="on"/>
            </el-form-item>

            <el-form-item label="Channel" prop="channel">
              <el-select class="country-select" v-model="submitForm.channel" placeholder="Select">
                <el-option v-for="item in channelsOption" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>

            <div class="Grid">
              <div class="Grid Grid--top">
                <el-form-item prop="checked">
                  <el-checkbox v-model="submitForm.checked"></el-checkbox>
                </el-form-item>
              </div>
              <div class="Grid Grid--top">
                <div class="checkbox-txt">
                  Consent to Onchain Custodian performing checks with external vendors and/or
                  sources for account opening.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-form-item class="el-login-btn">
        <el-button type="primary" @click.native.prevent="submit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validateAccount, validateYear, validateChecked } from "@/utils/rules";
import { COUNTRIES, BUSINESS_INDUSTRY, CHANNELS } from "@/utils/const";

export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      submitForm: {
        business_registration_number: "",
        customer_legal_name: "",
        country_of_origin: "",
        business_registration_date: "",
        year_of_establishment: "",
        contact_person_name: "",
        holding_position: "",
        area_code: "",
        mobile: "",
        contact_email: "",
        registered_address_line_1: "",
        registered_address_line_2: "",
        registered_address_line_3: "",
        postal_code: "",
        country: "",
        income_tax_number: "",
        business_industry: "",
        number_of_share_holders: "",
        number_of_directors: "",
        referral_code: "",
        channel: "",
        checked: false,
      },
      submitRules: {
        business_registration_number: [
          { required: true, trigger: "blur", message: "Please input business registration number" },
          {
            max: 50,
            trigger: "blur",
            message: "Business registration number cannot be longer than 50 characters",
          },
        ],
        customer_legal_name: [
          { required: true, trigger: "blur", message: "Please input business legal name" },
          {
            max: 300,
            trigger: "blur",
            message: "Business legal name cannot be longer than 300 characters",
          },
        ],
        country_of_origin: [
          { required: true, trigger: "change", message: "Please select country of origin" },
        ],
        business_registration_date: [
          { required: true, trigger: "blur", message: "Please input business registration date" },
        ],
        year_of_establishment: [{ required: true, trigger: "blur", validator: validateYear }],
        contact_person_name: [
          { required: true, trigger: "blur", message: "Please input contact person name" },
          {
            max: 100,
            trigger: "blur",
            message: "Contact person name cannot be longer than 100 characters",
          },
        ],
        holding_position: [
          { required: true, trigger: "blur", message: "Please input holding position" },
          {
            max: 50,
            trigger: "blur",
            message: "Holding position cannot be longer than 50 characters",
          },
        ],
        area_code: [{ required: true, trigger: "change", message: "Please select area code" }],
        mobile: [
          { required: true, trigger: "blur", message: "Please input phone number" },
          {
            max: 20,
            trigger: "blur",
            message: "Phone number cannot be longer than 20 characters",
          },
        ],
        contact_email: [{ required: true, max: 50, trigger: "blur", validator: validateAccount }],
        registered_address_line_1: [
          { required: true, trigger: "blur", message: "Please input street address" },
          {
            max: 100,
            trigger: "blur",
            message: "Street address cannot be longer than 100 characters",
          },
        ],
        registered_address_line_2: [
          { required: true, trigger: "blur", message: "Please input city" },
          {
            max: 100,
            trigger: "blur",
            message: "City cannot be longer than 100 characters",
          },
        ],
        registered_address_line_3: [
          { required: true, trigger: "blur", message: "Please input province" },
          {
            max: 100,
            trigger: "blur",
            message: "Province cannot be longer than 100 characters",
          },
        ],
        postal_code: [
          { required: true, trigger: "blur", message: "Please input postal code" },
          {
            max: 20,
            trigger: "blur",
            message: "Postal code cannot be longer than 20 characters",
          },
        ],
        country: [{ required: true, trigger: "change", message: "Please select country" }],
        income_tax_number: [
          {
            max: 50,
            trigger: "blur",
            message: "Income tax Number cannot be longer than 50 characters",
          },
        ],
        business_industry: [
          { required: true, trigger: "change", message: "Please input business industry" },
        ],
        number_of_share_holders: [
          { required: true, trigger: "blur", message: "Please input number of share holders" },
          {
            max: 4,
            trigger: "blur",
            message: "Number of share holders cannot be longer than 4 characters",
          },
        ],
        number_of_directors: [
          { required: true, trigger: "blur", message: "Please input number of directors" },
          {
            max: 4,
            trigger: "blur",
            message: "Number of directors cannot be longer than 4 characters",
          },
        ],
        checked: [{ required: true, trigger: "blur", validator: validateChecked }],
      },
      countryOption: COUNTRIES,
      businessIndustryOption: BUSINESS_INDUSTRY,
      channelsOption: CHANNELS,
      basicTit: "Basic information",
      applicantTit: "Applicant contact person information",
      companyRegTit: "Company Registration Address",
      otherInfo: "other company information",
      referralInfo: "Referral Information",
    };
  },
  methods: {
    async submit() {
      await this.$refs.submitForm.validate();
      try {
        this.loading = true;
        const mobile = this.submitForm.area_code + " " + this.submitForm.mobile;
        await this.$store.dispatch("submitCustomerJoinInfo", { ...this.submitForm, mobile });
        await this.$store.dispatch("getMyInfo");
        this.$router.push({ name: "upload-info" });
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

.submit-info-container {
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

  .el-form--label-top .el-form-item__label {
    color: #6987a7;
    font-size: 14px;
    padding-bottom: 0;
  }

  .tit-bg-block {
    width: 984px;
    height: 40px;
    line-height: 40px;
    color: $light_gray;
    background-color: $bg_blue;
    margin: 0 -32px 48px;
  }
  .input-block {
    width: 352px;
    text-align: left;
  }
  .input-block-552 {
    width: 552px;
    text-align: left;
  }
  .date-select,
  .country-select {
    width: 100%;
  }
  .margin-top-50 {
    margin-top: 50px;
  }
  .country-select-block {
    width: 352px;
  }
  .checkbox-txt {
    margin-left: 16px;
    color: $light_gray;
    font-size: 14px;
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
  .el-checkbox {
    padding-bottom: 12px;
  }
  .el-form-item__error {
    width: 352px;
  }
}
</style>
