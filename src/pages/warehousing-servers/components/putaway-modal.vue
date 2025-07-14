<!--
* @description  上架
* @fileName  putaway-modal
* @author wjp
* @date 2024-03-23 21:13:11
!-->
<template>
  <div id="putaway-modal" class="putaway-modal">
    <el-dialog
      :title="$t('message.storage.putaway')"
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
            @click="batchPutaway"
            type="primary"
            >{{ $t('message.storage.batchPutaway') }}</el-button
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
          width="100"
        >
          <template slot-scope="scope">
            <a
              :disabled="putawayDisabled(scope.row)"
              @click.prevent="
                putawayDisabled(scope.row) ? null : putaway(scope.row)
              "
              >{{ $t('message.storage.putaway') }}</a
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
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="product_detail.barcode"
          :label="$t('message.productManagement.productBarcode')"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="product_detail.sku"
          width="100"
          :label="$t('message.productManagement.productSku')"
        >
        </el-table-column>
        <el-table-column :label="$t('message.storage.batch')" width="180">
          <template slot-scope="{ row }">
            <el-popover
              trigger="hover"
              placement="top-start"
              v-if="Array.isArray(row?.putaway)"
            >
              <el-table
                :data="row.putaway"
                v-loading="loading"
                style="width: 900px"
                :max-height="600"
              >
                <el-table-column
                  prop="batch"
                  :label="$t('message.storage.batch')"
                ></el-table-column>
                <el-table-column
                  prop="location_name"
                  :label="$t('message.myAccount.cargoLocation')"
                ></el-table-column>
                <el-table-column
                  prop="number"
                  :label="$t('message.storage.putawayNumber')"
                ></el-table-column>
                <el-table-column
                  prop="production_date"
                  :label="$t('message.storage.dateOfManufacture')"
                ></el-table-column>
                <el-table-column
                  prop="expiration_date"
                  :label="$t('message.storage.expirationDate')"
                ></el-table-column>
              </el-table>
              <!-- 默认显示简短信息 -->
              <el-button type="text" slot="reference" class="ellipsis">
                <span
                  v-for="(item, index) in row.putaway"
                  :key="index"
                  class="span-slot"
                >
                  {{ $t('message.storage.batch') }}-{{ item.batch }} ({{
                    item.number
                  }})
                </span>
              </el-button>
            </el-popover>
            <div v-else>
              <span>-</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="quantity"
          :label="$t('message.storage.inventoryReservationQuantity')"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="unit"
          :label="$t('message.productManagement.unit')"
        >
          <template slot-scope="scope">
            {{
              productUnitMap[scope.row.unit]
                ? productUnitMap[scope.row.unit][$languageType]
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.storage.putawayNumber')">
          <template slot-scope="scope">
            {{ scope.row.putawayCount ? scope.row.putawayCount : '-' }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('message.storage.qualifiedQuantityOfReceivedGoods')"
          width="100"
        >
          <template slot-scope="scope">
            {{ qualifiedQuantityTotal(scope.row.quality_check) }}
            <!-- {{
              scope.row.quality_check[scope.row?.product_detail?.barcode]
                ?.qualified_quantity
            }} -->
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('message.storage.unqualifiedQuantity')"
          width="180"
        >
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
    <PutawayForm
      :value="putawayVisible"
      :currentData="currentClickData"
      :storageMap="storageMap"
      @close="closePutawayForm"
    >
    </PutawayForm>
    <BatchUpload
      :visible="batchPutawayVisible"
      :currentData="putawayCurrentData"
      :uploadType="uploadType"
      @close="closeBatchPutaway"
    ></BatchUpload>
  </div>
</template>

<script>
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import PutawayForm from './putaway-form.vue'
import BatchUpload from './batch-upload.vue'
import AuthImg from '@/components/auth-img.vue'
import { fetchProductList, qualifiedQuantityTotal, unqualifiedQuantityTotal } from '@/common/common-func'
import { unitOptions, productUnitMap } from '@/common/field-maping'
export default {
  name: 'putaway-modal',
  props: {
    value: { type: Boolean, default: false },
    currentData: { type: Object, default: () => { } },
    storageMap: { type: Object, default: () => { } }
  },
  components: {
    SearchCard,
    CstTableHead,
    PutawayForm,
    BatchUpload,
    AuthImg

  },
  data () {
    return {
      total: 0,
      productUnitMap,
      modalVisible: false,
      putawayVisible: false, qualifiedQuantityTotal, unqualifiedQuantityTotal,
      uploadType: '',
      unitOptions,
      batchPutawayVisible: false,
      putawayCurrentData: {},
      currentClickData: {},
      searchForm: {
        product_barcode: '',

      },
      tableData: [],
      loading: false,
      multipleSelection: [],

    }
  },
  methods: {
    putawayDisabled (row) {
      return row.putawayCount >= row.quantity
    },
    closePutawayForm () {
      this.putawayVisible = false
      this.queryProductList()

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

    putaway (row) {

      this.putawayVisible = true
      this.currentClickData = row
    },
    batchPutaway () {
      this.batchPutawayVisible = true
      this.putawayCurrentData = {
        system_number: this.currentData.system_number
      }
      this.uploadType = 'putaway'

    },
    closeBatchPutaway (isRefresh) {
      this.batchPutawayVisible = false
    },
    oneClickPutaway () {
    },
    async oneClickMeasurement () {

      try {
        this.loading = true
        const res = await this.$ajax(
          {
            method: 'put',
            url: '/api-prefix/api/storage-m/one-button-measurement',
            params: { system_number: this.currentData.system_number },
            roleType: this.roleType
          })
        if (this.$isRequestSuccessful(res.code)) {
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
            if (element.putaway) {
              const putawayCount = this.putawayNumber(element.putaway)
              return {
                ...element, system_number: this.currentData.system_number, putawayCount,
                storage_uuid: this.currentData.storage_uuid
                // , quality_check: [element.quality_check?.[element.product_detail.barcode]]
              };
            }
            // 如果没有quality_check则初始化

            return {
              ...element, system_number: this.currentData.system_number,
              storage_uuid: this.currentData.storage_uuid
            };
          });
          this.total = this.tableData.length
        }
      }).finally(() => {
        this.loading = false
      })
    },
    putawayNumber (putaway) {
      if (!putaway) return 0
      return putaway.reduce((acc, cur) => {
        acc += cur.number
        return acc
      }, 0)
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
.span-slot {
  color: var(--custom-font-color4);
}
</style>