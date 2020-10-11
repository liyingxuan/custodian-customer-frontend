<template>
  <div class="upload-info-container">
    <el-form
      autocomplete="on"
      :model="uploadForm"
      :rules="uploadRules"
      ref="uploadForm"
      label-position="left"
      label-width="0px"
    >
      <div class="tit-bg-block">{{ mandatoryFiles.toUpperCase() }}</div>
      <div class="Grid">
        <div class="Grid Grid-cell Grid--justifyCenter">
          <div class="input-block">
            <div class="Grid">
              <div class="Grid Grid-cell Grid--justifyCenter">
                <div class="upload-desc">
                  <div>Please upload the documents that apply to you.</div>
                  <div>
                    You need to complete
                    <span
                      style="color: black; font-weight: bold"
                    >at least one section</span>
                    to proceed to the next page.
                  </div>
                  <div>
                    You may only upload
                    <span
                      style="color: black; font-weight: bold"
                    >one document per section</span>
                    below.
                  </div>
                </div>
              </div>
            </div>

            <div v-for="(item, index) in uploadMandatoryFiles" :key="index">
              <div class="upload-file-tit">{{ index + 1 + "." + item.title }}</div>
              <div class="upload-file-desc"></div>
              <div class="upload-file-btn">
                <el-form-item prop="hasFile">
                  <el-upload
                    class="upload-demo"
                    :action="actionUrl"
                    :headers="headers"
                    :before-upload="handleUpload"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="fileList[item.key]"
                    :data="{ name: item.key }"
                  >
                    <el-button size="small" type="primary" :loading="uploadLoading">Click to upload</el-button>
                  </el-upload>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tit-bg-block margin-top-50">{{ optionalFiles.toUpperCase() }}</div>
      <div class="Grid">
        <div class="Grid Grid-cell Grid--justifyCenter">
          <div class="input-block">
            <div v-for="(item, index) in uploadOptionalFiles" :key="index">
              <div class="upload-file-tit">{{ item.title }}</div>
              <div class="upload-file-desc"></div>
              <div class="upload-file-btn">
                <el-form-item prop="hasFile">
                  <el-upload
                    class="upload-demo"
                    :action="actionUrl"
                    :headers="headers"
                    :before-upload="handleUpload"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="fileList[item.key]"
                    :data="{ name: item.key }"
                  >
                    <el-button size="small" type="primary" :loading="uploadLoading">Click to upload</el-button>
                  </el-upload>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="Grid">
        <div class="Grid Grid-cell Grid--justifyCenter">
          <div class="note-block">
            <div class="note-tit">NOTE</div>
            <div class="note-txt">
              <p>Please provide certified/ notarised copies for all non-original documents submitted. They can be certified/ notarised by:</p>
              <ol type="a">
                <li>A Staff/Representative of ONC;</li>
                <li>A Registered Lawyer; (should include full name and registration number)</li>
                <li>A Certified Accountant; or (should include full name and registration number)</li>
                <li>A Notary Public (should include full name and registration number)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <el-form-item class="el-login-btn">
        <el-button type="primary" @click.native.prevent="handleSubmit" :loading="loading">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getToken } from "../../utils/auth";
import {
  UPLOAD_FILE_TYPES,
  UPLOAD_MANDATORY_FILES,
  UPLOAD_OPTIONAL_FILES,
} from "../../utils/const";

export default {
  name: "UploadInfo",
  created() {
    this.$store.dispatch("getCustomerKycInfo", this.myInfo.cust_id);
  },
  data() {
    return {
      actionUrl: window.serverConfig.BASE_URL + "customers/file/upload",
      headers: { Authorization: getToken() },
      uploadMandatoryFiles: UPLOAD_MANDATORY_FILES,
      uploadOptionalFiles: UPLOAD_OPTIONAL_FILES,
      fileList: [...UPLOAD_MANDATORY_FILES, ...UPLOAD_OPTIONAL_FILES].reduce(
        (result, item) => ({
          ...result,
          [item.key]: [],
        }),
        {},
      ),
      uploadForm: {
        hasFile: [],
      },
      uploadRules: {
        hasFile: [
          {
            type: "array",
            required: true,
            message: "Please upload any documents",
            trigger: "change",
            min: 1,
          },
        ],
      },
      mandatoryFiles: "Mandatory Documents",
      optionalFiles: "Other Documents",
      uploadLoading: false,
      loading: false,
    };
  },
  computed: {
    myInfo() {
      return this.$store.getters.myInfo || {};
    },
    customer() {
      return this.$store.getters.selectCustomerKycInfo(this.myInfo.cust_id) || {};
    },
  },
  watch: {
    customer: function(newV, oldV) {
      let data = newV.kyc_info;
      let self = this;
      Object.keys(data).forEach(function(key) {
        if (data[key].fileName) {
          self.fileList[key] = [{ name: data[key].fileName, url: "" }];
          self.uploadForm.hasFile = self.fileList[key];
        }
      });
    },
  },
  methods: {
    handleUpload(file) {
      const extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      const size = file.size / 1024 / 1024;
      if (!UPLOAD_FILE_TYPES.includes(extension)) {
        const supportedFileTypes = UPLOAD_FILE_TYPES.map(item => "*." + item).join(", ");
        this.$message.error(
          "The file extension is not in supported list: " + supportedFileTypes + ".",
        );
        return false;
      }
      if (size > 20) {
        this.$message.error("The file exceed the limit size: 20M.");
        return false;
      }
      this.uploadLoading = true;
      return true;
    },
    handleSuccess(response, file, fileList) {
      this.uploadLoading = false;
      if (response.result) {
        this.uploadForm.hasFile = fileList;
        this.$refs.uploadForm.validate();
      }
    },
    async handleError(err, file, fileList) {
      this.uploadLoading = false;
      try {
        const error = JSON.parse(err.message);
        error.__apiError = true;
        error.__showMessage = true;
        throw error;
      } catch (error) {
        if (error && error.__apiError) {
          throw error;
        } else {
          this.$message.error("Upload failed, please try again later.");
        }
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The limit is 1.`);
    },
    async handleSubmit() {
      await this.$refs.uploadForm.validate();
      if (this.uploadLoading) {
        return this.$message.error("Please wait for uploading completed.");
      }
      try {
        this.loading = true;
        await this.$store.dispatch("uploadCustomerJoinFileFinish");
        await this.$store.dispatch("getMyInfo");
        this.$router.push({ name: "wait-review" });
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

.upload-info-container {
  @include relative;
  input {
    border: 1px solid $disable_gray;
    -webkit-appearance: none;
    border-radius: 0;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 40px !important;
    margin-bottom: 6px;
    width: 352px;
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
    width: 745px;
    text-align: left;
  }
  .upload-desc {
    width: 584px;
    text-align: center;
    font-size: 16px;
    color: $light_gray;
    line-height: 22px;
    margin-bottom: 40px;
  }
  .upload-file-tit {
    font-size: 16px;
    font-family: OpenSans-Semibold, Microsoft YaHei, Arial, sans-serif;
    font-weight: 600;
    color: rgba(0, 51, 106, 1);
    line-height: 22px;
  }
  .upload-txt {
    color: $light_gray;
    font-size: 14px;
    margin-bottom: 24px;
  }
  .upload-file-btn {
    margin-bottom: 48px;
  }
  .margin-top-50 {
    margin-top: 50px;
  }
  .note-block {
    margin-top: 40px;
    width: 784px;
    background: rgba(243, 250, 255, 1);
    text-align: left;
    padding: 24px 40px;
  }
  .note-tit {
    font-size: 18px;
    font-family: OpenSans-Semibold, Microsoft YaHei, Arial, sans-serif;
    font-weight: 600;
    color: black;
    margin-bottom: 15px;
  }
  .note-txt {
    color: $light_gray;
    font-size: 16px;
    line-height: 22px;
  }
  .el-login-btn {
    background-color: white;
    width: 157px;
    text-align: center;
    margin: 40px auto;
  }
  .el-button {
    min-width: 157px;
    height: 36px;
    line-height: 10px;
    background: rgba(0, 120, 250, 1);
    border-radius: 18px;
    margin: 8px 0;
    font-size: 18px;
  }
}
</style>
