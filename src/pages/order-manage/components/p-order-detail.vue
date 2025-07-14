<!--
* @description  参数1
* @fileName  p-order-detail
* @author wjp
* @date 2024-06-09 20:26:37
!-->
<template>
  <div id="p-order-detail" class="p-order-detail">
    <el-dialog
      :title="$t('message.orderInfo.orderDetails')"
      :visible.sync="dialogVisible"
      width="78%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane
          :label="$t('message.orderManagement.order')"
          name="order"
          class="tab-pane-style"
          ><POrderInfo
            ref="POrderInfo"
            :currentData="currentOrderData"
            :logistics_channels="logistics_channels"
            :logisticsCompanyMap="logisticsCompanyMap"
          ></POrderInfo
        ></el-tab-pane>
        <el-tab-pane
          :label="$t('message.productManagement.product')"
          name="product"
          class="tab-pane-style"
          ><POrderProductInfo
            :currentData="currentOrderData"
          ></POrderProductInfo
        ></el-tab-pane>
        <el-tab-pane
          :label="$t('common.costs')"
          name="cost"
          class="tab-pane-style"
        ></el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import POrderInfo from './p-order-detail/p-order-info.vue'
import POrderProductInfo from './p-order-detail/p-order-product-info.vue'
export default {
  name: 'p-order-detail',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentData: {
      type: Object,
      default: () => { }
    },
    logistics_channels: { type: Array, default: () => [] },
    logisticsCompanyMap: { type: Object, default: () => { } }
  },
  components: {
    POrderInfo,
    POrderProductInfo
  },
  data () {
    return {
      dialogVisible: false,
      activeName: 'order',
      currentOrderData: {}
    }
  },
  methods: {
    handleClose (refresh = false) {
      // 重置子组件的样式
      this.$refs.POrderInfo.editStatus = false
      this.$emit('close', refresh)
    },
    handleClick (tab, event) {
    }
  },
  computed: {

  },
  mounted () {

  },
  watch: {
    visible (val) {
      this.dialogVisible = val
      this.currentOrderData = this.currentData
    }
  }
}
</script>
<style scoped lang='css'>
.tab-pane-style {
  width: 100%;
  height: 500px; /* 可根据需要调整这个高度 */
  overflow-y: auto; /* 超出部分显示滚动条 */
  overflow-x: hidden;
}
</style>