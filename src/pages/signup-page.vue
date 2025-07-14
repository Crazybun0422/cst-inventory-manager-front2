<!--
* @description  注册页面
* @fileName  signup-page
* @author wjp
* @date 2023-05-14 18:33:11
!-->
<template>
  <el-container class="login-container">
    <el-main>
      <div class="signup-main">
        <!-- <div class="signup-left-img">
          <img style="width: 230px" src="@/assets/logo-black.svg" alt />
        </div> -->
        <div class="sign-up-title">{{ $t('message.login.signUp') }}</div>
        <SignupForm ref="signupFormRef">
          <template slot="formButton">
            <el-form-item>
              <div class="register-or-login">
                <el-button
                  style="width: 100%"
                  type="primary"
                  :round="true"
                  @click="submitForm('formData')"
                  >{{ $t('message.signUp.signup') }}</el-button
                >

                <span class="to-login-message">
                  {{ $t('message.signUp.existAccount') }}
                  <a @click="toLogin" class="to-login">{{
                    $t('message.signUp.login')
                  }}</a>
                </span>
              </div>
            </el-form-item>
          </template>
        </SignupForm>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import SignupForm from '@/pages/login/components/signup-form.vue'
import { toLoginPage, register, getCsrfTokenFromServer, getAesKey } from '@/common/common-func'
export default {
  name: "signup-page",
  components: { SignupForm },
  props: {},
  data () {
    return {
      loading: false,
    };
  },
  methods: {
    // TODO: 使用promise优化下面的接口
    register,
    getCsrfTokenFromServer, getAesKey,
    submitForm (formData) {
      this.$refs.signupFormRef.$refs[formData].validate(async (valid) => {
        if (valid) {
          const formData = this.$refs.signupFormRef.formData
          this.loading = true;
          this.getCsrfTokenFromServer().then((csrfToken) => {
            this.getAesKey(formData).then((encryptedPassword) => {
              const mapFromData = new FormData()
              mapFromData.append("username", formData.username)
              mapFromData.append("encrypted_password", encryptedPassword)
              mapFromData.append("phone", formData.phone)
              mapFromData.append("email", formData.email)
              mapFromData.append("role", formData.role)
              mapFromData.append("address", formData.address)
              mapFromData.append("user_avatar", formData.avatar)
              this.register(mapFromData, {
                "Content-Type": 'application/x-www-form-urlencoded',
                "X-CSRFToken": csrfToken,
              }).then((res) => {
                if (this.$isRequestSuccessful(res.code)) {
                  this.toLogin()
                }
              })
            })
          }).catch((e) => {
            console.error(e);
          }).finally(() => {
            this.loading = false;
          })
        }
      });
    },
    toLogin () {
      const loginPath = toLoginPage(this.roleType)
      this.$router.push(loginPath);
    },
  }
};
</script>
<style scoped lang='scss'>
::v-deep .el-form-item {
  margin-bottom: 28px;
}
.sign-up-title {
  text-align: center;
  color: var(--custom-font-color);
  font-size: 30px;
  font-weight: 400;
}
.signup-main {
  background-color: var(--custom-background-color);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px 100px 40px 40px;
  border-radius: 40px;

  box-sizing: border-box;
  box-shadow: 5px 5px 10px var(--custom-theme-box-shadow);
}
.signup-left-img {
  margin: 0 auto;
}
.signup-form {
  padding: 24px 24px 0 0;
  width: 500px;
}
.register-or-login {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.to-login:hover {
  text-decoration: underline;
  cursor: pointer;
}
.image-upload {
  display: flex;
  flex-wrap: wrap;
}
.to-login-message {
  color: var(--custom-font-color2);
}
</style>