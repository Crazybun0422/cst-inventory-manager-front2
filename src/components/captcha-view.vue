<!--
* @description  验证码组件
* @fileName  captcha-view
* @author wjp
* @date 2023-05-16 20:02:38
!-->
<template>
  <el-dialog
    :visible.sync="captchaVisible"
    width="320px"
    custom-class="no-header-dialog"
    :append-to-body="true"
    @close="handleClose"
  >
    <div class="container" v-loading="loading">
      <div class="captcha-row">
        <span>根据图片选择正确的文字</span>
      </div>
      <div class="captcha-row" @click="getCaptcha">
        <img :src="captchaImg" alt="验证码" />
      </div>
      <div class="captcha-row-btn">
        <el-button
          type="info"
          class="captcha-btn"
          v-for="(choice, index) in choiceList"
          :key="index"
          @click="chioceCaptcha(index)"
          >{{ choice }}</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios';
export default {
  name: 'captcha-view',
  props: ["showCaptcha", "captchaData"],
  data () {
    return {
      captchaImg: '',
      choiceList: [],
      captchaVisible: true,
      uuid: '',
      loading: false
    }
  },
  watch: {
    showCaptcha: {
      immediate: true,
      handler (newValue) {
        this.captchaVisible = newValue
        if (newValue) {
          this.captchaVisible = this.showCaptcha
          this.captchaImg = 'data:image/gif;base64,' + this.captchaData.captcha_base64
          this.choiceList = this.captchaData.list
          this.uuid = this.captchaData.uuid
        }
      },
    }
  },
  methods: {
    handleClose () {
      this.$emit('captchaCancel')
    },
    chioceCaptcha (chioceId) {
      this.$ajax({
        url: "/api-prefix/captcha/check",
        method: "GET",
        params: {
          uuid: this.uuid,
          btn_id: chioceId
        }
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(res.msg[this.$languageType])
          this.$emit('captchaCancel')
        } else if (res.code === 2002) {
          this.captchaImg = 'data:image/gif;base64,' + res.data.captcha_base64
          this.choiceList = res.data.list
          this.uuid = res.data.uuid
        }

      })
    },
    getCaptcha () {
      this.loading = true
      axios.get("/api-prefix/captcha/").then(response => {
        this.captchaImg = 'data:image/gif;base64,' + response.data.data.captcha_base64
        this.choiceList = response.data.data.list
        this.uuid = response.data.data.uuid
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    }
  },
}
</script>
<style scoped lang='css'>
.container {
  display: flex;
  flex-direction: column;
}

.captcha-row {
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}
::v-deep .el-dialog .el-dialog__body {
  padding: 10px 20px;
}
/* ::v-deep .no-header-dialog .el-dialog__header {
  display: none;
} */
.captcha-btn {
  width: 100px;
  height: 100px;
  font-size: 50px;
  /* margin: 10px 30px; */
}
.captcha-row-btn button:nth-child(even) {
  margin-left: 5px;
  margin-right: 35px;
  margin-bottom: 10px;
}
.captcha-row-btn button:nth-child(odd) {
  margin-left: 35px;
  margin-right: 5px;
  margin-bottom: 10px;
}
</style>