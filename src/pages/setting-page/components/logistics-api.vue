<!--
* @description  参数1
* @fileName  logistics-api
* @author wjp
* @date 2023-12-05 20:42:09
!-->
<template>
  <div id="logistics-api" class="logistics-api" v-loading="loading">
    <PageHead :title="$t('message.myAccount.logisticsAPI')">
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
          <el-select v-model="searchForm.queryKey">
            <el-option
              v-for="item in logisticsApiFieldSelectMap"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.queryValue"
            filterable
            remote
            clearable
            reserve-keyword
            :placeholder="$t('common.pleaseEnterAKeyword')"
            :remote-method="remoteQueryLogisticsApiMethod"
            :loading="remoteLoading"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="searchLogisticsApi">{{
            $t('common.search')
          }}</el-button>
        </el-form-item>
      </el-form>
    </SearchCard>
    <CstTableHead
      ><template slot="top-right">
        <el-button
          type="danger"
          @click="deleteLogisticsApi"
          :disabled="!hasSelection"
          >{{ $t('common.deleteInBulk') }}</el-button
        >
      </template></CstTableHead
    >
    <el-table
      :data="tableData"
      style="width: 100%"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column
        prop="api_name"
        :label="$t('message.myAccount.logisticsAPIName')"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column
        fixed="left"
        :label="$t('common.operation')"
        width="160"
        align="center"
      >
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">{{
            $t('common.check')
          }}</el-button>
          <el-button
            type="text"
            size="small"
            @click="editLogisticsApiDialog(scope.row)"
            >{{ $t('common.edit') }}</el-button
          >

          <el-popconfirm
            :title="$t('message.myAccount.confirmDeleteLogisticsAPI')"
            @confirm="handledelLogisticsApi(scope.row)"
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
        :current-page.sync="curPage"
        :page-sizes="[10, 50, 100]"
        :page-size="pageSize"
        layout="total,sizes, prev, pager, next"
        :total="total"
        background
      >
      </el-pagination>
    </el-row>
    <!-- 新增和编辑表单 -->

    <LogisticsApiDialog
      :visible.sync="logisticsApiVisible"
      :currentData="currentData"
      :submitType="submitType"
      @close="closeLogisticsApiDialog"
      @ok="submitLogisticsApiDialog"
    >
    </LogisticsApiDialog>

    <LogisticsApiDetail
      :currentData="currentData"
      :visible="logisticsApiDrawerVisible"
      @close="closeLogisticsApiDetail"
    ></LogisticsApiDetail>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import LogisticsApiDialog from '@/pages/setting-page/components/logistics-api-dialog.vue'
import LogisticsApiDetail from '@/pages/setting-page/components/logistics-api-detail.vue'
import { logisticsApiFieldSelectMap } from '@/common/field-maping'
import { queryLogisticsApi } from '@/common/common-func'
import { resolvePreferenceProviderUuid } from '@/common/global-user-settings'
export default {
  name: 'logistics-api',
  props: {
  },
  components: {
    LogisticsApiDialog,
    SearchCard,
    PageHead,
    CstTableHead,
    LogisticsApiDetail

  },
  data () {
    return {
      logisticsApiFieldSelectMap,
      loading: false,
      formLoading: false,
      total: 0,
      providerOptions: [],
      remoteLoading: false,
      popoverVisible: false,
      logisticsApiDrawerVisible: false,
      submitType: 'add',
      formLabelWidth: '130px',
      currentData: {},
      logisticsApiVisible: false,
      searchForm: {
        queryKey: 'api_name',
      },
      curPage: 1,
      pageSize: 10,
      tableData: [],
      multipleSelection: [],
      options: [],
    }
  },

  methods: {
    queryLogisticsApi,
    remoteQueryLogisticsApiMethod (query) {
      this.remoteLoading = true;

      const provider_uuid = this.provider_uuid
      if (!provider_uuid) {
        this.options = []
        this.remoteLoading = false
        return
      }
      let queryParams = {
        // provider的userRelatedId就是provider_uuid
        provider_uuid,
      }
      queryParams[this.searchForm.queryKey] = query
      try {
        this.queryLogisticsApi(queryParams).then(resData => {
          this.options = resData.map(item => {
            return {
              label: item,
              value: item
            }
          })
        })


      }
      catch (error) {
        console.error(error);
      }
      finally {
        this.remoteLoading = false
      }
    },
    deleteLogisticsApi () {
      let format_ids = this.multipleSelection.map(item => item.id)
      if (format_ids && format_ids.length === 0) {
        this.$message({
          message: this.$t('common.selectDeleteData'),
          type: 'warning'
        });
        return
      }
      this.delLogisticsApi(format_ids)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    searchLogisticsApi () {
      this.loading = true
      let queryParams = {
        // provider的userRelatedId就是provider_uuid
        page_number: this.curPage,
        page_size: this.pageSize,
      }
      const provider_uuid = this.provider_uuid
      if (!provider_uuid) {
        this.loading = false
        this.$message.error(this.$t('message.myAccount.noShop'));
        return
      }
      queryParams['provider_uuid'] = provider_uuid;
      if (this.searchForm.queryValue) {
        queryParams[this.searchForm.queryKey] = this.searchForm.queryValue
      }
      this.$ajax({
        method: 'get',
        url: '/api-prefix/api/logistics/fetch-all-api-params',
        params: queryParams,
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.tableData = res.data.results
          this.total = res.data.total
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        console.error(error);
      }).finally(() => {
        this.loading = false
      })
    },
    closeLogisticsApiDialog () {
      this.logisticsApiVisible = false
    },
    closeLogisticsApiDetail () {
      this.logisticsApiDrawerVisible = false
    },
    editLogisticsApiDialog (row) {
      this.logisticsApiVisible = true
      // this.currentData = row
      this.submitType = 'edit'
      this.currentData = row
    },
    handledelLogisticsApi (row) {
      let format_ids = [row.id]
      this.delLogisticsApi(format_ids)
    },
    delLogisticsApi (format_ids) {

      this.$ajax({
        method: 'delete',
        url: '/api-prefix/api/logistics/delete-api-params',
        roleType: this.roleType,
        data: {
          api_ids: format_ids,
        }
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message({
            message: this.$t('common.deleteSuccessful'),
            type: 'success'
          })
          this.searchLogisticsApi()
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }

      })
    },
    submitLogisticsApiDialog () {
      this.logisticsApiVisible = false
      this.searchLogisticsApi()
    },
    showModal (row) {
      this.logisticsApiVisible = true
      this.submitType = 'add'
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.searchLogisticsApi()
    },
    handleCurrentChange (val) {
      this.curPage = val
      this.searchLogisticsApi()
    },
    handleClick (row) {
      this.currentData = row
      this.logisticsApiDrawerVisible = true
    },
  },
  computed: {
    hasSelection () {
      return this.multipleSelection.length > 0
    },
    provider_uuid () {
      const uuid = resolvePreferenceProviderUuid(this.$store, this.roleType)
      if (uuid) return uuid
      const fallback = localStorage.getItem('shop_provider_uuid')
      return fallback || ''
    },
  },
  mounted () {
    if (this.provider_uuid) {
      this.searchLogisticsApi()
      this.remoteQueryLogisticsApiMethod('')
    }
  },
  watch: {
    provider_uuid (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.searchLogisticsApi()
        this.remoteQueryLogisticsApiMethod('')
      }
    }
  }
}
</script>
<style scoped lang='css'>
::v-deep .ContactsForm .el-input__inner {
  width: 350px;
  /* 居中显示 */
}
</style>
