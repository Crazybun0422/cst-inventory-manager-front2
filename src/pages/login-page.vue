<!--
* @description  登录页面
* @fileName  login-page
* @author wjp
* @date 2023-05-14 18:33:11
!-->
<template>
  <div class="login">
    <!-- Language Switch (top-right) -->
    <div class="lang-switch">
      <a-switch size="small" :checked="isEnglish" @change="toggleLanguage" checkedChildren="EN" unCheckedChildren="中" />
    </div>
    <el-container class="login-container">
      <el-main>
        <div class="logo-image">
          <img src="../assets/logo-no-background.svg" />
        </div>
        <div class="logo-text">
          Wing Dropship<span class="trademark">®</span>
        </div>
        <div class="login-form">
          <div class="login-form-title">
            <div class="login-form-main-title">
              {{
                currentPathName === 'p-login'
                  ? $t('common.adminLogin')
                  : $t('message.login.login')
              }}
            </div>
            <div class="login-form-sub-title">
              {{ $t('message.login.otherLoginMethods') }}
            </div>
            <ThirdPartLogin :disabled="isLoggingIn" />
          </div>
          <div style="margin: 28px 0">
            <el-divider content-position="center">
              {{ $t('message.login.orWithAccount') }}
            </el-divider>
          </div>
          <SigninForm :logging-in.sync="isLoggingIn" />
          <!-- <div class="language-select">
            <LanguageSelect :disabled="isLoggingIn" />
          </div> -->
          <div class="to-sign-up">
            {{ $t('message.login.notAMemberYet') }}
            <a @click="jumpUrl">{{ $t('message.login.signUp') }}</a>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- 备案号及隐私政策区域 -->
    <div class="footer">
      <template v-if="isERP">
        <span class="brand">{{ brandName }}</span>
        <span class="separator">|</span>
        <a :href="policyPath" @click.prevent="$router.push(policyPath)">{{$t('footer.pp')}}</a>
      </template>
      <template v-else>
        <a href="https://beian.miit.gov.cn/" target="_blank">湘ICP备2023017609号-1</a>
      </template>
    </div>
  </div>
</template>

<script>
import CaptchaView from '@/components/captcha-view.vue'
import LanguageSelect from '@/components/language-select.vue'
import ForgetPassword from "@/pages/login/components/forget-password.vue"
import ThirdPartLogin from "@/pages/login/components/third-part-login.vue"
import SigninForm from "@/pages/login/components/signin-form.vue"
import { setLanguge } from '@/common/language'

export default {
  name: 'login-page',
  props: {},
  components: { CaptchaView, LanguageSelect, ForgetPassword, ThirdPartLogin, SigninForm },
  data() {
    return {
      emailFormVisible: false,
      isLoginEnabled: false,
      mountedFlag: false,
      showCaptcha: false, // 三次登录错误后需要这个变量记录是否需要验证码，只有验证码正确才能变更这个值
      // errorCount: 0,
      captchaData: {},
      isLoggingIn: false, // 新增
    }
  },
  methods: {
    handleCloseForm() {
      this.emailFormVisible = false
    },
    jumpUrl() {
      this.$router.push('/signup')
    },
    toggleLanguage(checked) {
      const lang = checked ? 'en_us' : 'zh_cn'
      this.$i18n.locale = lang
      setLanguge(lang)
    },
  },
  computed: {
    canSubmit() {
      // 判断是否填写账密来禁用登录按钮
      const { userName, passWord } = this.loginFrom
      return Boolean(userName && passWord)
    },
    currentPathName() {
      return this.$route.name
    },
    isEnglish() {
      return this.$i18n.locale === 'en_us'
    },
    isERP() {
      return this.$store.state.init?.mainFunction === 'Business ERP'
    },
    brandName() {
      return this.$i18n.locale === 'en_us' ? this.$store.state.init?.titleEnus : this.$store.state.init?.titleZhcn
    },
    policyPath() {
      return this.config.privatePolicy
    }
  },
  mounted() { },
}
</script>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100vh;
  border-radius: 24px;
  background-color: var(--custom-background-color7);
  background-image: var(--custom--background-image-url);
  background-repeat: no-repeat;
  /* 防止背景重复 */
  background-size: cover;
  /* 自动调整背景大小以适应容器 */
  background-position: center;
  /* 居中背景图片 */
}

/* Language switch - fixed top-right for clear access */
.lang-switch {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.login-form {
  position: absolute;
  opacity: 1;
  top: 20%;
  left: 71%;
  width: 384px;
  height: 454px;
  border-radius: 24px;
  padding: 40px;
  background-color: var(--custom-background-color);

  .login-form-title {
    text-align: center;

    .login-form-main-title {
      color: var(--custom-font-color);
      font-size: 30px;
      font-weight: 400;
    }

    .login-form-sub-title {
      color: var(--custom-font-color2);
      margin-top: 8px;
      font-size: 14px;
      font-weight: 400;
    }
  }
}

.to-sign-up {
  text-align: center;
  margin-top: 20px;
  color: var(--custom-font-color2);

  a {
    color: var(--custom-color-primary);
    cursor: pointer;
  }
}

.logo-image {
  img {
    top: -20px;
    left: 20px;
    width: 120px;
    height: 120px;
    position: relative;
  }
}

.trademark {
  font-size: 24px;
  /* 适当缩小 ® 的大小 */
  font-weight: normal;
  /* 轻微上移，让 ® 与文字对齐 */
}

.logo-text {
  /* 可以换成更匹配品牌的字体 */
  position: absolute;
  top: 100px;
  font-size: 24px;
  /* 适当调整字体大小 */
  font-weight: bold;
  /* 让文字与图片保持适当间距 */
  background: linear-gradient(90deg, #A67C52, #FFD700, #FF4500);
  /* 渐变色 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

/* 备案号及隐私政策样式 */
.footer {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;

  a {
    color: #999;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .separator {
    margin: 0 5px;
  }
}
</style>
