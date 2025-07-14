<!--
* @description  装袋
* @fileName  p-bagging
* @author wjp
* @date 2024-07-04 22:07:12
!-->
<template>
  <div id="p-bagging" class="p-bagging">
    <PageHead :title="$t('navigate.bagging')"> </PageHead>
    <SearchCard>
      <el-form :inline="true" :model="queryData" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="queryData.queryKeyWord"
            :placeholder="$t('common.pleaseSelect')"
            style="width: 120px"
          >
            <el-option
              v-for="item in baggingFieldSelectMap"
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

        <el-form-item prop="country">
          <SelectCountry v-model="queryData.country"></SelectCountry>
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
        <el-button icon="el-icon-plus" @click="singleBagging" plain>{{
          $t('message.storage.singleBagging')
        }}</el-button>
        <el-button icon="el-icon-document-add" @click="batchBagging" plain>{{
          $t('message.storage.batchBagging')
        }}</el-button>
        <el-button
          icon="el-icon-printer"
          @click="multiplePrintBagNumbers"
          type="primary"
          plain
          >{{ $t('message.storage.printBagLabel') }}</el-button
        >
        <el-button icon="el-icon-download" disabled type="primary" plain>{{
          $t('message.storage.exportOrderInformation')
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
      v-loading="tableLoading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="bag_number"
        :label="$t('message.storage.bagNumber')"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="logistic_service"
        :label="$t('message.orderManagement.logisticsServices')"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.logistic_service ? scope.row.logistic_service : '-' }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('message.storage.channelCode')"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.channel_code ? scope.row.channel_code : '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="weight"
        :label="$t('message.productManagement.weight')"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        :label="$t('message.storage.dropShippingId')"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <a
            type="primary"
            style="display: block; cursor: pointer; target: _blank"
            v-for="drop_shipping_id in scope.row.drop_shipping_ids"
            :key="drop_shipping_id"
            @click="
              copyData(drop_shipping_id, $t('message.storage.dropShippingId'))
            "
          >
            {{ drop_shipping_id }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        :label="$t('common.createTime')"
        width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column :label="$t('common.operation')" fixed="left" width="100">
        <template slot-scope="scope">
          <!-- <el-button @click="showDetail(scope.row)" type="text" size="small">
            {{ $t('common.check') }}
          </el-button> -->
          <el-button
            @click="singlePrintBagNumber(scope.row)"
            type="text"
            size="small"
          >
            {{ $t('message.storage.printBagLabel') }}
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
    <PBaggingDetail
      :visible.sync="pBaggingDetailVisible"
      :currentData="currentData"
      :storageMap="storageMap"
      @close="pBaggingDetailVisible = false"
    >
    </PBaggingDetail>
    <PSingleBagging
      :visible.sync="singleBaggingVisible"
      @close="closeSingleBagging"
      :storageMap="storageMap"
    >
    </PSingleBagging>
    <PBatchBagging
      :visible.sync="batchBaggingVisible"
      @close="closeBatchBagging"
    >
    </PBatchBagging>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import SelectCountry from '@/pages/components/select-country.vue'
import PSingleBagging from './components/p-single-bagging.vue'
import PBatchBagging from './components/p-batch-bagging.vue'
import { getStorageDefinition, query_all_logistics_channels, copyData, fetchBagLabel, query_all_customers, fetchSpecificElementsQueryResults, removeEmptyStringValues, fetchBaggingListSpecificElements } from '@/common/common-func'
import {
  deliveryStatusMap,

  baggingFieldSelectMap
} from '@/common/field-maping'
import PBaggingDetail from './components/p-bagging-detail.vue'
export default {
  name: 'p-batch-weighing',
  props: {
  },
  components: {
    PageHead,
    SearchCard,
    CstTableHead,
    SelectCountry,
    PBaggingDetail,
    PSingleBagging,
    PBatchBagging
  },
  data () {
    return {
      tableLoading: false,
      baggingFieldSelectMap,
      tableData: [],
      currentData: {},
      pBaggingDetailVisible: false,
      deliveryStatusMap,
      remoteLoading: false,
      logisticsRemoteLoading: false,

      storageList: [],
      customers: [],
      storageMap: {},
      remoteQueryOptions: [],
      logistics_channels: [],
      queryData: {
        page_number: 1,
        page_size: 10,
        date: '',
        queryKeyWord: baggingFieldSelectMap[0].value,
        remoteQuerySelect: '',
        storage_uuid: '',
        date: '',
        country: ""
      },
      total: 0,
      singleBaggingVisible: false,
      batchBaggingVisible: false,
    }
  },
  methods: {
    copyData, fetchBagLabel,
    fetchBaggingListSpecificElements,
    multiplePrintBagNumbers () {
      if (this.multipleSelection.length === 0) {
        this.$message.error(this.$t('common.pleaseSelectAtLeastOneData'))
        return
      }
      let bag_numbers = this.multipleSelection.map(item => item.bag_number)
      this.printBagNumbers(bag_numbers)
    },
    singlePrintBagNumber (row) {
      if (!row.bag_number) {
        this.$message.error(this.$t('message.storage.noBagNumber'))
        return
      }
      this.printBagNumbers([row.bag_number])
    },
    printBagNumbers (bag_numbers) {
      this.tableLoading = true
      let queryParam = {
        bag_numbers,
        provider_uuid: this.provider_uuid
      }
      this.fetchBagLabel(queryParam).then(resData => {
        this.getFileIndependently({ filename: resData, provider_uuid: this.provider_uuid })
      }).finally(() => {
        this.multipleSelection = []
        this.tableLoading = false
      })
    },
    singleBagging () {
      this.singleBaggingVisible = true
    },
    closeSingleBagging () {
      this.singleBaggingVisible = false
    },
    batchBagging () {
      this.batchBaggingVisible = true
    },
    closeBatchBagging () {
      this.batchBaggingVisible = false
    },
    showDetail (row) {
      this.pBaggingDetailVisible = true
      this.currentData = row
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取查询参数
    fetchSpecificElementsQueryResults,
    removeEmptyStringValues,

    async getLogisticsChannels () {
      this.logisticsRemoteLoading = true
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
        [this.queryData.queryKeyWord]: query,
        provider_uuid: this.provider_uuid
      }
      this.fetchBaggingListSpecificElements(queryParam).then((remoteQueryResult) => {
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
      this.queryData = this.removeEmptyStringValues(this.queryData)
      let queryParam = {
        ...this.queryData,
        provider_uuid: this.provider_uuid
      }
      this.$ajax({
        url: '/api-prefix/api/dropshipping/query-bagged-list',
        method: 'get',
        params: queryParam,
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.tableData = res.data.results
          this.total = res.data.total
        }
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
        queryKeyWord: baggingFieldSelectMap[0].value,
        country: '',
        remoteQuerySelect: '',
        date: '',
        storage_uuid: '',

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

      this.getResultList()
    }


  },
  watch: {
    provider_uuid (newVal) {
      if (newVal) {
        this.getLogisticsChannels();

      }
    }
  }
}
</script>
<style scoped lang='css'>
</style>