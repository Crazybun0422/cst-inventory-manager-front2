<!--
* @description  配货
* @fileName  p-distribution-of-goods
* @author wjp
* @date 2024-07-04 22:09:20
!-->
<template>
  <div id="p-distribution-of-goods" class="p-distribution-of-goods">
    <PageHead :title="$t('navigate.distributionOfGoods')"> </PageHead>
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
        prop="system_number"
        sortable
        :label="$t('message.storage.systemOrderNumber')"
        show-overflow-tooltip
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="order_number"
        :label="$t('message.storage.orderNumber')"
        show-overflow-tooltip
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="reference_number"
        :label="$t('message.storage.referenceNo')"
        width="140"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="waybill_number"
        :label="$t('message.storage.waybillNumber')"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="transfer_order_number"
        :label="$t('message.storage.transferOrderNumber')"
        width="160"
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
        prop="typology"
        :label="$t('common.typology')"
        width="100"
        show-overflow-tooltip
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
        prop="create_time"
        sortable
        :label="$t('common.createTime')"
        show-overflow-tooltip
        width="160"
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
        prop="country"
        :label="$t('common.country')"
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
        prop="product_num"
        :label="$t('message.storage.productQuantity')"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="product_type_num"
        :label="$t('message.storage.productTypeAndQuantity')"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="wares"
        :label="$t('common.wares')"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="delivery_order_time"
        :label="$t('message.storage.deliveryOrderGenerationTime')"
        width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="error_prompt"
        :label="$t('common.errorPrompt')"
        width="120"
        show-overflow-tooltip
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
    <PDistributionOfGoodsDetail
      :visible.sync="drawerVisible"
      :currentData="currentData"
      :storageMap="storageMap"
      @close="drawerVisible = false"
    >
    </PDistributionOfGoodsDetail>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import { getStorageDefinition, query_all_logistics_channels, query_all_customers, fetchSpecificElementsQueryResults } from '@/common/common-func'
import PDistributionOfGoodsDetail from './components/p-distribution-of-goods-detail.vue'
import {
  StockEntryStatusEnum,
  pOrderFieldSelectMap,
} from '@/common/field-maping'
export default {
  name: 'p-distribution-of-goods',
  props: {
  },
  components: {
    PageHead,
    SearchCard,
    CstTableHead,
    PDistributionOfGoodsDetail
  },
  data () {
    return {
      total: 0,
      currentData: {},
      drawerVisible: false,
      StockEntryStatusEnum,
      pOrderFieldSelectMap,
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
        queryKeyWord: pOrderFieldSelectMap[0].value,
        remoteQuerySelect: '',
        storage_uuid: '',
        customer: '',
        shipping_company: '',
        date: '',
        multipleSelection: [],
      },
      tableData: [
        {
          system_number: '202107040001',
          order_number: '202107040001',
          reference_number: '202107040001',
          waybill_number: '202107040001',
          transfer_order_number: '202107040001',
          shipping_order_number: '202107040001',
          typology: '类型',
          name: '无名',
          create_time: '2021-07-04 00:01',
          user_code: '202107040001',
          country: '202107040001',
          logistics_channels: '顺丰',
          product_num: '15',
          product_type_num: '11',
          wares: 'iPhone 15',
          delivery_order_time: '2021-07-04 00:01',
          error_prompt: '运单号错误！'
        }

      ]
    }
  },
  methods: {
    showDetail (row) {

      this.drawerVisible = true
      this.currentData = row
    },
    // 获取查询参数
    handleSelectionChange (val) {
      this.multipleSelection = val

    },
    // 获取查询参数
    fetchSpecificElementsQueryResults,
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
        page_number: 1,
        page_size: 10,
        queryKeyWord: pOrderFieldSelectMap[0].value,
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