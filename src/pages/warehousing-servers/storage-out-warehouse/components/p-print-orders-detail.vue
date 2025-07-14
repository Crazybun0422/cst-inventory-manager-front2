<!--
* @description  参数1
* @fileName  p-print-orders-detail
* @author wjp
* @date 2024-07-09 22:48:21
!-->
<template>
  <div id="p-print-orders-detail" class="p-print-orders-detail">
    <el-drawer
      :title="$t('message.orderInfo.printOrderDetails')"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="60%"
      @close="onCloseDrawer"
      class="global-drawer-class"
    >
      <!-- <CstFormCard title="用户信息" class="mb-24">
        <el-descriptions :column="2" size="medium">
          <el-descriptions-item label="仓储">
            {{ storageMap[currentData.storage_uuid] }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.warehousingType')">
            {{ warehousingTypeMap[currentData.entry_type] }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.warehousingClassification')">
            {{ entryCategoryListMap[currentData.entry_category] }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.packingType')">{{
            packingTypeListMap[currentData.packing_type]
          }}</el-descriptions-item>
          <el-descriptions-item  :label="$t('message.storage.deliveryAndTransportationMethod')">
            {{ deliveryMethodListMap[currentData.delivery_method] }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.waybillNumber')"
            >{{ currentData.shipment_number }}
          </el-descriptions-item>
        </el-descriptions>
      </CstFormCard> -->
      <!-- <CstFormCard :title="$t('message.storage.product')" class="mb-24">
        <el-table
          :data="currentData.product_info"
          style="width: 100%"
          max-height="250"
        >
          <el-table-column prop="box_number" :label="$t('message.storage.caseNumber')" width="180">
          </el-table-column>
          <el-table-column
            prop="product_detail.sku"
            :label="$t('message.productManagement.productCode')"
            width="180"
          >
          </el-table-column>
          <template v-if="currentLanguage == 'zh_cn'">
            <el-table-column
              prop="product_detail.chinese_name"
              :label="$t('message.productManagement.chineseName')"
            >
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column
              prop="product_detail.english_name"
              :label="$t('message.productManagement.englishName')"
            >
            </el-table-column>
          </template>
          <el-table-column
            prop="product_detail.barcode"
            :label="$t('message.productManagement.productBarcode')"
            width="180"
          >
          </el-table-column>
          <el-table-column prop="quantity"  :label="$t('message.productManagement.quantity')"> </el-table-column>
          <el-table-column prop="product_detail.product_unit" label="单位">
            <template slot-scope="scope">
              {{
                productUnitMap[scope.row.product_detail.product_unit]
                  ? productUnitMap[scope.row.product_detail.product_unit][
                      $languageType
                    ]
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column prop="shipment_number" :label="$t('message.storage.waybillNumber')">
          </el-table-column>
        </el-table>
      </CstFormCard> -->
    </el-drawer>
  </div>
</template>

<script>
import CstFormCard from '@/components/cst-form-card/index.vue'
export default {
  name: 'p-print-orders-detail',
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: {} },
    storageMap: { type: Object, default: {} }
  },
  components: { CstFormCard },
  data () {
    return {
      drawerVisible: false,
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