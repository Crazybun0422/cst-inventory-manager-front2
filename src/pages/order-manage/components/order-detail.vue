<!--
* @Description: 订单详情
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div>
    <el-drawer
      :title="$t('message.orderInfo.orderDetails')"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="60%"
      @close="onCloseDrawer"
      class="global-drawer-class"
    >
      <CstFormCard
        :title="$t('message.storage.deliveryInformation')"
        class="mb-24"
      >
        <el-descriptions :column="2" size="medium" border>
          <el-descriptions-item
            :label="$t('message.orderManagement.orderType')"
          >
            {{ orderTypeMap[currentData.order_type]?.[$languageType] || '' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('common.status')">
            <el-tag
              :type="orderStatusMarkColorMap[currentData.order_status]"
              effect="plain"
              class="status-tag"
            >
              {{
                StockEntryStatusMap[currentData.order_status]?.[
                  $languageType
                ] || ''
              }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.orderManagement.consignee')"
          >
            {{ currentData.recipient_name }}
          </el-descriptions-item>

          <el-descriptions-item :label="$t('message.orderInfo.phoneLabel')">
            {{ currentData.recipient_phone }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.orderInfo.countryLabel')">
            {{ currentData.country }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('common.mobilePhone')">
            {{ currentData.recipient_mobile }}
          </el-descriptions-item>

          <el-descriptions-item :label="$t('common.stateProvince')">
            {{ currentData.state }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('common.city')">
            {{ currentData.city }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('common.area')">
            {{ currentData.area }}
          </el-descriptions-item>
          <!-- </el-descriptions> -->
          <!-- <el-descriptions :column="1" size="medium" border> -->
          <el-descriptions-item :label="$t('common.transportCode')">
            {{ currentData.shipping_code }}
          </el-descriptions-item>

          <el-descriptions-item
            :label="$t('message.orderManagement.address') + '1'"
          >
            {{ currentData.address_1 }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.orderManagement.address') + '2'"
          >
            {{ currentData.address_2 }}
          </el-descriptions-item>
          <!-- </el-descriptions> -->

          <!-- <el-descriptions :column="2" size="medium" border> -->
          <el-descriptions-item
            :label="$t('message.orderManagement.roomNumber')"
          >
            {{ currentData.house_number }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('common.zipCode')">
            {{ currentData.zip_code }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.orderManagement.nameOfReceivingCompany')"
          >
            {{ currentData.company_name }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.orderInfo.emailLabel')">
            {{ currentData.recipient_email }}
          </el-descriptions-item>

          <el-descriptions-item :label="$t('message.orderManagement.notes')">
            {{ currentData.customer_remark }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.orderManagement.cashOnDeliveryType')"
          >
            {{ currentData.cod_type }}
          </el-descriptions-item>

          <el-descriptions-item
            :label="$t('message.orderManagement.cashOnDeliveryAmount')"
          >
            {{ currentData.cod_amount }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.orderManagement.iossNumber')"
          >
            {{ currentData.ioss_number }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.orderManagement.vatNo')">
            {{ currentData.vat_number }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.orderManagement.idNo')">
            {{ currentData.id_card }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.orderManagement.csReferenceNumber')"
          >
            {{ currentData.cs_reference }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.orderManagement.warehouse')"
          >
            {{ storageMap[currentData.storage_uuid] }}
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
        <ShippingTable
          :key="currentData.order_id"
          :shipping_info="currentData.shipping_statuses"
          :logistics_channels="logistics_channels"
          :logisticsCompanyMap="logisticsCompanyMap"
        />
      </CstFormCard>
    </el-drawer>
  </div>
</template>
<script>

import CstFormCard from '@/components/cst-form-card/index.vue'
import ProductTable from '@/pages/components/warehousing-servers/product-table.vue'
import ShippingTable from '@/pages/components/warehousing-servers/shipping-table.vue'
import { productCategoryMap, productUnitMap, productStatusMap } from '@/common/field-maping'
import { orderTypeMap, orderStatusMarkColorMap, StockEntryStatusMap } from '@/common/field-maping'


export default {
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: () => { } },
    storageMap: { type: Object, default: () => { } },
    logistics_channels: { type: Array, default: () => [] },
    logisticsCompanyMap: { type: Object, default: () => { } }
  },
  components: { CstFormCard, ProductTable, ShippingTable },
  data () {
    return {
      orderTypeMap, orderStatusMarkColorMap, StockEntryStatusMap,
      productCategoryMap: productCategoryMap,
      productUnitMap: productUnitMap,
      productStatusMap: productStatusMap,
      drawerVisible: false,

    }
  },
  mounted () { },
  methods: {
    onCloseDrawer () {
      this.drawerVisible = false
      this.$emit('close')
    }
  },
  watch: {
    visible: {
      handler (newValue) {
        this.drawerVisible = newValue

      },
      immediate: true
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
