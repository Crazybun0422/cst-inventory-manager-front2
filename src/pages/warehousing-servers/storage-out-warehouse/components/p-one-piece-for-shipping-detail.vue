<!--
* @description  参数1
* @fileName  p-one-piece-for-shipping-detail
* @author wjp
* @date 2024-07-09 22:48:21
!-->
<template>
  <div
    id="p-one-piece-for-shipping-detail"
    class="p-one-piece-for-shipping-detail"
  >
    <el-drawer
      :title="$t('message.storage.detailsOfOnePieceForShipping')"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="60%"
      @close="onCloseDrawer"
      class="global-drawer-class"
    >
      <CstFormCard :title="$t('common.basicInformation')" class="mb-24">
        <el-descriptions :column="3" size="medium" border>
          <el-descriptions-item
            :span="2"
            :label="$t('message.myAccount.warehousingName')"
          >
            {{ storageMap[currentData.storage_uuid] }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.userCode')">
            {{ currentData.customer_id }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('common.status')">
            <el-tag
              size="small"
              :type="onePiceForShippingStatusColorMap[currentData.status]"
              class="status-tag"
              >{{
                onePiceForShippingStatusNameMap[currentData.status]
                  ? onePiceForShippingStatusNameMap[currentData.status][
                      $languageType
                    ]
                  : '-'
              }}</el-tag
            >
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.orderNumber')">
            {{ currentData.order_id ? currentData.order_id : '-' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.referenceNo')">
            {{ currentData.cs_reference ? currentData.cs_reference : '-' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.dropShippingId')">
            {{
              currentData.drop_shipping_id ? currentData.drop_shipping_id : '-'
            }}
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
import { onePiceForShippingStatusColorMap, onePiceForShippingStatusMap } from '@/common/field-maping'
export default {
  name: 'p-one-piece-for-shipping-detail',
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: {} },
    storageMap: { type: Object, default: {} }
  },
  components: { CstFormCard, ProductTable, ShippingTable, RecipientInfo },
  data () {
    return {
      drawerVisible: false,
      onePiceForShippingStatusColorMap, onePiceForShippingStatusMap
    }
  },
  methods: {
    onCloseDrawer () {
      this.drawerVisible = false
      this.$emit('close')
    },
  },
  computed: {

    onePiceForShippingStatusNameMap () {
      const statusMap = this.onePiceForShippingStatusMap.reduce((map, item) => {
        map[item.value] = item.label;
        return map;
      }, {});
      return statusMap
    }
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