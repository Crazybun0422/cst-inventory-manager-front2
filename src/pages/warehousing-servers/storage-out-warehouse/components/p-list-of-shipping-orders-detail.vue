<!--
* @description  发货单列表详情
* @fileName  p-list-of-shipping-orders-detail-detail
* @author wjp
* @date 2024-07-09 22:48:21
!-->
<template>
  <div
    id="p-list-of-shipping-orders-detail-detail"
    class="p-list-of-shipping-orders-detail-detail"
  >
    <el-drawer
      :title="$t('message.storage.deliveryNoteDetails')"
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

          <el-descriptions-item
            :label="$t('message.storage.shippingOrderStatus')"
          >
            <el-tag
              :type="deliveryOrderStatusColorMap[currentData.delivery_status]"
              effect="plain"
              class="status-tag"
            >
              {{
                deliveryOrderStatusMap.find(
                  (item) => item.value === currentData.delivery_status
                )?.label[$languageType] || ''
              }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.userCode')">
            {{ currentData.user_code }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.orderNumber')">
            {{ currentData.order_id ? currentData.order_id : '-' }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.storage.shippingOrderNumber')"
          >
            {{
              currentData.delivery_list_number
                ? currentData.delivery_list_number
                : '-'
            }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.waybillNumber')">
            {{
              currentData.wave_order_number
                ? currentData.wave_order_number
                : '-'
            }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.myAccount.recipient')">
            {{ currentData.recipient_name ? currentData.recipient_name : '-' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.orderInfo.phoneLabel')">
            {{
              currentData.recipient_phone ? currentData.recipient_phone : '-'
            }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('common.country')">
            {{ currentData.country ? currentData.country : '-' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('common.stateProvince')">
            {{ currentData.state ? currentData.state : '-' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.orderInfo.cityLabel')">
            {{ currentData.city ? currentData.city : '-' }}
          </el-descriptions-item>

          <el-descriptions-item :label="$t('common.address')">
            {{ currentData.address_1 ? currentData.address_1 : '-' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('common.zipCode')">
            {{ currentData.zip_code ? currentData.zip_code : '-' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('common.createTime')">
            {{ currentData.create_time ? currentData.create_time : '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </CstFormCard>
      <CstFormCard :title="$t('common.distributionInformation')" class="mb-24">
        <el-table :data="currentData.distribution" style="width: 100%">
          <el-table-column
            prop="barcode"
            :label="$t('message.productInfo.barcode')"
          ></el-table-column>
          <el-table-column
            prop="count"
            :label="$t('message.orderInfo.quantityLabel')"
          ></el-table-column>
          <el-table-column
            prop="location_number"
            :label="$t('message.myAccount.cargoLocation')"
          ></el-table-column>
          <el-table-column
            prop="section_name"
            :label="$t('message.myAccount.partition')"
          ></el-table-column>
          <el-table-column
            prop="shelf_name"
            :label="$t('message.myAccount.shelves')"
          ></el-table-column>
          <el-table-column
            prop="sum_picking_order"
            :label="$t('message.storage.pickingOrderNumber')"
          ></el-table-column>
        </el-table>
      </CstFormCard>
      <CstFormCard
        :title="$t('message.orderManagement.logisticsInformation')"
        class="mb-24"
      >
        <ShippingTable :shipping_info="[currentData.shipping_contents]" />
      </CstFormCard>
      <CstFormCard
        :title="$t('message.orderInfo.logisticsDetails')"
        class="mb-24"
      >
        <el-descriptions :column="3" size="medium" border>
          <el-descriptions-item :label="$t('message.storage.orderNumber')">
            {{
              currentData.shipping_details?.order_id
                ? currentData.shipping_details?.order_id
                : '-'
            }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.orderManagement.logisticsCompany')"
          >
            {{ currentData.shipping_details?.shipping_company }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.orderInfo.logisticsCosts')">
            {{ currentData.shipping_details?.shipping_fee }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.orderManagement.packageWeight')"
          >
            {{ currentData.shipping_details?.package_info?.package_weight }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.orderManagement.packageLength')"
          >
            {{ currentData.shipping_details?.package_info?.package_length }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.orderManagement.packageWidth')"
          >
            {{ currentData.shipping_details?.package_info?.package_width }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.orderManagement.packageHeight')"
          >
            {{ currentData.shipping_details?.package_info?.package_height }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.productManagement.logisticsTime')"
            :span="2"
          >
            {{ currentData.shipping_details?.shipping_time }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.productManagement.logisticsRemarks')"
            :span="3"
          >
            {{ currentData.shipping_details?.shipping_remark }}
          </el-descriptions-item>
        </el-descriptions>
        <el-table
          :data="currentData.shipping_details?.shipping_content"
          style="width: 100%; margin-top: 10px"
        >
          <el-table-column
            v-if="$languageType == 'zh_cn'"
            :label="$t('message.productManagement.chineseName')"
            show-overflow-tooltip
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sub_chinese_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :label="$t('message.productManagement.englishName')"
            show-overflow-tooltip
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sub_english_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="barcode"
            :label="$t('message.productInfo.barcode')"
          ></el-table-column>
          <el-table-column
            prop="sku"
            :label="$t('message.productManagement.productSku')"
          ></el-table-column>
          <el-table-column
            prop="quantity"
            :label="$t('message.storage.productQuantity')"
          ></el-table-column>
          <el-table-column :label="$t('message.productInfo.price')">
            <template slot-scope="scope">
              {{ currencySymbolMap[scope.row.unit] }}{{ scope.row.price }}
            </template>
          </el-table-column>
        </el-table>
      </CstFormCard>
    </el-drawer>
  </div>
</template>

<script>
import CstFormCard from '@/components/cst-form-card/index.vue'
import ShippingTable from '@/pages/components/warehousing-servers/shipping-table.vue'
import {
  deliveryOrderStatusMap,
  deliveryOrderStatusColorMap, currencySymbolMap
} from '@/common/field-maping'
export default {
  name: 'p-list-of-shipping-orders-detail-detail',
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: {} },
    storageMap: { type: Object, default: {} }
  },
  components: { CstFormCard, ShippingTable },
  data () {
    return {
      drawerVisible: false,
      currencySymbolMap,
      deliveryOrderStatusMap,
      deliveryOrderStatusColorMap
    }
  },
  methods: {
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