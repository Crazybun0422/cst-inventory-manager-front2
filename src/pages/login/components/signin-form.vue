<!--
* @description  登录组件
* @fileName  signin-form
* @author wjp
* @date 2024-09-04 22:00:52
!-->
<template>
  <div id="signin-form" class="signin-form">
    <el-form :model="loginFrom" :rules="rules" ref="loginFrom" class="demo-loginFrom" autocomplete="on"
      @keyup.enter.native="submitForm('loginFrom')">
      <el-form-item prop="username">
        <el-input ref="userNameRef" prefix-icon="el-icon-user" :placeholder="$t('message.login.username')"
          :disabled="isLoggingIn" v-model.trim="loginFrom.username" name="username" autocomplete="username"
          autocapitalize="off" autocorrect="off" spellcheck="false"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input prefix-icon="el-icon-lock" :disabled="isLoggingIn" :placeholder="$t('message.login.password')"
          v-model="loginFrom.password" show-password name="password" autocomplete="current-password"></el-input>
      </el-form-item>
      <el-form-item>
        <CaptchaView :showCaptcha="showCaptcha" @captchaCancel="showCaptcha = false" :captchaData="captchaData">
        </CaptchaView>
        <div class="forget-password">
          <a @click="emailFormVisible = true" :disabled="isLoggingIn">{{
            $t('message.login.forgetPassword')
          }}</a>
        </div>
        <div class="login-button">
          <el-button class="cursor-btn cursor-btn--primary" style="width: 100%" type="primary" @click="submitForm('loginFrom')" :loading="isLoggingIn">
            {{ $t('message.login.login') }}</el-button>
          </div>
      </el-form-item>
    </el-form>
    <ForgetPassword :visible.sync="emailFormVisible" @close="handleCloseForm" />
  </div>

</template>

<script>
import CaptchaView from '@/components/captcha-view.vue'
import ForgetPassword from '@/pages/login/components/forget-password.vue'
import {
  getAesKeyLogin,
  getWarehouseRelatedInfo,
  loadHomeData,
  getCsrfTokenFromServer,
  signIn
} from '@/common/common-func'
import { syncPreferencesAfterLogin } from '@/common/preference-sync'
export default {
  name: 'signin-form',
  props: {
    signInType: {
      type: String,
      default: 'login' // 登录类型 默认login  特殊情况有第三方关联账号登录 relateUser
    },
    needToRelateShopUrl: {
      type: String,
      default: '' // 登录类型为relateUser时需要提交该参数
    }
  },
  components: {
    CaptchaView,
    ForgetPassword
  },
  data() {
    return {
      emailFormVisible: false,
      showCaptcha: false, //三次登录错误后需要这个变量记录是否需要验证码 只有验证码正确才能变更这个值
      // errorCount: 0,
      captchaData: {},
      isLoggingIn: false, // 新增
      loginFrom: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t('message.login.userNameError'),
            trigger: 'blur'
          }
          // { min: 5, message: '长度5个字符以上', trigger: 'blur' },
        ],
        password: [
          {
            required: true,
            message: this.$t('message.login.passwordError'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    signIn,
    loadHomeData,
    getCsrfTokenFromServer,
    getWarehouseRelatedInfo,
    async tryStoreCredentials(username, password) {
      try {
        if ('credentials' in navigator && window.PasswordCredential) {
          const cred = new window.PasswordCredential({ id: username, name: username, password });
          await navigator.credentials.store(cred);
        }
      } catch (e) {
        // Silently ignore if not supported or blocked (e.g., non-HTTPS)
      }
    },
    getRelatedInfo() {
      return this.getWarehouseRelatedInfo()
        .then((resData) => {
          if (resData && resData.length === 0) {
            if (this.signInType === 'relateUser') {
              // 如果是关联用户登录 需要跳转到第三方关联仓储的步骤
              this.$emit('changeActive', 1)
            } else {
              this.$router.push(this.config[this.roleType].keyInformationPath)
            }
          } else {
            if (this.signInType === 'relateUser') {
              // 如果是关联用户登录 需要跳转到第三方同步产品的步骤
              this.$emit('changeActive', 2)
            } else {
              this.$router.push(this.config[this.roleType].homePath)
            }
          }
        })
        .catch((error) => {
          this.shopList = []
          console.error(error)
          throw error
        })
    },
    getAesKeyLogin,
    handleCloseForm() {
      this.emailFormVisible = false
    },
    submitForm(loginFrom) {
      this.$refs[loginFrom]?.validate((valid) => {
        if (this.isLoggingIn) {
          return // 如果已经在登录，就直接返回
        }
        // 开始登录'
        if (valid) {
          this.isLoggingIn = true
          this.getCsrfTokenFromServer()
            .then((csrfToken) => {
              localStorage.setItem(
                this.config[this.roleType].csrfToken,
                csrfToken
              )
              // 这里需要获取秘钥
              return this.getAesKeyLogin(this.loginFrom)
            })
            .then((encrypted_password) => {
              let reqData = {
                username: this.loginFrom.username,
                encrypted_password: encrypted_password,
                user_role: this.config.loginRoleType[this.roleType]
              }
              if (
                this.signInType === 'relateUser' &&
                this.needToRelateShopUrl
              ) {
                // 如果是关联用户登录 需要传递关联门店的url 且默认角色为ds
                reqData.need_to_relate_shop_url = this.needToRelateShopUrl
              }
              return this.signIn(reqData)
            })
            .then((response) => {
              // 成功后 设置 Cookie，包括 Token 和过期时间
              if (this.$isRequestSuccessful(response.code)) {
                localStorage.setItem(
                  this.config[this.roleType].accessToken,
                  response.data.access
                )
                // 加载数据并跳转到首页
                return this.loadHomeData()
              } // 如果等于2001说明错误三次了需要展示验证码
              else if (response.code === 2002) {
                this.captchaData = response.data
                this.showCaptcha = true
                return Promise.reject(new Error('login error'))
              } else {
                // 其他失败场景，统一抛错，避免后续 then 收到 undefined
                return Promise.reject(new Error('login error'))
              }
            })
            .then(async (resData) => {
              // Attempt to store credentials for browser password managers (inline to avoid method binding issues)
              try {
                if (navigator.credentials && navigator.credentials.create) {
                  const cred = await navigator.credentials.create({
                    password: {
                      id: this.loginFrom.username,
                      name: this.loginFrom.username,
                      password: this.loginFrom.password,
                    }
                  })
                  if (cred) {
                    await navigator.credentials.store(cred)
                  }
                }
              } catch (e) { /* ignore unsupported or insecure context */ }
              if (!resData || !resData.user) {
                throw new Error('home data invalid')
              }
              const { user, user_avatar_url, shops, default_settings: defaultSettings } = resData
              // 可能需要将 角色信息存到cookie 或者localstorage
              localStorage.setItem(
                this.config[this.roleType].userName,
                user.username
              )
              localStorage.setItem(
                this.config[this.roleType].userRole,
                user.user_role
              )
              localStorage.setItem(
                this.config[this.roleType].userRelatedId,
                user.user_related_id
              )
              // 保存店铺信息
              localStorage.setItem(
                this.config[this.roleType].shopList,
                JSON.stringify(shops)
              )
              this.$store.dispatch('tagsView/delAllPDSViews')
              await syncPreferencesAfterLogin({
                store: this.$store,
                i18n: this.$i18n,
                currentRoleType: this.roleType,
                userRoleName: user.user_role,
                defaultSettings
              })
              if (this.config.roleNames.includes(user.user_role)) {
                return this.getRelatedInfo()
              } else {
                // 角色信息错误 跳转到登录页面
                if (this.config.roles.includes(this.roleType)) {
                  this.$router.push(this.config[this.roleType].loginPath)
                } else {
                  this.$router.push(this.config.dropShipper.loginPath)
                }
              }
            })
            .catch((error) => {
              console.error(error)
              this.$message && this.$message.error(this.$t ? this.$t('message.login.login') + ' failed' : 'Login failed')
            })
            .finally(() => {
              this.$forceUpdate()
              this.isLoggingIn = false
            })
        } else {
          return false
        }
      })
    }
  },
  computed: {},
  mounted() { },
  watch: {
    isLoggingIn(newValue) {
      this.$emit('update:loggingIn', newValue) // 向父组件发送状态变化的事件
    }
  }
}
</script>
<style scoped lang="scss">
.demo-loginFrom {
  ::v-deep .el-form-item__content .el-input__inner {
    border: 1px solid var(--custom-border-color3);
    border-radius: 12px;
    color: var(--custom-font-color2);
  }

  .login-button {
    display: flex;
    justify-content: center;
    // width: 200px;
    min-height: 48px; /* allow outer ring halo without clipping */
    font-size: 60px;
    padding: 0;

    ::v-deep .el-button {
      font-size: 18px;
      border-radius: 12px !important;
    }
  }
}

.forget-password {
  text-align: right;
  display: block;
  margin: -8px 0 26px 0;
  cursor: pointer;
}
</style>
