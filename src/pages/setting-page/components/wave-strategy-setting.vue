<!--
* @description  波次策略
* @fileName  wave-strategy-setting
* @author wjp
* @date 2024-03-08 20:58:58
!-->
<template>
  <div
    id="wave-strategy-setting"
    class="wave-strategy-setting"
    v-loading="loading"
  >
    <PageHead :title="$t('message.myAccount.warehousingSetting')">
      <template slot="head-right">
        <el-button type="primary" icon="el-icon-plus" @click="showModal(null)">
          {{ $t('common.add') }}
        </el-button>
      </template>
    </PageHead>
    <SearchCard>
      <el-form
        :model="searchForm"
        ref="searchForm"
        label-width="140px"
        label-position="top"
        :inline="true"
      >
        <!-- <el-form-item >
          <el-input
            v-model="searchForm.queryValue"
            placeholder="请输入关键字"
          ></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-select
            v-model="searchForm.storage_id"
            :placeholder="$t('common.pleaseSelect')"
          >
            <el-option
              v-for="item in warehousingMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.name"
            filterable
            remote
            reserve-keyword
            :placeholder="$t('common.pleaseInput') + ' ' + '波次策略'"
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
          <el-button icon="el-icon-search" @click="queryWaveStrategies">{{
            $t('common.search')
          }}</el-button>
        </el-form-item>
      </el-form>
    </SearchCard>
    <CstTableHead>
      <template slot="top-right">
        <el-button plain icon="el-icon-download" @click="exportWarehouse">
          {{ $t('common.export') }}
        </el-button>
        <el-popconfirm
          :title="$t('common.confirmDeleteRecords')"
          @confirm="bulkDeleteWaveStrategy"
        >
          <span slot="reference">
            <el-button
              icon="el-icon-delete"
              type="danger"
              style="margin-left: 10px"
              :disabled="!hasSelection"
            >
              {{ $t('common.deleteInBulk') }}
            </el-button>
          </span>
        </el-popconfirm>
      </template>
    </CstTableHead>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="530px"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        show-overflow-tooltip
        :label="$t('common.operation')"
        fixed="left"
        width="140"
        prop="operate"
      >
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="text" size="small">
            {{ $t('common.check') }}
          </el-button>
          <el-button type="text" size="small" @click="showModal(scope.row)">
            {{ $t('common.edit') }}
          </el-button>
          <el-popconfirm
            :title="$t('common.confirmDeleteRecord')"
            @confirm="delWaveStrategy(scope.row)"
          >
            <span slot="reference">
              <el-button
                icon="el-icon-delete"
                type="text"
                style="margin-left: 10px"
              >
                {{ $t('common.delete') }}
              </el-button>
            </span>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="策略名称"></el-table-column>
      <el-table-column
        prop="storage_id"
        :label="$t('message.storage.warehouse')"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ warehousingNameMap[scope.row.storage_id] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="execution_priority"
        label="执行优先级"
      ></el-table-column>
      <el-table-column
        prop="orders_per_wave"
        label="每个波次的订单数"
      ></el-table-column>
      <el-table-column
        prop="group_by_sku"
        label="是否按SKU分组"
      ></el-table-column>
      <el-table-column
        prop="sku_group_start_quantity"
        label="SKU分组的起始数量"
      ></el-table-column>
      <el-table-column
        prop="country"
        :label="$t('common.country')"
      ></el-table-column>
      <el-table-column label="客户">
        <template slot-scope="scope">
          <span>{{ customers[scope.row.customer] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="product_barcode"
        :label="$t('message.productManagement.productBarcode')"
      ></el-table-column>
      <el-table-column
        prop="product_quantity_start"
        label="产品的起始数量"
      ></el-table-column>
      <el-table-column
        prop="product_quantity_end"
        label="产品的结束数量"
      ></el-table-column>
      <el-table-column
        prop="product_variety_quantity_start"
        label="产品品种的起始数"
      ></el-table-column>
      <el-table-column
        prop="product_variety_quantity_end"
        label="产品品种的结束数量"
      ></el-table-column>
      <el-table-column
        prop="create_time"
        sortable
        :label="$t('common.createTime')"
      ></el-table-column>
      <el-table-column
        prop="update_time"
        sortable
        :label="$t('common.updateTime')"
      ></el-table-column>
    </el-table>
    <el-row type="flex" justify="end" style="margin-top: 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page_number"
        :page-sizes="[10, 50, 100]"
        :page-size="page_size"
        layout="total,sizes, prev, pager, next"
        :total="total"
        background
      >
      </el-pagination
    ></el-row>
    <AddWaveStrategySetting
      :visible="addWaveStrategySettingDialogVisible"
      :currentData="currentData"
      @close="waveStrategyClose"
      :warehousingMap="warehousingMap"
    ></AddWaveStrategySetting>
    <WaveStrategyDetail
      :visible="waveStrategyDetailDialogVisible"
      :currentData="currentData"
      @close="waveStrategyDetailClose"
      :warehousingNameMap="warehousingNameMap"
    ></WaveStrategyDetail>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import { getStorageDefinition, removeEmptyStringValues, query_all_customers, mapArrayToObject } from '@/common/common-func'
import CstTableHead from '@/components/cst-table-head/index.vue'
import SelectCountry from '@/pages/components/select-country.vue'
import { warehousingSettingFieldSelectMap } from '@/common/field-maping'
import AddWaveStrategySetting from './wave-strategy-setting/add-wave-strategy-setting'
import WaveStrategyDetail from './wave-strategy-setting/wave-strategy-detail'
export default {
  name: 'wave-strategy-setting',
  props: {
  },
  components: {
    SearchCard,
    PageHead,
    CstTableHead,
    SelectCountry,
    AddWaveStrategySetting,
    WaveStrategyDetail
  },
  data () {
    return {
      loading: false,
      multipleSelection: [],
      warehousingMap: [],
      warehousingNameMap: [],
      currentData: {},
      addWaveStrategySettingDialogVisible: false,
      tableData: [
      ],
      searchForm: {
        storage_id: '',
        name: '',
      },
      page_number: 1,
      page_size: 10,
      total: 0,
      fieldOptions: warehousingSettingFieldSelectMap,
      remoteQueryOptions: [],
      remoteLoading: false,
      waveStrategyDetailDialogVisible: false,
      customers: [],
    }
  },
  methods: {
    getcustomers () {
      let provider_uuid = this.$store.state.user.dsCurrentProviderUuid
      let queryParams = {
        provider_uuid: provider_uuid,
        page_number: 1,
        page_size: 1000
      }
      query_all_customers(queryParams, this.roleType).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.customers = mapArrayToObject(res.data.results, 'related_id', 'user_code')
        }
      }).catch(err => {
        console.error(err);
      })
    },
    showDetail (row) {
      this.currentData = row
      this.waveStrategyDetailDialogVisible = true
    },
    waveStrategyDetailClose () {
      this.waveStrategyDetailDialogVisible = false
    },
    remoteQueryMethod (query) {
      if (query === '') {
        this.remoteQueryOptions = [];
        return
      }
      // 用来远程获取数据
      this.remoteLoading = true;

      const queryParam = {
        name: query,
        storage_id: this.searchForm.storage_id
      }
      this.$ajax({
        url: '/api-prefix/api/customer-settings/query-specific-wave-strategies',
        method: "get",
        params: queryParam,
        headers: {
          "Content-Type": 'application/json',
        },
        roleType: this.roleType,
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.remoteLoading = false;
          // 保存查询的结果
          const remoteQueryResult = res.data//res.data[this.queryData.queryKeyWord]
          this.remoteQueryOptions = remoteQueryResult.map(item => {
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
      })
    },
    bulkDeleteWaveStrategy () {
      const entity_ids = this.multipleSelection.map(item => item.entity_id)
      this.delWaveStrategyFunc(entity_ids)
    },
    delWaveStrategy (row) {
      const entity_ids = [row.entity_id]
      this.delWaveStrategyFunc(entity_ids)
    },
    delWaveStrategyFunc (entity_ids) {
      this.$ajax({
        url: '/api-prefix/api/customer-settings/delete-wave-strategies',
        method: 'delete',
        data: { entity_ids: entity_ids },
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(this.$t('common.deleteSuccessful'))
          this.queryWaveStrategies()
        }
      })
    },
    handleSizeChange (val) {
      this.page_size = val

    },
    handleCurrentChange (val) {
      this.page_number = val

    },
    waveStrategyClose (reflash = false) {
      this.addWaveStrategySettingDialogVisible = false
      if (reflash) {
        this.queryWarehousingSetting()
      }
    },
    showModal (data) {
      this.currentData = data
      this.addWaveStrategySettingDialogVisible = true
    },
    queryWaveStrategies () {
      let params = {
        page_number: this.page_number,
        page_size: this.page_size,
      }
      let filterParams = removeEmptyStringValues(this.searchForm)
      if (filterParams) {
        Object.assign(params, filterParams)
      }
      this.$ajax({
        url: '/api-prefix/api/customer-settings/list-wave-strategies',
        method: 'get',
        params: params,
        roleType: this.roleType
      }).then(res => {
        this.tableData = res.data.results
        this.total = res.total
      })
    },
    exportWarehouse () {
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    async getWarehousingDefinition () {
      try {
        const res = await getStorageDefinition(this.provider_uuid, this.roleType)
        if (this.$isRequestSuccessful(res.code)) {
          this.warehousingMap = res.data.map(item => ({
            label: item.name,
            value: item.storage_define_uuid
          }));
          res.data.forEach(element => {
            this.warehousingNameMap[element.storage_define_uuid] = element.name
          });
          this.$set(this.searchForm, 'storage_id', this.warehousingMap[0].value)

        }
      }
      catch (error) {
        console.error(error);
      }
    },
  },
  computed: {

    queryKeyWordValue () {
      return this.fieldOptions.find(item => item.value === this.searchForm.queryKeyWord).label[this.$languageType]
    },

    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },
    hasSelection () {
      return this.multipleSelection.length > 0
    },
  },
  async mounted () {
    await this.getWarehousingDefinition()
    this.queryWaveStrategies()
    this.getcustomers()
  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
</style>