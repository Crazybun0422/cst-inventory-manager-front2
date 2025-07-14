<!--
* @description  参数1
* @fileName  p-shipping-notice-detail
* @author wjp
* @date 2024-07-09 22:48:21
!-->
<template>
  <div id="p-shipping-notice-detail" class="p-shipping-notice-detail">
    <el-drawer
      title="发货通知详情"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="60%"
      @close="onCloseDrawer"
      class="global-drawer-class"
    >
      <CstFormCard :title="$t('common.basicInformation')" class="mb-24">
        <el-descriptions :column="2" size="medium" border>
          <el-descriptions-item :label="$t('message.storage.dropShippingId')">
            {{ currentData.drop_shipping_id }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('common.status')"
            ><el-tag
              :type="onePiceForShippingStatusColorMap[currentData.status]"
              effect="plain"
              class="status-tag"
            >
              {{
                onePiceForShippingStatusMap.find(
                  (item) => item.value === currentData.status
                )?.label[$languageType]
              }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.myAccount.warehousingName')"
          >
            {{ storageMap[currentData.storage_uuid] }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.userCode')">
            {{ currentData.customer_id }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.orderNumber')">
            {{ currentData.order_id }}
          </el-descriptions-item>

          <el-descriptions-item :label="$t('message.storage.referenceNo')">
            {{ currentData.cs_reference }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.storage.transferOrderNumber')"
          >
            {{
              currentData.transfer_shipping_number
                ? currentData.transfer_shipping_number
                : '-'
            }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.waybillNumber')">
            {{ currentData.wave_number ? currentData.wave_number : '-' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('common.createTime')">
            {{ currentData.create_time ? currentData.create_time : '-' }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.storage.submissionDeterminationTime')"
          >
            {{ currentData.confirm_time ? currentData.confirm_time : '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </CstFormCard>
      <CstFormCard
        :title="$t('message.productManagement.productInfo')"
        class="mb-24"
      >
        <ProductTable :key="currentData.order_id" :currentData="currentData" />
      </CstFormCard>
      <CstFormCard
        :title="$t('message.orderManagement.logisticsInformation')"
        class="mb-24"
      >
        <ShippingTable :shipping_info="currentData.shipping_info" />
      </CstFormCard>
      <CstFormCard
        :title="$t('message.storage.deliveryInformation')"
        class="mb-24"
      >
        <RecipientInfo :recipient_info="currentData.recipient_info" />
      </CstFormCard>
    </el-drawer>
  </div>
</template>

<script>
import CstFormCard from '@/components/cst-form-card/index.vue'
import ProductTable from '@/pages/components/warehousing-servers/product-table.vue'
import ShippingTable from '@/pages/components/warehousing-servers/shipping-table.vue'
import RecipientInfo from '@/pages/components/warehousing-servers/recipient-info-descriptions.vue'
import { toShippingDetail } from '@/common/common-func'
import {
  onePiceForShippingStatusColorMap,
  onePiceForShippingStatusMap
} from '@/common/field-maping'
export default {
  name: 'p-shipping-notice-detail',
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: {} },
    storageMap: { type: Object, default: {} }
  },
  components: { CstFormCard, ProductTable, ShippingTable, RecipientInfo },
  data () {
    return {
      onePiceForShippingStatusColorMap,
      onePiceForShippingStatusMap,
      drawerVisible: false,
    }
  },
  methods: {
    toShippingDetail,
    onCloseDrawer () {
      this.drawerVisible = false
      this.$emit('close')
    },
  },
  computed: {

  },
  mounted () {

  },
  watch: {
    visible: {
      handler (newValue) {
        this.drawerVisible = newValue
      },
      immediate: true
    },
  }
}
</script>
<style scoped lang='css'>
</style>