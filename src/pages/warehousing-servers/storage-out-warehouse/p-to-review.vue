<!--
* @description  复核
* @fileName  p-to-review
* @author wjp
* @date 2024-07-04 22:14:25
!-->
<template>
  <div id="p-to-review" class="p-to-review">
    <el-row :gutter="24">
      <el-col :span="8">
        <el-row>
          <el-card class="full-height" shadow="hover">
            <div slot="header">
              <span>{{ $t('message.storage.sortingInformation') }}</span>
            </div>
            <el-form
              :model="toReviewForm"
              ref="toReviewForm"
              label-width="auto"
            >
              <el-form-item
                :label="$t('message.storage.waybillNumber')"
                prop="wave_number"
                ><el-row>
                  <el-col :span="12">
                    <el-input
                      v-model.trim="toReviewForm.tracking_number"
                      :placeholder="
                        $t('message.storage.waybillNumberPlaceholder')
                      "
                      class="form-width"
                    ></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-button
                      type="primary"
                      style="margin-left: 10px"
                      @click="queryWaybillNumber"
                    >
                      {{ $t('common.confirm') }}
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item
                :label="$t('message.productManagement.productBarcode')"
                prop="product_barcode"
              >
                <el-row>
                  <el-col :span="12">
                    <el-input
                      v-model="toReviewForm.product_barcode"
                      :placeholder="
                        $t(
                          'message.productManagement.productBarcodePlaceholder'
                        )
                      "
                      class="form-width"
                    ></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-button
                      type="primary"
                      @click="confirmProductBarcode"
                      style="margin-left: 10px"
                    >
                      {{ $t('common.confirm') }}
                    </el-button>
                  </el-col>
                </el-row>
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
      </el-col>

      <el-col :span="16">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>{{ $t('message.orderInfo.orderInfo') }}</span>
          </div>
          <el-table
            :data="tableData"
            style="width: 100%"
            highlight-current-row
            :max-height="500"
          >
            <el-table-column
              prop="name"
              :label="$t('message.storage.name')"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="order_id"
              sortable
              :label="$t('message.storage.orderNumber')"
              width="160"
              show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
              prop="tracking_number"
              sortable
              :label="$t('message.storage.waybillNumber')"
            ></el-table-column>
            <el-table-column
              prop="barcode"
              :label="$t('message.productManagement.productBarcode')"
            ></el-table-column>
            <el-table-column
              prop="quantity"
              :label="$t('message.storage.totalQuantity')"
            ></el-table-column>
            <el-table-column
              prop="scanned"
              :label="$t('message.storage.scannedQuantity')"
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
          </el-table>
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
  name: 'p-to-review',
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
      toReviewForm: {
        tracking_number: '',
        product_barcode: ''
      },
      secondSortingOrderStatusMap,
      tableData: [],
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
    queryWaybillNumber () {
      if (this.toReviewForm.tracking_number === '') {
        this.$message.error(this.$t("message.storage.waybillNumberPlaceholder"));
        return;
      }
      this.$ajax({
        method: 'get',
        url: '/api-prefix/api/delivery_list/tracking-number-scanning-start',
        roleType: this.roleType,
        params: {
          tracking_number: this.toReviewForm.tracking_number
        }
      }).then(res => {
        this.tableData = res.data;
        if (this.tableData.length === 0) {
          this.$message.error('该运单号没有数据');
        }
      });
    },
    confirmProductBarcode () {
      // 确认产品条码 我认为应该有接口用于确认和查询
      const barcode = this.toReviewForm.product_barcode;
      if (!barcode) {
        this.$message.error(this.$t("message.productManagement.productBarcodePlaceholder"));
        return;
      }
      const product = this.tableData.find(product => product.barcode === barcode);
      if (!product) {
        this.$message.error('产品条码不存在');
        return;
      }
      if (product.scanned < product.quantity) {
        product.scanned += 1;
        if (product.scanned === product.quantity) {
          product.status = 1
        }
        this.$message.success(this.$t('common.operationSuccessful'));
        // 检查所有产品是否都已经扫描完毕
        const allMatched = this.tableData.every(product => product.scanned >= product.quantity);
        if (allMatched) {
          this.complete();  // 如果所有产品都已扫描完毕，则调用 complete 方法
        }
      } else {

        this.$message.error('该产品已全部扫描');
      }

    },
    complete () {
      const allMatched = this.tableData.every(product => product.quantity === product.scanned);
      if (!allMatched) {
        this.$message.error('有产品未完成扫描');
        return;
      }
      this.$ajax({
        method: 'get',
        url: '/api-prefix//api/delivery_list/tracking-number-scanning-completed',
        roleType: this.roleType,
        params: {
          tracking_number: this.toReviewForm.tracking_number
        }
      }).then(res => {
        this.$message.success('复核已完成');
        this.resetQuery();
      }).catch(err => {
        console.error('复核出错:', err);
        this.$message.error('复核失败');
      });
    },
    resetQuery () {
      // 重置表单
      this.$refs.toReviewForm.resetFields();
      this.toReviewForm = {
        tracking_number: '',
        product_barcode: ''
      }
      // 重置已扫描数量
      this.tableData = []
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