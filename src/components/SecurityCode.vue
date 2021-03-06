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
  <div class="security-code clearfix">
    <div class="security-code-wrapper">
      <div class="security-code-field" :key="n" v-for="n in securityCodeLength">
        <input
          maxlength="1"
          autocorrect="off"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          type="tel"
          class="form-control"
          :key="n"
          v-model="securityCode[n - 1]"
          @focus="setSelected"
          @input.stop="inputEvent"
          @keydown.stop="downEvent"
          @keypress.stop="pressEvent"
          @paste="pasteEvent(n - 1, $event)"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OfcoldSecurityCode",
  props: {
    value: {
      type: [Number, String],
      required: true,
    },
    blurOnComplete: {
      type: Boolean,
      default: false,
    },
    securityCodeLength: {
      type: Number,
      default: 6,
    },
  },
  data() {
    return {
      securityCode: new Array(this.securityCodeLength),
    };
  },
  mounted() {
    if (this.value !== 0) {
      this.securityCode = this.value
        .toString()
        .substr(0, this.securityCodeLength)
        .split("");
    }
  },
  methods: {
    inputEvent(event) {
      let value = event.target.value;

      if (value.length > 1) {
        event.target.value = value.substr(0, 1);
      }

      this.getCodeString().length === this.securityCodeLength
        ? this.blurOnComplete
          ? event.target.blur()
          : this.nextElement(event)
        : event.target.value && this.nextElement(event);
    },
    /**
     * Listen paste event.
     *
     * @param  {[type]} index
     * @param  {[type]} event
     *
     * @return {[array]}
     */
    pasteEvent(index, event) {
      let i,
        pasteData,
        elements = event.target.parentNode.parentNode.childNodes,
        len = 0,
        vm = this;

      for (
        event.clipboardData && event.clipboardData.getData
          ? (pasteData = event.clipboardData.getData("Text"))
          : window.clipboardData &&
            window.clipboardData.getData &&
            (pasteData = window.clipboardData.getData("Text")),
          pasteData = pasteData
            .replace(/\s/g, "")
            .substr(0, elements.length - index)
            .split(""),
          i = 0;
        i < elements.length && !isNaN(Number(pasteData[i]));
        i++
      ) {
        len++;
        elements[i + index].firstChild.value = pasteData[i];
        vm.securityCode[i + index] = pasteData[i];
      }

      return [
        setTimeout(() => {
          vm.getCodeString().length === vm.securityCodeLength
            ? vm.blurOnComplete
              ? event.target.blur()
              : vm.previousElement(event, vm.getCodeString().length - 1)
            : vm.previousElement(event, index + len);
        }, 0),
        event.preventDefault(),
        false,
      ];
    },
    pressEvent(event) {
      let keyCode = event.which || event.keyCode;
      return this.isMainKeyCode(keyCode) ||
        this.isTab(keyCode) ||
        this.isBackspace(keyCode) ||
        this.isMetaKey(event, keyCode)
        ? void 0
        : (event.preventDefault(), false);
    },
    downEvent(event) {
      let parentNode = event.target.parentNode;
      let keyCode = event.which || event.keyCode;
      let _sibling;

      if (keyCode === 8 && !event.target.value) {
        _sibling = parentNode.previousSibling;
        if (_sibling) {
          _sibling.firstChild.focus();
        }
      } else if (keyCode >= 37 && keyCode <= 41) {
        switch (keyCode) {
          case 37:
            _sibling = parentNode.previousSibling;
            break;
          case 39:
            _sibling = parentNode.nextSibling;
            break;
        }
        if (_sibling) {
          _sibling.firstChild.focus();
        }
        return [event.preventDefault(), false];
      }
    },
    previousElement(event, length) {
      let elements = event.target.parentNode.parentNode.childNodes;

      if (length >= elements.length) {
        length = elements.length - 1;
      }

      elements[length].firstChild.focus();
    },
    nextElement(event) {
      let parentNode = event.target.parentNode;
      let nextSibling = parentNode.nextSibling;

      nextSibling ? nextSibling.firstChild.focus() : parentNode.focus();
    },
    isMainKeyCode(keyCode) {
      return keyCode >= 48 && keyCode <= 57;
    },
    isTab(keyCode) {
      return keyCode === 9;
    },
    isBackspace(keyCode) {
      return keyCode === 8;
    },
    isMetaKey(event, keyCode) {
      return event.metaKey && keyCode === 118;
    },
    setSelected(event) {
      event.target.select();
    },
    getCodeString() {
      let code = this.securityCode.join("");

      this.$emit("input", code);

      return code;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item.is-error {
  .form-control {
    border: solid 1px #f56c6c !important;
  }
}

.security-code {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  &-wrapper {
    display: inline-block;
    margin: auto;
    min-width: 240px;
    text-align: center;
    @media only screen and (max-device-width: 736px) {
      max-width: 320px;
    }
    .security-code-field {
      width: 40px;
      display: inline-block;
      margin-right: 10px;
      @media only screen and (max-device-width: 736px) {
        float: none;
        margin-right: 4px;
      }
      .form-control {
        width: 32px;
        height: 40px;
        font-size: 30px;
        text-align: center;
        padding: 0;
        @media only screen and (max-device-width: 736px) {
          width: 42px;
          height: 42px;
          margin: 0;
        }
      }
      /*&:nth-child(3) {*/
      /*margin-right: 20px;*/
      /*}*/
    }
  }
}
</style>
