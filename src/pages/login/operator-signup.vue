<template>
  <el-dialog
    :title="$t('message.userInfo.addOperator')"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <SignupForm ref="signupFormRef" pageType="addOperator"></SignupForm>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="signup">{{
        $t('common.confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import SignupForm from '@/pages/login/components/signup-form.vue'
import {
  toLoginPage,
  register,
  getCsrfTokenFromServer,
  getAesKey
} from '@/common/common-func'
export default {
  name: 'ComponentName',
  components: { SignupForm },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    register,
    getCsrfTokenFromServer,
    getAesKey,
    toLoginPage,
    handleClose() {
      this.dialogVisible = false
      Object.assign(this.$refs.signupFormRef.formData, {})
      this.$refs.signupFormRef.$refs.formData.resetFields()
      this.$emit('close')
    },
    signup() {
      this.$refs.signupFormRef.$refs.formData.validate((valid) => {
        this.$refs.signupFormRef.$refs.formData.validate((valid) => {
          if (valid) {
            this.$refs.signupFormRef.loading = true
            const formData = this.$refs.signupFormRef?.formData
            this.getCsrfTokenFromServer()
              .then((csrfToken) => {
                return this.getAesKey(formData).then((encryptedPassword) => {
                  const mapFromData = new FormData()
                  mapFromData.append('username', formData.username)
                  mapFromData.append('encrypted_password', encryptedPassword)
                  mapFromData.append('phone', formData.phone)
                  mapFromData.append('email', formData.email)
                  mapFromData.append('role', 'Operator')
                  mapFromData.append('address', formData.address)
                  mapFromData.append('user_avatar', formData.avatar)
                  mapFromData.append('uuid_of_provider', this.provider_uuid)
                  return this.register(mapFromData, {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken
                  })
                })
              })
              .then((res) => {
                if (this.$isRequestSuccessful(res.code)) {
                  this.$message.success(this.$t('common.operationSuccessful'))
                }
              })
              .catch((e) => {
                console.error(e)
              })
              .finally(() => {
                this.$refs.signupFormRef.loading = false
                this.handleClose()
              })
          }
        })
      })
    },
    toLogin() {
      const loginPath = toLoginPage(this.roleType)
      this.$router.push(loginPath)
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    }
  },
  computed: {
    provider_uuid() {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    }
  }
}
</script>

<style scoped>
::v-deep .el-dialog__body {
  padding: 0 20px;
}
</style>
