<!--
* @description  质检框
* @fileName  quality-inspection-modal
* @author wjp
* @date 2024-03-23 21:13:11
!-->
<template>
  <div id="quality-inspection-modal" class="quality-inspection-modal">
    <el-dialog
      :title="$t('message.storage.qualityInspection')"
      :visible.sync="modalVisible"
      width="1200px"
      :close-on-click-modal="false"
      @close="handlerClose"
      class="global-modal-class"
      v-loading="loading"
    >
      <SearchCard>
        <el-form
          :inline="true"
          :model="searchForm"
          class="demo-form-inline"
          label-suffix=" :"
        >
          <el-form-item :label="$t('message.storage.systemOrderNumber')">
            <span> {{ currentData.system_number }}</span>
          </el-form-item>
          <el-form-item prop="product_barcode">
            <el-input
              v-model="searchForm.product_barcode"
              :placeholder="$t('message.productManagement.productBarcode')"
              style="width: 200px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="queryProductList"
              type="primary"
              icon="el-icon-search"
              >{{ $t('common.search') }}</el-button
            >
          </el-form-item>
        </el-form>
      </SearchCard>
      <CstTableHead>
        <template slot="top-left">
          <el-button
            plain
            icon="el-icon-check"
            @click="batchQualityInspection"
            type="primary"
            >{{ $t('message.storage.batchQualityInspection') }}</el-button
          >

          <el-button
            plain
            icon="el-icon-check"
            @click="oneClickQualityInspection"
            :disabled="true"
            type="primary"
            >{{ $t('message.storage.oneClickQualityInspection') }}</el-button
          >

          <el-button
            plain
            icon="el-icon-check"
            @click="oneClickMeasurement"
            type="primary"
            >{{ $t('message.storage.oneClickMeasurement') }}</el-button
          >
        </template>
      </CstTableHead>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="400"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column
          :label="$t('common.operation')"
          fixed="left"
          width="160"
        >
          <template slot-scope="scope">
            <a
              :disabled="qualityInspectionDisabled(scope.row)"
              @click.prevent="
                qualityInspectionDisabled(scope.row)
                  ? null
                  : qualityInspection(scope.row)
              "
              >{{ $t('message.storage.qualityInspection') }}</a
            >
            <a
              type="text"
              size="small"
              style="margin-left: 10px"
              @click.prevent="true ? null : tagsPrint(scope.row)"
              :disabled="true"
              >{{ $t('message.productInfo.tags') }}</a
            >
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('message.productManagement.productImage')"
          column-key="image_url"
          width="120"
        >
          <template slot-scope="scope">
            <AuthImg
              :src="scope.row.image_url"
              :styleInfo="'width:50px;height:50px;'"
            ></AuthImg>
          </template>
        </el-table-column>
        <el-table-column
          prop="system_number"
          sortable
          :label="$t('message.storage.systemOrderNumber')"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="product_detail.barcode"
          :label="$t('message.productManagement.productBarcode')"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="product_detail.sku"
          :label="$t('message.productManagement.productSku')"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="quantity"
          :label="$t('message.storage.totalNumberOfAppointments')"
        >
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.unit')">
          <template slot-scope="scope">
            {{
              productUnitMap[scope.row.unit]
                ? productUnitMap[scope.row.unit][$languageType]
                : '-'
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
        <el-table-column :label="$t('message.storage.inspectionLength')">
          <template slot-scope="scope">
            {{
              scope.row?.measured_info
                ? scope.row?.measured_info.inspection_length
                : '-'
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.storage.inspectionWidth')">
          <template slot-scope="scope">
            {{
              scope.row?.measured_info
                ? scope.row?.measured_info.inspection_width
                : '-'
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.storage.inspectionHeight')">
          <template slot-scope="scope">
            {{
              scope.row?.measured_info
                ? scope.row?.measured_info.inspection_height
                : '-'
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.storage.inspectionWeight')">
          <template slot-scope="scope">
            {{
              scope.row?.measured_info
                ? scope.row?.measured_info.inspection_weight
                : '-'
            }}
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="searchForm.page_number"
          :page-sizes="[10, 50, 100]"
          :page-size="searchForm.page_size"
          layout="total,sizes, prev, pager, next"
          :total="total"
          background
        >
        </el-pagination>
      </el-row>
    </el-dialog>
    <QualityInspectionForm
      :value="qualityInspectionVisible"
      :currentData="currentClickData"
      :storageMap="storageMap"
      @close="closeQualityInspectionForm"
    >
    </QualityInspectionForm>
    <BatchUpload
      :visible="batchQualityInspectionVisible"
      :currentData="batchQualityInspectionCurrentData"
      :uploadType="uploadType"
      @close="closeBatchQualityInspection"
    ></BatchUpload>
  </div>
</template>

<script>
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import QualityInspectionForm from './quality-insepection-form.vue'
import BatchUpload from './batch-upload.vue'
import AuthImg from '@/components/auth-img.vue'
import { fetchProductList, qualifiedQuantityTotal, unqualifiedQuantityTotal } from '@/common/common-func'
import { unitOptions, productUnitMap } from '@/common/field-maping'
export default {
  name: 'quality-inspection-modal',
  props: {
    value: { type: Boolean, default: false },
    currentData: { type: Object, default: () => { } },
    storageMap: { type: Object, default: () => { } }
  },
  components: {
    SearchCard,
    BatchUpload,
    CstTableHead,
    QualityInspectionForm,
    AuthImg
  },
  data () {
    return {
      total: 0,
      uploadType: '', productUnitMap,
      modalVisible: false,
      batchQualityInspectionCurrentData: {},
      batchQualityInspectionVisible: false,
      qualityInspectionVisible: false,
      tagsPrintVisible: false,
      currentClickData: {},
      searchForm: {
        product_barcode: '',
      },
      unitOptions,
      tableData: [
      ],
      loading: false,
      multipleSelection: [],

    }
  },
  methods: {
    qualifiedQuantityTotal,
    unqualifiedQuantityTotal,
    qualityInspectionDisabled (row) {
      // 需要质检的个数
      const qualityCount = row.quantity
      // 质检合格的个数
      const qualityCheckTotal = this.qualifiedQuantityTotal(row.quality_check)
      return qualityCount <= qualityCheckTotal
    },
    batchQualityInspection () {
      this.batchQualityInspectionVisible = true
      this.batchQualityInspectionCurrentData = {
        system_number: this.currentData.system_number
      }
      this.uploadType = 'qualityInspection'

    },
    closeBatchQualityInspection (isRefresh = false) {
      this.batchQualityInspectionVisible = false
    },
    closeQualityInspectionForm (isRefresh = false) {
      this.qualityInspectionVisible = false
      if (isRefresh) {
        this.queryProductList()
      }

    },
    handleSizeChange (val) {
      this.queryData.page_size = val
      this.queryData.page_number = 1
      this.queryProductList()
    },
    handleCurrentChange (val) {
      this.queryData.page_number = val
      this.queryProductList()
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    tagsPrint (row) {
      this.tagsPrintVisible = true
      this.currentClickData = row
    },
    qualityInspection (row) {
      this.qualityInspectionVisible = true
      this.currentClickData = row
    },

    oneClickQualityInspection () {
    },
    async oneClickMeasurement () {

      try {
        if (this.multipleSelection.length === 0) {
          this.$message.error(this.$t('common.pleaseSelectAtLeastOneData'))
          return
        }
        this.loading = true
        // const barcodes = this.multipleSelection.map(item => `barcodes=${item.product_detail.barcode}`).join('&');
        const barcodes = this.multipleSelection.map(item => item.product_detail.barcode)
        const res = await this.$ajax(
          {
            method: 'put',
            url: '/api-prefix/api/storage-m/one-button-measurement',
            params: { system_number: this.currentData.system_number },
            data: { barcodes },
            roleType: this.roleType
          })
        if (this.$isRequestSuccessful(res.code)) {
          this.queryProductList()
          this.$message.success(this.$t('common.operationSuccessful'))
        }
      }
      catch (error) {
        console.error(error)
      }
      finally {
        this.loading = false
        // this.$emit('close')
      }
    },
    handlerClose () {
      // this.$refs.modalForm.resetFields()
      // this.modalVisible = false
      // this.modalForm = Object.assign({}, undefined)
      // 如果操作成功 则关闭时刷新 否则不刷新
      this.$emit('close', this.isRefresh)
    },
    queryProductList () {
      this.loading = true
      let params = {
        system_number: this.currentData.system_number,
      }
      if (this.searchForm.product_barcode) {
        params.product_barcode = this.searchForm.product_barcode
      }
      fetchProductList(params, this.roleType).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.tableData = res.data.product_info?.map(element => {
            if (element.quality_check) {
              return {
                ...element, system_number: this.currentData.system_number,
                storage_uuid: this.currentData.storage_uuid
              };
            }
            // 如果没有quality_check则初始化
            let quality_check = [{
              qualified_quantity: 0,
              unqualified_quantity: 0,
              inspection_length: 0,
              inspection_width: 0,
              inspection_height: 0,
              inspection_weight: 0
            }]
            return {
              ...element, system_number: this.currentData.system_number, quality_check,
              storage_uuid: this.currentData.storage_uuid
            };
          });
          this.total = this.tableData.length
        }
      }).finally(() => {
        this.loading = false
      })
    }
  },
  computed: {

    unitOptionsMap () {
      // 从数组转map
      return this.unitOptions.reduce((acc, cur) => {
        acc[cur.value] = cur.label
        return acc
      }, {})
    },
    unitMapOptions () {
      return Object.keys(this.productUnitMap).map(key => ({
        label: this.productUnitMap[key][this.languageType],
        value: parseInt(key)
      }));
    },
  },
  mounted () {

  },
  watch: {
    value: {
      handler (newValue) {
        this.modalVisible = newValue
        if (newValue && this.currentData.system_number) {

          this.queryProductList()
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang='css'>
.cst-table-head {
  display: flex;
  align-items: center;
}
::v-deep .el-dialog {
  height: 680px;

  overflow-y: auto;
}
::v-deep .el-dialog__body {
  max-height: 590px;
}
</style>