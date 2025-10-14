<!--
* @Description: 导航组件
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div class="navigate-style">
    <div>
      <div
        class="cst-logo"
        role="button"
        tabindex="0"
        @click="onToggle"
        @keydown.enter.prevent="onToggle"
      >
        <img src="../../assets/logo-no-background.svg" alt style="height: 50px; line-height: 50px" />
        <span v-show="!isCollapse">Wing DropShip</span>
      </div>

    </div>
    <!-- <div class="top-divider">
      <el-divider></el-divider>
    </div> -->
    <div class="select-shop" v-if="config.pRoleList.includes(roleType)">
      <el-select v-model="shop_provider_uuid" :placeholder="$t('common.pleaseSelect')" @change="handleSelectShop"
        ref="shopSelect">
        <el-option v-for="item in shopList" :key="item.provider_uuid" :label="item.name" :value="item.provider_uuid">
        </el-option>
      </el-select>
    </div>
    <el-menu :router="true" :collapse="isCollapse" :default-active="currentName">
      <NavItem v-for="nav in navigationData" :key="nav.path" :item="nav" :handleNavItemClick="handleNavItemClick" />
    </el-menu>

    <!-- Shopify 弹框 -->
    <ShopifyConditionModal ref="shopifyConditionModal" :visible="modalVisible" @confirmed="handleShopifyShopUrl"
      :loading="isLoading" @closed="handleModalClose" v-if="isDropShipper" />
  </div>
</template>
<script>
import { provider, dropShipper, config } from '@/common/commonconfig'
import { navigationDataProvider, navigationDataDs } from './navigate'
import { getWarehouseRelatedInfo, filterRoutesByRole, shopifyDirectAuth } from '@/common/common-func'
import NavItem from './navitem.vue'
import ShopifyConditionModal from '@/pages/store-management/p-user-info/modal/shopify-condition-modal.vue'
import { Message } from 'element-ui'
export default {
  props: { isCollapse: { type: Boolean, default: false } },
  components: { NavItem, ShopifyConditionModal },
  data() {
    return {
      navigationData: [],
      shopName: '',
      // isCollapse: false,
      shopList: [],
      modalVisible: false, // 控制 Shopify 弹框的显示
      isLoading: false,
    }
  },
  watch: {
    $route: {
      handler(newValue, oldValue) {
        this.currentName = this.$route.path
        // 未隔离路由前的切换店铺逻辑
        // if (newValue?.name === 'home' && oldValue?.name === 'key-information') {
        //   await this.getShopList()
        // }
        if ((newValue?.name === 'ds-home' && oldValue?.name === 'ds-key-information') || (newValue?.name === 'p-home' && oldValue?.name === 'p-key-information')) {
          this.getShopList()
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    //获取当前的门店id
    shop_provider_uuid: {
      get() {
        return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
      },
      set() { }//添加一个空setter防止报错
    },
    isDropShipper() {
      return this.roleType === dropShipper
    },
  },
  created() {
    // 获取当前登陆角色
    if (this.config.pRoleList.includes(this.roleType)) {
      // 这里按路由过滤
      this.navigationData = filterRoutesByRole(navigationDataProvider, this.config[this.roleType].roleName)
    } else {
      this.navigationData = navigationDataDs
    }
    this.getShopList()
  },
  methods: {
    shopifyDirectAuth,
    getWarehouseRelatedInfo,
    onToggle () {
      this.$emit('toggle-collapse')
    },
    handleSelect(index) {
      console.log('选择了菜单项，索引为:', index);
    },
    // toggleExpand 留空以避免修改 Prop；改为通过上面的 onToggle 通知父组件
    // 获取店铺
    getShopList() {
      this.$emit('loading', true)
      this.getWarehouseRelatedInfo().then(resData => {
        if (resData && resData.length !== 0) {
          this.shopList = resData
          this.shopName = resData[0].name
          this.shop_provider_uuid = resData[0].provider_uuid
          if (this.config.pRoleList.includes(this.roleType)) {
            // p才使用shop_provider_uuid 用于切换店铺
            localStorage.setItem('shop_provider_uuid', resData[0].provider_uuid)
          }
          this.$store.dispatch('shopProviderUuid/setShopInfo', resData[0])
        } else {
          this.shopList = []
        }
        this.$emit('loading', false)

      }).catch(error => {
        this.shopList = []
        this.$emit('loading', false)
      })
    },
    // 切换店铺
    handleSelectShop(value) {
      const selectedOption = this.shopList.find(shopInfo => shopInfo.provider_uuid === value);
      // localStorage.setItem('shop_provider_uuid', res.data[0].provider_uuid)
      if (this.config.pRoleList.includes(this.roleType)) {
        localStorage.setItem('shop_provider_uuid', value)
      }
      this.$store.dispatch('shopProviderUuid/setShopInfo', selectedOption)
      this.shopName = selectedOption.name
    },

    handleNavItemClick(nav) {
      console.log(nav);
      if (nav.condition !== undefined) {
        if (!nav.condition()) {
          this.modalVisible = true; // 显示弹框
          for (let child of nav.children) {
            if (child.condition !== undefined)
              child.condition = false
          }
          return;
        } else {
          for (let child of nav.children) {
            if (child.condition !== undefined)
              child.condition = true
          }
        }
      }
    },

    // 处理弹框提交
    handleShopifyShopUrl(shopUrl) {
      this.isLoading = true
      this.shopifyDirectAuth({ "shop": shopUrl }, {})
        .then((response) => {
          if (this.$isRequestSuccessful(response.code)) {
            if (response.code == 100000) {
              window.location.href = response.data.auth_url // 重定向到 auth_url
            } else {
              this.$message.success(this.$t('common.addShopSuccess'))
              window.location.reload();  // 刷新页面
            }
          } else {
            this.isLoading = false
          }
        })
        .catch((error) => {
          this.$message.error(error)
          this.isLoading = false
        })

    },

    // 处理弹框关闭
    handleModalClose() {
      this.modalVisible = false; // 关闭弹框
    }
  },
}
</script>
<style scoped lang="scss">
.select-shop {
  padding: 10px;
  display: flex;
  justify-content: center;
}

.cst-logo {
  margin-left: 10px;
  height: 60px;
  display: flex;
  align-items: center;
  /* 确保垂直居中对齐 */
  justify-content: flex-start;
  /* 确保左对齐 */
}

.cst-logo span {
  font-size: 18px;
  font-weight: bold;
  margin-left: 5px;
  /* 让文字与图片保持适当间距 */
  background: linear-gradient(90deg, #A67C52, #FFD700, #FF4500);
  /* 渐变色 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}
.cst-logo { cursor: pointer; user-select: none; }
</style>
