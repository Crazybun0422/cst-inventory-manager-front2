<!--
* @description  参数1
* @fileName  shipping-table
* @author wjp
* @date 2024-08-18 17:30:42
!-->
<template>
  <div id="shipping-table" class="shipping-table">
    <el-table
      :data="shippingTableData"
      style="width: 100%"
      border
      size="small"
      :span-method="rowSpanMethod"
      :row-class-name="tableRowClassName"
      @cell-mouse-leave="cellMouseLeave"
      @cell-mouse-enter="cellMouseEnter"
    >
      <el-table-column :label="$t('message.orderManagement.logisticsCompany')">
        <template slot-scope="scope">
          <!-- <span>{{ logisticsCompanyMap[scope.row.shipping_company] }}</span> -->
          <span>{{ scope.row.shipping_company }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sku"
        :label="$t('message.productManagement.productSku')"
      >
      </el-table-column>
      <el-table-column
        prop="quantity"
        :label="$t('message.storage.productQuantity')"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="tracking_number"
        :label="$t('message.productManagement.logisticsNumber')"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            style="display: block; target: _blank"
            @click="toShippingDetail(scope.row.tracking_number)"
          >
            {{ scope.row.tracking_number }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showPackageInfo"
        prop="shipping_fee"
        :label="$t('message.orderInfo.logisticsCosts')"
        width="70"
      >
      </el-table-column>
      <el-table-column
        v-if="showPackageInfo"
        prop="package_info.package_weight"
        :label="$t('message.orderManagement.packageWeight')"
        width="100"
      >
      </el-table-column>
      <el-table-column
        :label="$t('message.orderManagement.packageVolume')"
        width="160"
        v-if="showPackageInfo"
      >
        <template slot-scope="scope">
          <span
            >{{ scope.row?.package_info?.package_length }}*{{
              scope.row?.package_info?.package_width
            }}*{{ scope.row?.package_info?.package_height }}</span
          >
        </template>
      </el-table-column>

      <el-table-column
        prop="tracking_pdf"
        :label="$t('message.orderManagement.logisticsInformation')"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-link :href="scope.row.tracking_pdf" target="_blank">{{
            scope.row.tracking_pdf
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="shipping_time"
        :label="$t('message.productManagement.logisticsTime')"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="shipping_remark"
        :label="$t('message.orderManagement.notes')"
        show-overflow-tooltip
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import utils from '@/utils/index'
export default {
  name: 'shipping-table',
  props: {
    shipping_info: { type: Array, default: () => [] },
    logistics_channels: { type: Array, default: () => [] },
    logisticsCompanyMap: { type: Object, default: () => { } }
  },
  components: {},
  data () {
    return {
      shippingTableData: [],
      curRowArr: []
    }
  },
  methods: {
    initShippingTableData (arr) {
      const resultData = []
      if (!arr || arr.length === 0) {
        this.shippingTableData = []
        return
      }
      arr.forEach((el) => {
        el.shipping_content.forEach((content, index) => {
          // 将tracking_number相同的行合并
          if (index === 0) {
            content.rowspan = el.shipping_content.length
          } else {
            content.rowspan = 0
          }
          resultData.push({ ...el, ...content })
        })
      })
      this.shippingTableData = resultData
    },

    rowSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (column.property !== 'sku' && column.property !== 'quantity') {
        return { rowspan: row.rowspan, colspan: 1 }
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      // 获取当前的高亮行索引数组
      let temArr = this.curRowArr.findIndex(
        (el) => el.shipping_company === row.shipping_company
      )
      if (temArr >= 0) {
        return 'high-row-class'
      }
    },
    // 鼠标移入单元格时触发的方法
    cellMouseEnter (row, column, cell, event) {
      this.curRowArr = [row]
    },

    // 鼠标移出单元格时触发的方法
    cellMouseLeave (row, column, cell, event) {
      this.curRowArr = []
    }
  },
  computed: {
    showPackageInfo () {
      return this.shippingTableData.some(
        (item) =>
          item.package_info &&
          item.package_info.package_length != null &&
          item.package_info.package_width != null &&
          item.package_info.package_height != null
      )
    }
  },
  mounted () {
    this.initShippingTableData(utils.deepClone(this.shipping_info))
  },
  watch: {}
}
</script>
<style scoped lang="scss">
::v-deep .high-row-class {
  background: #f5f7fa;
}
</style>
