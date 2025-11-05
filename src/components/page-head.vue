<!--
* @Description: 页面头部
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div>
    <el-row type="flex" justify="space-between">
      <el-col :span="6">
        <span class="head-title">{{ title }}</span>
      </el-col>

      <el-col :span="18" class="head-right">
        <div style="
            display: flex;
            align-items: center;
            justify-content: end;
            width: 900px;
          ">
          <SyncProductsProgress v-if="isShowSyncProducts && currentShopUrl" :key="currentShopUrl"
            :shop_url="currentShopUrl" :progressType="'line'" :inlineProgress="true"
            @sync-completed="handleSyncCompleted"></SyncProductsProgress>
          <!-- 店铺下拉框 -->
          <el-select v-if="isShowShopSelect" v-model="currentShopUrl" :placeholder="$t('common.pleaseSelect')"
            @change="selectChange" filterable v-loading="loading" style="width: 300px; margin-left: 10px">
            <el-option v-for="item in shopList" :key="item.ewis_shop_url" :label="item.ewis_shop_url"
              :value="item.ewis_shop_url">
              <span class="custom-select-option-left">{{
                item.ewis_shop_url
              }}</span>
            </el-option>
          </el-select>
          <!-- 添加店铺按钮 -->
          <!-- <el-button v-if="isShowShopSelect && isDropShipper" @click="openAddShopModal" type="primary"
            style="margin-left: 10px">
            {{ $t('common.addShop') }}
          </el-button> -->
        </div>
        <slot name="head-right"></slot>
      </el-col>
    </el-row>

    <!-- Shopify 弹框 -->
    <ShopifyConditionModal ref="shopifyConditionModal" :visible="modalVisible" @confirmed="handleShopifyShopUrl"
      :loading="isLoading" @closed="handleModalClose" v-if="isDropShipper" />
  </div>
</template>
<script>
/**
 * @file 公共头部
 */

// 组件

// mixins

// 常量
import { mapActions } from 'vuex'
import SyncProductsProgress from '@/pages/store-management/components/sync-products-progress.vue'
import ShopifyConditionModal from '@/pages/store-management/p-user-info/modal/shopify-condition-modal.vue'
import { shopifyDirectAuth } from '@/common/common-func'
import { dropShipper } from '@/common/commonconfig';
export default {
  props: {
    title: { type: String, default: '标题' },
    isShowShopSelect: {
      type: Boolean,
      default: false
    },
    isShowSyncProducts: {
      type: Boolean,
      default: false
    }
  },
  components: { SyncProductsProgress, ShopifyConditionModal },
  data() {
    return {
      currentShopUrl: '',
      loading: false,
      modalVisible: false,  // 控制 Shopify 弹框的显示
      isLoading: false
      // shopList: []
    }
  },

  computed: {
    shopifyShopUrl() {
      return this.$store.getters.shopifyShopUrl
    },
    progressVisible() {
      return this.currentShopUrl !== ''
    },
    isDropShipper() {
      return this.roleType === dropShipper
    },
    shopList: {
      get() {
        return this.roleType === dropShipper ? this.$store.state.shopify.shopListDS : this.$store.state.shopify.shopListP
      },
      set(value) {
        this.roleType === dropShipper ? this.$store.commit('shopify/SET_SHOP_LIST_DS', value) : this.$store.commit('shopify/SET_SHOP_LIST_P', value)
      }
    }
  },
  mounted() {
    if (
      this.isShowShopSelect &&
      !this.shopifyShopUrl &&
      this.shopList.length === 0
    ) {
      this.getShopList()
    } else {
      this.currentShopUrl = this.shopifyShopUrl
      this.$emit('refresh')
    }
  },
  methods: {
    shopifyDirectAuth,
    // ...mapActions(['fetchShopListByParams']),
    handleSyncCompleted(data) {
      // 同步完成后，刷新页面
    },
    openAddShopModal() {
      this.modalVisible = true;
    },
    handleShopifyShopUrl(shopUrl) {
      console.log('提交的店铺 URL:', shopUrl);
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
    handleModalClose() {
      this.modalVisible = false; // 关闭弹框
    },
    getShopList() {
      let vm = this
      vm.loading = true
      vm.$ajax({
        url: '/api/shop-manager/enum',
        method: 'get',
        roleType: vm.roleType,
        params: {}
      })
        .then(({ data = [] }) => {
          vm.shopList = data
          vm.loading = false
          vm.currentShopUrl = data?.[0]?.ewis_shop_url ?? ''
          vm.selectChange(vm.currentShopUrl)
          // }
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          vm.loading = false
        })
    },
    selectChange(url) {
      this.$store.commit('shopify/setShopifyShopUrl', url)
      this.currentShopUrl = url
      this.$emit('refresh')
    }
  }
}
</script>
<style lang="scss" scoped>
.head-title {
  font-size: 18px;
  line-height: 32px;
  height: 32px;
}

.head-right {
  display: flex;
  align-items: center;
  /* 确保所有子元素在交叉轴上中心对齐 */
  justify-content: flex-end;
  /* 对齐到容器的末端 */
}

::v-deep .el-divider--horizontal {
  margin: 15px 0;
}

.custom-select-option-left {
  float: left;
}

.custom-select-option-right {
  float: right;
  font-size: 13px;
}

::v-deep .el-select .el-loading-spinner {
  height: 32px;
  top: 50%;
  margin-top: -16px;
  width: 100%;
  text-align: center;
  position: absolute;
}

::v-deep .circular {
  height: 30px;
}
</style>
