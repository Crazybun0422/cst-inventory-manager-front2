<!--
* @description  仓储设置
* @fileName  warehousing-setting
* @author wjp
* @date 2024-03-08 20:58:58
!-->
<template>
  <div id="warehousing-setting" class="warehousing-setting" v-loading="loading">
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
            v-model="searchForm.warehousingName"
            :placeholder="queryKeyWordValue"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <SelectCountry v-model="searchForm.country"></SelectCountry>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="queryWarehousingSetting">{{
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
      </template>
    </CstTableHead>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="530px"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column
        prop="code_for_short"
        :label="$t('message.myAccount.abbreviationCode')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="warehousingName"
        :label="$t('message.storage.warehousingName')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="Cuntry"
        :label="$t('common.country')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="address"
        :label="$t('message.myAccount.location')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="name"
        :label="$t('message.myAccount.contactName')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="phone"
        :label="$t('common.phone')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="zipCode"
        :label="$t('message.orderInfo.zipCodeLabel')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="company"
        :label="$t('message.myAccount.company')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="state"
        :label="$t('common.stateProvince')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="city"
        :label="$t('message.orderInfo.cityLabel')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="mail"
        :label="$t('common.email')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="create_time"
        sortable
        :label="$t('common.createTime')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="update_time"
        sortable
        :label="$t('common.updateTime')"
        align="center"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import SelectCountry from '@/pages/components/select-country.vue'
import { warehousingSettingFieldSelectMap } from '@/common/field-maping'
export default {
  name: 'warehousing-setting',
  props: {
  },
  components: {
    SearchCard,
    PageHead,
    CstTableHead,
    SelectCountry
  },
  data () {
    return {
      loading: false,
      multipleSelection: [],
      tableData: [
        {
          code_for_short: 'US',
          warehousingName: '美国仓',
          Cuntry: '美国',
          address: '美国',
          name: '张三',
          phone: '123456789',
          zipCode: '123456',
          company: '公司',
          state: '州',
          city: '城市',
          mail: '21321321@qq.com',
          create_time: '2020-01-01',
          update_time: '2020-01-01'
        }
      ],
      searchForm: {
        queryValue: '',
        queryKeyWord: warehousingSettingFieldSelectMap[0].value,
      },
      fieldOptions: warehousingSettingFieldSelectMap
    }
  },
  methods: {
    queryWarehousingSetting () {
    },
    exportWarehouse () {
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
  },
  computed: {
    queryKeyWordValue () {
      return this.fieldOptions.find(item => item.value === this.searchForm.queryKeyWord).label[this.$languageType]
    },
  },
  mounted () {

  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
</style>