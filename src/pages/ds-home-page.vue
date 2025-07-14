<!--
* @description  首页布局
* @fileName  home-page
* @author wjp
* @date 2023-05-14 18:31:36
!-->
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-statistic
          group-separator=","
          :precision="2"
          :value="value1"
          prefix="¥"
          suffix="RMB"
          title="账户余额"
        ></el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic
          title="待付款金额"
          group-separator=","
          :precision="2"
          :value="value2"
          prefix="¥"
          suffix="RMB"
        >
        </el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic title="待处理问题件" :value="value2">
          <template slot="suffix">
            <el-link
              type="primary"
              :underline="false"
              class="el-icon-view el-icon--right"
            ></el-link>
          </template>
        </el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic title="未读站内信" :value="value2">
          <template slot="suffix">
            <el-link
              type="primary"
              :underline="false"
              class="el-icon-view el-icon--right"
            ></el-link>
          </template>
        </el-statistic>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { loadHomeData } from '@/common/common-func'
export default {
  name: 'home-page',
  props: {},
  data () {
    return {
      userName: '',
      userRole: '',
      userRelatedId: '',
      avatarBase64: require('../assets/notImg.png'),
      like: true,
      value1: 4154.564,
      value2: 2222
    }
  },
  methods: {
    loadHomeData,
    loadAndSaveHomeData () {
      this.loadHomeData()
        .then((resData) => {
          const { user, avatar_base64, shops, default_settings } = resData
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
          localStorage.setItem(
            this.config[this.roleType].avatarBase64,
            avatar_base64
          )
          // 保存店铺信息
          localStorage.setItem(
            this.config[this.roleType].shopList,
            JSON.stringify(shops)
          )
          this.$store.dispatch('tagsView/delAllPDSViews')

          // 设置个人偏好的语言种类
          const defaultLanguage =
            default_settings?.defaultLanguage || 'en_us'
          this.$store.dispatch('user/getDefaultLanguage', defaultLanguage)
          this.$i18n.locale = defaultLanguage
          // 设置主题
          const defaultTheme = default_settings?.defaultTheme || 'defaultTheme'
          localStorage.setItem('theme', defaultTheme)
          this.$store.dispatch('user/changeSetting', {
            key: 'theme',
            value: defaultTheme
          })
          if (this.config.roleNames.includes(user.user_role)) {
            this.getWarehouseRelatedInfo()
              .then((resData) => {
                if (resData && resData.length === 0) {
                  this.$router.push(this.config[this.roleType].keyInformationPath)

                }
              })
              .catch((error) => {
                this.shopList = []
                throw error
              })
          } else {
            // 角色信息错误 跳转到登录页面
            if (this.config.roles.includes(this.roleType)) {
              this.$router.push(this.config[this.roleType].loginPath)
            } else {
              this.$router.push(this.config.dropShipper.loginPath)
            }
          }
        })
        .catch((error) => { })
    }
  },
  created () {
    // 在组件创建时进行数据请求
    // this.loadAndSaveHomeData();  这个数据在登录时已获取
    // 判断路由参数type是否存在
    if (this.$route.query.type && this.$route.query.type === 'p2ds') {
      this.loadAndSaveHomeData()
    }
  }
}
</script>
<style scoped lang="scss"></style>
