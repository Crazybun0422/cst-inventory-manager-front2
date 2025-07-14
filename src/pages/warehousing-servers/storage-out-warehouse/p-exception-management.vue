<!--
* @description  参数1
* @fileName  p-exception-management
* @author wjp
* @date 2024-07-04 22:21:13
!-->
<!--
* @description  参数1
* @fileName  p-exception-management
* @author wjp
* @date 2024-07-04 22:07:25
!-->
<template>
  <div id="p-exception-management" class="p-exception-management">
    <PageHead :title="$t('navigate.exceptionManagement')"> </PageHead>
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
          <el-select
            v-model="queryData.order_status"
            filterable
            clearable
            style="width: 140px"
            :placeholder="$t('message.storage.shippingOrderStatus')"
          >
            <el-option
              v-for="item in deliveryStatusMap"
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
        <el-button icon="el-icon-close" type="primary" @click="toDraft" plain>
          {{ $t('message.storage.submitDraft') }}
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
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="exception_order_number"
        label="异常单号"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="processing_results"
        label="处理结果"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="shipping_order_number"
        :label="$t('message.storage.shippingOrderNumber')"
        width="170"
        show-overflow-tooltip
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
        prop="tracking_number"
        :label="$t('message.storage.waybillNumber')"
      ></el-table-column>
      <el-table-column
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
        align="center"
        :label="$t('message.orderManagement.receivingCountry')"
        show-overflow-tooltip
        width="145"
        prop="country"
      >
      </el-table-column>
      <el-table-column prop="status" label="发货单状态">
        <template slot-scope="scope">
          <el-tag size="small" class="status-tag">{{
            deliveryStatusDict[scope.row.status]
              ? deliveryStatusDict[scope.row.status][$languageType]
              : '-'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="shipping_order_number"
        :label="$t('message.storage.shippingOrderNumber')"
        width="170"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column :label="$t('common.operation')" fixed="left">
        <template slot-scope="scope">
          <el-button
            @click="checkException(scope.row)"
            type="text"
            size="small"
          >
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
    <PExceptionManagementDetail
      :visible.sync="drawerVisible"
      :currentData="currentData"
      :storageMap="storageMap"
      @close="onCloseDrawer"
    ></PExceptionManagementDetail>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import SelectCountry from '@/pages/components/select-country.vue'
import PExceptionManagementDetail from './components/p-exception-management-detail.vue'
import { getStorageDefinition, query_all_logistics_channels, query_all_customers, fetchSpecificElementsQueryResults, removeEmptyStringValues } from '@/common/common-func'
import {
  deliveryStatusMap,
  pOrderFieldSelectMap
} from '@/common/field-maping'
export default {
  name: 'p-exception-management',
  props: {
  },
  components: {
    PageHead,
    SearchCard,
    CstTableHead,
    SelectCountry,
    PExceptionManagementDetail
  },
  data () {
    return {
      deliveryStatusMap,
      pOrderFieldSelectMap,
      drawerVisible: false,
      remoteLoading: false,
      logisticsRemoteLoading: false,
      customersRemoteLoading: false,
      currentData: {},
      storageList: [],
      customers: [],
      storageMap: {},
      remoteQueryOptions: [],
      logistics_channels: [],
      queryData: {
        page_number: 1,
        page_size: 10,
        date: '',
        queryKeyWord: pOrderFieldSelectMap[0].value,
        order_status: '',
        remoteQuerySelect: '',
        storage_uuid: '',
        customer: '',
        shipping_company: '',
        date: '',
        country: ""
      },
      total: 0,
      tableData: [
        {
          exception_order_number: '12312313',
          processing_results: '已处理',
          shipping_order_number: '123456',
          system_number: '123456',
          tracking_number: '123456',
          product_barcode: '123456',
          quantity: '123456',
          quantity_scanned: '123456',
          status: 1,
          storage_uuid: "5634d0cd-168e-46a1-b6e3-1a8493d9d1ec",
          user_code: '1231',
          country: '中国'
        }

      ],
      multipleSelection: []
    }
  },
  methods: {
    // 获取查询参数
    fetchSpecificElementsQueryResults,
    removeEmptyStringValues,
    checkException (row) {
      this.currentData = row
      this.drawerVisible = true
    },
    onCloseDrawer () {
      this.drawerVisible = false
    },
    handleSelectionChange (val) {
      this.multipleSelection = val

    },
    toDraft () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: this.$t('common.pleaseSelectTheDataToBeSubmitted'),
          type: 'warning'
        })
        return
      }

    },
    async queryStorageDef () {

      const res = await getStorageDefinition(this.provider_uuid, this.roleType)
      if (this.$isRequestSuccessful(res.code)) {
        this.storageDefinitionList = res.data.map(item => ({
          label: item.name,
          value: item.storage_define_uuid
        }));
        this.queryData.storage_define_uuid = this.storageDefinitionList[0]?.value
        res.data.forEach((obj) => {
          this.$set(this.storageMap, obj.storage_define_uuid, obj.name)

        })

      }
    },
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
        // 处理错误情况
        console.error(error)
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
        queryKeyWord: pOrderFieldSelectMap[0].value,
        country: '',
        order_status: '',
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

    deliveryStatusDict () {
      return this.deliveryStatusMap.reduce((acc, cur) => {
        acc[cur.value] = cur.label
        return acc
      }, {})

    }
  },
  async mounted () {
    if (this.provider_uuid) {
      await this.getLogisticsChannels();
      this.getcustomers()
    }
    // await this.queryStorage()
    await this.queryStorageDef()
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