<!--
* @description  参数1
* @fileName  p-print-orders
* @author wjp
* @date 2024-07-04 22:11:25
!-->
<!--
* @description  参数1
* @fileName  p-print-orders
* @author wjp
* @date 2024-07-04 22:08:23
!-->
<template>
  <div id="p-print-orders" class="p-print-orders">
    <PageHead :title="$t('navigate.printOrders')"> </PageHead>
    <SearchCard>
      <el-form :inline="true" :model="queryData" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="queryData.queryKeyWord"
            :placeholder="$t('common.pleaseSelect')"
            style="width: 120px"
          >
            <el-option
              v-for="item in pPrintOrderStatus"
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
        <el-form-item>
          <el-select
            v-model="queryData.service_providers"
            filterable
            clearable
            style="width: 140px"
            :placeholder="$t('common.serviceProviders')"
          >
            <el-option
              v-for="item in serviceProviderList"
              :key="item.service_provider_id"
              :label="item.service_provider"
              :value="item.service_provider"
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
          <el-select
            v-model="queryData.wave_order_state"
            :placeholder="$t('message.storage.waveOrderState')"
            style="width: 120px"
          >
            <el-option
              v-for="item in pPrintOrderStatus"
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
      <template slot="top-left"> </template>
      <template slot="top-right">
        <el-button icon="el-icon-printer" disabled type="primary" plain>{{
          $t('message.orderManagement.printWaybill')
        }}</el-button>
        <el-button icon="el-icon-document" disabled type="primary" plain>{{
          $t('message.orderManagement.printWaveOrder')
        }}</el-button>
        <el-button icon="el-icon-close" disabled type="primary" plain>{{
          $t('message.storage.revokeWaveTimes')
        }}</el-button>
        <el-button icon="el-icon-check" disabled type="primary" plain>{{
          $t('message.storage.pickingCompleted')
        }}</el-button>
        <el-button icon="el-icon-close" disabled type="primary" plain>{{
          $t('message.storage.cancelTask')
        }}</el-button>
        <el-button icon="el-icon-download" disabled type="primary" plain>{{
          $t('common.export')
        }}</el-button></template
      >
    </CstTableHead>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="530px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="wave_number"
        sortable
        :label="$t('message.storage.waveNumber')"
        show-overflow-tooltip
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('message.storage.warehouse')"
        show-overflow-tooltip
        width="100"
      >
        <template slot-scope="scope">
          {{ storageMap[scope.row.storage_uuid] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="order_quantity"
        :label="$t('message.storage.orderQuantity')"
        show-overflow-tooltip
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="product_quantity"
        :label="$t('message.storage.productQuantity')"
        width="160"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column
        prop="user_code"
        :label="$t('message.storage.userCode')"
        show-overflow-tooltip
        width="100"
      >
      </el-table-column>

      <el-table-column
        prop="logistics_channels"
        :label="$t('message.myAccount.logisticsChannels')"
        show-overflow-tooltip
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="recipient_country"
        :label="$t('common.recipientCountry')"
        show-overflow-tooltip
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="wave_type"
        :label="$t('message.storage.waveType')"
        show-overflow-tooltip
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="wave_order_status"
        :label="$t('message.storage.waveOrderState')"
        show-overflow-tooltip
        width="140"
      >
      </el-table-column>
      <el-table-column
        prop="waveStrategy"
        :label="$t('message.storage.waveStrategy')"
        show-overflow-tooltip
        width="110"
      >
      </el-table-column>

      <el-table-column
        prop="printing_waybill_frequency"
        :label="$t('message.storage.printingWaybillFrequency')"
        show-overflow-tooltip
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="printing_wave_order_frequency"
        :label="$t('message.storage.printingWaveOrderFrequency')"
        show-overflow-tooltip
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="receiver"
        :label="$t('message.storage.receiver')"
        show-overflow-tooltip
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="receiverTime"
        :label="$t('message.storage.receiverTime')"
        show-overflow-tooltip
        width="100"
      >
      </el-table-column>

      <el-table-column
        prop="generation_time"
        :label="$t('message.storage.generationTime')"
        show-overflow-tooltip
        width="120"
      >
      </el-table-column>

      <el-table-column :label="$t('common.operation')" fixed="left" width="80">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="text" size="small">
            {{ $t('common.check') }}
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
    <PPrintOrderDetail
      :visible="drawerVisible"
      :currentData="currentData"
      @close="drawerVisible = false"
      :storageMap="storageMap"
    >
    </PPrintOrderDetail>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import SelectCountry from '@/pages/components/select-country.vue'
import { getStorageDefinition, query_all_logistics_channels, query_all_customers, fetchSpecificElementsQueryResults, removeEmptyStringValues } from '@/common/common-func'
import PPrintOrderDetail from './components/p-print-orders-detail.vue'
import {
  hasTrackingNumberMap,
  pPrintOrderStatus,
  orderTypeList
} from '@/common/field-maping'
export default {
  name: 'p-print-orders',
  props: {
  },
  components: {
    PageHead,
    SearchCard,
    CstTableHead,
    SelectCountry,
    PPrintOrderDetail
  },
  data () {
    return {
      drawerVisible: false,
      currentData: {},
      tableData: [
        {
          wave_number: '202107040001',
          storage_uuid: '1',
          order_quantity: 10,
          product_quantity: 10,
          user_code: 'test',
          logistics_channels: 'DHL',
          recipient_country: 'US',
          wave_type: '1',
          wave_order_status: '1',
          waveStrategy: '1',
          printing_waybill_frequency: 1,
          printing_wave_order_frequency: 1,
          receiver: 'test',
          receiverTime: '2021-07-04 12:00:00',
          generation_time: '2021-07-04 12:00:00'
        }
      ],
      hasTrackingNumberMap,
      pPrintOrderStatus,
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
        page_number: 1,
        page_size: 10,
        date: '',
        queryKeyWord: pPrintOrderStatus[0].value,
        has_tracking_number: '',
        remoteQuerySelect: '',
        storage_uuid: '',
        customer: '',
        shipping_company: '',
        date: '',
        country: "",
        wave_order_state: ''
      },
      serviceProviderList: [
        {
          service_provider_id: 1,
          service_provider: 'DHL'
        },
        {
          service_provider_id: 2,
          service_provider: 'UPS'
        },
        {
          service_provider_id: 3,
          service_provider: 'FEDEX'
        }
      ],
      total: 0
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    showDetail (row) {
      this.drawerVisible = true
      this.currentData = row
    },
    // 获取查询参数
    fetchSpecificElementsQueryResults,
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
      //TODO: 这里this.roleType获取不到只能this.roleType需要优化
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
      this.fetchSpecificElementsQueryResults(queryParam).then((remoteQueryResult) => {
        // 成功获取数据后的处理逻辑
        this.remoteQueryOptions = remoteQueryResult.map((item) => {
          return {
            label: item,
            value: item
          }
        })
        this.queryData.remoteQuerySelect = query
      }).catch((error) => {
        console.error(error)
        // 处理错误情况
        this.remoteQueryOptions = []
        this.queryData.remoteQuerySelect = query
      }).finally(() => {
        this.remoteLoading = false
      })
    },
    getResultList () {
      this.queryData = this.removeEmptyStringValues(this.queryData)
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
        queryKeyWord: pPrintOrderStatus[0].value,
        country: '',
        remoteQuerySelect: '',
        date: '',
        storage_uuid: '',
        customer: '',
        shipping_company: '',
        has_tracking_number: '',
        wave_order_state: ''
      }
    }

  },
  computed: {
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },

  },
  async mounted () {
    if (this.provider_uuid) {
      await this.getLogisticsChannels();
      this.getcustomers()
    }
    await this.queryStorage()
    this.getResultList()

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