<!--
* @description  批量称重
* @fileName  p-batch-weighing
* @author wjp
* @date 2024-07-04 22:19:32
!-->
<template>
  <div id="p-batch-weighing" class="p-batch-weighing">
    <PageHead :title="$t('navigate.batchWeighing')"> </PageHead>
    <SearchCard>
      <el-form :inline="true" :model="queryData" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="queryData.queryKeyWord"
            :placeholder="$t('common.pleaseSelect')"
            style="width: 120px"
          >
            <el-option
              v-for="item in deliveryOrderFieldSelectMap"
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
          <SelectCountry
            v-model="queryData.country"
            style="width: 140px"
          ></SelectCountry>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryData.delivery_status"
            filterable
            clearable
            style="width: 140px"
            :placeholder="$t('message.storage.shippingOrderStatus')"
          >
            <el-option
              v-for="item in deliveryOrderStatusMap"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryData.orderType"
            filterable
            clearable
            style="width: 140px"
            :placeholder="$t('message.orderManagement.orderType')"
          >
            <el-option
              v-for="item in orderTypeList"
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
        <el-button
          icon="el-icon-s-data"
          @click="multipleCalculateShippingCosts"
          type="primary"
          plain
          >{{ $t('message.storage.calculateShippingCosts') }}</el-button
        >
        <el-button
          icon="el-icon-edit"
          @click="multiplebModifyWeight"
          type="primary"
          plain
          >{{ $t('message.storage.batchModifyWeight') }}</el-button
        >
        <!-- <el-button icon="el-icon-upload2" disabled type="primary" plain>{{
          $t('common.import')
        }}</el-button>
        <el-button icon="el-icon-refresh" disabled type="primary" plain>{{
          $t('message.storage.qualityInspectionSynchronization')
        }}</el-button>
        <el-button icon="el-icon-download" disabled type="primary" plain>{{
          $t('common.export')
        }}</el-button> -->
      </template>
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
        prop="delivery_list_number"
        :label="$t('message.storage.shippingOrderNumber')"
        width="170"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="order_id"
        sortable
        :label="$t('message.storage.orderNumber')"
        width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="shipping_contents.tracking_number"
        :label="$t('message.storage.waybillNumber')"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('message.storage.warehouse')"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ storageMap[scope.row.storage_uuid] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="delivery_status"
        :label="$t('message.storage.shippingOrderStatus')"
        width="160"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-tag
            :type="deliveryOrderStatusColorMap[scope.row.delivery_status]"
            effect="plain"
            class="status-tag"
          >
            {{
              deliveryOrderStatusMap.find(
                (item) => item.value === scope.row.delivery_status
              )?.label[$languageType] || ''
            }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="user_code"
        :label="$t('message.storage.userCode')"
        show-overflow-tooltip
        width="100"
      >
      </el-table-column>

      <el-table-column
        prop="country"
        :label="$t('common.country')"
        show-overflow-tooltip
        width="100"
      >
      </el-table-column>
      <el-table-column
        :label="$t('navigate.waveOrder')"
        show-overflow-tooltip
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.wave_order_number ? scope.row.wave_order_number : '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="shipping_details.shipping_fee"
        :label="$t('message.storage.shippingCosts')"
        width="110"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="recipient_name"
        :label="$t('message.myAccount.recipient')"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="recipient_phone"
        :label="$t('message.myAccount.phone')"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="create_time"
        sortable
        :label="$t('common.createTime')"
        show-overflow-tooltip
        width="160"
      >
      </el-table-column>
      <!-- <el-table-column :label="$t('common.operation')" fixed="left" width="140">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="text" size="small">
            {{ $t('common.check') }}
          </el-button>
          <el-button
            @click="calculateShippingCosts([scope.row.entity_id])"
            :disabled="scope.row.delivery_status !== 5"
            type="text"
            size="small"
          >
            {{ $t('message.storage.calculateShippingCosts') }}
          </el-button>
          <el-button
            :disabled="scope.row.delivery_status !== 4"
            @click="batchModifyWeight([scope.row.entity_id])"
            type="text"
            size="small"
          >
            {{ $t('message.storage.batchModifyWeight') }}
          </el-button>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('common.operation')" fixed="left" width="140">
        <template slot-scope="scope">
          <el-button
            @click="showDetail(scope.row)"
            type="text"
            size="small"
            style="margin-right: 12px"
          >
            {{ $t('common.check') }}
          </el-button>
          <el-dropdown
            trigger="click"
            :hide-on-click="false"
            @command="handleDropdownCommand"
          >
            <el-button type="text" size="small">
              {{ $t('common.more') }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="{ calculateShippingCosts: scope.row }"
              >
                <el-button type="text" size="small">
                  {{ $t('message.storage.calculateShippingCosts') }}
                </el-button>
              </el-dropdown-item>

              <el-dropdown-item :command="{ batchModifyWeight: scope.row }">
                <el-button type="text" size="small">
                  {{ $t('message.storage.batchModifyWeight') }}
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
    <PListOfShippingOrdersDetail
      :visible.sync="drawerVisible"
      :currentData="currentData"
      :storageMap="storageMap"
      @close="drawerVisible = false"
    >
    </PListOfShippingOrdersDetail>
    <PMultiplebModifyWeight
      :visible.sync="pMultiplebModifyWeightVisible"
      :delivery_ids="pMultiplebModifyWeightDeliveryIds"
      @close="closeBatchModifyWeight"
    >
    </PMultiplebModifyWeight>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import SelectCountry from '@/pages/components/select-country.vue'
import { getStorageDefinition, query_all_logistics_channels, query_all_customers, fetchDeliveryListSpecificElements, removeEmptyStringValues, fetchWaveStrategy } from '@/common/common-func'
import {
  deliveryStatusMap,
  deliveryOrderFieldSelectMap,
  orderTypeList,
  deliveryOrderStatusMap,
  deliveryOrderStatusColorMap
} from '@/common/field-maping'
import PListOfShippingOrdersDetail from './components/p-list-of-shipping-orders-detail.vue'
import PMultiplebModifyWeight from './components/p-multipleb-modify-weight.vue'
export default {
  name: 'p-list-of-shipping-orders',
  props: {
  },
  components: {
    PageHead,
    SearchCard,
    CstTableHead,
    SelectCountry,
    PListOfShippingOrdersDetail,
    PMultiplebModifyWeight
  },
  data () {
    return {
      pMultiplebModifyWeightDeliveryIds: [],
      pMultiplebModifyWeightVisible: false,
      tableLoading: false,
      deliveryOrderStatusMap,
      deliveryOrderStatusColorMap,
      tableData: [],
      drawerVisible: false,
      currentData: {},
      deliveryStatusMap,
      deliveryOrderFieldSelectMap,
      orderTypeList,
      remoteLoading: false,
      logisticsRemoteLoading: false,
      customersRemoteLoading: false,
      storageList: [],
      customers: [],
      storageMap: {},
      remoteQueryOptions: [],
      logistics_channels: [],
      waveStrategyMap: {},
      queryData: {
        page_number: 1,
        page_size: 10,
        date: '',
        queryKeyWord: deliveryOrderFieldSelectMap[0].value,
        delivery_status: '',
        remoteQuerySelect: '',
        storage_uuid: '',
        customer: '',
        shipping_company: '',
        date: '',
        order_type: "",
        country: ""
      },
      total: 0
    }
  },
  methods: {
    closeBatchModifyWeight (refresh = false) {
      this.pMultiplebModifyWeightVisible = false
      if (refresh) {
        this.getResultList()
      }
    },
    multipleCalculateShippingCosts () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(this.$t('common.pleaseSelectTheDataToBeSubmitted'))
        return
      }
      if (this.multipleSelection.some(item => item.delivery_status !== 5)) {
        this.$message.warning('请选择已称重的发货单')
        return
      }
      let delivery_ids = this.multipleSelection.map(item => item.entity_id)
      this.calculateShippingCosts(delivery_ids)
    },
    calculateShippingCosts (delivery_ids) {
      this.tableLoading = true
      this.$ajax({
        url: '/api-prefix/api/delivery_list/batch-delivery-pay',
        method: 'put',
        data: {
          delivery_ids: delivery_ids
        },
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
    handleDropdownCommand (command) {
      const keys = Object.keys(command)
      const key = keys[0]
      let rowData = command[key]
      this.currentData = rowData
      this.recordData = rowData
      switch (key) {
        case 'calculateShippingCosts':
          this.calculateShippingCosts([rowData.entity_id])
          break
        case 'batchModifyWeight':
          this.batchModifyWeight([rowData.entity_id])
          break

        default:
          break
      }
    },
    multiplebModifyWeight () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(this.$t('common.pleaseSelectTheDataToBeSubmitted'))
        return
      }
      if (this.multipleSelection.some(item => item.delivery_status !== 4)) {
        this.$message.warning('请选择已复核的发货单')
        return
      }
      this.pMultiplebModifyWeightVisible = true
      this.pMultiplebModifyWeightDeliveryIds = this.multipleSelection.map(item => item.entity_id)
    },
    batchModifyWeight (delivery_ids) {
      this.pMultiplebModifyWeightVisible = true
      this.pMultiplebModifyWeightDeliveryIds = delivery_ids
    },
    fetchWaveStrategy,
    getWaveStrategyMap () {
      let queryParams = {
        storage_id: this.queryData.storage_uuid
      }
      this.fetchWaveStrategy(queryParams, this.roleType).then(res => {
        this.waveStrategyMap = res
      })
    },
    showDetail (row) {

      this.drawerVisible = true
      this.currentData = row
    },
    // 获取查询参数
    handleSelectionChange (val) {
      this.multipleSelection = val

    },
    fetchDeliveryListSpecificElements,
    removeEmptyStringValues,
    getcustomers () {
      this.customersRemoteLoading = true
      let provider_uuid = this.provider_uuid
      if (!provider_uuid) {
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
      this.fetchDeliveryListSpecificElements(queryParam, this.roleType).then((remoteQueryResult) => {
        // 成功获取数据后的处理逻辑
        this.remoteQueryOptions = remoteQueryResult.map((item) => {
          return {
            label: item,
            value: item
          }
        })
      }).catch((error) => {
        // 处理错误情况
        console.error(error)
        this.remoteQueryOptions = []
      }).finally(() => {
        this.remoteLoading = false
      })
    },
    changeQueryKeyWord () {

      // 重置远程查询的数据
      this.remoteQueryOptions = []
    },
    getResultList () {
      this.tableLoading = true
      if (this.queryData.remoteQuerySelect !== '') {
        this.queryData[this.queryData.queryKeyWord] = this.queryData.remoteQuerySelect;
      }
      let queryParam = {
        provider_uuid: this.provider_uuid
      };
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
        url: '/api-prefix/api/delivery_list/query',
        method: 'get',
        params: queryParam,
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.tableData = res.data.results
          this.total = res.data.total
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
        queryKeyWord: deliveryOrderFieldSelectMap[0].value,
        order_type: '',
        country: '',
        delivery_status: '',
        remoteQuerySelect: '',
        date: '',
        storage_uuid: '',
        customer: '',
        shipping_company: ''
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
      await this.queryStorage()
      this.getcustomers()
      this.getResultList()
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