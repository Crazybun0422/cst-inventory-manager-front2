<!--
* @Description: 入库
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div>
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
          提交发货
        </el-button>
        <el-button
          icon="el-icon-delete"
          type="danger"
          plain
          v-if="radioAuditStatus === 0"
          @click="submitShipment(3)"
          >作废</el-button
        >
        <el-button
          icon="el-icon-position"
          type="success"
          plain
          v-if="radioAuditStatus === 1"
          @click="submitShipment(1)"
        >
          提交草稿
        </el-button>

        <el-button icon="el-icon-folder-add" type="primary" disabled plain
          >批量新建
        </el-button>
        <el-button
          icon="el-icon-circle-plus-outline"
          disabled
          type="primary"
          plain
          >亚马逊退仓入库新建
        </el-button>
        <el-button icon="el-icon-download" disabled type="primary" plain
          >导出</el-button
        ></template
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
      <el-table-column prop="name" :label="$t('message.storage.warehouse')">
        <template slot-scope="scope">
          {{ storageMap[scope.row.storage_uuid] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="system_number"
        sortable
        :label="$t('message.storage.systemNumber')"
        width="180"
      >
      </el-table-column>

      <el-table-column
        prop="entry_type"
        :label="$t('message.storage.warehousingClassification')"
      >
        <template slot-scope="scope">
          {{ entryTypeMap[scope.row.entry_type][languageType] }}
        </template>
      </el-table-column>

      <el-table-column
        prop="shipment_number"
        sortable
        :label="$t('message.storage.waybillNumber')"
      >
      </el-table-column>
      <el-table-column
        prop="reference_number"
        :label="$t('message.storage.referenceNo')"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="tags" :label="$t('common.mark')">
      </el-table-column>
      <el-table-column
        prop="create_time"
        sortable
        :label="$t('common.createTime')"
      >
      </el-table-column>
      <el-table-column :label="$t('common.operation')" fixed="left" width="300">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="text" size="small">
            {{ $t('common.check') }}
          </el-button>
          <el-button type="text" size="small" @click="showModal(scope.row)">
            {{ $t('common.edit') }}
          </el-button>
          <el-button @click="showMarkText(scope.row)" type="text" size="small">
            {{ $t('common.mark') }}
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="confirmAndDownload(scope.row)"
            :disabled="!scope.row.attachment"
            >{{ $t('common.attachment') }}
          </el-button>
          <!-- TODO:这里是展示图片文件的需要接口返回 -->
          <el-button
            @click="showBoxDetail(scope.row, 'boxLabel')"
            type="text"
            size="small"
          >
          </el-button>
          <!-- TODO: 这里是展示图片文件的需要接口返回-->
          <el-button
            type="text"
            size="small"
            @click="showBoxDetail(scope.row, 'packingList')"
          >
            {{ $t('common.packingList') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 标记的对话框 -->
    <el-dialog :visible.sync="showMarkDialog" :title="$t('common.mark')">
      <el-input
        type="textarea"
        :placeholder="$t('common.pleaseEnterContent')"
        v-model="markInfo.tags"
        maxlength="30"
        :autosize="{ minRows: 2, maxRows: 8 }"
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
      <span>{{ $t('common.whetherToDownloadFiles') }}</span>
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="curPage"
        :pager-count="11"
        :page-sizes="[10, 50, 100]"
        :page-size="pageSize"
        background
        layout="total,sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination
    ></el-row>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import { getLanguage } from '@/common/language'
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
      pageSize: 50,
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
      // 提交确认
      // 重新加载列表
      this.getWarehousingEntry(this.queryData)
      // 重新加载 状态数量
      this.queryAuditStatus()
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
      this.addWarehousingVisible = true
      if (row) {
        this.currentData = row
        this.operationType = 'edit'
      }
    },

    getWarehousingEntry (queryParam = {}) {
      let reqData = {
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
          }
        })
        .catch((error) => {
          console.error(error)
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
          this.multipleSelection = []
          // 提交成功需要重新查询各个状态的数量 并且重新请求数据
          this.queryAuditStatus()
          this.getWarehousingEntry(this.queryData)
        }
      })
    },
    queryAuditStatus () {
      this.$ajax({
        url: '/api-prefix/api/storage-m/query-audit-status',
        method: 'get'
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
    queryStorage () {
      this.$ajax({
        url: '/api-prefix/api/storage/query-storage',
        method: 'get'
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.storageList = res.data.map((item) => ({
              label: item.name,
              value: item.storage_uuid
            }))
            res.data.forEach((obj) => {
              this.storageMap[obj.storage_uuid] = obj.name
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  mounted () {
    this.languageType = getLanguage()
    this.getWarehousingEntry(this.queryData)
    this.queryAuditStatus()
    this.queryStorage()
  },
  computed: {
    //计算queryKeyWord的value值
    queryKeyWordValue () {
      return this.fieldOptions.find(
        (item) => item.value === this.queryData.queryKeyWord
      ).label[this.$languageType]
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
</style>
