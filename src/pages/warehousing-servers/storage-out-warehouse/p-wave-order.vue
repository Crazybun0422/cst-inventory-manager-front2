<!--
* @description  波次
* @fileName  p-wave-order
* @author wjp
* @date 2024-07-04 22:10:01
!-->
<template>
  <div id="p-wave-order" class="p-wave-order">
    <PageHead :title="$t('message.storage.waveTimes')"> </PageHead>
    <SearchCard>
      <el-form :inline="true" :model="queryData" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="queryData.queryKeyWord"
            :placeholder="$t('common.pleaseSelect')"
            style="width: 120px"
          >
            <el-option
              v-for="item in waveOrderFieldSelectMap"
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
            v-model="queryData.customer"
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

        <el-form-item prop="country">
          <SelectCountry v-model="queryData.country"></SelectCountry>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryData.product_barcode"
            clearable
            style="width: 140px"
            :placeholder="$t('message.productManagement.productBarcode')"
          >
          </el-input>
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
      <template slot="top-left"> </template>
      <template slot="top-right">
        <el-button
          icon="el-icon-circle-close"
          @click="multipleOperation('cancel')"
          type="danger"
          plain
          >{{ $t('message.storage.cancelWave') }}</el-button
        >
        <el-button
          icon="el-icon-circle-check"
          @click="multipleOperation('picking')"
          type="success"
          plain
          >{{ $t('message.storage.pickingCompleted') }}</el-button
        >
        <el-button
          icon="el-icon-printer"
          type="primary"
          plain
          @click="multipleOperation('printPickingList')"
          >{{ $t('message.storage.printWavePickingList') }}</el-button
        >
        <el-button
          icon="el-icon-printer"
          type="primary"
          plain
          @click="multipleOperation('printSummaryList')"
          >{{ $t('message.storage.printWaveSummarySheet') }}</el-button
        ></template
      >
    </CstTableHead>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="530px"
      @selection-change="handleSelectionChange"
      v-loading="tableLoading"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="wave_order_number"
        :label="$t('message.storage.waveOrderNumber')"
        show-overflow-tooltip
        min-width="150"
      >
      </el-table-column>
      <el-table-column
        prop="wave_strategy_name"
        :label="$t('message.storage.waveStrategy')"
        show-overflow-tooltip
        min-width="110"
      >
      </el-table-column>
      <el-table-column
        :label="$t('message.storage.warehouse')"
        show-overflow-tooltip
        min-width="160"
      >
        <template slot-scope="scope">
          {{ storageMap[scope.row.storage_id] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="$t('message.storage.waveOrderState')"
        show-overflow-tooltip
        min-width="140"
      >
        <template slot-scope="scope">
          <el-tag
            :type="waveOrderStatusColorMap[scope.row.status]"
            size="small"
            class="status-tag"
            >{{ waveOrderStatusMap[scope.row.status][$languageType] }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="deliveries_count"
        :label="$t('message.storage.deliveriesCount')"
        show-overflow-tooltip
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="products_count"
        :label="$t('message.storage.productsCount')"
        show-overflow-tooltip
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="wave_order_time"
        :label="$t('message.storage.waveOrderTime')"
        show-overflow-tooltip
        min-width="160"
      >
      </el-table-column>
      <el-table-column
        prop="modified_time"
        :label="$t('common.updateTime')"
        show-overflow-tooltip
        min-width="160"
      >
      </el-table-column>
      <el-table-column :label="$t('common.operation')" fixed="left" width="200">
        <template slot-scope="scope">
          <!-- <el-button @click="showDetail(scope.row)" type="text" size="small">
            {{ $t('common.check') }}
          </el-button> -->
          <el-button
            @click="cancelWaveOrder([scope.row.wave_order_number])"
            type="text"
            size="small"
          >
            {{ $t('message.storage.cancelWave') }}
          </el-button>
          <el-button
            @click="pickingCompleted([scope.row.wave_order_number])"
            type="text"
            size="small"
          >
            {{ $t('message.storage.pickingCompleted') }}
          </el-button>
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
    <PWaveOrderDetail
      :visible="drawerVisible"
      :currentData="currentData"
      @close="drawerVisible = false"
      :storageMap="storageMap"
    >
    </PWaveOrderDetail>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import SelectCountry from '@/pages/components/select-country.vue'
import { getStorageDefinition, query_all_logistics_channels, query_all_customers, fetchWaveOrderList, removeEmptyStringValues } from '@/common/common-func'
import PWaveOrderDetail from './components/p-wave-order-detail.vue'
import {
  hasTrackingNumberMap,
  waveOrderFieldSelectMap,
  orderTypeList,
  waveOrderStatusSelectMap,
  waveOrderStatusColorMap
} from '@/common/field-maping'
// import getFileIndependently from '@/common/download-file-mixin'
export default {
  name: 'p-wave-order',
  props: {
  },
  // mixins: [getFileIndependently],
  components: {
    PageHead,
    SearchCard,
    CstTableHead,
    SelectCountry,
    PWaveOrderDetail
  },
  data () {
    return {
      waveOrderStatusColorMap,
      waveOrderStatusSelectMap,
      tableLoading: false,
      hasTrackingNumberMap,
      waveOrderFieldSelectMap,
      orderTypeList,
      remoteLoading: false,
      logisticsRemoteLoading: false,
      customersRemoteLoading: false,
      storageList: [],
      customers: [],
      storageMap: {},
      remoteQueryOptions: [],
      logistics_channels: [],
      queryData: {
        queryKeyWord: waveOrderFieldSelectMap[0].value,
        remoteQuerySelect: '',
        storage_uuid: '',
        customer: '',
        shipping_company: '',
        country: '',
        product_barcode: '',
        date: '',
        page_number: 1,
        page_size: 10
      },
      drawerVisible: false,
      currentData: {},
      tableData: [

      ],
      multipleSelection: [],
      total: 0
    }
  },
  methods: {
    multipleOperation (type = '') {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(this.$t('common.pleaseSelectTheDataToBeSubmitted'))
        return
      }
      let wave_order_numbers = this.multipleSelection.map(item => item.wave_order_number)

      const operationMap = {
        cancel: this.cancelWaveOrder,
        picking: this.pickingCompleted,
        printPickingList: this.printWavePickingList,
        printSummaryList: this.printWaveSummaryList
      }
      operationMap[type](wave_order_numbers)
    },
    cancelWaveOrder (wave_order_numbers) {
      this.tableLoading = true
      this.$ajax({
        url: '/api-prefix/api/delivery_list/wave-cancel',
        method: 'put',
        data: { wave_order_numbers: wave_order_numbers },
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(res.msg[this.$languageType])
          this.getResultList()
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    pickingCompleted (wave_order_numbers) {
      this.tableLoading = true
      this.$ajax({
        url: '/api-prefix/api/delivery_list/picking-complete',
        method: 'put',
        data: { wave_order_numbers: wave_order_numbers },
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(res.msg[this.$languageType])
          this.getResultList()
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    printWavePickingList (wave_order_numbers) {
      this.tableLoading = true
      let wave_order_numbers_str = wave_order_numbers.map(id => `wave_order_numbers=${id}`).join('&');
      this.$ajax({
        url: `/api-prefix/api/delivery_list/print-wave-picking?&${wave_order_numbers_str}`,
        method: 'get',
        params: {},
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(res.msg[this.$languageType])
          this.getFileIndependently({ filename: res.data.name, provider_uuid: this.provider_uuid })
          this.getResultList()
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    printWaveSummaryList (wave_order_numbers) {
      this.tableLoading = true
      let wave_order_numbers_str = wave_order_numbers.map(id => `wave_order_numbers=${id}`).join('&');
      this.$ajax({
        url: `/api-prefix/api/delivery_list/print-summary-picking?&${wave_order_numbers_str}`,
        method: 'get',
        params: {},
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(res.msg[this.$languageType])
          this.getFileIndependently({ filename: res.data.name, provider_uuid: this.provider_uuid })
          this.getResultList()
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    showDetail (row) {
      this.drawerVisible = true
      this.currentData = row
    },
    // 获取查询参数
    fetchWaveOrderList,
    removeEmptyStringValues,
    getcustomers () {
      this.customersRemoteLoading = true
      let provider_uuid = this.provider_uuid
      if (!provider_uuid) {
        console.error("provider_uuid is null or undefined");
        this.remoteLoading = false;
        return;
      }
      let queryParams = {
        provider_uuid: provider_uuid,
        page_number: 1,
        page_size: 1000
      }
      query_all_customers(queryParams, this.roleType).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.customers = res.data.results.map(item => ({
            user_code: item.user_code,
            user_id: item.related_id //TODO： 这里看是否需要转ID
          }))
        }
      }).finally(() => {
        this.customersRemoteLoading = false
      })
    },
    async getLogisticsChannels () {
      this.logisticsRemoteLoading = true
      let provider_uuid = this.provider_uuid
      if (!provider_uuid) {
        console.error("provider_uuid is null or undefined");
        this.remoteLoading = false;
        return;
      }
      let queryParams = {
        provider_uuid: provider_uuid,
        page_number: 1,
        page_size: 1000
      }
      //TODO: 这里this.roleType获取不到只能this.$getRoleType(this.$route.path)需要优化
      await query_all_logistics_channels(queryParams, this.roleType).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.logistics_channels = res.data.results.map(item => ({
            channel_name: item.channel_name,
            channel_code: item.channel_code
          }))
        }
      }).finally(() => {
        this.logisticsRemoteLoading = false
      })

    },
    async queryStorage () {
      const res = await getStorageDefinition(this.provider_uuid, this.roleType)
      if (this.$isRequestSuccessful(res.code)) {
        this.storageList = res.data.map(item => ({
          label: item.name,
          value: item.storage_define_uuid
        }));
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
        [this.queryData.queryKeyWord]: query
      }
      this.fetchWaveOrderList(queryParam, this.roleType).then((remoteQueryResult) => {
        // 成功获取数据后的处理逻辑
        this.remoteQueryOptions = remoteQueryResult.map((item) => {
          return {
            label: item,
            value: item
          }
        })
      }).catch(() => {
        // 处理错误情况
        this.remoteQueryOptions = []
      }).finally(() => {
        this.remoteLoading = false
      })
    },
    getResultList () {
      this.tableLoading = true
      if (this.queryData.remoteQuerySelect !== '') {
        this.queryData[this.queryData.queryKeyWord] = this.queryData.remoteQuerySelect;
      }
      let queryParam = { provider_uuid: this.provider_uuid };
      if (this.queryData.date && this.queryData.date.length > 0) {
        queryParam[`${this.queryData.timeType}_start`] = this.queryData.date[0]
        queryParam[`${this.queryData.timeType}_end`] = this.queryData.date[1]
      }
      this.queryData = this.removeEmptyStringValues(this.queryData)

      Object.keys(this.queryData).forEach(key => {
        // 排除 remoteQuerySelect 和 queryKeyWord 属性
        if (['remoteQuerySelect', 'queryKeyWord', 'date', 'timeType'].includes(key) === false) {
          if (this.queryData[key] !== '') queryParam[key] = this.queryData[key];
        }
      });

      this.$ajax({
        url: '/api-prefix/api/delivery_list/query-wave-list',
        method: 'get',
        params: queryParam,
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.tableData = res.data.results
          this.total = res.data.total
          // this.tableData = res.data[0]
          // this.total = res.data[1]
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    queryResult () {
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
        page_number: 1,
        page_size: 10,
        queryKeyWord: waveOrderFieldSelectMap[0].value,
        country: '',
        remoteQuerySelect: '',
        date: '',
        storage_uuid: '',
        customer: '',
        shipping_company: '',
        product_barcode: ''
      }
    }
  },
  computed: {
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },

    waveOrderStatusMap () {
      return waveOrderStatusSelectMap.reduce((acc, item) => {
        acc[item.value] = item.label;
        return acc;
      }, {});
    }
  },
  async mounted () {
    if (this.provider_uuid) {
      await this.getLogisticsChannels();
      this.getcustomers()
      this.getResultList()
      await this.queryStorage()
    }



  },
  watch: {
    provider_uuid (newVal) {
      if (newVal) {
        this.getLogisticsChannels();
        this.getcustomers()
      }
    }
  }
}
</script>
<style scoped lang='css'>
</style>