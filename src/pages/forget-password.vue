<!--
* @description  这是邮件跳转的忘记密码页面
* @fileName  forget-password
* @author wjp
* @date 2023-12-08 21:24:08
!-->
<template>
  <div id="forget-password" class="forget-password" v-loading="loading">
    <el-card shadow="always" class="box-card" style="width: 50%; margin: 0 auto; margin-top: 100px">
      <div slot="header">
        <span>{{ $t('message.login.forgetPassword') }}</span>
      </div>
      <el-form label-position="top" :model="forgetPasswordForm" ref="forgetPasswordForm" label-width="100px"
        class="demo-dynamic" :rules="forgetPasswordRules">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-form-item prop="passWord" :label="$t('message.myAccount.newPassword')">
              <el-input v-model.trim="forgetPasswordForm.passWord" type="passWord" show-password></el-input>
              <el-progress :percentage="passwordStrength" :format="pwdFormatF" :color="pwdColorF"></el-progress>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" type="flex" align="top">
          <el-col :span="16" class="flex-container">
            <el-form-item prop="confirmPassword" :label="$t('message.myAccount.confirmPassword')">
              <el-input v-model.trim="forgetPasswordForm.confirmPassword" type="passWord" show-password></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="submitForm">{{
            $t('common.confirm')
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="form-main"></div>
  </div>
</template>

<script>
import { toLoginPage, encryptPassword } from '@/common/common-func'
export default {
  name: 'forget-password',
  props: {
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('message.signUp.enterPassword')));
      } else {
        //6-20位包含字符、数字和特殊字符
        // 包含 大小字母 数字 特殊字符
        var ls = 0;
        if (this.forgetPasswordForm.passWord !== '') {
          if (this.forgetPasswordForm.passWord.match(/([a-z])+/)) {
            ls++;
          }
          if (this.forgetPasswordForm.passWord.match(/([0-9])+/)) {
            ls++;
          }
          if (this.forgetPasswordForm.passWord.match(/([A-Z])+/)) {
            ls++;
          }
          if (this.forgetPasswordForm.passWord.match(/([\W])+/) && !this.forgetPasswordForm.passWord.match(/(![\u4E00-\u9FA5])+/)) {
            ls++;
          }
          if (this.forgetPasswordForm.passWord.length < 6 || this.forgetPasswordForm.passWord.length > 20) {
            callback(new Error(this.$t('message.signUp.passwordLengthError')));
            ls = 0;
          }
          if (this.forgetPasswordForm.passWord.match(/([\u4E00-\u9FA5])+/)) {
            callback(new Error(this.$t('message.signUp.passwordFormatError')));
            ls = 0;
          }
          if (ls > 3 && this.forgetPasswordForm.passWord.length < 12) {
            // 当满足四种类型 但是长度小于12级减少1
            ls--;
          }
          if (ls >= 3 && this.forgetPasswordForm.passWord.length >= 12) {
            // 满足三种类型但是长度大于12时等级加1
            ls++;
          }
          switch (ls) {
            case 0: this.passwordStrength = 0; callback(new Error(this.$t('message.signUp.passwordRequirements'))); break;
            case 1: this.passwordStrength = 33; callback(new Error(this.$t('message.signUp.passwordRequirements'))); break;
            case 2: this.passwordStrength = 33; callback(new Error(this.$t('message.signUp.passwordRequirements'))); break;
            case 3: this.passwordStrength = 66; break;
            case 4: this.passwordStrength = 100; break;
            case 5: this.passwordStrength = 100; break;
            default: this.passwordStrength = 0; break;
          }
        }
        callback();
      }
    };
    return {
      username: '',
      api_key: '',
      loading: false,
      passwordStrength: 0, // 用于保存密码强度
      forgetPasswordForm: {
        passWord: '',
        confirmPassword: ''
      },
      forgetPasswordRules: {
        "passWord": [
          {
            required: true,
            message: this.$t('message.signUp.enterPassword'),
            trigger: ["blur", "change"],
          },
          {
            // validator: (rule, value, callback) => {
            //   if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}/.test(value)) {
            //     callback(new Error(this.$t('message.signUp.formatErrorPassword')));
            //   } else {
            //     callback();
            //   }
            validator: validatePassword,
            trigger: ["blur", "change"],
          }
        ],
        "confirmPassword": [
          { required: true, message: this.$t('message.myAccount.confirmPasswordPlaceholder'), trigger: 'blur' },
          { min: 6, max: 20, message: this.$t('message.myAccount.passwordLengthCheck'), trigger: 'blur' }
        ]
      }
    }

  },
  components: {

  },
  methods: {
    submitForm() {
      this.$refs.forgetPasswordForm.validate((valid) => {
        if (valid) {
          if (this.forgetPasswordForm.passWord !== this.forgetPasswordForm.confirmPassword) {
            this.$message({
              message: this.$t('message.myAccount.passwordErrorInfo'),
              type: 'error'
            })
            return false;
          }
          this.loading = true

          this.$ajax({
            url: '/api-prefix/get-aes-key-login/',
            method: 'get',
            params: {
              username: this.username
            },
          }
          ).then(response => {
            if (this.$isRequestSuccessful(response.code)) {
              const aesKey = response.data.aes_key
              const encryptedPasswordBefore = encryptPassword(aesKey, this.forgetPasswordForm.passWord)
              console.log(this.api_key)
              this.$ajax({
                url: '/api-prefix/api/customer-settings/change-password-directly',
                method: 'put',
                data: {
                  password_current: encryptedPasswordBefore
                },
                headers: {
                  'Authorization': "Bearer " + this.api_key
                },
                roleType: this.roleType
              }).then(res => {
                if (this.$isRequestSuccessful(res.code)) {
                  this.$message.success(this.$t('common.operationSuccessful'))
                  this.forgetPasswordForm = Object.assign({}, undefined)
                  this.$refs['forgetPasswordForm'].resetFields()
                  // 暂停1秒后跳转到登录页面
                  setTimeout(() => {
                    this.$router.push(toLoginPage(this.roleType))
                    this.loading = false
                  }, 1000)
                } else {
                  this.$message.error(res.msg[this.$languageType])
                }
              }).catch(error => {
                this.$message.error(error)
                this.loading = false
              })
            }
          })


        }
      })
    },
    // 动态显示指定内容
    pwdFormatF() {
      return this.passwordStrength == 33 ? this.$t('message.signUp.passwordStrengthWeak') : this.passwordStrength == 66 ? this.$t('message.signUp.passwordStrengthMedium') : this.passwordStrength == 100 ? this.$t('message.signUp.passwordStrengthStrong') : this.$t('message.signUp.passwordStrengthDefault')
    },
    // 动态改变颜色
    pwdColorF() {
      return this.passwordStrength == 33 ? '#FF5340' : this.passwordStrength == 66 ? '#FFB640' : this.passwordStrength == 100 ? '#25DC1B' : '#FF5340'
    },
  },
  computed: {

  },
  mounted() {
    const username = this.$route.query.username;
    const api_key = this.$route.query['api-key'];
    if (username && api_key) {
      this.username = username;
      this.api_key = api_key;
    } else {
      // 延时1秒跳转到登录页面
      this.$message({
        message: this.$t('common.parameterError'),
        type: 'error'
      })
      setTimeout(() => {
        this.$router.push(toLoginPage(this.roleType))
      }, 1000);
    }
  },
  watch: {

  }
}
</script>
< scoped lang='scss'>
  .form-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  border-radius: 6px;
  padding: 24px;
  box-sizing: border-box;
  box-shadow: 5px 5px 10px var(--custom-theme-box-shadow);
  }
  .forget-password-form {
  padding: 24px 24px 0 0;
  width: 500px;
  }
</