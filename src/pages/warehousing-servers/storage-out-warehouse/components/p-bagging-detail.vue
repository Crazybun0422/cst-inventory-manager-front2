<!--
* @description  参数1
* @fileName  p-bagging-detail
* @author wjp
* @date 2024-07-09 22:48:21
!-->
<template>
  <div id="p-bagging-detail" class="p-bagging-detail">
    <el-dialog
      :title="$t('common.check')"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
    >
      <CstTableHead>
        <template slot="top-left">
          <el-button
            icon="el-icon-close"
            @click="cancelBagging"
            type="primary"
            plain
            >{{ $t('message.storage.cancelBagging') }}</el-button
          >
          <el-button
            icon="el-icon-download"
            @click="exportInfo"
            type="primary"
            plain
            >{{ $t('common.export') }}</el-button
          ></template
        >
      </CstTableHead>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="530px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="system_order_number"
          :label="$t('message.storage.systemOrderNumber')"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="waybill_number"
          :label="$t('message.storage.waybillNumber')"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="transfer_order_number"
          :label="$t('message.storage.transferOrderNumber')"
          width="160"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          :label="$t('message.myAccount.clientId')"
          prop="customer_id"
          sortable
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="logistics_channels"
          :label="$t('message.myAccount.logisticsChannels')"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="recipient_name"
          :label="$t('message.myAccount.recipient')"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="recipient_country"
          :label="$t('common.recipientCountry')"
          width="130"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="receipt_time"
          :label="$t('message.storage.receiptTime')"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="queryData.page_number"
          :page-sizes="[10, 50, 100]"
          :page-size="queryData.page_size"
          layout="total,sizes, prev, pager, next"
          :total="total"
          background
        >
        </el-pagination>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import CstTableHead from '@/components/cst-table-head/index.vue'
export default {
  name: 'p-bagging-detail',
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: {} },
    storageMap: { type: Object, default: {} }
  },
  components: { CstTableHead },
  data () {
    return {
      dialogVisible: false,
      tableData: [
        {
          system_order_number: '202107090001',
          waybill_number: '202107090001',
          transfer_order_number: '202107090001',
          customer_id: '1111111',
          logistics_channels: '11111111',
          recipient_name: '圣埃蒂安',
          recipient_country: '中国',
          receipt_time: '2021 07-09 00:01'
        },
        {
          system_order_number: '202107090002',
          waybill_number: '202107090002',
          transfer_order_number: '202107090002',
          customer_id: '202107090002',
          logistics_channels: '202107090002',
          recipient_name: '圣埃蒂安',
          recipient_country: '中国',
          receipt_time: '2021 07-09 00:01'
        }
      ],
      multipleSelection: [],
      queryData: {
        page_number: 1,
        page_size: 10
      },
      total: 2
    }
  },
  methods: {
    handleClose () {
      this.dialogVisible = false
      this.$emit('close')
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    cancelBagging () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(
          this.$t('common.selectSubmitData')
        )
        return
      }
      this.$message.success(this.$t('common.operationSuccessful'))
    },
    exportInfo () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(
          this.$t('common.selectSubmitData')
        )
        return
      }
      this.$message.success('导出成功')
    },
    async handleSizeChange (val) {
      this.queryData.page_size = val
      await this.getOrderList()
    },
    async handleCurrentChange (val) {
      this.queryData.page_number = val
      await this.getOrderList()
    },
  },
  computed: {

  },
  mounted () {

  },
  watch: {
    visible: {
      handler (newValue) {
        this.dialogVisible = newValue
      },
      immediate: true
    },
  }
}
</script>
<style scoped lang='css'>
</style>