<!--
* @description  参数1
* @fileName  p-order-product-info
* @author wjp
* @date 2024-06-09 22:19:50
!-->
<template>
  <div id="p-order-product-info" class="p-order-product-info">
    <el-table
      :data="tableData"
      style="width: 100%"
      height="450px"
      size="small"
      highlight-current-row
    >
      <el-table-column
        :label="$t('message.productManagement.productImage')"
        column-key="main_image_url"
        width="120"
      >
        <template slot-scope="scope">
          <AuthImg
            :src="scope.row.sub_image_url"
            :styleInfo="'width:50px;height:50px;'"
          ></AuthImg>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('message.productManagement.chineseName')"
        show-overflow-tooltip
        v-if="$languageType == 'zh_cn'"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.chinese_name + '-' + scope.row.sub_chinese_name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        :label="$t('message.productManagement.englishName')"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.english_name + '-' + scope.row.sub_english_name
          }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('message.productManagement.productCode')"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="
              copyData(
                scope.row.product_code_sku,
                $t('message.productManagement.productCode')
              )
            "
            >{{ scope.row.product_code_sku }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('message.productManagement.productBarcode')"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="
              copyData(
                scope.row.product_barcode,
                $t('message.productManagement.productBarcode')
              )
            "
            >{{ scope.row.product_barcode }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="quantity"
        :label="$t('message.productManagement.quantity')"
        width="120"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="price"
        :label="$t('message.productManagement.price')"
        width="120"
      >
        <template slot-scope="scope">
          {{
            scope.row.price
              ? currencySymbolMap[scope.row.unit] + scope.row.price
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="product_unit"
        :label="$t('message.productManagement.productUnit')"
        width="120"
      >
        <template slot-scope="scope">
          {{
            scope.row.product_unit
              ? productUnitMap[scope.row.product_unit][$languageType]
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        show-overflow-tooltip
        :label="
          $t('message.productManagement.qualityInspectionWeight') + '[KG]'
        "
      >
        <template slot-scope="scope">
          <p>{{ scope.row.quality_inspection_weight_kg }}</p>
        </template>
      </el-table-column>
      <el-table-column
        width="140"
        show-overflow-tooltip
        :label="$t('message.productManagement.origin')"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.origin }}</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { copyData } from '@/common/common-func'
import { productCategoryMap, productUnitMap, productStatusMap, fieldSelectMap, currencySymbolMap } from '@/common/field-maping'
import { initProductData } from '@/common/common-func'
import AuthImg from '@/components/auth-img.vue'
export default {
  name: 'p-order-product-info',
  props: {
    currentData: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    AuthImg
  },
  data () {
    return {
      currencySymbolMap: currencySymbolMap,
      productCategoryMap: productCategoryMap,
      productUnitMap: productUnitMap,
      productStatusMap: productStatusMap,
      fieldSelectMap: fieldSelectMap,

      tableData: [
        // {
        //   main_image_url: '1a6984ee-6865-4b4b-b86d-f4f71576481a.jpg',
        //   chinese_name: '中文名',
        //   english_name: '英文名',
        //   product_code_sku: '产品代码/SKU',
        //   product_barcode: '产品条码',
        //   product_quantity: '产品数量',
        //   price: '价格',
        //   product_unit: 1,
        //   quality_inspection_weight_kg: '质检重量',
        //   origin: '产地'
        // }

      ]
    }
  },
  methods: {
    copyData,
    initProductData,
    getProductInfo (products) {
      this.initProductData(products).then(resultArr => {
        this.tableData = resultArr;
      })
        .catch(error => {
          console.error(error);
        });
    }
  },
  computed: {
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },

  },
  mounted () {
    this.getProductInfo(this.currentData.products, this.roleType)
  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
</style>