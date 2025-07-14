<!--
* @Description: 产品详情
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div>
    <el-drawer
      :title="$t('message.storage.warehousingDetails')"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="60%"
      @close="onCloseDrawer"
      class="global-drawer-class"
    >
      <CstFormCard :title="$t('common.basicInformation')" class="mb-24">
        <el-descriptions :column="2" size="medium">
          <el-descriptions-item :label="$t('message.storage.warehouse')">
            {{ storageMap[currentData.storage_uuid] }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.warehousingType')">
            {{ warehousingTypeMap[currentData.entry_type] }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.storage.warehousingClassification')"
          >
            {{ entryCategoryListMap[currentData.entry_category] }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.packingType')">{{
            packingTypeListMap[currentData.packing_type]
          }}</el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.storage.deliveryAndTransportationMethod')"
          >
            {{ deliveryMethodListMap[currentData.delivery_method] }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.storage.waybillNumber')"
            >{{ currentData.shipment_number }}
          </el-descriptions-item>
        </el-descriptions>
      </CstFormCard>
      <CstFormCard
        :title="$t('message.productManagement.product')"
        class="mb-24"
      >
        <el-table
          :data="currentData.product_info"
          style="width: 100%"
          max-height="250"
        >
          <el-table-column
            prop="box_number"
            :label="$t('message.storage.caseNumber')"
            width="180"
          >
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
            productBarcode
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="quantity"
            :label="$t('message.productManagement.quantity')"
          >
          </el-table-column>
          <el-table-column
            prop="product_detail.product_unit"
            :label="$t('message.productManagement.unit')"
          >
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
          <el-table-column
            prop="shipment_number"
            sortable
            :label="$t('message.storage.waybillNumber')"
          >
          </el-table-column>
        </el-table>
      </CstFormCard>
      <CstFormCard
        :title="$t('message.storage.deliveryInformation')"
        class="mb-24"
      >
        <el-table
          :data="currentData?.received_result"
          style="width: 100%"
          max-height="250"
        >
          <el-table-column :label="$t('common.createTime')">
            <template slot-scope="scope">
              {{ formatTimestamp(scope.row?.create_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="landed_quantity"
            :label="$t('message.storage.quantityOfGoodsReceived')"
          >
          </el-table-column>
          <el-table-column
            prop="landed_num_of_boxes"
            :label="$t('message.storage.numberOfBoxesReceived')"
          >
          </el-table-column>
          <el-table-column
            prop="sum_weight"
            :label="$t('message.storage.grossWeight')"
          >
          </el-table-column>
          <el-table-column
            prop="sum_cmb"
            :label="$t('message.storage.totalCapacity')"
          >
          </el-table-column>
          <el-table-column :label="$t('message.storage.unloadingUnit')">
            <template slot-scope="scope">
              {{
                productUnitMap[scope.row.unit]
                  ? productUnitMap[scope.row.unit][$languageType]
                  : ''
              }}
            </template>
          </el-table-column>
        </el-table>
      </CstFormCard>
      <CstFormCard
        :title="$t('message.storage.qualityInspectionListingInformation')"
        class="mb-24"
      >
        <el-table
          :data="currentData.product_info"
          style="width: 100%"
          max-height="250"
        >
          <el-table-column
            prop="box_number"
            :label="$t('message.storage.caseNumber')"
          >
          </el-table-column>
          <el-table-column
            prop="product_detail.sku"
            :label="$t('message.productManagement.productCode')"
            :min-width="120"
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
          >
          </el-table-column>
          <el-table-column :label="$t('message.productManagement.unit')">
            <template slot-scope="scope">
              {{
                productUnitMap[scope.row.unit]
                  ? productUnitMap[scope.row.unit][currentLanguage]
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="quantity"
            :label="$t('message.storage.totalNumberOfAppointments')"
          >
          </el-table-column>
          <el-table-column :label="$t('message.storage.pendingListing')">
            <template slot-scope="scope">
              {{
                scope.row.quantity -
                (scope.row.putaway ? computePutawayTotal(scope.row.putaway) : 0)
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('message.storage.qualifiedQuantity')">
            <template slot-scope="scope">
              {{ qualifiedQuantityTotal(scope.row.quality_check) }}
              <!-- {{
              scope.row.quality_check[scope.row?.product_detail?.barcode]
                ?.qualified_quantity
            }} -->
            </template>
          </el-table-column>
          <el-table-column :label="$t('message.storage.unqualifiedQuantity')">
            <template slot-scope="scope">
              {{ unqualifiedQuantityTotal(scope.row.quality_check) }}
              <!-- {{
              scope.row.quality_check[scope.row?.product_detail?.barcode]
                ?.unqualified_quantity
            }} -->
            </template>
          </el-table-column>
          <el-table-column :label="$t('message.storage.putawayNumber')">
            <template slot-scope="scope">
              {{
                scope.row && scope.row.putaway
                  ? computePutawayTotal(scope.row.putaway)
                  : 0
              }}
            </template>
          </el-table-column>
        </el-table>
      </CstFormCard>
    </el-drawer>
  </div>
</template>
<script>
import CstFormCard from '@/components/cst-form-card/index.vue'
import { getLanguage } from '@/common/language'
import { formatTimestamp, qualifiedQuantityTotal, unqualifiedQuantityTotal } from '@/common/common-func'
import { provider } from '@/common/commonconfig'
import { productUnitMap } from '@/common/field-maping'
import { warehousingTypeList, unitOptions, entryCategoryList, packingTypeList, deliveryMethodList } from "@/common/field-maping"
export default {
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: {} },
    storageMap: { type: Object, default: {} }
  },
  components: { CstFormCard },
  data () {
    return {
      provider,
      productUnitMap,
      currentLanguage: "en_us",
      warehousingTypeList: warehousingTypeList,
      storageList: [],
      deliveryMethodList: deliveryMethodList,
      packingTypeList: packingTypeList,
      entryCategoryList: entryCategoryList,
      unitOptions: unitOptions,
      drawerVisible: false,
    }
  },
  mounted () {
    this.currentLanguage = getLanguage()
  },
  methods: {
    formatTimestamp,
    qualifiedQuantityTotal,
    unqualifiedQuantityTotal,
    computePutawayTotal (putaway) {
      let total = 0;
      if (Array.isArray(putaway)) {
        putaway.forEach(element => {
          total += element.number || 0;  // 确保 number 是有效数字，如果不是则用0替代
        });
      }
      return total;
    },

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
    },

  },
  computed: {

    warehousingTypeMap () {
      let mapData = {}
      this.warehousingTypeList.forEach(element => {
        mapData[element.value] = element.label[this.$languageType]
      });
      return mapData
    },
    unitOptionsMap () {
      let mapData = {}
      this.unitOptions.forEach(element => {
        mapData[element.value] = element.label[this.$languageType]
      });
      return mapData
    },
    entryCategoryListMap () {
      let mapData = {}
      this.entryCategoryList.forEach(element => {
        mapData[element.value] = element.label[this.$languageType]
      });
      return mapData
    },
    packingTypeListMap () {
      let mapData = {}
      this.packingTypeList.forEach(element => {
        mapData[element.value] = element.label[this.$languageType]
      });
      return mapData
    },
    deliveryMethodListMap () {
      let mapData = {}
      this.deliveryMethodList.forEach(element => {
        mapData[element.value] = element.label[this.$languageType]
      });
      return mapData
    },
    putawayTotal () {
      let total = 0
      this.currentData.product_info.forEach(element => {
        total += element.quality_check.qualified_quantity
      })
      return total
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
