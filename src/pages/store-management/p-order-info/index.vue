<template>
  <div class="p-order-info" v-loading="pageLoading" ref="pageHead">
    <!-- 头部 -->
    <pageHead ref="orderPageHead" :title="$t('navigate.orderInfo')" :is-show-shop-select="true"
      :is-show-sync-products="false" @refresh="refresh" />

    <!-- 搜索栏 -->
    <SearchCard>
      <el-form inline :model="submitData" :disabled="pageLoading || tableLoading">
        <el-form-item>
          <el-date-picker v-model="dateRange" type="daterange" :range-separator="$t('common.to')"
            :start-placeholder="$t('common.startTime')" :end-placeholder="$t('common.endTime')" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd" @change="handleDateRangeChange"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-select v-model="submitData.Fulfillmentstatus" :placeholder="$t('message.orderInfo.fulfillmentStatus')">
            <el-option v-for="item in fulfillmentList" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input v-model="submitData.orderNumber" :placeholder="$t('message.orderInfo.orderPlaceHolderSelect')"
            clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="refresh">
            {{
              $t('common.search')
            }}
          </el-button>
        </el-form-item>
      </el-form>
    </SearchCard>

    <!-- 表格头部操作栏 -->
    <CstTableHead>
      <template slot="top-left">
        <el-form inline :disabled="pageLoading || tableLoading">
          <el-form-item>
            <el-button type="primary" :disabled="!multipleSection.length" @click="handleBatchPush">{{
              $t('message.orderInfo.push') }}</el-button>
          </el-form-item>

          <el-form-item :label="$t('message.orderInfo.autoPush')" prop="autoFulfillment">
            <el-switch v-model="autoFulfillment" @change="handleSwitchChange"></el-switch>
          </el-form-item>

          <el-form-item v-show="exportOrderShow">
            <el-button type="primary" @click="exportOrder">{{ $t('message.orderInfo.exportOrder') }}</el-button>
          </el-form-item>

          <el-form-item v-show="exportOrderShow">
            <el-checkbox v-model="filtered_tracking">
              {{
                $t('message.orderInfo.onlyExportWithoutTracking')
              }}
            </el-checkbox>
          </el-form-item>
        </el-form>
      </template>
      <template slot="top-right">
        <!-- <el-button
          type="primary"
          icon="el-icon-upload"
          plain
          @click="uploadVisible = true"
        >
          {{ $t('message.storeSettings.batchFulfillment') }}
        </el-button>-->
        <el-button type="primary" icon="el-icon-upload" plain :disabled="pageLoading || tableLoading"
          @click="uploadFile">{{ $t('message.storeSettings.batchFulfillment') }}</el-button>
      </template>
    </CstTableHead>

    <!-- 表格 -->
    <el-table :data="tableData" v-loading="loading" @selection-change="$_tableMixin_handleSectionChange">
      <el-table-column type="selection" width="45" :selectable="onSelectable"></el-table-column>

      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <!-- 子表格 -->
          <SubTable :row-data="row" />
        </template>
      </el-table-column>

      <el-table-column prop="ewis_name" :label="$t('message.orderInfo.orderNumber')" width="120"></el-table-column>

      <el-table-column prop="ewis_create_time" sortable :label="$t('message.orderInfo.orderDate')">
        <template slot-scope="{ row }">{{ row.ewis_create_time }}</template>
      </el-table-column>

      <el-table-column prop="ShipToName" :label="$t('message.orderInfo.customer')">
        <template slot-scope="{ row }">{{ row.ewis_order_detail.ShipToName }}</template>
      </el-table-column>

      <el-table-column prop="ewis_payment_status" :label="$t('message.orderInfo.paymentStatus')" width="140">
        <template slot-scope="{ row }">
          <el-tag :type="EWIS_PAYMENT_STATUS.type[row.ewis_payment_status]" effect="dark" class="status-tag">
            {{
              EWIS_PAYMENT_STATUS.text[row.ewis_payment_status] ||
              row.ewis_payment_status
            }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="ewis_currency_amount" sortable :label="$t('message.orderInfo.orderAmount')">
        <template slot-scope="{ row }">{{ row.ewis_currency_amount }} {{ row.ewis_currency_code }}</template>
      </el-table-column>

      <el-table-column prop="ewis_fulfillment_status" :label="$t('message.orderInfo.orderStatus')" width="180">
        <template slot-scope="{ row }">
          <el-tag :type="EWIS_FULFILLMENT_STATUS.type[row.ewis_fulfillment_status] || 'warning'" effect="dark"
            class="status-tag">
            <!-- {{
              EWIS_FULFILLMENT_STATUS.text[row.ewis_fulfillment_status] ||
              row.ewis_fulfillment_status
            }}-->
            {{
              row.ewis_fulfillment_status ? row.ewis_fulfillment_status : '-'
            }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="ewis_tracking_info" :label="$t('message.orderInfo.tracking')">
        <template slot-scope="{ row }">
          <div v-for="item in row.ewis_tracking_info" :key="item.id">
            <div v-for="it in item.trackingInfo" :key="it.company">
              <a :href="it.url" rel="noopener noreferrer">{{ it.number }}</a>
              <span>({{ it.company }})</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="end" align="bottom">
      <el-col :span="24" :offset="24">
        <el-pagination :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 20, 50]"
          @size-change="$_tableMixin_sizeChange" layout="sizes, slot">
          <!--上一页 -->
          <el-button icon="el-icon-arrow-left" :disabled="!hasPrevPage" @click="$_tableMixin_prevChange"></el-button>

          <!-- 下一页 -->
          <el-button icon="el-icon-arrow-right" :disabled="!hasNextPage" @click="$_tableMixin_nextChange"></el-button>
        </el-pagination>
      </el-col>
    </el-row>
    <FileExportProgress v-if="isFileProgressExist" :visible="fileExportProgressVisible"
      :current_file_id="current_file_id" @close="closeFileExportProgress" @stop="stopExport"
      :loading="fileExportProgressLoading" @export="exportOrderFile">
    </FileExportProgress>
    <!-- 上传弹窗 -->
    <el-dialog v-if="uploadDialogVisible" :title="$t('message.userInfo.bulkPushOrder')" width="50%"
      :visible.sync="uploadDialogVisible">
      <UploadModal ref="uploadModal" v-loading="uploadDialogLoading" :parent-table-data="$refs.orderPageHead?.shopList"
        @upload-success="uploadSuccess" @fulfill-completed="closeUploadDialog" />

      <!-- 底部操作栏 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUploadDialog">
          {{
            $t('common.cancel')
          }}
        </el-button>
        <el-button type="primary" @click="uploadSubmit" :disabled="confirmButtomDisabled">
          {{ $t('common.confirm')
          }}
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="fulfillErrorDialogVisible"
      class="fulfill-error-dialog"
      :visible.sync="fulfillErrorDialogVisible"
      width="420px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="fulfill-error-body">
        <div class="fulfill-error-head">
          <i class="el-icon-warning-outline fulfill-error-icon"></i>
          <div class="fulfill-error-title">{{ $t('common.operationFailed') }}</div>
        </div>
        <p class="fulfill-error-message">{{ fulfillErrorMessage }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeFulfillErrorDialog">
          {{ $t('common.confirm') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * @file 订单信息
 * @date 2024/03/17
 */

// 组件
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import SubTable from './sub-table.vue'
import FileExportProgress from '../components/file-export-progress.vue'
// mixins
import tableMixin from '@/common/table-mixin'

// 函数
import { download, getExcelFile } from '@/common/common-func'

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// 常量
import { DIRECTION } from '@/common/field-maping'
import {
  EWIS_PAYMENT_STATUS,
  EWIS_FULFILLMENT_STATUS,
  EWIS_FULFILLMENT_STATUS_VALUE
} from './const.js'
import { startSyncOrder } from '@/common/common-func'
import { dropShipper } from '@/common/commonconfig'

export default {
  name: 'p-order-info',
  components: {
    PageHead,
    SearchCard,
    CstTableHead,
    SubTable,
    FileExportProgress,
    UploadModal: () =>
      import(
        /* webpackChunkName: 'UploadModal' */ '../p-user-info/modal/upload-modal.vue'
      )
  },
  mixins: [tableMixin],
  props: {},
  data() {
    return {
      uploadVisible: false,
      confirmButtomDisabled: false,
      EWIS_PAYMENT_STATUS,
      uploadDialogVisible: false,
      EWIS_FULFILLMENT_STATUS,
      EWIS_FULFILLMENT_STATUS_VALUE,
      current_file_id: '',
      fileExportProgressLoading: false,
      pageLoading: false,
      fileExportProgressVisible: false,
      loading: false,
      submitData: {
        createdAtBegin: '',
        createdAtEnd: '',
        Fulfillmentstatus: 'any',
        orderNumber: ''
      },
      dateRange: [],
      autoFulfillment: false,
      fulfillmentList: [
        {
          label: 'ANY',
          value: 'any'
        },
        {
          label: 'UNFULFILLED',
          value: 'unfulfilled'
        }
      ],
      filtered_tracking: false, // 仅导出无物流信息的订单
      tableData: [],
      startCursor: null,
      endCursor: null,
      uploadDialogLoading: false,
      tableLoading: true,
      isFileProgressExist: false,
      fulfillErrorDialogVisible: false,
      fulfillErrorMessage: ''
    }
  },
  mounted() {
    this.isFileProgressExist = this.roleType != dropShipper
  },
  computed: {
    orderNames() {
      return this.multipleSection.forEach((item) => {
        return item.a
      })
    },
    shopifyShopUrl() {
      return this.$store.getters.shopifyShopUrl
    },
    exportOrderShow() {
      return this.config.pRoleList.includes(this.roleType)
    }
  },
  watch: {
    dateRange(newVal) {
      if (newVal === null) {
        this.dateRange = []
        this.submitData.createdAtBegin = ''
        this.submitData.createdAtEnd = ''
      }
    }
  },
  methods: {
    startSyncOrder,
    getFulfillResponse(res) {
      return res && res.data ? res.data : null
    },
    hasFulfillError(fulfillResult) {
      const fulfillCode = fulfillResult && fulfillResult.code
      if (fulfillCode !== undefined && fulfillCode !== 200) {
        return true
      }
      const detailLists = fulfillResult && fulfillResult.data
      if (Array.isArray(detailLists)) {
        for (const detailList of detailLists) {
          if (!Array.isArray(detailList)) continue
          for (const item of detailList) {
            if (item && item.code !== undefined && item.code !== 200) {
              return true
            }
          }
        }
      }
      return false
    },
    getLocalizedMessage(msgObj) {
      if (!msgObj) {
        return ''
      }
      if (typeof msgObj === 'string') {
        return msgObj
      }
      return (
        msgObj[this.$languageType] ||
        msgObj.en_us ||
        msgObj.zh_cn ||
        ''
      )
    },
    buildFulfillErrorMessage(fulfillResult) {
      const messages = []

      const topMessage = this.getLocalizedMessage(fulfillResult?.msg)
      if (topMessage) {
        messages.push(topMessage)
      }

      const detailLists = fulfillResult?.data
      if (Array.isArray(detailLists)) {
        detailLists.forEach((detailList) => {
          if (!Array.isArray(detailList)) return
          detailList.forEach((item) => {
            const itemMessage = this.getLocalizedMessage(item?.msg)
            const orderNames = item?.data?.orderNames
            const missingLineItems = item?.data?.missingLineItems?.map((it) => it.title).filter(Boolean)

            let detailMessage = itemMessage
            if (missingLineItems?.length) {
              const missingPart = missingLineItems.join(', ')
              detailMessage = detailMessage ? `${detailMessage}: ${missingPart}` : missingPart
            }
            if (orderNames?.length) {
              const orders = orderNames.join(', ')
              detailMessage = detailMessage ? `[${orders}] ${detailMessage}` : `[${orders}]`
            }
            if (detailMessage) {
              messages.push(detailMessage)
            }
          })
        })
      }

      return messages.join('\n')
    },
    showFulfillErrorDialog(message) {
      this.fulfillErrorMessage = message || this.$t('common.operationFailed')
      this.fulfillErrorDialogVisible = true
    },
    closeFulfillErrorDialog() {
      this.fulfillErrorDialogVisible = false
      this.fulfillErrorMessage = ''
    },
    uploadFile() {
      this.uploadDialogVisible = true
    },
    onSelectable(row, index) {
      if (
        row.ewis_fulfillment_status === EWIS_FULFILLMENT_STATUS_VALUE.fulfilled
      ) {
        return false
      }
      return true
    },
    async exportOrderFile(filename) {
      await getExcelFile(filename)
    },
    stopExport() {
      this.fileExportProgressLoading = true
      this.$ajax({
        url: '/api/shop-manager/stop-export-mission',
        method: 'post',
        roleType: this.roleType,
        data: {
          mission_id: this.current_file_id
        }
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.$message.warning(this.$t('common.stopExport'))
            this.closeFileExportProgress()
          }
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.fileExportProgressLoading = false
        })
    },
    closeFileExportProgress() {
      this.fileExportProgressVisible = false
    },
    refresh() {
      this.tableLoading = false
      this.startCursor = null
      this.endCursor = null
      this.getTableData()
    },
    getTableData() {
      let vm = this
      vm.loading = true
      if (vm.shopifyShopUrl === '') {
        vm.loading = false
        return
      }
      vm.$ajax({
        url: `/api/shop-manager/fetch-orders?shop_url=${vm.shopifyShopUrl}`,
        method: 'post',
        roleType: vm.roleType,
        data: {
          ...vm.submitData,
          startCursor:
            vm.direction === DIRECTION.before ? vm.startCursor : null,
          endCursor: vm.direction === DIRECTION.after ? vm.endCursor : null,
          itemsPerPage: vm.pageSize + ''
        }
      })
        .then(({ data = {} }) => {
          vm.tableData = data.data.pageInfo ?? []
          vm.startCursor = data.data.startCursor
          vm.endCursor = data.data.endCursor

          // 回填自动推送
          vm.autoFulfillment = data.data.AutoFulfillment

          // hasPreviousPage为false时禁用上一页，hasNextPage为false时禁用下一页
          vm.hasPrevPage = data.data.hasPreviousPage
          vm.hasNextPage = data.data.hasNextPage
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          vm.loading = false
        })
    },
    // 选择日期
    handleDateRangeChange([begin, end]) {
      this.submitData.createdAtBegin = begin
      this.submitData.createdAtEnd = end
    },
    // 批量推送
    handleBatchPush() {
      this.pageLoading = true
      const orderList = this.multipleSection.map((item) => {
        return item.ewis_name
      })
      this.startSyncOrder(
        { shop_url: this.$refs.orderPageHead.currentShopUrl },
        { orderNames: orderList }
      )
        .then((res) => {
          const fulfillResult = this.getFulfillResponse(res)
          const fulfillHasError = this.hasFulfillError(fulfillResult)
          if (fulfillHasError) {
            const errorMsg =
              this.buildFulfillErrorMessage(fulfillResult) ||
              this.$t('common.operationFailed')
            this.showFulfillErrorDialog(errorMsg)
            return
          }
          const successMsg = this.getLocalizedMessage(
            (fulfillResult && fulfillResult.msg) || res.msg
          ) || this.$t('common.operationSuccessful')
          this.$message.success(successMsg)
          this.refresh()
        })
        .catch((err) => {
          console.error('Error starting sync products:', err)
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    // 自动推送
    handleSwitchChange() {
      this.$ajax({
        url: `/api/shop-manager/auto-fulfill?shop_url=${this.shopifyShopUrl}`,
        method: 'post',
        roleType: this.roleType,
        data: {
          AutoFulfillment: this.autoFulfillment
        }
      })
    },

    async uploadSubmit() {
      let vm = this
      let uploadModalRefs = vm.$refs.uploadModal
      let isValid = await uploadModalRefs?.$_formMixin_isValid?.()
      if (!isValid) {
        return
      }

      if (!uploadModalRefs.fileList?.length) {
        this.$message.warning(this.$t('message.userInfo.uploadFilePlaceholder'))
        return
      }
      vm.uploadDialogLoading = true
      vm.confirmButtomDisabled = true
      uploadModalRefs?.submitUpload?.()
    },
    uploadSuccess() {
      this.uploadDialogLoading = false
      // this.confirmButtomDisabled = false
      // this.getTableData()
    },

    closeUploadDialog() {
      this.confirmButtomDisabled = false
      this.uploadDialogLoading = false
      this.uploadDialogVisible = false
      this.getTableData()
    },
    // 导出订单
    async exportOrder() {
      let vm = this
      vm.pageLoading = true
      try {
        let queryParmas = {
          shop_url: vm.shopifyShopUrl
        }
        if (vm.config.pRoleList.includes(vm.roleType)) {
          queryParmas.provider_uuid = localStorage.getItem('shop_provider_uuid')
        }
        const res = await vm.$ajax({
          url: '/api/shop-manager/export-shopify-orders',
          method: 'post',
          roleType: vm.roleType,
          params: queryParmas,
          data: {
            ...vm.submitData,
            startCursor: null,
            endCursor: null,
            itemsPerPage: vm.pageSize + '',
            filtered_tracking: vm.filtered_tracking,
            mission_id: generateUUID()
          }
        })
        if (this.$isRequestSuccessful(res.code)) {
          vm.$message.success(vm.$t('message.orderManagement.exportInfo'))
          vm.current_file_id = res.data.mission_id
          vm.fileExportProgressVisible = true
        }
      } catch (error) {
        console.error(error)
      } finally {
        vm.pageLoading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.table-expand {
  font-size: 0;

  label {
    width: 90px;
    color: #99a9bf;
  }

  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}

.fulfill-error-dialog ::v-deep .el-dialog__body {
  padding: 20px 24px 10px 24px;
  background: #1d1f23;
}

.fulfill-error-dialog ::v-deep .el-dialog__footer {
  padding: 10px 24px 20px 24px;
}

.fulfill-error-dialog ::v-deep .el-dialog {
  background: #1d1f23;
  color: #fff;
  border-radius: 18px;
  border: 1px solid #fff;
}

.fulfill-error-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fulfill-error-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fulfill-error-icon {
  font-size: 20px;
  color: #f56c6c;
}

.fulfill-error-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.fulfill-error-message {
  margin: 0;
  color: #e6e8eb;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-line;
}
</style>
