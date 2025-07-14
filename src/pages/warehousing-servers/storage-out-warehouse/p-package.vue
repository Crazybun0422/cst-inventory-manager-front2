<!--
* @description  参数1
* @fileName  p-package
* @author wjp
* @date 2024-07-04 22:15:32
!-->
<!--
* @description  复核
* @fileName  p-package
* @author wjp
* @date 2024-07-04 22:14:25
!-->
<template>
  <div id="p-package" class="p-package">
    <el-row :gutter="24">
      <el-col :span="8">
        <el-row>
          <el-card class="full-height" shadow="hover">
            <div slot="header">
              <span>扫描</span>
            </div>
            <el-form :model="packageForm" ref="packageForm" label-width="100px">
              <el-form-item
                :label="$t('message.storage.systemOrderNumber')"
                prop="wave_number"
              >
                <el-input
                  v-model="packageForm.system_number"
                  :placeholder="$t('message.storage.pleaseEnterSystemNumber')"
                  class="form-width"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('message.productManagement.productBarcode')"
                prop="product_barcode"
              >
                <el-input
                  v-model="packageForm.product_barcode"
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
            </div>
            <el-row :gutter="24">
              <el-form
                :model="packageSetingForm"
                ref="packageSetingForm"
                label-width="100px"
              >
                <el-form-item>
                  <el-checkbox
                    v-model="packageSetingForm.isAlreadyShipped"
                    @change="isAlreadyShipped"
                    >是否直接已发货</el-checkbox
                  >
                </el-form-item>
                <el-form-item>
                  <el-checkbox
                    v-model="packageSetingForm.isScanning"
                    @change="isScanning"
                    >是否扫描包材</el-checkbox
                  >
                </el-form-item>
                <el-form-item>
                  <el-checkbox
                    v-model="packageSetingForm.intercept"
                    @change="isIntercept"
                    >是否开启截取</el-checkbox
                  ></el-form-item
                >
                <div v-show="packageSetingForm.intercept">
                  <el-form-item label="有效开始位">
                    <el-input-number
                      v-model="packageSetingForm.start"
                      placeholder="请输入有效开始位"
                      :min="0"
                    ></el-input-number>
                  </el-form-item>
                  <el-form-item label="有效长度">
                    <el-input-number
                      v-model="packageSetingForm.length"
                      placeholder="请输入有效开始位"
                      :min="0"
                    ></el-input-number>
                  </el-form-item>
                </div>
              </el-form>
            </el-row>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>运单信息</span>
          </div>
          <CstTableHead>
            <template slot="top-left">
              <el-descriptions :column="4">
                <el-descriptions-item label="累计扫描数量"
                  >100</el-descriptions-item
                >
                <el-descriptions-item label="单号"
                  >18100000000</el-descriptions-item
                >
                <el-descriptions-item label="增值服务单"
                  >-</el-descriptions-item
                >
                <el-descriptions-item label="服务单状态">
                  -
                </el-descriptions-item>
              </el-descriptions>
            </template>
          </CstTableHead>
          <el-table
            :data="tableData"
            style="width: 100%"
            height="530px"
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
              prop="package_barcode"
              label="包材条码"
            ></el-table-column>
            <el-table-column
              prop="package_price"
              label="包材价格"
            ></el-table-column>
            <el-table-column
              prop="package_cost_price"
              label="包材成本价格"
            ></el-table-column>
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
  name: 'p-package',
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
      packageForm: {
        system_number: '',
        product_barcode: ''
      },
      secondSortingOrderStatusMap,
      tableData: [
        {
          system_number: '202107040001',
          package_barcode: 'ASD202107040001',
          package_price: '100',
          package_cost_price: '100',
        }
      ],
      queryData: {
        page_number: 1,
        page_size: 10
      },
      total: 1,
      packageSetingForm: {
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
      this.packageSetingForm.intercept = val;
    },
    isAlreadyShipped (val) {
      this.packageSetingForm.isAlreadyShipped = val;
    },
    isScanning (val) {
      this.packageSetingForm.isScanning = val;
    },
    resetQuery () {
      // 重置表单
      this.$refs.packageForm.resetFields();
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