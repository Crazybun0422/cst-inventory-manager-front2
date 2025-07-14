<!--
* @description  参数1
* @fileName  p-one-piece-for-shipping
* @author wjp
* @date 2024-07-04 22:03:39
!-->
<template>
  <div id="p-one-piece-for-shipping" class="p-one-piece-for-shipping">
    <PageHead :title="$t('navigate.onePieceForShipping')"> </PageHead>
    <SearchCard>
      <el-form :inline="true" :model="queryData" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="queryData.queryKeyWord"
            :placeholder="$t('common.pleaseSelect')"
            style="width: 120px"
          >
            <el-option
              v-for="item in pOnePeiceForShippingFieldSelectMap"
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
            v-model="queryData.storage_uuid"
            filterable
            clearable
            style="width: 140px"
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
            v-model="queryData.drop_shipping_id"
            filterable
            clearable
            style="width: 140px"
            :placeholder="$t('common.pleaseSelectCustomer')"
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
          <el-select
            popper-class="more-tag-data"
            v-model="queryData.shipping_company"
            clearable
            filterable
            :loading="logisticsRemoteLoading"
            style="width: 140px"
            @focus="getLogisticsChannels"
            :placeholder="$t('message.myAccount.logisticsChannelsSelect')"
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
          <SelectCountry v-model="queryData.recipient_country"></SelectCountry>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryData.timeType"
            :placeholder="$t('common.pleaseSelect')"
            style="width: 120px"
          >
            <el-option
              v-for="item in pOnePeiceForShippingTimeSelectMap"
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
          <el-button type="primary" @click="queryResult">{{
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
            v-for="item in onePiceForShippingStatusMap"
            :key="item.value"
            :max="99"
            :hidden="auditStatusMap[item.value] === 0"
            :type="onePiceForShippingStatusColorMap[item.value]"
          >
            <el-radio-button :label="item.value" :value="item.value">
              <span>{{ item.label[$languageType] }}</span>
            </el-radio-button>
          </el-badge>
        </el-radio-group>
      </template>
      <template slot="bottom-left"> </template>
    </CstTableHead>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="530px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column
        prop="drop_shipping_id"
        :label="$t('message.storage.dropShippingId')"
        show-overflow-tooltip
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="order_id"
        sortable
        :label="$t('message.storage.orderNumber')"
        show-overflow-tooltip
        width="160"
      >
      </el-table-column>
      <el-table-column
        prop="cs_reference"
        sortable
        :label="$t('message.storage.referenceNo')"
        width="140"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="wave_number"
        sortable
        :label="$t('message.storage.waveOrderNumber')"
        width="150"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.wave_number !== '' ? scope.row.wave_number : '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="transfer_shipping_number"
        sortable
        :label="$t('message.storage.transferOrderNumber')"
        width="160"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>
            {{
              scope.row.transfer_shipping_number !== ''
                ? scope.row.transfer_shipping_number
                : '-'
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('message.storage.waybillNumber')"
        width="170"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            v-for="shipping_info in scope.row.shipping_info"
            :key="shipping_info._id"
            style="display: block; target: _blank"
            @click="toShippingDetail(scope.row)"
          >
            {{ shipping_info.tracking_number }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="$t('message.storage.pendingOrderStatus')"
        width="150"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-tag
            :type="onePiceForShippingStatusColorMap[scope.row.status]"
            effect="plain"
            class="status-tag"
          >
            {{
              onePiceForShippingStatusMap.find(
                (item) => item.value === scope.row.status
              ).label[$languageType]
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="customer_id"
        sortable
        :label="$t('message.storage.userCode')"
        show-overflow-tooltip
        width="100"
      >
      </el-table-column>
      <!-- <el-table-column
        prop="typology"
        :label="$t('common.typology')"
        width="160"
        show-overflow-tooltip
      >
      </el-table-column> -->
      <el-table-column
        prop="name"
        :label="$t('message.storage.warehouse')"
        show-overflow-tooltip
        width="160"
      >
        <template slot-scope="scope">
          {{ storageMap[scope.row.storage_uuid] }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('common.recipientCountry')"
        show-overflow-tooltip
        width="130"
      >
        <template slot-scope="scope">
          {{ getCountryByAbbreviation(scope.row.recipient_info.country) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="confirm_time"
        :label="$t('message.storage.submissionDeterminationTime')"
        show-overflow-tooltip
        width="220"
      >
      </el-table-column>
      <el-table-column
        prop="create_time"
        :label="$t('common.createTime')"
        show-overflow-tooltip
        width="160"
      >
      </el-table-column>
      <el-table-column
        :label="$t('common.operation')"
        fixed="left"
        :width="operationWidth"
      >
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="text" size="small">
            {{ $t('common.check') }}
          </el-button>
          <!-- <el-button @click="showDetail(scope.row)" type="text" size="small">
            {{ $t('common.log') }}
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" style="margin-top: 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryData.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination
    ></el-row>
    <POnePieceForShippingDetail
      :visible.sync="drawerVisible"
      :currentData="currentData"
      :storageMap="storageMap"
      @close="drawerVisible = false"
    >
    </POnePieceForShippingDetail>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import POnePieceForShippingDetail from './components/p-one-piece-for-shipping-detail.vue'
import SelectCountry from '@/pages/components/select-country.vue'
import {
  getStorageDefinition,
  query_all_logistics_channels,
  query_all_customers,
  fetchDropshippingSpecificElements,
  getCountryByAbbreviation,
  removeEmptyStringValues,
  toShippingDetail
} from '@/common/common-func'
import {
  StockEntryStatusEnum,
  pOnePeiceForShippingFieldSelectMap,
  onePiceForShippingStatusMap,
  onePiceForShippingStatusColorMap,
  pOnePeiceForShippingTimeSelectMap
} from '@/common/field-maping'
import { del } from 'vue'
export default {
  name: 'p-one-piece-for-shipping',
  props: {},
  components: {
    PageHead,
    SearchCard,
    CstTableHead,
    POnePieceForShippingDetail,
    SelectCountry
  },
  data () {
    return {
      currentData: {},
      drawerVisible: false,
      pOnePeiceForShippingTimeSelectMap,
      tableData: [],
      multipleSelection: [],
      radioAuditStatus: 255,
      onePiceForShippingStatusMap,
      onePiceForShippingStatusColorMap,
      auditStatusMap: {},
      StockEntryStatusEnum,
      pOnePeiceForShippingFieldSelectMap,
      remoteLoading: false,
      logisticsRemoteLoading: false,
      customersRemoteLoading: false,
      storageList: [],
      customers: [],
      storageMap: {},
      remoteQueryOptions: [],
      logistics_channels: [],
      queryData: {
        page_number: 1,
        page_size: 10,
        date: '',
        queryKeyWord: pOnePeiceForShippingFieldSelectMap[0].value,
        remoteQuerySelect: '',
        storage_uuid: '',
        drop_shipping_id: '',
        shipping_company: '',
        date: '',
        timeType: pOnePeiceForShippingTimeSelectMap[0].value,
        recipient_country: ''
      },
      total: 0
    }
  },
  methods: {
    removeEmptyStringValues,
    toShippingDetail,
    getCountryByAbbreviation,
    showDetail (row) {
      this.drawerVisible = true
      this.currentData = row
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取查询参数
    handleRadioChange (val) {
      this.queryData = {
        ...this.queryData,
        page_number: 1,
        page_size: this.queryData.page_size
      }

      // 如果 status 不等于 255，则添加 status 字段
      if (val !== 255) {
        this.queryData.status = val
      } else {
        // 如果 status 为 255，确保删除已存在的 status 字段
        delete this.queryData.status
      }
      this.getResultList()
    },
    fetchDropshippingSpecificElements,
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
      //TODO: 这里this.roleType获取不到只能this.roleType需要优化
      await query_all_logistics_channels(queryParams, this.roleType)
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.logistics_channels = res.data.results.map((item) => ({
              channel_name: item.channel_name,
              channel_code: item.channel_code
            }))
          }
        })
        .finally(() => {
          this.logisticsRemoteLoading = false
        })
    },
    async queryStorage () {
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
    remoteQueryMethod (query) {
      if (query === '') {
        this.remoteQueryOptions = []
        return
      }
      // 用来远程获取数据
      this.remoteLoading = true
      const queryParam = {
        [this.queryData.queryKeyWord]: query,
        storage_uuid: this.queryData.storage_uuid
      }
      this.fetchDropshippingSpecificElements(queryParam, this.roleType)
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
        .catch((error) => {
          // 处理错误情况
          console.error(error)
          this.remoteQueryOptions = []
          this.queryData.remoteQuerySelect = query
        })
        .finally(() => {
          this.remoteLoading = false
        })
    },
    getResultList () {
      if (this.queryData.remoteQuerySelect !== '') {
        this.queryData[this.queryData.queryKeyWord] =
          this.queryData.remoteQuerySelect
      }
      let queryParam = { provider_uuid: this.provider_uuid }
      if (this.queryData.date && this.queryData.date.length > 0) {
        queryParam[`${this.queryData.timeType}_start`] = this.queryData.date[0]
        queryParam[`${this.queryData.timeType}_end`] = this.queryData.date[1]
      }
      this.queryData = this.removeEmptyStringValues(this.queryData)
      Object.keys(this.queryData).forEach((key) => {
        // 排除 remoteQuerySelect 和 queryKeyWord 属性
        if (
          ['remoteQuerySelect', 'queryKeyWord', 'date', 'timeType'].includes(
            key
          ) === false
        ) {
          if (this.queryData[key] !== '') queryParam[key] = this.queryData[key]
        }
      })
      this.$ajax({
        url: '/api-prefix/api/dropshipping/query-list',
        method: 'get',
        params: queryParam,
        roleType: this.roleType
      }).then((res) => {
        if (this.$isRequestSuccessful(res.code)) {
          this.tableData = res.data.results
          this.total = res.data.total
          return this.getStatusCount(queryParam)
        }
      })
    },
    queryResult () {
      this.queryData.page_number = 1
      this.getResultList()
    },
    handleSizeChange (val) {
      this.queryData.page_size = val
      this.getResultList()
    },
    handleCurrentChange (val) {
      this.queryData.page_number = val
      this.getResultList()
    },
    resetQuery () {
      this.queryData = {
        status: 255,
        page_number: 1,
        page_size: 10,
        date: '',
        queryKeyWord: pOnePeiceForShippingFieldSelectMap[0].value,
        remoteQuerySelect: '',
        storage_uuid: '',
        drop_shipping_id: '',
        shipping_company: '',
        date: '',
        timeType: pOnePeiceForShippingTimeSelectMap[0].value,
        recipient_country: ''
      }
    },
    getStatusCount (params) {
      let queryParam = { ...params }
      if (this.provider_uuid) {
        queryParam.provider_uuid = this.provider_uuid
      }
      delete queryParam.status
      delete queryParam.page_size
      delete queryParam.page_number
      this.$ajax({
        url: '/api-prefix/api/dropshipping/status-count',
        method: 'get',
        params: queryParam,
        roleType: this.roleType
      }).then((res) => {
        if (this.$isRequestSuccessful(res.code)) {
          this.auditStatusMap = res.data
        }
      })
    }
  },
  computed: {
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },

    operationWidth () {
      if (this.$languageType === 'zh_cn') {
        return 100
      } else {
        return 120
      }
    }
  },
  async mounted () {
    if (this.provider_uuid) {
      await this.getLogisticsChannels()
      await this.queryStorage()
      this.getcustomers()
      this.getResultList()
    }
  },
  watch: {
    provider_uuid (newVal) {
      if (newVal) {
        this.getLogisticsChannels()
        this.getcustomers()
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
