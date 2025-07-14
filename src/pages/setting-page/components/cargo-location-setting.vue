<!--
* @description  货架
* @fileName  cargo-location-setting
* @author wjp
* @date 2024-03-08 20:58:58
!-->
<template>
  <div
    id="cargo-location-setting"
    class="cargo-location-setting"
    v-loading="loading"
  >
    <PageHead :title="$t('message.myAccount.shelvesSetting')">
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
          <el-button icon="el-icon-search" @click="queryCargoLocationSetting">{{
            $t('common.search')
          }}</el-button>
        </el-form-item>
      </el-form>
    </SearchCard>
    <CstTableHead>
      <template slot="top-right">
        <!-- <el-button
          plain
          icon="el-icon-plus"
          type="primary"
          @click="addInBatchesCargoLocation"
        >
          {{ $t('common.addInBatches') }}
        </el-button> -->
        <el-popconfirm
          :title="$t('common.confirmDeleteRecords')"
          @confirm="bulkDeleteCargoLocation"
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
      ref="tableref"
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
        prop="location_number"
        :label="$t('message.myAccount.locationNumber')"
      ></el-table-column>
      <el-table-column
        prop="location_note"
        :label="$t('message.myAccount.storageLocationRemarks')"
      ></el-table-column>
      <el-table-column
        prop="section_name"
        :label="$t('message.myAccount.partition')"
      ></el-table-column>
      <el-table-column
        prop="shelf_name"
        :label="$t('message.myAccount.shelves')"
      ></el-table-column>
      <el-table-column
        prop="location_type"
        :label="$t('message.myAccount.locationType')"
      >
        <template slot-scope="scope">
          <span>{{ showLabel(locationTypeMap, scope.row.location_type) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="size_type"
        :label="$t('message.myAccount.sizeType')"
      >
        <template slot-scope="scope">
          <span>{{ showLabel(sizeTypeMap, scope.row.size_type) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="volume_size"
        :label="$t('message.storage.totalCapacity')"
      ></el-table-column>
      <el-table-column prop="max_weight" label="最大重量"></el-table-column>
      <el-table-column
        prop="abc_classification"
        :label="'ABC' + $t('common.classification')"
      >
        <template slot-scope="scope">
          <span>{{
            showLabel(abcClassificationMap, scope.row.abc_classification)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="location_product_specification"
        label="货位产品规格"
      >
        <template slot-scope="scope">
          <span>{{
            showLabel(
              locationProductSpecificationMap,
              scope.row.location_product_specification
            )
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_default" :label="$t('common.isItDefault')">
        <template slot-scope="scope">
          <span>{{
            scope.row.is_default ? $t('common.yes') : $t('common.no')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="picking_order"
        :label="$t('message.myAccount.pickingSorting')"
      ></el-table-column>
      <el-table-column
        prop="sum_picking_order"
        :label="$t('message.myAccount.totalSortingOfPicking')"
      ></el-table-column>
      <el-table-column
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
            @confirm="delCargoLocation(scope.row)"
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
      </el-pagination>
    </el-row>
    <AddCargoLocationSetting
      :visible="addCargoLocationSettingDialogVisible"
      :warehousingMap="warehousingMap"
      :currentData="currentData"
      @close="closeAddCargoLocationSettingDialog"
    ></AddCargoLocationSetting>
    <CargoLocationSettingDetail
      :visible="shelvesSettingDetailVisible"
      :currentData="currentData"
      :warehousingNameMap="warehousingNameMap"
      @close="closeCargoLocationSettingDetail"
    ></CargoLocationSettingDetail>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import SelectCountry from '@/pages/components/select-country.vue'
import { cargoLocationSettingFieldSelectMap, locationTypeMap, sizeTypeMap, abcClassificationMap, locationProductSpecificationMap } from '@/common/field-maping'
import { getStorageDefinition, listToMap } from '@/common/common-func'
import AddCargoLocationSetting from '../components/cargo-location-setting/add-cargo-location-setting.vue'
import CargoLocationSettingDetail from '../components/cargo-location-setting/cargo-location-setting-detail.vue'
export default {
  name: 'cargo-location-setting',
  props: {
  },
  components: {
    SearchCard,
    PageHead,
    CstTableHead,
    SelectCountry,
    AddCargoLocationSetting,
    CargoLocationSettingDetail
  },
  data () {
    return {
      locationTypeMap, sizeTypeMap, abcClassificationMap, locationProductSpecificationMap,
      loading: false,
      currentData: null,
      shelvesSettingDetailVisible: false,
      addCargoLocationSettingDialogVisible: false,
      multipleSelection: [],
      tableData: [

      ],
      searchForm: {
        queryValue: '',
        queryKeyWord: cargoLocationSettingFieldSelectMap[0].value,
      },
      fieldOptions: cargoLocationSettingFieldSelectMap,
      warehousingMap: [],
      warehousingNameMap: [],
      page_number: 1,
      page_size: 10,
      total: 0,
    }
  },
  methods: {
    showDetail (row) {
      this.currentData = row
      console.error('row: ', row);
      this.shelvesSettingDetailVisible = true
    },
    closeCargoLocationSettingDetail () {
      this.shelvesSettingDetailVisible = false
    },
    bulkDeleteCargoLocation () {
      const entity_ids = this.multipleSelection.map(item => item.entity_id)
      this.delCargoLocationFunc(entity_ids)
    },
    delCargoLocation (row) {
      const entity_ids = [row.entity_id]
      this.delCargoLocationFunc(entity_ids)
    },
    delCargoLocationFunc (entity_ids) {
      this.loading = true
      this.$ajax({
        url: '/api-prefix/api/customer-settings/delete-location-entities',
        method: 'delete',
        data: {
          entity_ids
        },
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(this.$t('common.deleteSuccessful'))
          this.queryCargoLocationSetting()
        }
      }).catch(err => {
        console.error('err: ', err);
      }).finally(() => {
        this.loading = false
      })
    },
    queryCargoLocationSetting () {
      this.loading = true
      const { storage_id, queryValue, queryKeyWord } = this.searchForm
      const queryParams = {
        storage_id,
        page_number: this.page_number,
        page_size: this.page_size
      }
      if (queryValue !== '') {
        queryParams[queryKeyWord] = queryValue
      }
      this.$ajax({
        url: '/api-prefix/api/customer-settings/query-location-entities',
        method: 'get',
        params: queryParams,
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.tableData = res.data.results
          this.total = res.data.total
          this.data = data;

        }
      }).catch(err => {
        console.error(err);
      }).finally(() => {
        this.loading = false
      })
    },
    closeAddCargoLocationSettingDialog () {
      this.addCargoLocationSettingDialogVisible = false
      this.currentData = {}
      this.queryCargoLocationSetting()
    },
    handleSizeChange (val) {
      this.page_size = val

    },
    handleCurrentChange (val) {
      this.page_number = val

    },
    showModal (data) {
      this.currentData = data
      this.addCargoLocationSettingDialogVisible = true
    },
    exportWarehouse () {
    },
    addInBatchesCargoLocation () {

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
    showLabel (selectMap, value) {
      const ret = listToMap(selectMap)
      return ret[value][this.$languageType]
    }
  },
  activated () {
    // myTable是表格的ref属性值
    if (this.$refs.tableref && this.$refs.tableref.doLayout) {
      this.$refs.tableref.doLayout();
    }
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
    this.queryCargoLocationSetting()
  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
</style>