<!--
* @description  参数1
* @fileName  third-part-key-information
* @author wjp
* @date 2024-08-30 22:17:18
!-->
<template>
  <div id="third-part-key-information" class="third-part-key-information">
    <el-dialog :visible.sync="dialogVisible" width="60%" top="5vh" :show-close="false" :close-on-press-escape="false"
      :close-on-click-modal="false" v-loading="loading">
      <div v-if="resultVisble">
        <el-result icon="warning" :title="$t('common.operationTips')"
          :subTitle="$t('message.signUp.relateOrCreateSubTitle')">
          <template slot="extra">
            <el-button type="primary" size="medium" icon="el-icon-link" @click="showSigninForm">{{
              $t('message.signUp.linkedExistingAccounts') }}</el-button>
            <el-button type="primary" size="medium" icon="el-icon-user" @click="showKeyInformationSteps">{{
              $t('message.signUp.generateNewAccount') }}</el-button>
          </template>
        </el-result>
      </div>
      <div v-if="!resultVisble">
        <KeyInformationSteps ref="keyInformationSteps" @close="handleClose" :resultVisble="resultVisble"
          :signinVisble="signinVisble" :signupForm="signupForm" @changeVisble="changeVisble"></KeyInformationSteps>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import KeyInformationSteps from '@/pages/login/components/key-information-steps.vue'
import { dropShipper } from '@/common/commonconfig'
export default {
  name: 'third-part-key-information',
  props: {},
  components: {
    KeyInformationSteps
  },
  data() {
    return {
      dialogVisible: true,
      signinVisble: false,
      resultVisble: true,
      loading: false,
      signupForm: {
        username: '',
        password: '',
        email: ''
      }
    }
  },
  methods: {
    changeVisble() {
      this.resultVisble = true
      this.signinVisble = false
    },
    handleClose() {
      // 关闭弹窗跳首页
      this.dialogVisible = false
      this.$router.push({ path: this.config[dropShipper].homePath })
    },
    showSigninForm() {
      this.signinVisble = true
      this.resultVisble = false
    },
    showKeyInformationSteps() {
      this.loading = true
      let { host, hmac, timestamp, session, shop } = this.$route.query
      this.$ajax({
        url: '/api-prefix/auth/third-part-create-account/',
        method: 'post',
        data: {
          host,
          hmac,
          timestamp,
          session,
          shop
        }
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.signupForm.username = res.data.username
            this.signupForm.password = res.data.password
            this.signupForm.email = res.data.email
            this.signupForm.defaultUn = res.data.username
            localStorage.setItem(
              this.config.dropShipper.accessToken,
              res.data.access
            )
            localStorage.setItem(
              this.config.dropShipper.userName,
              res.data.username
            )
            localStorage.setItem(this.config.userRole, dropShipper)
            // localStorage.setItem(this.config.userRelatedId, user.user_related_id);
            localStorage.setItem(this.config.dropShipper.avatarBase64, null)
            this.resultVisble = false
            this.signinVisble = false
          }
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  computed: {},
  mounted() {
    const { direct } = this.$route.query;
    if (direct !== null && direct !== undefined) {
      resultVisble = false
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss">
::v-deep .el-dialog {
  // 圆角
  border-radius: 50px;
}
</style>
