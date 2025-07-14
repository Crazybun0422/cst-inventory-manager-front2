<!--
* @description  参数1
* @fileName  forget-password
* @author wjp
* @date 2024-09-04 22:33:27
!-->
<template>
  <div id="forget-password">
    <el-dialog :title="$t('message.login.forgetPassword')" :visible.sync="emailFormVisible"
      :close-on-click-modal="false" @close="handleCloseForm" v-loading="forgetPasswordLoading" destroy-on-close
      :modal-append-to-body="false" :z-index="3001">
      <el-form :model="emailForm" :rules="emailFormRules" ref="emailForm">
        <el-form-item :label="$t('message.signUp.userName')" prop="username">
          <el-input v-model="emailForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.signUp.email')" prop="email">
          <el-input type="email" v-model="emailForm.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseForm">{{
          $t('common.cancel')
        }}</el-button>
        <el-button type="primary" @click="submitEmailForm">{{
          $t('common.confirm')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'forget-password',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      forgetPasswordLoading: false,
      emailFormVisible: false,
      emailFormRules: {
        username: [
          {
            required: true,
            message: this.$t('message.signUp.enterUsername'),
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: this.$t('message.signUp.emailPlaceholder'),
            trigger: 'blur'
          },
          {
            type: 'email',
            message: this.$t('message.signUp.emailCheckError'),
            trigger: ['blur', 'change']
          }
        ]
      },
      emailForm: {
        lan: '',
        username: localStorage.getItem('userName')
          ? localStorage.getItem('userName')
          : '',
        email: ''
      }
    }
  },
  methods: {
    handleCloseForm() {
      this.emailFormVisible = false
      this.emailForm = Object.assign({}, undefined)
      this.$refs.emailForm.resetFields()
      this.$emit('update:visible', false)
      this.$emit('close')
      document.querySelectorAll('.v-modal').forEach(el => {
        if (window.getComputedStyle(el).zIndex === '3001') {
          el.style.display = 'none';
        }
      });
    },
    submitEmailForm() {
      this.$refs.emailForm.validate((valid) => {
        this.emailForm.lan = this.$languageType
        if (valid) {
          this.forgetPasswordLoading = true
          this.$ajax({
            url: '/api-prefix/change-password/',
            method: 'GET',
            params: this.emailForm
          })
            .then((res) => {
              if (this.$isRequestSuccessful(res.code)) {
                this.$message.success(this.$t('common.operationSuccessful'))
                this.handleCloseForm()
              }
            })
            .catch((error) => {
              console.error(error)
            })
            .finally(() => {
              this.forgetPasswordLoading = false
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
    visible(val) {
      this.emailFormVisible = val
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-dialog {
  // 圆角
  border-radius: 20px;
  opacity: 1;
}
</style>
