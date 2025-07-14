<!--
* @Description: p-订单
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div v-loading="loading">
    <PageHead :title="$t('message.orderManagement.order')"> </PageHead>
    <SearchCard>
      <el-form :inline="true" :model="queryData" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="queryData.queryKeyWord"
            :placeholder="$t('common.pleaseSelect')"
            style="width: 120px"
          >
            <el-option
              v-for="item in pOrderFieldSelectMap"
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
            :placeholder="$t('common.pleaseInput')"
            :remote-method="remoteQueryMethod"
            :loading="remoteLoading"
            :loading-text="$t('common.loading')"
            clearable
            style="width: 140px"
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
          <el-select
            v-model="queryData.orderStatus"
            filterable
            style="width: 140px"
            :placeholder="$t('message.orderInfo.fulfillmentStatus')"
          >
            <el-option
              v-for="item in StockEntryStatusEnum"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryData.storage_uuid"
            filterable
            clearable
            style="width: 140px"
            :placeholder="$t('message.storage.warehousingName')"
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
            v-model="queryData.customer"
            filterable
            clearable
            style="width: 140px"
            :placeholder="$t('message.orderInfo.customer')"
          >
            <el-option
              v-for="item in customers"
              :key="item.user_id"
              :label="item.user_code"
              :value="item.user_code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="shipping_company">
          <!-- <SelectShippingChannel
                :currentData="modalForm.shipping_company"
                @updateChange="handleUpdate"
              ></SelectShippingChannel> -->
          <el-select
            popper-class="more-tag-data"
            v-model="queryData.shipping_company"
            clearable
            filterable
            :loading="logisticsRemoteLoading"
            style="width: 140px"
            @focus="getLogisticsChannels"
            :placeholder="$t('message.myAccount.logisticsChannels')"
          >
            <el-option
              v-for="item in logistics_channels"
              :key="item.channel_code"
              :label="item.channel_name"
              :value="item.channel_code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryData.shop"
            :placeholder="$t('message.storeSettings.pleaseSelectShop')"
            filterable
            style="width: 230px"
          >
            <el-option
              v-for="item in shops"
              :key="item"
              :label="item"
              :value="item"
            >
              <span class="custom-select-option-left">{{ item }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryData.dateType"
            clearable
            filterable
            style="width: 140px"
            :placeholder="$t('common.pleaseSelectDateType')"
          >
            <el-option
              v-for="item in dateTypeMap"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            style="width: 240px"
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
          <el-button type="primary" @click="queryOrder">{{
            $t('common.search')
          }}</el-button>
          <el-button type="primary" @click="resetQuery">
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </SearchCard>
    <CstTableHead>
      <template slot="top-right">
        <el-button icon="el-icon-printer" @click="printWaybill">{{
          $t('message.orderManagement.printWaybill')
        }}</el-button>
        <el-button icon="el-icon-edit" @click="batchModifyLogistics">{{
          $t('message.orderManagement.batchModifyLogistics')
        }}</el-button>
        <el-button icon="el-icon-edit" @click="batchCleanWaybill">{{
          $t('message.orderInfo.batchClearWaybillNumbers')
        }}</el-button>
        <el-button icon="el-icon-edit" @click="changeOrder">{{
          $t('message.orderInfo.changeOrders')
        }}</el-button>

        <el-popconfirm
          ref="exportOrderPopconfirm"
          trigger="click"
          :title="
            multipleSelection.length === 0
              ? $t('common.exportAllDataUnderCurrentConditions') + '?'
              : $t('common.exportSelectedData') + '?'
          "
          style="margin-left: 10px"
          :width="240"
          placement="top-start"
          @confirm="exportOrder"
        >
          <el-button
            icon="el-icon-download"
            type="primary"
            slot="reference"
            size="mini"
            plain
            >{{ $t('common.export') }}</el-button
          >
        </el-popconfirm>
      </template>
    </CstTableHead>

    <el-table
      ref="table"
      :data="tableData"
      style="width: 100%"
      :max-height="tableMaxHeight"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55">
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('common.operation')"
        width="140"
        prop="operate"
        fixed="left"
      >
        <template slot-scope="scope">
          <a style="margin-right: 10px" @click="showDetail(scope.row)">
            {{ $t('common.check') }}
          </a>
          <el-dropdown
            trigger="click"
            :hide-on-click="false"
            @command="handleDropdownCommand"
          >
            <a>
              {{ $t('common.more') }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </a>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{ remark: scope.row }">
                <a>
                  {{ $t('message.orderManagement.notes') }}
                </a>
              </el-dropdown-item>
              <el-dropdown-item :command="{ logDetail: scope.row }">
                <a>
                  {{ $t('common.log') }}
                </a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="cs_reference"
        sortable
        :label="$t('message.storage.referenceNo')"
        show-overflow-tooltip
        width="150"
      >
      </el-table-column>
      <el-table-column
        prop="order_id"
        sortable
        :label="$t('message.storage.orderNumber')"
        show-overflow-tooltip
        width="160"
        align="center"
      >
      </el-table-column>

      <!-- <el-table-column
        prop="transferNumber"
        label="转单号"
        show-overflow-tooltip
        width="160"
        align="center"
      >
      </el-table-column> -->
      <el-table-column
        :label="$t('message.myAccount.clientId')"
        prop="customer_id"
        sortable
        width="180"
        show-overflow-tooltip
        align="center"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="order_type"
        :label="$t('message.orderManagement.orderType')"
        show-overflow-tooltip
        width="160"
      >
        <template slot-scope="scope">
          <span>
            {{
              Number(scope.row.order_type) === 1
                ? $t('message.orderManagement.onePieceForShipping')
                : null
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        :label="$t('message.orderInfo.orderStatus')"
        show-overflow-tooltip
        width="150"
      >
        <template slot-scope="scope">
          <el-tag
            :type="orderStatusMarkColorMap[scope.row.order_status]"
            effect="plain"
            class="status-tag"
          >
            {{
              StockEntryStatusMap[scope.row.order_status]?.[$languageType] || ''
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('common.source')"
        width="100"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <el-tooltip
            :content="$t('common.source') + ':' + scope.row?.shop"
            placement="bottom"
            v-if="scope.row.source !== 0"
          >
            <el-tag
              effect="plain"
              :style="getTagStyle(scope.row.source, sourceColorMap)"
              class="status-tag"
            >
              {{ souringMap[scope.row.source]?.[$languageType] }}
            </el-tag>
          </el-tooltip>
          <el-tag
            effect="plain"
            :style="getTagStyle(scope.row.source, sourceColorMap)"
            class="status-tag"
            v-else
          >
            {{ souringMap[scope.row.source]?.[$languageType] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('message.orderManagement.warehouse')"
        prop="storage_uuid"
        width="180"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <span>
            {{ storageMap[scope.row.storage_uuid] }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="logistics_services"
        label="物流服务"
        show-overflow-tooltip
        width="160"
        align="center"
      >
      </el-table-column> -->
      <el-table-column
        prop="recipient_name"
        :label="$t('message.myAccount.recipient')"
        show-overflow-tooltip
        width="160"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="country"
        :label="$t('common.recipientCountry')"
        show-overflow-tooltip
        width="130"
        align="center"
      >
        <template slot-scope="scope">
          {{ getCountryByAbbreviation(scope.row.country) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="recipient_phone"
        :label="$t('message.storage.recipientContactInformation')"
        show-overflow-tooltip
        width="220"
        align="center"
      >
      </el-table-column>
      <el-table-column
        :label="$t('common.createTime')"
        prop="create_time"
        sortable
        width="160"
      >
      </el-table-column>
      <el-table-column
        :label="$t('message.orderInfo.CODAmount')"
        prop="cod_amount"
        width="110"
      >
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" style="margin-top: 10px">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryData.page_number"
        :page-sizes="[10, 50, 100]"
        :page-size="queryData.page_size"
        layout="total,sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </el-row>
    <BatchModifyLogistics
      :visible="batchModifyLogisticsVisible"
      :orderInfo="batchModifyLogisticsInfo"
      @close="closeBatchModifyLogistics"
    ></BatchModifyLogistics>
    <LogList
      :visible="logDetailVisible"
      :currentData="currentData"
      :title="$t('message.orderManagement.orderLog')"
      @close="closeLogDetail"
    ></LogList>
    <POrderRemark
      :visible="remarkVisible"
      :tableData="remarkList"
      @close="closeRemark"
    ></POrderRemark>
    <PPrintWaybill
      :visible="printWaybillVisible"
      :orderIds="printWaybillOrderIds"
      @close="closePrintWaybill"
    ></PPrintWaybill>
    <BatchCleanWaybill
      :visible="batchCleanWaybillVisible"
      :orderIds="cleanWaybillOrderIds"
      @close="closeBatchCleanWaybill"
    ></BatchCleanWaybill>
    <POrderDetail
      :logistics_channels="logistics_channels"
      :logisticsCompanyMap="logisticsCompanyMap"
      :visible="orderDetailVisible"
      :currentData="currentData"
      @close="closeDetail"
    ></POrderDetail>
    <PChangeOrder
      :visible="changeOrderVisible"
      @close="handleChangeOrderClose"
    ></PChangeOrder>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import {
  getCountryByAbbreviation,
  getStorageDefinition,
  query_all_logistics_channels,
  query_all_customers,
  fetchSpecificElementsQueryResults,
  removeEmptyStringValues,
  getTagStyle,
  getOrderInfoList
} from '@/common/common-func'
import BatchEditOrder from '@/pages/order-manage/components/batch-edit-order.vue'
import OrderDetail from '@/pages/order-manage/components/order-detail.vue'
import BatchModifyLogistics from '@/pages/order-manage/components/batch-modify-logistics.vue'
import LogList from '@/pages/order-manage/components/log-list.vue'
import POrderRemark from '@/pages/order-manage/components/p-order-remark.vue'
import PPrintWaybill from '@/pages/order-manage/components/p-print-waybill.vue'
import BatchCleanWaybill from '@/pages/order-manage/components/batch-clean-waybill.vue'
import PChangeOrder from '@/pages/order-manage/components/p-change-order.vue'
import POrderDetail from '@/pages/order-manage/components/p-order-detail.vue'
import utils from '@/utils/index'
import {
  dateTypeMap,
  pOrderFieldSelectMap,
  StockEntryStatusEnum,
  orderStatusMarkColorMap,
  StockEntryStatusMap,
  currencySymbolMap,
  souringMap,
  sourceColorMap
} from '@/common/field-maping'
export default {
  name: 'order',
  components: {
    PageHead,
    OrderDetail,
    SearchCard,
    CstTableHead,
    BatchEditOrder,
    BatchModifyLogistics,
    LogList,
    POrderRemark,
    PPrintWaybill,
    BatchCleanWaybill,
    POrderDetail,
    PChangeOrder
  },
  data () {
    return {
      souringMap,
      sourceColorMap,
      dateTypeMap: dateTypeMap,
      changeOrderVisible: false,
      storageList: [],
      customers: [],
      logDetailVisible: false,
      remarkVisible: false,
      cleanWaybillOrderIds: [],
      batchCleanWaybillVisible: false,
      orderDetailVisible: false,
      remarkList: [],
      currentSelectOrderId: '',
      shippingOption: 'edit',
      StockEntryStatusMap,
      currencySymbolMap,
      loading: false,
      tableHeight: 450,
      markOrderVisible: false,
      printWaybillVisible: false,
      batchModifyLogisticsVisible: false,
      batchModifyLogisticsInfo: [],
      printWaybillOrderIds: [],
      batchEditOrderIds: [],
      batchEditOrderVisible: false,
      shipingInfoList: [],
      shippingInfoVisible: false,
      radioAuditStatus: StockEntryStatusEnum[0].value,
      StockEntryStatusEnum: StockEntryStatusEnum,
      orderStatusMarkColorMap: orderStatusMarkColorMap,
      pOrderFieldSelectMap,
      tableData: [],
      logList: [],
      variantsTotal: 0,
      total: 0,
      multipleSelection: [],
      shippingVisible: false,
      orderVisible: false,
      currentData: {},
      recordData: {},
      operationType: 'add',
      currentShippingId: '',
      // 抽屉
      detailVisible: false,
      queryData: {
        page_number: 1,
        page_size: 10,
        date: '',
        remoteQuerySelect: [],
        queryKeyWord: pOrderFieldSelectMap[0].value,
        dateType: dateTypeMap[0].value,
        shop: 'ALL'
      },
      remoteLoading: false,
      logisticsRemoteLoading: false,
      remoteQueryOptions: [],
      multipleSelectionShipping: [],
      logistics_channels: [],
      logisticsCompanyMap: {},
      storageMap: {},
      customersRemoteLoading: false
    }
  },

  methods: {
    getCountryByAbbreviation,
    fetchSpecificElementsQueryResults,
    getTagStyle,
    getOrderInfoList,
    getcustomers () {
      this.customersRemoteLoading = true
      let provider_uuid = this.provider_uuid
      if (!provider_uuid) {
        console.error('provider_uuid is null or undefined')
        this.remoteLoading = false
        return
      }
      let queryParams = {
        provider_uuid: provider_uuid,
        page_number: 1,
        page_size: 1000
      }
      query_all_customers(queryParams, this.roleType)
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.customers = res.data.results.map((item) => ({
              user_code: item.user_code,
              user_id: item.related_id //TODO： 这里看是否需要转ID
            }))
          }
        })
        .finally(() => {
          this.customersRemoteLoading = false
        })
    },
    async getLogisticsChannels () {
      this.logisticsRemoteLoading = true
      let provider_uuid = this.provider_uuid
      if (!provider_uuid) {
        console.error('provider_uuid is null or undefined')
        this.remoteLoading = false
        return
      }
      let queryParams = {
        provider_uuid: provider_uuid,
        page_number: 1,
        page_size: 1000
      }
      await query_all_logistics_channels(queryParams, this.roleType)
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.logistics_channels = res.data.results.map((item) => ({
              channel_name: item.channel_name,
              channel_code: item.channel_code
            }))
            this.logisticsCompanyMap = res.data.results.reduce((acc, cur) => {
              acc[cur.channel_code] = cur.channel_name
              return acc
            }, {})
          }
        })
        .finally(() => {
          this.logisticsRemoteLoading = false
        })
    },
    async queryStorageDefinition () {
      const res = await getStorageDefinition(this.provider_uuid, this.roleType)
      if (this.$isRequestSuccessful(res.code)) {
        this.storageList = res.data.map((item) => ({
          label: item.name,
          value: item.storage_define_uuid
        }))
        res.data.forEach((obj) => {
          this.$set(this.storageMap, obj.storage_define_uuid, obj.name)
        })
        this.queryData.storage_uuid = this.storageList[0].value
      }
    },
    handleChangeOrderClose () {
      this.changeOrderVisible = false
    },
    closeDetail (refresh = false) {
      this.orderDetailVisible = false
      if (refresh) {
        this.getOrderList()
      }
    },
    batchCleanWaybill () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(this.$t('common.selectEditData'))
        return
      }
      this.batchCleanWaybillVisible = true
      this.cleanWaybillOrderIds = this.multipleSelection.map(
        (item) => item.order_id
      )
    },
    closeBatchCleanWaybill (refresh = false) {
      this.batchCleanWaybillVisible = false
      if (refresh) {
        this.getOrderList()
      }
    },
    changeOrder () {
      this.changeOrderVisible = true
    },
    closeBatchModifyLogistics (refresh = false) {
      this.batchModifyLogisticsVisible = false
      if (refresh) {
        this.getOrderList()
      }
    },
    async exportOrder () {
      let queryParam = {
        lan: this.$languageType
      }
      let queryString = ''
      if (this.multipleSelection.length !== 0) {
        queryString = this.multipleSelection
          .map((item) => `order_ids=${item.order_id}`)
          .join('&')
      } else {
        if (this.radioAuditStatus) {
          queryParam['order_status'] = this.radioAuditStatus
        }
        if (this.queryData.date !== '' && this.queryData.date.length !== 0) {
          queryParam['time_start'] = this.queryData.date[0]
          queryParam['time_end'] = this.queryData.date[1]
        }
        if (
          this.queryData.queryKeyWord === 'tracking_number' &&
          this.queryData.remoteQuerySelect !== null
        ) {
          queryParam['tracking_number'] = this.queryData.remoteQuerySelect
        }
        // 删除空字符串值
        queryParam = removeEmptyStringValues(queryParam)
        // 将 queryParam 对象转换为查询字符串
        const additionalQueryString = Object.entries(queryParam)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')

        queryString = additionalQueryString
      }
      try {
        const res = await this.$ajax({
          url: `/api-prefix/api/order/order-export?${queryString}`,
          method: 'get',
          roleType: this.roleType
        })
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(this.$t('message.orderManagement.exportInfo'))
        }
      } catch (error) {
        console.error(error)
      }
    },
    batchEditOrder () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(this.$t('common.selectEditData'))
        return
      }
      this.batchEditOrderIds = this.multipleSelection.map(
        (item) => item.order_id
      )
      this.batchEditOrderVisible = true
    },
    printWaybill () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(
          this.$t('message.orderManagement.printWaybillInfo')
        )
        return
      }
      this.printWaybillVisible = true
      this.printWaybillOrderIds = this.multipleSelection.map(
        (item) => item.order_id
      )
    },
    batchModifyLogistics () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(
          this.$t('message.orderManagement.batchLogisticsInfo')
        )
        return
      }

      this.batchModifyLogisticsInfo = this.multipleSelection.map((item) => {
        return {
          order_id: item.order_id,
          shipping_statuses: item.shipping_statuses
        }
      })
      this.batchModifyLogisticsVisible = true
    },
    async getPrintWaybillPdf (data) {
      // 遍历data对象
      for (const [fileName, fileUrl] of Object.entries(data)) {
        // 使用URL对象解析URL
        const urlObj = new URL(fileUrl)
        // 获取路径和查询字符串
        const urlPath = '/api-prefix' + urlObj.pathname + urlObj.search
        const params = new URLSearchParams(urlObj.search)
        const filenameWithExtension = params.get('filename')
        const filenameId = filenameWithExtension.split('.')[0] // 通过'.'分割字符串并取第一部分

        // 使用fetch API下载PDF文件
        try {
          const res = await this.$ajax({
            url: urlPath,
            method: 'get',
            responseType: 'blob'
          })
          const pdfBlob = new Blob([res], { type: 'application/pdf' })

          // 创建临时下载链接
          const downloadUrl = window.URL.createObjectURL(pdfBlob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = fileName + '-' + filenameId // 设置下载的文件名
          // link.setAttribute('download', fileName); // 为下载的文件命名
          document.body.appendChild(link)
          link.click()

          // 清理并移除链接
          link.parentNode.removeChild(link)
          window.URL.revokeObjectURL(downloadUrl)
        } catch (error) {
          console.error('下载 PDF 文件时出错:', error)
        }
      }
    },
    handleDropdownCommand (command) {
      const keys = Object.keys(command)
      const key = keys[0]
      let rowData = command[key]
      this.currentData = rowData
      this.recordData = rowData
      switch (key) {
        case 'logDetail':
          this.showLogDetail(rowData)
          break
        case 'remark':
          this.showRemark(rowData)
          break

        default:
          break
      }
    },
    showLogDetail (row) {
      this.logDetailVisible = true
      this.currentData = row
    },
    closeLogDetail (refresh = false) {
      this.logDetailVisible = false
      if (refresh) {
        this.getOrderList()
      }
    },
    showRemark (row) {
      this.remarkVisible = true
      this.remarkList = [
        {
          date: '2022-06-06',
          name: 'wjp',
          remark: '备注1'
        },
        {
          date: '2022-06-06',
          name: 'wjp2',
          remark: '备注2'
        },
        {
          date: '2022-06-06',
          name: 'wjp3',
          remark: '备注3'
        },
        {
          date: '2022-06-06',
          name: 'wjp4',
          remark: '备注4'
        }
      ]
    },
    closeRemark (refresh = false) {
      this.remarkVisible = false
      if (refresh) {
        this.getOrderList()
      }
    },
    closePrintWaybill () {
      this.printWaybillVisible = false
    },
    closePopconfirm () {
      // 模拟点击其他位置形成气泡确认框关闭
      document.body.click()
    },
    // 获取查询参数
    remoteQueryMethod (query) {
      if (query === '') {
        this.remoteQueryOptions = []
        return
      }
      // 用来远程获取数据
      this.remoteLoading = true
      const queryParam = {
        [this.queryData.queryKeyWord]: query
      }
      this.fetchSpecificElementsQueryResults(queryParam)
        .then((remoteQueryResult) => {
          // 成功获取数据后的处理逻辑
          this.remoteQueryOptions = remoteQueryResult.map((item) => {
            return {
              label: item,
              value: item
            }
          })
          this.queryData.remoteQuerySelect = query
        })
        .catch(() => {
          // 处理错误情况
          this.remoteQueryOptions = []
          this.queryData.remoteQuerySelect = query
        })
        .finally(() => {
          this.remoteLoading = false
        })
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    showDetail (row) {
      this.orderDetailVisible = true
      this.currentData = row
    },
    showModal (type) {
      this.closePopconfirm()
      this.shippingVisible = true
      this.operationType = type
    },
    // 新增订单
    showOrderModal (orderInfo, type) {
      this.closePopconfirm()
      this.operationType = type
      this.orderVisible = true
      this.currentData = orderInfo
    },

    // 弹窗确认后刷新列表
    onConfirm () {
      this.markOrderVisible = false
      this.shippingVisible = false
      this.orderVisible = false
      this.batchEditOrderVisible = false
      this.getOrderList()
    },
    getOrderList () {
      this.loading = true
      const queryParam = {
        page_number: this.queryData.page_number,
        page_size: this.queryData.page_size
        // tracking_number: this.queryData.tracking_number,
      }
      queryParam['shop'] = this.queryData.shop
      if (this.provider_uuid) {
        queryParam['provider_uuid'] = this.provider_uuid
      } else {
        this.loading = false
        return
      }
      if (this.queryData.remoteQuerySelect !== '') {
        queryParam[this.queryData.queryKeyWord] =
          this.queryData.remoteQuerySelect
      }
      if (this.queryData.orderStatus !== '') {
        queryParam['order_status'] = this.queryData.orderStatus
      }
      //组装日期查询
      if (this.queryData.date !== '' && this.queryData.date.length > 0) {
        queryParam['time_start'] = this.queryData.date[0]
        queryParam['time_end'] = this.queryData.date[1]
      }
      if (this.queryData.storage_uuid !== '') {
        queryParam['storage_uuid'] = this.queryData.storage_uuid
      }
      if (this.queryData.customer !== '') {
        queryParam['user_code'] = this.queryData.customer
      }
      if (this.queryData.shipping_company !== '') {
        queryParam['shipping_company'] = this.queryData.shipping_company
      }
      if (this.queryData.dateType !== '') {
        queryParam['date_type'] = this.queryData.dateType
      }
      this.getOrderInfoList(queryParam)
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            // this.initTableData(utils.deepClone(res.data.results))
            let results = utils.deepClone(res.data.results)
            results.map((item) => {
              item.loadInfo = false
              item.productsInfo = []
            })
            this.tableData = results
            this.total = res.data.total
            this.objectSpanFlag = false
            // 获取订单各状态数量
            // this.queryCountStatus()
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
      this.queryData.page_size = val
      this.getOrderList()
    },
    handleCurrentChange (val) {
      this.queryData.page_number = val
      this.getOrderList()
    },
    queryOrder () {
      this.queryData.page_number = 1
      this.getOrderList()
    },

    resetQuery () {
      this.queryData = {
        page_number: 1,
        page_size: 10,
        queryKeyWord: pOrderFieldSelectMap[0].value,
        remoteQuerySelect: '',
        date: '',
        storage_uuid: '',
        dateType: dateTypeMap[0].value
      }
    }
  },
  async mounted () {
    if (this.provider_uuid) {
      this.getLogisticsChannels()
      this.getcustomers()
      await this.queryStorageDefinition()
    }

    this.getOrderList()
  },
  computed: {
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },
    shops () {
      let shopList = ['ALL']
      const storedShops = JSON.parse(
        localStorage.getItem(this.config[this.roleType].shopList)
      )
      if (Array.isArray(storedShops) && storedShops.length > 0) {
        shopList = shopList.concat(storedShops)
      }
      return shopList
    },
    tableMaxHeight () {
      // 视窗高度-(头部-搜索框)-(分页-底部)  通用列表自适应视窗高度
      return window.innerHeight - 290 - 90
    }
  },
  watch: {
    async provider_uuid (newVal) {
      if (newVal) {
        this.getLogisticsChannels()
        this.getcustomers()
        await this.queryStorageDefinition()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep
  .audit-status:last-child
  .badge-inside-button
  .el-radio-button
  .el-radio-button__inner:last-child {
  border-radius: 0 4px 4px 0;
  background-color: green;
}

::v-deep .el-badge__content {
  z-index: 100;
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
