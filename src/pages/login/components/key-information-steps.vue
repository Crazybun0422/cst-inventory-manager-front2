<!--
* @description  shopify key information steps页面
* @fileName  key-information-steps
* @author wjp
* @date 2024-09-04 22:02:07
!-->
<template>
  <div id="key-information-steps" class="key-information-steps">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step class="text-container" v-if="signinVisble" :title="$t('message.signUp.linkedExistingAccounts')"
        :description="$t('message.signUp.linkedExistingAccountsDescription')"></el-step>
      <el-step class="text-container" v-else-if="!signinVisble"
        :title="$t('message.signUp.modifyInitializationAccountAndPassword')" :description="$t('message.signUp.modifyInitializationAccountAndPasswordDescription')
          "></el-step>
      <el-step class="text-container" :title="$t('message.storage.associatedWarehousing')"
        :description="$t('message.signUp.associatedWarehousingDescription')"></el-step>
      <el-step class="text-container" :title="$t('message.storage.synchronizeProducts')"
        :description="$t('message.storage.synchronizeProductsDescription')"></el-step>
    </el-steps>
    <el-divider></el-divider>
    <el-row type="flex" justify="center">
      <SigninForm v-show="signinVisble && active === 0" :signInType="signInType" :needToRelateShopUrl="shop_url"
        @changeActive="signinFormChangeActive"></SigninForm>
      <SignupForm v-show="!signinVisble && active === 0" pageType="thirdVerify" ref="signupFormRef"
        :logging-in.sync="isLoggingIn">
      </SignupForm>
      <SelectStoreTable ref="SelectStoreTable" v-show="active === 1" :pageType="'thirdVerify'"
        @addStorageCompleted="addStorageCompleted" @updateAssociatedStorageStatus="updateAssociatedStorageStatus">
      </SelectStoreTable>
      <div v-if="active === 2" class="synchronize-button">
        <el-row type="flex" justify="center">
          <SyncProductsProgress :shop_url="shop_url" @sync-completed="handleSyncCompleted" ref="syncProgress">
          </SyncProductsProgress>
        </el-row>
      </div>
    </el-row>
    <el-row type="flex" justify="space-between" :gutter="24">
      <el-col :span="18">
        <el-button style="margin-top: 12px" icon="el-icon-back" @click="previousStep" size="medium">{{ $t('common.back')
          }}</el-button>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="end">
          <el-button type="primary" v-if="!(signinVisble && active === 0) && active !== 2" style="margin-top: 12px"
            @click="submit" size="medium" :disabled="loading">
            <i v-if="loading" class="el-icon-loading"></i>
            <i v-else class="el-icon-finished"></i>
            {{ $t('common.confirm') }}</el-button>
          <el-button v-if="showSkipButton" style="margin-top: 12px" icon="el-icon-right" @click="skip" size="medium">{{
            $t('common.skip') }}</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SigninForm from '@/pages/login/components/signin-form.vue'
import SignupForm from '@/pages/login/components/signup-form.vue'
import SelectStoreTable from '@/pages/components/select-store-table.vue'
import { dropShipper } from '@/common/commonconfig'
import {
  toLoginPage,
  modifyShopifyAccount,
  getCsrfTokenFromServer,
  getAesKeyLogin,
  startSyncProducts
} from '@/common/common-func'
import SyncProductsProgress from '@/pages/store-management/components/sync-products-progress.vue'
export default {
  name: 'key-information-steps',
  props: {
    signinVisble: {
      type: Boolean,
      default: false
    },
    signupForm: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    SelectStoreTable,
    SigninForm,
    SignupForm,
    SyncProductsProgress
  },
  data() {
    return {
      active: 0,
      loading: false,
      isLoggingIn: false,
      hasAssociatedStorage: false,
      shop_url: '',
      signInType: 'relateUser',
      defaultUn: ''
    }
  },
  methods: {
    toLoginPage,
    modifyShopifyAccount,
    getCsrfTokenFromServer,
    getAesKeyLogin,
    startSyncProducts,
    updateAssociatedStorageStatus(status) {
      this.hasAssociatedStorage = status
    },
    handleSyncCompleted(data) {
      this.$router.push({ path: this.config[dropShipper].homePath })
    },
    signinFormChangeActive(active) {
      this.active = active
    },

    previousStep() {
      if (this.active >= 1) {
        this.active--
      } else {
        // 返回到选择关联账号或者新建账号页面
        this.$emit('changeVisble')
      }
    },
    updateUserInfo() {
      // 请求账密修改接口
      this.$refs.signupFormRef.$refs.formData.validate((valid) => {
        if (valid) {
          this.$refs.signupFormRef.loading = true
          const formData = this.$refs.signupFormRef.formData
          // this.getCsrfTokenFromServer().then((csrfToken) => {
          // 修改账号时 需要使用默认用户名的aeskey 而不是最新的
          this.getAesKeyLogin({
            username: this.defaultUn,
            password: formData.password
          })
            .then((encryptedPassword) => {
              const mapFromData = new FormData()
              mapFromData.append('username', formData.username)
              mapFromData.append('password_current', encryptedPassword)
              mapFromData.append('phone', formData.phone)
              mapFromData.append('email', formData.email)
              // mapFromData.append("role", formData.role)
              mapFromData.append('address', formData.address)
              mapFromData.append('user_avatar', formData.avatar)
              this.modifyShopifyAccount(mapFromData, {
                'Content-Type': 'application/x-www-form-urlencoded'
                // "X-CSRFToken": csrfToken,
              }).then((res) => {
                console.log(res,)
                if (this.$isRequestSuccessful(res.code)) {
                  this.active++
                }
              })
                .catch((e) => {
                  console.error(e)
                })
                .finally(() => {

                  this.$refs.signupFormRef.loading = false

                })
            })

        }
      })
    },
    skip() {
      if (this.active < 2) {
        this.active++
      } else if (this.active === 2) {
        // 如果在 同步产品哪里点跳过则跳转到主页
        this.$router.push({ path: this.config[dropShipper].homePath })
      }
    },
    submit() {
      // 判断active是多少来请求相应的接口 成功后active++
      if (this.active === 0) {
        this.updateUserInfo()
      } else if (this.active === 1) {
        // 请求关联仓储接口
        this.loading = true
        this.$refs.SelectStoreTable.$emit('relateStore') // 自定义事件触发
      }
    },
    addStorageCompleted() {
      // 用于恢复loading状态
      this.loading = false
    }
  },
  computed: {
    showSkipButton() {
      return (
        (!this.signinVisble && this.active !== 1) ||
        (this.signinVisble && this.active > 1) ||
        (this.active === 1 && this.hasAssociatedStorage)
      )
    }
  },
  watch: {
    active(newVal) {
      if (newVal === 0 && !this.signinVisble) {
        this.$nextTick(() => {
          // 确保DOM已更新
          if (this.signupForm && this.$refs.signupFormRef) {
            this.$refs.signupFormRef.formData.username =
              this.signupForm.username
            this.$refs.signupFormRef.formData.password =
              this.signupForm.password
            this.$refs.signupFormRef.formData.email = this.signupForm.email
            this.defaultUn = this.signupForm.defaultUn
          }
        })
      }
      if (newVal === 1) {
        // 使用 $nextTick 确保 DOM 已更新
        this.$nextTick(() => {
          // 检查 selectStoreTable 是否存在
          if (
            this.$refs.SelectStoreTable &&
            typeof this.$refs.SelectStoreTable.initializeComponent ===
            'function'
          ) {
            this.$refs.SelectStoreTable.initializeComponent()
          } else {
            console.warn(
              'SelectStoreTable 组件或其 initializeComponent 方法不可用'
            )
          }
        })
      }
    }
  },
  mounted() {
    // 检查URL查询参数中是否有 'active'
    this.$nextTick(() => {
      const { active, shop } = this.$route.query
      if (active !== undefined) {
        // 强制转换为数字并更新prop
        if (this.signinVisble) {
          // 关联账号时 默认跳转到关联账号页面
          this.active = 0
        } else this.active = Number(active)
      }
      if (shop) {
        this.shop_url = shop
      }
      if (this.signupForm) {
        this.$refs.signupFormRef.formData.username = this.signupForm.username
        this.$refs.signupFormRef.formData.password = this.signupForm.password
        this.$refs.signupFormRef.formData.email = this.signupForm.email
        this.defaultUn = this.signupForm.defaultUn
      }
    })
  }
}
</script>
<style scoped lang="scss">
::v-depp .synchronize-button .el-button {
  width: 150px;
  height: 150px;
}
</style>
