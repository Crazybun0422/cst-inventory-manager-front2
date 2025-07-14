<!--
* @Description: 入库
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div v-loading="loading">
    <PageHead :title="$t('message.storage.warehousing')">
      <template slot="head-right">
        <el-button icon="el-icon-plus" type="primary" @click="showModal(null)">
          {{ $t('common.add') }}
        </el-button>
      </template>
    </PageHead>
    <SearchCard>
      <el-form :inline="true" :model="queryData" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="queryData.storage_uuid"
            filterable
            clearable
            :placeholder="$t('message.storage.warehouseSelect')"
          >
            <el-option
              v-for="item in storageList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryData.queryKeyWord"
            :placeholder="$t('common.pleaseSelect')"
          >
            <el-option
              v-for="item in fieldOptions"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="queryData.remoteQuerySelect"
            filterable
            remote
            reserve-keyword
            :placeholder="queryKeyWordValue"
            :remote-method="remoteQueryMethod"
            :loading="remoteLoading"
            :loading-text="$t('common.loading')"
            clearable
          >
            <el-option
              v-for="item in remoteQueryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryData.date"
            type="daterange"
            :range-separator="$t('common.to')"
            :start-placeholder="$t('common.startTime')"
            :end-placeholder="$t('common.endTime')"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button @click="queryWarehousingEntry" icon="el-icon-search">{{
            $t('common.search')
          }}</el-button>
          <el-button type="primary" @click="resetQuery">
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </SearchCard>
    <CstTableHead>
      <template slot="top-left">
        <el-radio-group
          v-model="radioAuditStatus"
          @change="handleRadioChange"
          class="auditStatus"
        >
          <el-badge
            :value="auditStatusMap[item.value]"
            class="badge-inside-button"
            v-for="item in addWarehouseStatusMap"
            :key="item.value"
            :max="99"
            :type="statusMarkColorMap[item.value]"
          >
            <el-radio-button :label="item.value" :value="item.value">
              <span>{{ item.label[$languageType] }}</span>
            </el-radio-button>
          </el-badge>
        </el-radio-group>
      </template>
      <template slot="top-right">
        <el-button
          icon="el-icon-check"
          type="success"
          plain
          v-if="radioAuditStatus === 0"
          @click="submitShipment(0)"
        >
          {{ $t('message.storage.submitShipment') }}
        </el-button>
        <el-button
          icon="el-icon-delete"
          type="danger"
          plain
          v-if="radioAuditStatus === 0"
          @click="submitShipment(3)"
          >{{ $t('message.storage.becomeInvalid') }}</el-button
        >
        <el-button
          icon="el-icon-position"
          type="success"
          plain
          v-if="radioAuditStatus === 1"
          @click="submitShipment(1)"
        >
          {{ $t('message.storage.submitDraft') }}
        </el-button>

        <el-button icon="el-icon-folder-add" type="primary" disabled plain>
          {{ $t('message.storage.batchNew') }}
        </el-button>
        <!-- <el-button
          icon="el-icon-circle-plus-outline"
          disabled
          type="primary"
          plain
          >亚马逊退仓入库新建
        </el-button> -->
        <el-button icon="el-icon-download" disabled type="primary" plain>{{
          $t('common.export')
        }}</el-button></template
      >
      <template slot="bottom-left"> </template>
    </CstTableHead>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="530px"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('message.storage.warehouse')"
        show-overflow-tooltip
        min-width="280"
      >
        <template slot-scope="scope">
          {{ storageMap[scope.row.storage_uuid] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="system_number"
        sortable
        :label="$t('message.storage.systemOrderNumber')"
        show-overflow-tooltip
        min-width="260"
      >
      </el-table-column>

      <el-table-column
        prop="entry_type"
        :label="$t('message.storage.warehousingClassification')"
        show-overflow-tooltip
        min-width="240"
      >
        <template slot-scope="scope">
          {{ entryTypeMap[scope.row.entry_type][languageType] }}
        </template>
      </el-table-column>

      <el-table-column
        prop="shipment_number"
        sortable
        :label="$t('message.storage.waybillNumber')"
        show-overflow-tooltip
        min-width="240"
      >
      </el-table-column>
      <el-table-column
        prop="reference_number"
        :label="$t('message.storage.referenceNo')"
        min-width="140"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="tags"
        :label="$t('common.mark')"
        min-width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="create_time"
        sortable
        :label="$t('common.createTime')"
        min-width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        :label="$t('common.operation')"
        fixed="left"
        min-width="160"
      >
        <template slot-scope="scope">
          <a @click="showDetail(scope.row)">
            {{ $t('common.check') }}
          </a>

          <el-dropdown
            style="margin-left: 8px"
            @command="(cmd) => handleCommand(cmd, scope.row)"
          >
            <a>
              {{ $t('common.more')
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </a>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit">
                <a>
                  {{ $t('common.edit') }}
                </a>
              </el-dropdown-item>
              <el-dropdown-item command="mark">
                <a>
                  {{ $t('common.mark') }}
                </a>
              </el-dropdown-item>

              <el-dropdown-item command="boxLabel">
                <a>
                  {{ $t('common.boxLabel') }}
                </a>
              </el-dropdown-item>
              <el-dropdown-item command="packingList">
                <a>
                  {{ $t('common.packingList') }}
                </a>
              </el-dropdown-item>
              <el-dropdown-item
                :disabled="!scope.row.attachment"
                command="attachment"
                ><a :disabled="!scope.row.attachment"
                  >{{ $t('common.attachment') }}
                </a></el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>

          <!-- TODO:这里是展示图片文件的需要接口返回 -->

          <!-- TODO: 这里是展示图片文件的需要接口返回-->
        </template>
      </el-table-column>
    </el-table>
    <!-- 标记的对话框 -->
    <el-dialog
      :visible.sync="showMarkDialog"
      :title="$t('common.mark')"
      :close-on-click-modal="false"
    >
      <el-input
        type="textarea"
        :placeholder="$t('common.pleaseEnterContent')"
        v-model="markInfo.tags"
        maxlength="5000"
        :autosize="{ minRows: 5, maxRows: 8 }"
        show-word-limit
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showMarkDialog = false">{{
          $t('common.cancel')
        }}</el-button>
        <el-button type="primary" @click="submitMarkText">{{
          $t('common.confirm')
        }}</el-button>
      </span>
    </el-dialog>
    <!-- PDF文件对话框 -->
    <el-dialog
      v-loading="downloadPdfLoading"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      :visible.sync="showPDFDialogVisibel"
      :title="$t('common.prompt')"
      width="30%"
      :close-on-click-modal="false"
    >
      <span>{{ $t('common.whetherToDownloadFiles') }}?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showPDFDialogVisibel = false">{{
          $t('common.cancel')
        }}</el-button>
        <el-button
          type="primary"
          @click="dowloadPackList"
          icon="el-icon-download"
          >{{ $t('common.confirm') }}</el-button
        ></span
      >
    </el-dialog>
    <EditAddWarehousing
      :visible="addWarehousingVisible"
      :currentData="currentData"
      :originalDataArr="tableData"
      :storageList="storageList"
      :operationType="operationType"
      @close="onCloseModal"
      @confirm="onConfirm"
    >
    </EditAddWarehousing>
    <WarehousingDetail
      :visible="drawerVisible"
      :currentData="currentData"
      :storageMap="storageMap"
      @close="onCloseDrawer"
    >
    </WarehousingDetail>
    <el-row type="flex" justify="end" style="margin-top: 10px">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="curPage"
        :pager-count="11"
        :page-sizes="[10, 50, 100]"
        :page-size="pageSize"
        layout="total,sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import { getLanguage } from '@/common/language'
import { getStorage } from '@/common/common-func'
import CstTableHead from '@/components/cst-table-head/index.vue'
import WarehousingDetail from '@/pages/warehousing-servers/components/warehousing-detail.vue'
import AuthImg from '@/components/auth-img.vue'
import EditAddWarehousing from '@/pages/warehousing-servers/components/edit-addwarehousing.vue'
import {
  productCategoryMap,
  productUnitMap,
  productStatusMap,
  addWarehouseFieldSelectMap,
  addWarehouseTimeSelectMap,
  addWarehouseStatusMap,
  statusMarkColorMap,
  entryTypeMap
} from '@/common/field-maping'
import utils from '@/utils/index'
export default {
  name: 'product',
  components: {
    PageHead,
    WarehousingDetail,
    SearchCard,
    CstTableHead,
    AuthImg,
    EditAddWarehousing
  },
  data () {
    return {
      loading: false,
      operationType: 'add',
      languageType: 'en_us',
      entryTypeMap: entryTypeMap,
      showMarkDialog: false,
      markText: '',
      auditStatusMap: {},
      markInfo: {},
      showPDFDialogVisibel: false,
      boxType: '',
      downloadPdfLoading: false,
      packingLinstNum: '',
      statusMarkColorMap: statusMarkColorMap,
      radioAuditStatus: addWarehouseStatusMap[0].value,
      queryKeyWord: addWarehouseFieldSelectMap[0].value,
      remoteQuerySelect: [],
      drawerVisible: false,
      remoteLoading: false,
      remoteQueryOptions: [],
      remoteQueryResult: [],
      fieldOptions: addWarehouseFieldSelectMap,
      timeSelectMap: addWarehouseTimeSelectMap,
      addWarehouseStatusMap: addWarehouseStatusMap,
      productCategoryMap: productCategoryMap,
      productUnitMap: productUnitMap,
      productStatusMap: productStatusMap,
      objectSpanFlag: false,
      tableData: [],
      storageList: [],
      storageMap: {},
      newTableData: [],
      curPage: 1,
      pageSize: 10,
      variantsTotal: 0,
      total: 0,
      multipleSelection: [],
      addWarehousingVisible: false,
      currentData: {},
      // 抽屉
      detailVisible: false,
      queryData: {
        queryKeyWord: addWarehouseFieldSelectMap[0].value,
        remoteQuerySelect: '',
        storage_uuid: '',
        date: ['', '']
      }
    }
  },
  methods: {
    handleCommand (command, row) {
      if (command === 'mark') {
        this.showMarkText(row)
      } else if (command === 'edit') {
        this.showModal(row)
      }
      else if (command === 'boxLabel') {
        this.showBoxDetail(row, 'boxLabel')
      } else if (command === 'packingList') {
        this.showBoxDetail(row, 'packingList')
      } else if (command === 'attachment') {
        this.confirmAndDownload(row)
      }
    },
    submitMarkText () {
      let queryParam = {
        system_numbers: [this.markInfo.system_number],
        tags: this.markInfo.tags
      }
      this.$ajax({
        url: '/api-prefix/api/storage-m/mark-entry',
        method: 'put',
        data: queryParam,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (this.$isRequestSuccessful(res.code)) {
          this.showMarkDialog = false
          this.$message.success(this.$t('common.editSuccessful'))
          //刷新页面
          this.getWarehousingEntry(this.queryData)
        }
      })
    },
    resetQuery () {
      this.queryData = {
        queryKeyWord: addWarehouseFieldSelectMap[0].value,
        remoteQuerySelect: '',
        date: ['', ''],
        storage_uuid: ''
      }
    },
    onCloseModal () {
      this.addWarehousingVisible = false
      this.currentData = {}
    },
    onCloseDrawer () {
      this.drawerVisible = false
    },
    onConfirm () {
      this.addWarehousingVisible = false
      this.getWarehousingEntry(this.queryData)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    showDetail (row) {
      this.drawerVisible = true
      this.currentData = row
    },

    showModal (row) {
      this.operationType = 'add'
      this.currentData = {}
      if (row) {
        this.currentData = row
        this.operationType = 'edit'
      }
      this.addWarehousingVisible = true
    },

    getWarehousingEntry (queryParam = {}) {
      this.loading = true
      let reqData = {
        provider_uuid: this.dsCurrentProviderUuid,
        audit_status: this.radioAuditStatus,
        page_size: queryParam.pageSize ?? this.pageSize,
        page_num: queryParam.curPage ?? this.curPage
      }
      if (queryParam.remoteQuerySelect) {
        reqData[queryParam.queryKeyWord] = queryParam.remoteQuerySelect
      }
      if (queryParam.date && queryParam.date[0] != '') {
        reqData['start_date'] = queryParam.date[0]
        reqData['end_date'] = queryParam.date[1]
      }
      if (queryParam.storage_uuid) {
        reqData['storage_uuid'] = queryParam.storage_uuid
      }

      this.$ajax({
        url: '/api-prefix/api/storage-m/query-entries',
        method: 'get',
        params: reqData,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.tableData = utils.deepClone(res.data.results)
            this.total = res.data.total
            this.queryAuditStatus(reqData)
          }
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },

    handleSizeChange (val) {
      this.pageSize = val
      this.getWarehousingEntry(this.queryData)
    },
    handleCurrentChange (val) {
      this.curPage = val
      this.getWarehousingEntry(this.queryData)
    },
    // 标记需要合并的行
    getRowCount () {
      this.tableData.forEach((el, index) => {
        el.rowspan = el.product_variants.length
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (!this.objectSpanFlag) {
        return
      }
      if (
        columnIndex === 0 ||
        column.property === 'operate' ||
        column.property === 'main_image_url' ||
        column.property === 'chinese_name' ||
        column.property === 'english_name' ||
        column.property === 'category' ||
        column.property === 'create_time'
      ) {
        if (row.rowspan !== null) {
          if (row.rowspan !== 1) {
            return {
              rowspan: row.rowspan,
              colspan: 1
            }
          } else {
            return {
              rowspan: 1,
              colspan: 1
            }
          }
        } else {
          return {
            rowspan: 0,
            colspan: 1
          }
        }
      }
    },
    remoteQueryMethod (query) {
      // 用来远程获取数据
      if (query !== '') {
        this.remoteLoading = true
        const queryParam = {
          [this.queryData.queryKeyWord]: query
        }
        this.$ajax({
          url: '/api-prefix/api/storage-m/query-specific',
          method: 'get',
          params: queryParam,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.remoteLoading = false
            if (res.data.length > 0) {
              // 保存查询的结果
              this.remoteQueryOptions = res.data.map((item) => {
                return {
                  label: item,
                  value: item
                }
              })
              this.queryData.remoteQuerySelect = query
            } else {
              this.remoteQueryOptions = []
              this.queryData.remoteQuerySelect = query
            }
          }
        })
      } else {
        this.remoteQueryOptions = []
      }
    },
    queryWarehousingEntry () {
      this.getWarehousingEntry(this.queryData)
    },
    handleRadioChange () {
      let queryParam = {
        ...this.queryData,
        curPage: 1
      }
      this.getWarehousingEntry(queryParam)
    },

    confirmAndDownload (row) {
      this.$confirm('确定要下载该附件吗?', '确认', {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.downloadAttachment(row)
        })
        .catch((error) => {
          // 用户点击了取消或关闭了对话框
          console.error(error)
        })
    },
    downloadAttachment (row) {
      if (!row.attachment) {
        alert('没有可下载的附件')
        return
      }
      const link = document.createElement('a')
      link.href = row.attachmentUrl
      link.download = row.system_number // 这里设置系统单号作为默认文件名
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    showBoxDetail (row, boxType) {
      this.packingLinstNum = row.system_number
      this.boxType = boxType
      this.showPDFDialogVisibel = true
    },
    showMarkText (row) {
      this.showMarkDialog = true
      this.markInfo = {
        tags: row.tags,
        system_number: row.system_number
      }
    },
    submitShipment (value) {
      let reqUrl = {
        0: '/api-prefix/api/storage-m/submit-shipment', //提交发货
        1: '/api-prefix/api/storage-m/return-back-draft', //提交草稿
        3: '/api-prefix/api/storage-m/cancel' //废除
      }
      if (this.multipleSelection.length === 0) {
        this.$message.warning(
          this.$t('common.pleaseSelectTheDataToBeSubmitted')
        )
        return
      }
      let system_numbers = this.multipleSelection.map((item) => {
        return item.system_number
      })
      this.$ajax({
        url: reqUrl[value],
        method: 'put',
        data: { system_numbers: system_numbers },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success('提交成功')
          this.getWarehousingEntry(this.queryData)
        }
      })
    },
    queryAuditStatus (params) {
      let queryParam = {
        ...params
      }
      if (this.queryData.storage_uuid) {
        queryParam['storage_uuid'] = this.queryData.storage_uuid
      }
      delete queryParam.audit_status
      delete queryParam.page_size
      delete queryParam.page_num
      this.$ajax({
        url: '/api-prefix/api/storage-m/query-audit-status',
        method: 'get',
        params: queryParam
      }).then((res) => {
        if (this.$isRequestSuccessful(res.code)) {
          this.auditStatusMap = {}
          for (let obj of res.data) {
            Object.assign(this.auditStatusMap, obj)
            // 草稿和未收货使用红色 作废用灰色啥的  完成用绿色 其他中间态用橙色
          }
        }
      })
    },
    async dowloadPackList () {
      let urlMap = {
        boxLabel: '/api-prefix/api/storage-m/get-entry-ticket', //箱标
        packingList: '/api-prefix/api/storage-m/get-entry-invoice' //箱单
      }
      let fileNameType = {
        boxLabel: 'ticket',
        packingList: 'invoic'
      }
      this.downloadPdfLoading = true
      await this.$ajax({
        url: urlMap[this.boxType],
        method: 'get',
        params: { system_number: this.packingLinstNum },
        responseType: 'blob'
        // 告诉Ajax请求要接收二进制数据
      })
        .then((res) => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/pdf' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download =
            this.packingLinstNum + '-' + fileNameType[this.boxType] + '.pdf'
          document.body.appendChild(link)
          link.click()
          this.downloadPdfLoading = false
          this.showPDFDialogVisibel = false
        })
        .catch((error) => {
          {
            this.downloadPdfLoading = false
            this.showPDFDialogVisibel = false
            console.error(error)
          }
        })
    },
    async queryStorage () {
      const res = await getStorage(this.dsCurrentProviderUuid)
      if (this.$isRequestSuccessful(res.code)) {
        this.storageList = res.data.map((item) => ({
          label: item.name,
          value: item.storage_uuid
        }))
        res.data.forEach((obj) => {
          this.$set(this.storageMap, obj.storage_uuid, obj.name)
        })
        this.queryData.storage_uuid = this.storageList[0].value
      }
    }
  },
  async mounted () {
    this.languageType = getLanguage()
    await this.queryStorage()
    this.getWarehousingEntry(this.queryData)
  },
  computed: {
    //计算queryKeyWord的value值
    queryKeyWordValue () {
      return this.fieldOptions.find(
        (item) => item.value === this.queryData.queryKeyWord
      ).label[this.$languageType]
    },
    dsCurrentProviderUuid () {
      return this.$store.state.user.dsCurrentProviderUuid
    }
  },
  watch: {
    'queryData.queryKeyWord': {
      handler (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.queryData.remoteQuerySelect = ''
          this.remoteQueryOptions = []
        }
      },
      deep: true
    },
    async dsCurrentProviderUuid (val) {
      if (val) {
        await this.queryStorage()
        this.getWarehousingEntry(this.queryData)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.pagehead {
  margin-top: 10px;
}
::v-deep .el-badge__content {
  z-index: 100;
}
::v-deep
  .audit-status:last-child
  .badge-inside-button
  .el-radio-button
  .el-radio-button__inner:last-child {
  border-radius: 0 4px 4px 0;
  background-color: green;
}
.auditStatus {
  ::v-deep div.badge-inside-button {
    .el-radio-button__inner {
      border-radius: 0 0 0 0;
    }
  }
  ::v-deep div.badge-inside-button:first-child {
    .el-radio-button__inner {
      border-radius: 4px 0 0 4px;
    }
  }
  ::v-deep div.badge-inside-button:last-child {
    .el-radio-button__inner {
      border-radius: 0 4px 4px 0;
    }
  }
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
