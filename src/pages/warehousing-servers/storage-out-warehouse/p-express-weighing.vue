<!--
* @description  快递称重(已废弃)
* @fileName  p-express-weighing
* @author wjp
* @date 2024-07-04 22:18:39
!-->

<template>
  <div id="p-express-weighing" class="p-express-weighing">
    <el-row :gutter="24">
      <el-col :span="12">
        <el-card class="info-card" shadow="hover">
          <div slot="header">
            <span>{{ $t('navigate.batchWeighing') }}</span>
          </div>

          <!-- <el-form
            :model="expressWeighingForm"
            ref="expressWeighingForm"
            label-width="100px"
          >
            <el-form-item
              :label="$t('message.storage.systemOrderNumber')"
              prop="system_number"
            >
              <el-input
                v-model="expressWeighingForm.system_number"
                :placeholder="$t('message.storage.pleaseEnterSystemNumber')"
                class="form-width"
              ></el-input>
            </el-form-item>
          </el-form> -->
          <el-form
            :model="expressWeighingForm"
            ref="expressWeighingForm"
            label-width="100px"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item
                  :label="$t('message.storage.systemOrderNumber')"
                  prop="system_number"
                >
                  <el-input
                    v-model="expressWeighingForm.system_number"
                    :placeholder="$t('message.storage.pleaseEnterSystemNumber')"
                    class="form-width"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderInfo.otherExpenses')"
                  prop="other_expenses"
                >
                  <el-input-number
                    v-model="expressWeighingForm.other_expenses"
                    :placeholder="
                      $t('message.storage.pleaseEnterOtherExpenses')
                    "
                    :min="0"
                    class="form-width"
                  ></el-input-number>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  :label="$t('message.productManagement.weight')"
                  prop="weight"
                >
                  <el-input
                    v-model="expressWeighingForm.weight"
                    :placeholder="$t('message.productInfo.pleaseEnterWeight')"
                    class="form-width"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('message.productManagement.length')"
                  prop="length"
                >
                  <el-input
                    v-model="expressWeighingForm.length"
                    placeholder="请输入产品长"
                    class="form-width"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('message.productManagement.width')"
                  prop="width"
                >
                  <el-input
                    v-model="expressWeighingForm.width"
                    placeholder="请输入产品宽"
                    class="form-width"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('message.productManagement.height')"
                  prop="height"
                >
                  <el-input
                    v-model="expressWeighingForm.height"
                    placeholder="请输入产品高"
                    class="form-width"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="箱数" prop="box_number">
                  <el-input-number
                    v-model="expressWeighingForm.box_number"
                    placeholder="请输入数量"
                    :min="0"
                    class="form-width"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-button type="primary" @click="complete">{{
                    $t('common.confirm')
                  }}</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table
            :data="expressWeighTableData"
            max-height="140px"
            highlight-current-row
          >
            <el-table-column
              prop="express_number"
              label="快递号"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="length"
              :label="$t('message.productManagement.length')"
            ></el-table-column>
            <el-table-column
              prop="width"
              :label="$t('message.productManagement.width')"
            ></el-table-column>
            <el-table-column
              prop="height"
              :label="$t('message.productManagement.height')"
            ></el-table-column>
            <el-table-column
              prop="weight"
              :label="$t('message.productManagement.weight')"
            ></el-table-column>
            <el-table-column
              prop="volume_weight"
              :label="$t('message.storage.volumeWeight')"
            ></el-table-column>
            <el-table-column prop="proportion" label="比重"></el-table-column>
            <el-table-column
              prop="mini_weight"
              label="一票多件最低重量"
            ></el-table-column>
          </el-table>
          <el-descriptions :column="4" style="margin-top: 10px">
            <el-descriptions-item label="合计重量">99</el-descriptions-item>
            <el-descriptions-item label="合计体积重">100</el-descriptions-item>
            <el-descriptions-item label="合计计费重">
              110
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card shadow="hover" class="info-card">
          <div slot="header" class="clearfix">
            <span>信息</span>
          </div>
          <el-descriptions :column="2">
            <el-descriptions-item label="服务"
              >kooriookami</el-descriptions-item
            >
            <el-descriptions-item label="客户ID">1007</el-descriptions-item>
            <el-descriptions-item label="系统单">苏州市</el-descriptions-item>
            <el-descriptions-item :label="$t('message.storage.waybillNumber')">
              11111111111
            </el-descriptions-item>
            <el-descriptions-item :label="$t('message.storage.referenceNo')">
              11111111111
            </el-descriptions-item>
            <el-descriptions-item :label="$t('message.storage.warehouse')">
              本家
            </el-descriptions-item>
            <el-descriptions-item :label="$t('common.country')">
              中国
            </el-descriptions-item>
            <el-descriptions-item :label="$t('message.orderInfo.zipCodeLabel')">
              41000
            </el-descriptions-item>
            <el-descriptions-item :label="$t('message.orderInfo.cityLabel')">
              长沙
            </el-descriptions-item>
            <el-descriptions-item label="增值服务单">
              11111111111
            </el-descriptions-item>
            <el-descriptions-item label="服务单状态">
              11111111111
            </el-descriptions-item>
            <el-descriptions-item label="所属服务商">
              11111111111
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card shadow="hover" class="info-card">
          <div slot="header">
            <span>{{ $t('common.setting') }}</span>
          </div>
          <el-form
            :model="weighingSetingForm"
            ref="weighingSetingForm"
            label-width="100px"
          >
            <el-form-item>
              <el-checkbox @change="changedDeliverGoods"
                >是否变为发货</el-checkbox
              >
            </el-form-item>

            <el-form-item>
              <el-checkbox
                v-model="weighingSetingForm.intercept"
                @change="isIntercept"
                >是否开启截取</el-checkbox
              >
            </el-form-item>

            <div>
              <el-form-item label="有效开始位">
                <el-input-number
                  v-model="weighingSetingForm.start"
                  placeholder="请输入有效开始位"
                  :min="0"
                ></el-input-number>
              </el-form-item>

              <el-form-item label="有效长度">
                <el-input-number
                  v-model="weighingSetingForm.length"
                  placeholder="请输入有效开始位"
                  :min="0"
                ></el-input-number>
              </el-form-item>
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-card shadow="hover" style="margin-top: 10px">
        <el-table
          :data="tableData"
          style="width: 100%"
          height="300px"
          highlight-current-row
        >
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
            prop="charging_weight"
            :label="$t('common.chargeableWeight')"
          ></el-table-column>
          <el-table-column
            prop="actual_weight"
            :label="$t('message.orderInfo.actualweight')"
          ></el-table-column>
          <el-table-column
            prop="volume_weight"
            :label="$t('message.storage.volumeWeight')"
          ></el-table-column>
          <el-table-column
            prop="cost"
            :label="$t('common.costs')"
          ></el-table-column>
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
          </el-pagination
        ></el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import { secondSortingOrderStatusMap } from '@/common/field-maping'
export default {
  name: 'p-express-weighing',
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
      expressWeighingForm: {
        system_number: '',
        product_barcode: ''
      },
      secondSortingOrderStatusMap,
      expressWeighTableData: [
        {
          express_number: '123',
          length: '123456',
          width: '123456',
          height: '123456',
          weight: '123456',
          volume_weight: '123456',
          proportion: '123456',
          mini_weight: '123456'
        },
        {
          express_number: '123',
          length: '123456',
          width: '123456',
          height: '123456',
          weight: '123456',
          volume_weight: '123456',
          proportion: '123456',
          mini_weight: '123456'
        },
        {
          express_number: '123',
          length: '123456',
          width: '123456',
          height: '123456',
          weight: '123456',
          volume_weight: '123456',
          proportion: '123456',
          mini_weight: '123456'
        }
      ],
      tableData: [
        {
          system_number: '123456',
          charging_weight: '123456',
          actual_weight: '123456',
          volume_weight: '123456',
          cost: '123456',
          receipt_time: '123456'
        }
      ],
      queryData: {
        page_number: 1,
        page_size: 10
      },
      total: 1,
      weighingSetingForm: {
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

      if (this.weighingSetingForm.start === 0 || this.weighingSetingForm.length === 0) {
        this.$message.error('请输入有效开始位和有效长度');
        this.weighingSetingForm.intercept = false;
        return;
      }
      this.weighingSetingForm.intercept = val;
    },
    isFixWeight (val) {

    },
    isPrintOtherExpenses (val) {

    },
    isFixOtherExpenses (val) {

    },
    changedDeliverGoods (val) {

    },
    isPrintLWH (val) {

    },
    downloadMAssistant () {

    },
    isPhotograph (val) {
    },
    resetQuery () {
      // 重置表单
      this.$refs.expressWeighingForm.resetFields();

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
  height: 430px;
  overflow: auto;
}
.form-width {
  width: 143px;
}
</style>