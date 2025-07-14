<!--
* @description  参数1
* @fileName  p-add-warehouse
* @author wjp
* @date 2023-10-25 20:57:28
!-->
<template>
  <div id="p-add-warehouse" class="p-add-warehouse" v-loading="loading">
    <PageHead :title="$t('message.storage.warehousing')">
      <!-- <template slot="head-right">
        <el-button icon="el-icon-plus" type="primary" @click="showModal(null)">
          {{ $t('common.add') }}
        </el-button>
      </template> -->
    </PageHead>
    <SearchCard>
      <el-form :inline="true" :model="queryData" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="queryData.storage_define_uuid"
            filterable
            clearable
            :placeholder="$t('message.storage.warehouseSelect')"
          >
            <el-option
              v-for="item in storageDefinitionList"
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
            v-for="item in pAddWarehouseStatusMap"
            :key="item.value"
            :max="99"
            :type="pStatusMarkColorMap[item.value]"
          >
            <el-radio-button :label="item.value" :value="item.value">
              <span>{{ item.label[$languageType] }}</span>
            </el-radio-button>
          </el-badge>
        </el-radio-group>
      </template>
      <template slot="top-right">
        <el-button
          icon="el-icon-receiving"
          type="success"
          plain
          v-if="radioAuditStatus === 1"
          @click="submitShipment(1)"
        >
          {{ $t('message.storage.completeReceipt') }}
        </el-button>
        <el-button
          icon="el-icon-close"
          type="danger"
          plain
          v-if="radioAuditStatus === 1"
          @click="submitShipment(2)"
          >{{ $t('message.storage.becomeInvalid') }}</el-button
        >
        <!-- <el-button
          icon="el-icon-s-claim"
          type="success"
          plain
          v-if="radioAuditStatus === 2"
          @click="submitShipment(3)"
          >{{ $t('message.storage.completeQualityInspection') }}</el-button
        > -->
        <el-button
          icon="el-icon-s-claim"
          type="success"
          plain
          v-if="radioAuditStatus === 4"
          @click="submitShipment(4)"
          >{{ $t('message.storage.completeAddWarehouse') }}</el-button
        >
        <el-button icon="el-icon-printer" type="primary" disabled plain>
          {{ $t('common.print') }}
        </el-button>
        <el-button icon="el-icon-folder-add" type="primary" disabled plain>
          {{ $t('message.storage.batchNew') }}
        </el-button>

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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('message.storage.warehouse')"
        align="center"
        show-overflow-tooltip
        width="180"
      >
        <template slot-scope="scope">
          {{ storageMap[scope.row.storage_uuid] }}
        </template>
      </el-table-column>

      <el-table-column
        prop="user_code"
        :label="$t('message.storage.userCode')"
        align="center"
        show-overflow-tooltip
        width="260"
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
        prop="entry_type"
        :label="$t('message.storage.warehousingClassification')"
        align="center"
        show-overflow-tooltip
        width="240"
      >
        <template slot-scope="scope">
          {{ entryTypeMap[scope.row.entry_type][$languageType] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="reference_number"
        :label="$t('message.storage.referenceNo')"
        width="140"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="tags"
        :label="$t('common.mark')"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="create_time"
        sortable
        :label="$t('common.createTime')"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column :label="$t('common.operation')" fixed="left" width="120">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="text" size="small">
            {{ $t('common.check') }}
          </el-button>
          <el-dropdown
            style="margin-left: 10px"
            @command="(cmd) => handleCommand(cmd, scope.row)"
          >
            <span class="el-dropdown-link">
              {{ $t('common.more')
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item command="mark">
                <el-button type="text" size="small">
                  {{ $t('common.mark') }}
                </el-button>
              </el-dropdown-item> -->
              <el-dropdown-item
                command="takeDelivery"
                v-show="![5, 6].includes(radioAuditStatus)"
              >
                <el-button
                  type="text"
                  size="small"
                  @click="onTakeDelivery(scope.row)"
                >
                  {{ $t('common.takeDelivery') }}
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item
                command="qualityInspection"
                v-show="![1, 5, 6].includes(radioAuditStatus)"
              >
                <el-button
                  type="text"
                  size="small"
                  @click="onQualityInspection(scope.row)"
                >
                  {{ $t('message.storage.qualityInspection') }}
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item
                command="putaway"
                v-show="![1, 2, 5, 6].includes(radioAuditStatus)"
              >
                <el-button
                  type="text"
                  size="small"
                  @click="onPutaway(scope.row)"
                >
                  {{ $t('message.storage.putaway') }}
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item command="boxLabel">
                <el-button type="text" size="small">
                  {{ $t('common.boxLabel') }}
                </el-button>
              </el-dropdown-item>

              <el-dropdown-item command="packingList">
                <el-button type="text" size="small">
                  {{ $t('common.packingList') }}
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item
                :disabled="!scope.row.attachment"
                command="attachment"
                ><el-button
                  type="text"
                  size="small"
                  :disabled="!scope.row.attachment"
                  >{{ $t('common.attachment') }}
                </el-button></el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

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
    <WarehousingDetail
      :visible="drawerVisible"
      :currentData="currentData"
      :storageMap="storageMap"
      @close="onCloseDrawer"
    >
    </WarehousingDetail>
    <TakeDeliveryModal
      v-model="takeDeliveryVisible"
      :currentData="currentData"
      :storageMap="storageMap"
      @close="onCloseTakeDeliveryModal"
    ></TakeDeliveryModal>
    <QualityInspectionModal
      v-model="qualityInspectionVisible"
      :currentData="currentData"
      :storageMap="storageMap"
      @close="onCloseQualityInspectionModal"
    >
    </QualityInspectionModal>
    <PutawayModal
      v-model="putawayVisible"
      :currentData="currentData"
      :storageMap="storageMap"
      @close="onClosePutawayModal"
    ></PutawayModal>
  </div>
</template>

<script>
import utils from '@/utils/index'
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import { getStorageDefinition } from '@/common/common-func'
import WarehousingDetail from '@/pages/warehousing-servers/components/warehousing-detail.vue'
import {
  pAddWarehouseFieldSelectMap,
  pAddWarehouseStatusMap,
  pStatusMarkColorMap,
  entryTypeMap
} from '@/common/field-maping'
import TakeDeliveryModal from './components/take-delivery-modal.vue'
import QualityInspectionModal from './components/quality-inspection-modal.vue'
import PutawayModal from './components/putaway-modal'
export default {
  name: 'p-add-warehouse',
  props: {},
  components: {
    PageHead,
    SearchCard,
    CstTableHead,
    WarehousingDetail,
    TakeDeliveryModal,
    QualityInspectionModal,
    PutawayModal
  },
  data () {
    return {
      entryTypeMap,
      loading: false,
      pStatusMarkColorMap,
      pAddWarehouseStatusMap,
      downloadPdfLoading: false,
      currentData: {},
      drawerVisible: false,
      radioAuditStatus: 1,
      pageSize: 10,
      curPage: 1,
      auditStatusMap: {},
      queryData: {
        storage_define_uuid: '',
        queryKeyWord: pAddWarehouseFieldSelectMap[0].value,
        remoteQuerySelect: '',
        date: ''
      },
      remoteQueryOptions: [],
      storageMap: {},
      storageDefinitionList: [],
      fieldOptions: pAddWarehouseFieldSelectMap,
      queryKeyWord: pAddWarehouseFieldSelectMap[0].value,
      remoteLoading: false,
      tableData: [],
      packingLinstNum: '',
      boxType: '',
      showPDFDialogVisibel: false,
      qualityInspectionVisible: false,
      putawayVisible: false,
      showMarkDialog: false,
      markInfo: {
        tags: '',
        system_number: ''
      },
      // 收货弹窗
      takeDeliveryVisible: false
    }
  },

  methods: {
    // tableRowClassName ({ row, rowIndex }) {
    //   if (rowIndex === 1) {
    //     return 'warning-row';
    //   } else if (rowIndex === 3) {
    //     return 'success-row';
    //   }
    //   return '';
    // },
    onCloseTakeDeliveryModal (closeType = false) {
      // if (closeType) {
      // closeType 为true 代表是提交数据成功
      this.getWarehousingEntry(this.queryData)
      // }
      this.takeDeliveryVisible = false
      this.currentData = {}
    },
    onCloseQualityInspectionModal (closeType = false) {
      // if (closeType) {
      // closeType 为true 代表是提交数据成功
      this.getWarehousingEntry(this.queryData)
      // }
      this.qualityInspectionVisible = false
      this.currentData = {}
    },
    onClosePutawayModal (closeType = false) {
      // if (closeType) {
      // closeType 为true 代表是提交数据成功
      this.getWarehousingEntry(this.queryData)
      // }
      this.putawayVisible = false
      this.currentData = {}
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
        roleType: this.roleType,
        params: {
          system_number: this.packingLinstNum,
          provider_uuid: this.provider_uuid
        },
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
    handleCommand (command, row) {
      // if (command === 'mark') {
      //   this.showMarkText(row)
      // } else
      if (command === 'boxLabel') {
        this.showBoxDetail(row, 'boxLabel')
      } else if (command === 'packingList') {
        this.showBoxDetail(row, 'packingList')
      } else if (command === 'attachment') {
        this.confirmAndDownload(row)
      }
    },
    showBoxDetail (row, boxType) {
      this.packingLinstNum = row.system_number
      this.boxType = boxType
      this.showPDFDialogVisibel = true
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
    showMarkText (row) {
      this.showMarkDialog = true
      this.markInfo = {
        tags: row.tags,
        system_number: row.system_number
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
        roleType: this.roleType,
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
    showDetail (row) {
      this.drawerVisible = true
      this.currentData = row
    },
    onCloseDrawer () {
      this.drawerVisible = false
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    submitShipment (value) {
      let reqUrl = {
        1: '/api-prefix/api/storage-m/goods-receipt-completion', //完成收货
        2: '/api-prefix/api/storage-m/cancel', //作废
        4: '/api-prefix/api/storage-m/completed' //完成上架
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
        roleType: this.roleType,
        headers: {
          'Content-Type': 'application/json'
        },
        roleType: this.roleType
      }).then((res) => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success('提交成功')
          this.multipleSelection = []
          this.getWarehousingEntry(this.queryData)
        }
      })
    },
    getWarehousingEntry (queryParam = {}) {
      if (!this.provider_uuid) {
        // 如果provider_uuid为空，则不执行查询
        return
      }
      this.loading = true
      let reqData = {
        provider_uuid: this.provider_uuid,
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
      if (queryParam.storage_define_uuid) {
        reqData['storage_uuid'] = queryParam.storage_define_uuid
      }

      this.$ajax({
        url: '/api-prefix/api/storage-m/query-entries',
        method: 'get',
        params: reqData,
        roleType: this.roleType,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.tableData = utils.deepClone(res.data.results)
            this.total = res.data.total
            return this.queryAuditStatus(reqData)
          }
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    queryAuditStatus (params) {
      if (!this.provider_uuid) {
        // 如果provider_uuid为空，则不执行查询
        return
      }
      let queryParam = {
        provider_uuid: this.provider_uuid,
        ...params
      }

      delete queryParam.audit_status
      delete queryParam.page_size
      delete queryParam.page_num
      this.$ajax({
        url: '/api-prefix/api/storage-m/query-audit-status',
        method: 'get',
        roleType: this.roleType,
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
    async queryStorageDef () {
      const res = await getStorageDefinition(this.provider_uuid, this.roleType)
      if (this.$isRequestSuccessful(res.code)) {
        this.storageDefinitionList = res.data.map((item) => ({
          label: item.name,
          value: item.storage_define_uuid
        }))
        this.queryData.storage_define_uuid =
          this.storageDefinitionList[0]?.value
        res.data.forEach((obj) => {
          this.$set(this.storageMap, obj.storage_define_uuid, obj.name)
        })
      }
    },
    resetQuery () {
      this.queryData = {
        queryKeyWord: pAddWarehouseFieldSelectMap[0].value,
        remoteQuerySelect: '',
        date: '',
        storage_define_uuid: this.storageDefinitionList[0].value
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
    onTakeDelivery (row) {
      this.currentData = row
      this.takeDeliveryVisible = true
    },
    onQualityInspection (row) {
      this.currentData = row
      this.qualityInspectionVisible = true
    },
    onPutaway (row) {
      this.currentData = row
      this.putawayVisible = true
    }
  },
  computed: {
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },
    queryKeyWordValue () {
      return this.fieldOptions.find(
        (item) => item.value === this.queryData.queryKeyWord
      ).label[this.$languageType]
    },

  },
  async mounted () {
    await this.queryStorageDef()
    this.$nextTick(() => {
      this.getWarehousingEntry(this.queryData)
    })
  },
  watch: {}
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
