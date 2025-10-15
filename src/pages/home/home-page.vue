<!--
* @description  首页布局
* @fileName  home-page
* @author wjp
* @date 2023-05-14 18:31:36
!-->
<template>
  <div>
    <div v-if="roleType == provider">
      <PHome />
    </div>
    <div v-else-if="roleType == dropShipper">
      <DsHome />
    </div>
  </div>
</template>

<script>
import { loadHomeData } from '@/common/common-func'
import {
  provider,
  dropShipper,
  providerName,
  dropShipperName,
  config
} from '@/common/commonconfig'
import PHome from '@/pages/home/p-home.vue'
import DsHome from '@/pages/home/ds-home.vue'
export default {
  name: 'home-page',
  components: {
    PHome,
    DsHome
  },
  props: {},
  data() {
    return {
      provider: provider,
      dropShipper: dropShipper,
      providerName: providerName,
      dropShipperName: dropShipperName,
      value1: 4154.564,
      value2: 2222
    }
  },
  methods: {
    loadHomeData,
    loadAndSaveHomeData() {
      const routeRoleKey = this.$route?.path?.startsWith(config.provider.pathPrefix)
        ? config.provider.role
        : config.dropShipper.role
      this.loadHomeData(routeRoleKey)
        .then((res) => {
          const { user, user_avatar_url, shops } = res
          if (user.user_role === this.providerName) {
            localStorage.setItem('pUserName', user.username)
            localStorage.setItem('pUserRole', user.user_role)
            localStorage.setItem('pUserRelatedId', user.user_related_id)
            localStorage.setItem(config.provider.shopList, JSON.stringify(shops || []))
          } else {
            localStorage.setItem('userName', user.username)
            localStorage.setItem('userRole', user.user_role)
            localStorage.setItem('userRelatedId', user.user_related_id)
            localStorage.setItem(config.dropShipper.shopList, JSON.stringify(shops || []))
          }
        })
        .catch(() => { })
    }
  },
  computed: {},
  created() {
    this.loadAndSaveHomeData() // 在登录的时候保存了用户信息
  }
}
</script>
