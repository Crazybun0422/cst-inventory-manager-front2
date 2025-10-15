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
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            const { user, user_avatar_url } = res.data
            // 可能需要将 角色信息存到cookie 或者localstorage
            // this.userName = user.username
            // this.userRole = user.user_role
            // this.userRelatedId = user.user_related_id
            // this.avatarBase64 = user_avatar_url
            localStorage.setItem('userName', user.username)
            localStorage.setItem('userRole', user.user_role)
            localStorage.setItem('userRelatedId', user.user_related_id)
          }
          // 统一拦截里面做了其他code的处理
        })
        .catch((error) => { })
    }
  },
  created () {
    // 在组件创建时进行数据请求
    // this.loadAndSaveHomeData(); 这个数据在登录时已获取
  }
}
</script>
<style scoped lang="scss"></style>
