<template>
  <div class="erp-login">
    <div class="progress-bar" :style="{ width: progress + '%' }" v-if="isVerifying"></div>
    <!-- 自定义顶部进度条 -->
    <el-container class="erp-login-container">
      <el-main>
        <div class="erp-login-main" ref="erpLoginMain">
          <!-- 页面内容，可以保持现有结构 -->
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  getCsrfTokenFromServer,
  getWarehouseRelatedInfo,
  shopifyAuth,
  shopifyDirectAuth,
} from '@/common/common-func'
import { dropShipper, config } from '@/common/commonconfig'

export default {
  name: 'erp-login',
  data() {
    return {
      isVerifying: false, // 控制进度条显示
      progress: 0, // 进度条的进度控制
      thirdPartyParams: {
        hmac: '',
        host: '',
        session: '',
        shop: '',
        timestamp: '',
        direct: false
      },

    }
  },
  mounted() {
    // 获取第三方验证参数并存入 data
    const queryParams = this.$route.query
    this.thirdPartyParams.hmac = queryParams.hmac || ''
    this.thirdPartyParams.host = queryParams.host || ''
    this.thirdPartyParams.session = queryParams.session || ''
    if (this.thirdPartyParams.session === '') {
      delete this.thirdPartyParams.session
    }
    this.thirdPartyParams.shop = queryParams.shop || ''
    this.thirdPartyParams.timestamp = queryParams.timestamp || ''
    this.thirdPartyParams.direct = queryParams.direct
    // 如果没有必要的验证参数，则跳回到login页面
    if (!this.thirdPartyParams.hmac || !this.thirdPartyParams.shop) {
      this.$router.push({ name: 'ds-login' })
    } else {
      // 自动发起第三方验证请求
      this.submitThirdPartyVerification()
    }
  },
  methods: {
    shopifyAuth,
    shopifyDirectAuth,
    getWarehouseRelatedInfo,
    getCsrfTokenFromServer,
    startProgressBar() {
      this.progress = 0
      this.isVerifying = true
      this.increaseProgress() // 开始增加进度
    },
    increaseProgress() {
      if (this.progress < 90) {
        // 进度条达到90%后等待请求完成
        this.progress += 1
        setTimeout(this.increaseProgress, 100) // 每100ms增加进度
      }
    },
    stopProgressBar() {
      this.progress = 100 // 请求完成后将进度条设置为100%
      setTimeout(() => {
        this.isVerifying = false // 延迟一段时间后隐藏进度条
      }, 300) // 延迟0.3秒让进度条完全显示
    },
    submitThirdPartyVerification() {
      this.startProgressBar() // 开始显示进度条
      this.getCsrfTokenFromServer().then((csrfToken) => {
        const reqHeader = {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        }
        localStorage.setItem(config[dropShipper].csrfToken, csrfToken)
        // 调用后端接口进行第三方验证
        if (this.thirdPartyParams?.direct) {
          this.shopifyDirectAuth({ "shop": this.thirdPartyParams.shop }, {})
            .then((response) => {
              if (this.$isRequestSuccessful(response.code)) {
                if (response.code == 100000) {
                  window.location.href = response.data.auth_url // 重定向到 auth_url
                } else {
                  this.$message.success(this.$t('common.addShopSuccess'))
                  this.$router.push(this.config[dropShipper].homePath)
                }
              } else {
                this.isLoading = false
              }
            })
            .catch((error) => {
              this.$message.error(error)
              this.isLoading = false
            })
        }
        else {
          this.shopifyAuth(this.thirdPartyParams, reqHeader)
            .then((response) => {
              if (this.$isRequestSuccessful(response.code)) {
                if (response.code == 100000) {
                  window.location.href = response.data.auth_url // 重定向到 auth_url
                } else {
                  // 成功后的处理逻辑

                  const {
                    username,
                    access,
                    user_role,
                    password,
                    email,
                    shop_url,
                    info_need_to_edit
                  } = response.data
                  if (access) {
                    localStorage.setItem(config[dropShipper].accessToken, access)
                    localStorage.setItem(config[dropShipper].userName, username)
                    localStorage.setItem(config[dropShipper].userRole, user_role)
                    // localStorage.setItem(this.config.userRelatedId, user.user_related_id);
                    localStorage.setItem(config[dropShipper].avatarBase64, null)
                    // 如果token有值 需要判断是否已关联仓储
                    this.getWarehouseRelatedInfo()
                      .then((resData) => {
                        if (resData && resData.length === 0) {

                          let activeNum = 1 // 未关联仓储默认跳转步骤2
                          if (info_need_to_edit) activeNum = 0 // 如果需要编辑信息跳转到步骤1
                          this.$router.push({
                            path: config[dropShipper].thirdPartKeyInformation,
                            query: {
                              active: activeNum,
                              defaultUn: username,
                              defaultEmail: email,
                              shop: shop_url,
                              ...this.thirdPartyParams
                            }
                          })
                        } else {

                          this.$router.push({
                            path: config[dropShipper].homePath
                          })
                        }
                      })
                      .catch((error) => {
                        this.shopList = []
                        console.error(error)
                      })
                  } else {
                    // 如果有值跳转的账密修改页面
                    this.$router.push({
                      path: config[dropShipper].thirdPartKeyInformation,
                      query: {
                        active: 0,
                        defaultUn: username,
                        defaultPsw: password,
                        defaultEmail: email,
                        shop: shop_url,
                        ...this.thirdPartyParams
                      }
                    })
                  }
                }
              } else {
                this.$router.push({ path: config[dropShipper].loginPath })
              }
            })
            .catch(() => {
              this.$router.push({ path: config[dropShipper].loginPath })
            })
            .finally(() => {
              this.stopProgressBar() // 请求完成后结束进度条
            })
        }

      })
    }
  }
}
</script>

<style scoped lang="scss">
/* 顶部的自定义进度条，模仿 Shopify 的风格 */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background-color: #48c486;
  /* Shopify 的品牌色 */
  width: 0%;
  transition: width 0.1s ease-out;
  /* 平滑增加宽度 */
  z-index: 9999;
  /* 保证进度条在最上方 */
}
</style>
