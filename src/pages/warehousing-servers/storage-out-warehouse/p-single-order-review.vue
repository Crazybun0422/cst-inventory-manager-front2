<!--
* @description  参数1
* @fileName  p-single-order-review
* @author wjp
* @date 2024-07-04 22:12:58
!-->
<template>
  <div id="p-single-order-review" class="p-single-order-review">
    <el-row :gutter="24">
      <el-col :span="8">
        <el-row>
          <el-card class="full-height" shadow="hover">
            <div slot="header">
              <span>{{ $t('message.storage.sortingInformation') }}</span>
            </div>
            <el-form
              :model="singleOrderReviewForm"
              ref="singleOrderReviewForm"
              label-width="100px"
            >
              <el-form-item :label="$t('common.prompt')"> </el-form-item>
              <!-- <el-form-item label="波次单"> </el-form-item>
              <el-form-item label="单号"> </el-form-item> -->
              <el-form-item
                :label="$t('message.storage.waveNumber')"
                prop="wave_number"
              >
                <el-input
                  v-model="singleOrderReviewForm.wave_number"
                  :placeholder="$t('message.storage.waveOrderPlaceholder')"
                  class="form-width"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('message.storage.waveNumber')"
                prop="wave_number"
              >
                <el-input
                  v-model="singleOrderReviewForm.wave_number"
                  :placeholder="$t('message.storage.waveOrderPlaceholder')"
                  class="form-width"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('message.productManagement.productBarcode')"
                prop="product_barcode"
              >
                <el-input
                  v-model="singleOrderReviewForm.product_barcode"
                  :placeholder="
                    $t('message.productManagement.productBarcodePlaceholder')
                  "
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
        </el-row>
        <el-row>
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
              <el-checkbox v-model="checked" @change="isSend">{{
                $t('message.storage.doYouWantToSendMCloudPrintingAssistant')
              }}</el-checkbox>
            </el-row>
          </el-card>
        </el-row>
      </el-col>

      <el-col :span="16">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>{{ $t('message.orderInfo.orderInfo') }}</span>
            <el-button style="float: right; padding: 3px 0" type="text">{{
              $t('common.rescan')
            }}</el-button>
          </div>
          <el-table :data="tableData" style="width: 100%" highlight-current-row>
            <el-table-column
              prop="shipping_order_number"
              :label="$t('message.storage.shippingOrderNumber')"
              width="170"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="system_number"
              sortable
              :label="$t('message.storage.systemOrderNumber')"
              align="center"
              show-overflow-tooltip
              width="260"
            >
            </el-table-column>
            <el-table-column
              prop="tracking_number"
              :label="$t('message.storage.waybillNumber')"
            ></el-table-column>
            <el-table-column
              prop="product_barcode"
              :label="$t('message.productManagement.productBarcode')"
            ></el-table-column>
            <el-table-column
              prop="quantity"
              :label="$t('message.productManagement.quantity')"
            ></el-table-column>
            <el-table-column
              prop="quantity_scanned"
              :label="$t('message.storage.scannedquantity')"
            ></el-table-column>
            <el-table-column prop="status" :label="$t('common.status')">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status == 1 ? 'success' : 'danger'"
                  size="small"
                  class="status-tag"
                  >{{
                    secondSortingOrderStatusMap[scope.row.status]
                      ? secondSortingOrderStatusMap[scope.row.status][
                          $languageType
                        ]
                      : '-'
                  }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="shipping_order_number"
              :label="$t('message.storage.shippingOrderNumber')"
              width="170"
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
            </el-pagination
          ></el-row>
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
  name: 'p-single-order-review',
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
      singleOrderReviewForm: {
        quantity_scanned: '',
        wave_number: '',
        product_barcode: ''
      },
      secondSortingOrderStatusMap,
      tableData: [
        {
          shipping_order_number: '123',
          system_number: '123',
          tracking_number: '123',
          product_barcode: '123',
          quantity: '123',
          quantity_scanned: '123',
          status: 1,
        },
        {
          shipping_order_number: '123',
          system_number: '123',
          tracking_number: '123',
          product_barcode: '123',
          quantity: '123',
          quantity_scanned: '123',
          status: 0,
        }
      ],
      queryData: {
        page_number: 1,
        page_size: 10
      },
      total: 1
    }
  },
  methods: {
    downloadMAssistant () {
    },
    isSend (val) {
      this.checked = val;
    },
    resetQuery () {
      // 重置表单
      this.$refs.singleOrderReviewForm.resetFields();

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
.info-card {
  margin-top: 10px;
}
</style>