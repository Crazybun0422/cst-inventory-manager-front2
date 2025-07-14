<!--
* @description  分区
* @fileName  partition-setting
* @author wjp
* @date 2024-03-08 20:58:58
!-->
<template>
  <div id="partition-setting" class="partition-setting" v-loading="loading">
    <PageHead :title="$t('message.myAccount.partitionSetting')">
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
            v-model="searchForm.queryKeyWord"
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
          <el-input
            v-model="searchForm.queryValue"
            :placeholder="queryKeyWordValue"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="queryPartitionSetting">{{
            $t('common.search')
          }}</el-button>
        </el-form-item>
      </el-form>
    </SearchCard>
    <CstTableHead>
      <template slot="top-right">
        <el-popconfirm
          :title="$t('common.confirmDeleteRecords')"
          @confirm="bulkDeletePartition"
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
        <!-- <el-button plain icon="el-icon-download" @click="exportWarehouse">
          {{ $t('common.export') }}
        </el-button> -->
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
        prop="storage_id"
        :label="$t('message.storage.warehouse')"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ warehousingNameMap[scope.row.storage_id] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="section_name"
        :label="$t('message.myAccount.partitionName')"
      ></el-table-column>
      <el-table-column
        prop="short_code"
        :label="$t('message.myAccount.abbreviationCode')"
      ></el-table-column>
      <el-table-column
        prop="picking_order"
        :label="$t('message.myAccount.pickingSorting')"
      ></el-table-column>

      <el-table-column
        prop="created_time"
        :label="$t('common.createTime')"
      ></el-table-column>
      <el-table-column
        prop="modified_time"
        :label="$t('common.updateTime')"
      ></el-table-column>
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
            @confirm="delPartition(scope.row)"
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
    <AddPartitionSetting
      :visible="addPartitionSettingDialogVisible"
      :warehousingMap="warehousingMap"
      :currentData="currentData"
      @close="closeAddPartitionSettingDialog"
    ></AddPartitionSetting>
    <PartitionSettingDetail
      :visible="partitionSettingDetailVisible"
      :currentData="currentData"
      :warehousingNameMap="warehousingNameMap"
      @close="closePartitionSettingDetail"
    ></PartitionSettingDetail>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import SelectCountry from '@/pages/components/select-country.vue'
import { partitionSettingSelectMap } from '@/common/field-maping'
import { getStorageDefinition } from '@/common/common-func'
import AddPartitionSetting from './partition-setting/add-partition-setting.vue'
import PartitionSettingDetail from './partition-setting/partition-setting-detail.vue'
export default {
  name: 'partition-setting',
  props: {
  },
  components: {
    SearchCard,
    PageHead,
    CstTableHead,
    SelectCountry,
    AddPartitionSetting,
    PartitionSettingDetail
  },
  data () {
    return {
      partitionSettingDetailVisible: false,
      currentData: {},
      total: 0,
      warehousingMap: [],
      loading: false,
      multipleSelection: [],
      tableData: [],
      searchForm: {
        storage_id: '',
        queryValue: '',
        queryKeyWord: partitionSettingSelectMap[0].value,
      },
      fieldOptions: partitionSettingSelectMap,
      page_number: 1,
      page_size: 10,
      warehousingNameMap: [],
      addPartitionSettingDialogVisible: false
    }
  },
  methods: {
    closePartitionSettingDetail () {
      this.partitionSettingDetailVisible = false
      this.currentData = {}
    },
    showDetail (row) {
      this.currentData = row
      this.partitionSettingDetailVisible = true
    },
    bulkDeletePartition () {

      const entity_ids = this.multipleSelection.map(item => item.entity_id)
      this.delPartitionFunc(entity_ids)
    },
    delPartition (row) {
      const entity_ids = [row.entity_id]
      this.delPartitionFunc(entity_ids)
    },
    delPartitionFunc (entity_ids) {
      this.loading = true
      this.$ajax({
        url: '/api-prefix/api/customer-settings/delete-section-entities',
        method: 'delete',
        data: {
          entity_ids
        },
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(this.$t('common.deleteSuccessful'))
          this.queryPartitionSetting()
        }
      }).catch(err => {
        console.error(err);
      }).finally(() => {
        this.loading = false
      })
    },
    closeAddPartitionSettingDialog () {
      this.addPartitionSettingDialogVisible = false
      this.currentData = {}
      this.queryPartitionSetting()
    },
    showModal (data) {
      this.currentData = data
      this.addPartitionSettingDialogVisible = true
    },
    handleSizeChange (val) {
      this.page_size = val
      this.queryPartitionSetting()
    },
    handleCurrentChange (val) {
      this.page_number = val
      this.queryPartitionSetting()
    },
    queryPartitionSetting () {
      this.loading = true
      const { storage_id, queryValue, queryKeyWord } = this.searchForm
      const queryParams = {
        page_number: this.page_number,
        page_size: this.page_size
      }
      if (storage_id !== '') {
        queryParams["storage_id"] = storage_id
      }
      if (queryValue !== '') {
        queryParams[queryKeyWord] = queryValue
      }
      this.$ajax({
        url: '/api-prefix/api/customer-settings/query-section-entities',
        method: 'get',
        params: queryParams,
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.tableData = res.data.results
          this.total = res.data.total
        }
      }).catch(err => {
        console.error(err);
      }).finally(() => {
        this.loading = false
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
    hasSelection () {
      return this.multipleSelection.length > 0
    },
    queryKeyWordValue () {
      return this.fieldOptions.find(item => item.value === this.searchForm.queryKeyWord).label[this.$languageType]
    },

    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    }
  },
  async mounted () {
    await this.getWarehousingDefinition()
    this.queryPartitionSetting()
  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
</style>