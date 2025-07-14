<!--
* @description  运单打印
* @fileName  p-printing-the-waybill
* @author wjp
* @date 2024-07-04 22:20:30
!-->
<template>
  <div id="p-printing-the-waybill" class="p-printing-the-waybill">
    <el-row :gutter="24">
      <el-col :span="12">
        <el-card class="full-height" shadow="hover">
          <div slot="header">
            <span>{{ $t('common.print') }}</span>
          </div>
          <el-form
            :model="printingTheWaybillForm"
            ref="printingTheWaybillForm"
            label-width="100px"
            :inline="true"
          >
            <el-form-item
              :label="$t('message.storage.systemOrderNumber')"
              prop="wave_number"
            >
              <el-input
                v-model="printingTheWaybillForm.system_number"
                :placeholder="$t('message.storage.pleaseEnterSystemNumber')"
                class="form-width"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="complete">{{
                $t('common.complete')
              }}</el-button>
              <el-button type="primary" @click="resetQuery">
                {{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="info-card" shadow="hover">
          <div slot="header">
            <span>{{ $t('common.setting') }}</span>
            <el-button
              type="text"
              @click="downloadMAssistant"
              style="float: right; padding: 3px 0"
              >{{
                $t('message.storage.downloadMCloudPrintingAssistant')
              }}</el-button
            >
          </div>
          <el-row :gutter="24">
            <el-form
              :model="toReviewSetingForm"
              ref="toReviewSetingForm"
              label-width="100px"
            >
              <el-form-item>
                <el-checkbox
                  v-model="toReviewSetingForm.printOrder"
                  @change="isPrintOrder"
                  >是否打印面单</el-checkbox
                >
              </el-form-item>
              <el-form-item>
                <el-checkbox
                  v-model="toReviewSetingForm.checked"
                  @change="isSend"
                  >是否发送M云打印助理</el-checkbox
                >
              </el-form-item>
              <el-form-item>
                <el-checkbox
                  v-model="toReviewSetingForm.intercept"
                  @change="isIntercept"
                  >是否开启截取</el-checkbox
                ></el-form-item
              >
              <div v-show="toReviewSetingForm.intercept">
                <el-form-item label="有效开始位">
                  <el-input-number
                    v-model="toReviewSetingForm.start"
                    placeholder="请输入有效开始位"
                    :min="0"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="有效长度">
                  <el-input-number
                    v-model="toReviewSetingForm.length"
                    placeholder="请输入有效开始位"
                    :min="0"
                  ></el-input-number>
                </el-form-item>
              </div>
              <el-form-item>
                <el-checkbox
                  v-model="toReviewSetingForm.serviceProvider"
                  @change="isServiceProvider"
                  >是否直接打印服务商</el-checkbox
                >
              </el-form-item>
            </el-form>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import { secondSortingOrderStatusMap } from '@/common/field-maping'
export default {
  name: 'p-printing-the-waybill',
  props: {
  },
  components: {
    PageHead,
    SearchCard,
    CstTableHead
  },
  data () {
    return {
      checked: false,
      printingTheWaybillForm: {
        system_number: '',
        product_barcode: ''
      },
      secondSortingOrderStatusMap,
      tableData: [
        {
          shipping_order_number: '123456',
          system_number: '123456',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '123456',
          quantity_scanned: '123456',
          status: 1
        }
      ],
      queryData: {
        page_number: 1,
        page_size: 10
      },
      total: 1,
      toReviewSetingForm: {
        printOrder: false,
        checked: false,
        intercept: false,
        refresh: false,
        start: '',
        length: '',
      }
    }
  },
  methods: {
    isIntercept (val) {
      this.toReviewSetingForm.intercept = val;
    },
    isPrintOrder (val) {
      this.toReviewSetingForm.printOrder = val;
    },

    downloadMAssistant () {
    },
    isSend (val) {
      this.toReviewSetingForm.checked = val;
    },
    isServiceProvider (val) {
      this.toReviewSetingForm.serviceProvider = val;
    },
    resetQuery () {
      // 重置表单
      this.$refs.printingTheWaybillForm.resetFields();

    },
    complete () {

    },
    handleSizeChange (val) {
      this.queryData.page_size = val
    },
    handleCurrentChange (val) {
      this.queryData.page_number = val
    },
  },
  computed: {

  },
  mounted () {

  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
::v-deep .el-table .full-height {
  height: calc(100%);
}
</style>