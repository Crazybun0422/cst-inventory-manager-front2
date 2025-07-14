<!--
* @description  参数1
* @fileName  p-secondary-sortation
* @author wjp
* @date 2024-07-04 22:13:54
!-->
<template>
  <div
    id="p-secondary-sortation"
    class="p-secondary-sortation"
    style="height: 80vh"
  >
    <el-row>
      <el-col :span="8">
        <el-row>
          <el-card shadow="hover" class="full-height">
            <div slot="header" class="clearfix">
              <span>二次分拣</span>
            </div>
            <el-form
              :model="secondarySortationForm"
              ref="secondarySortationForm"
              label-width="100px"
            >
              <el-form-item :label="$t('common.prompt')">
                <el-checkbox v-model="secondarySortationForm.is_sorting"
                  >是否分拣运单</el-checkbox
                >
                <el-checkbox v-model="secondarySortationForm.is_refresh"
                  >完成是否自动刷新</el-checkbox
                >
              </el-form-item>
              <el-form-item label="待扫描数量" prop="quantity_scanned">
              </el-form-item>
              <el-form-item
                :label="$t('message.storage.waveNumber')"
                prop="wave_number"
              >
                <el-input
                  v-model="secondarySortationForm.wave_number"
                  placeholder="请输入波次号"
                  class="form-width"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('message.productManagement.productBarcode')"
                prop="product_barcode"
              >
                <el-input
                  v-model="secondarySortationForm.product_barcode"
                  :placeholder="
                    $t('message.productManagement.productBarcodePlaceholder')
                  "
                  class="form-width"
                ></el-input>
              </el-form-item>
              <el-form-item label="运单类型" prop="tracking_type">
                <el-select
                  v-model="secondarySortationForm.tracking_type"
                  filterable
                  :placeholder="$t('common.pleaseSelect')"
                  class="form-width"
                >
                  <el-option
                    v-for="item in secondSortingOrderFieldSelectMap"
                    :key="item.value"
                    :label="item.label[$languageType]"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('message.storage.waybillNumber')"
                prop="product_barcode"
              >
                <el-input
                  v-model="secondarySortationForm.tracking_number"
                  :placeholder="trackingTypePlaceholder"
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
          <el-card shadow="hover" class="info-card">
            <div slot="header" class="clearfix">
              <span>信息</span>
            </div>
            <div class="data-info">0</div>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="16" style="padding: 0 20px">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>{{ $t('message.storage.sortingInformation') }}</span>
          </div>
          <el-table :data="tableData" style="width: 100%" highlight-current-row>
            <el-table-column
              prop="sorting_number"
              :label="$t('message.storage.sortingNumber')"
            ></el-table-column>
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
            <el-table-column
              prop="status"
              :label="$t('common.status')"
            ></el-table-column>
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
import { secondSortingOrderFieldSelectMap } from '@/common/field-maping'
export default {
  name: 'p-secondary-sortation',
  props: {
  },
  components: {
    PageHead,
    SearchCard,
    CstTableHead
  },
  data () {
    return {
      secondSortingOrderFieldSelectMap,
      secondarySortationForm: {
        is_sorting: false,
        is_refresh: false,
        quantity_scanned: '',
        wave_number: '',
        product_barcode: '',
        tracking_type: 'tracking_number',
        tracking_number: ''
      },
      tableData: [
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
        },
        {
          sorting_number: '1',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '10',
          quantity_scanned: '5',
          status: '已分拣',
          shipping_order_number: '123456',
          system_number: '123456'
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
    resetQuery () {
      // 重置表单
      this.$refs.secondarySortationForm.resetFields();

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

    trackingTypePlaceholder () {
      const filedMap = this.secondSortingOrderFieldSelectMap.reduce((acc, curr) => {
        acc[curr.value] = curr.label;
        return acc;
      }, {});
      return filedMap[this.secondarySortationForm.tracking_type][this.$languageType];
    }
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
.data-info {
  text-align: center;
  font-size: 80px;

  font-weight: bold;
  color: red;
}
</style>