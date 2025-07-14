<!--
* @description  参数1
* @fileName  logistics-channel
* @author wjp
* @date 2023-12-05 20:42:09
!-->
<template>
  <div id="logistics-channel" class="logistics-channel" v-loading="loading">
    <PageHead :title="$t('message.myAccount.logisticsChannels')">
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
              v-for="item in logisticsChannelFieldSelectMap"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <SelectLogisticChannels
            v-model="searchForm.queryValue"
          ></SelectLogisticChannels>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="searchLogisticsChannel">{{
            $t('common.search')
          }}</el-button>
        </el-form-item>
      </el-form>
    </SearchCard>
    <CstTableHead
      ><template slot="top-right">
        <el-button
          type="danger"
          @click="deleteLogisticsChannel"
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
        prop="channel_name"
        :label="$t('message.myAccount.logisticsChannelName')"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="api_name"
        :label="$t('message.myAccount.logisticsAPIName')"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="channel_code"
        :label="$t('message.myAccount.logisticsChannelCode')"
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
            @click="editLogisticsChannelDialog(scope.row)"
            >{{ $t('common.edit') }}</el-button
          >

          <el-popconfirm
            :title="$t('message.myAccount.confirmDeleteLogisticsChannel')"
            @confirm="handledelLogisticsChannel(scope.row)"
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

    <LogisticsChannelDialog
      :visible.sync="logisticsChannelVisible"
      :currentData="currentData"
      :submitType="submitType"
      @close="closeLogisticsChannelVisibleDialog"
      @ok="submitLogisticsChannelDialog"
    >
    </LogisticsChannelDialog>

    <LogisticsChannelDetail
      :currentData="currentData"
      :visible="logisticsChannelDrawerVisible"
      @close="closeLogisticsChannelDetail"
    ></LogisticsChannelDetail>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import LogisticsChannelDialog from '@/pages/setting-page/components/logistics-channel-dialog.vue'
import LogisticsChannelDetail from '@/pages/setting-page/components/logistics-channel-detail.vue'
import { logisticsChannelFieldSelectMap } from '@/common/field-maping'
import { queryLogisticsChannels, query_all_logistics_channels } from '@/common/common-func'
import SelectLogisticChannels from '@/pages/components/select-logistics-channels.vue'
export default {
  name: 'logistics-channel',
  props: {
  },
  components: {
    LogisticsChannelDialog,
    SearchCard,
    PageHead,
    CstTableHead,
    LogisticsChannelDetail,
    SelectLogisticChannels

  },
  data () {
    return {
      logisticsChannelFieldSelectMap,
      loading: false,
      formLoading: false,
      total: 0,
      providerOptions: [],
      remoteLoading: false,
      popoverVisible: false,
      logisticsChannelDrawerVisible: false,
      submitType: 'add',
      formLabelWidth: '130px',
      currentData: {},
      logisticsChannelVisible: false,
      searchForm: {
        queryKey: 'channel_name',
      },
      curPage: 1,
      pageSize: 10,
      tableData: [],
      multipleSelection: [],
      options: [],
    }
  },

  methods: {
    queryLogisticsChannels,
    query_all_logistics_channels,

    deleteLogisticsChannel () {
      let format_ids = this.multipleSelection.map(item => item.id)
      if (format_ids && format_ids.length === 0) {
        this.$message({
          message: this.$t('common.selectDeleteData'),
          type: 'warning'
        });
        return
      }
      this.delLogisticsChannelDetail(format_ids)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    async searchLogisticsChannel () {
      this.loading = true
      let queryParams = {
        // provider的userRelatedId就是provider_uuid
        page_number: this.curPage,
        page_size: this.pageSize,
      }
      queryParams['provider_uuid'] = this.provider_uuid;
      if (this.searchForm.queryValue) {
        queryParams[this.searchForm.queryKey] = this.searchForm.queryValue
      }
      try {
        const res = await query_all_logistics_channels(queryParams, this.roleType)
        if (this.$isRequestSuccessful(res.code)) {
          this.tableData = res.data.results
          this.total = res.data.total
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      }
      catch (error) {
        console.error(error);
      } finally {
        this.loading = false
      }
    },
    closeLogisticsChannelVisibleDialog () {
      this.logisticsChannelVisible = false
    },
    closeLogisticsChannelDetail () {
      this.logisticsChannelDrawerVisible = false
    },
    editLogisticsChannelDialog (row) {
      this.logisticsChannelVisible = true
      // this.currentData = row
      this.submitType = 'edit'
      this.currentData = row
    },
    handledelLogisticsChannel (row) {
      let format_ids = [row.id]
      this.delLogisticsChannelDetail(format_ids)
    },
    delLogisticsChannelDetail (format_ids) {

      this.$ajax({
        method: 'delete',
        url: '/api-prefix/api/logistics/delete-channels',
        roleType: this.roleType,
        data: {
          channel_ids: format_ids,
        }
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message({
            message: this.$t('common.deleteSuccessful'),
            type: 'success'
          })
          this.searchLogisticsChannel()
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }

      })
    },
    submitLogisticsChannelDialog () {
      this.logisticsChannelVisible = false
      this.searchLogisticsChannel()
    },
    showModal (row) {
      this.logisticsChannelVisible = true
      this.submitType = 'add'
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.searchLogisticsChannel()
    },
    handleCurrentChange (val) {
      this.curPage = val
      this.searchLogisticsChannel()
    },
    handleClick (row) {
      this.currentData = row
      this.logisticsChannelDrawerVisible = true
    },
    remoteQueryLogisticsChannelMethod (query) {
      this.remoteLoading = true;
      let queryParams = {
        // provider的userRelatedId就是provider_uuid
        provider_uuid: this.provider_uuid,
      }

      queryParams[this.queryKey] = query
      this.queryLogisticsChannels(queryParams).then(resData => {
        this.options = resData.map(item => ({
          label: item,
          value: item
        }))
      }).catch(() => {
        this.options = []
      }).finally(() => {
        this.remoteLoading = false
      })

    },
  },
  computed: {
    hasSelection () {
      return this.multipleSelection.length > 0
    },
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },
  },
  async mounted () {
    this.$nextTick(() => {
      this.searchLogisticsChannel()
    })

    await this.remoteQueryLogisticsChannelMethod("")
  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
</style>