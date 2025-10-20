<!--
* @description  Logistics track URL list for provider settings
* @fileName  logistics-track-url
!-->
<template>
  <div id="logistics-track-url" class="logistics-track-url" v-loading="loading">
    <PageHead :title="$t('message.myAccount.logisticsTrackUrl')">
      <template slot="head-right">
        <el-button type="primary" icon="el-icon-plus" @click="openCreateDialog">
          {{ $t('common.add') }}
        </el-button>
      </template>
    </PageHead>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        :label="$t('common.operation')"
        width="180"
        align="center"
        fixed="left"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            :disabled="!scope.row.editable"
            @click="handleEdit(scope.row)"
          >
            {{ $t('common.edit') }}
          </el-button>
          <el-popconfirm
            :title="$t('message.myAccount.confirmDeleteLogisticsTrackUrl')"
            :disabled="!scope.row.deletable"
            @confirm="handleDelete(scope.row)"
          >
            <span slot="reference">
              <el-button
                type="text"
                size="small"
                :disabled="!scope.row.deletable"
                icon="el-icon-delete"
              >
                {{ $t('common.delete') }}
              </el-button>
            </span>
          </el-popconfirm>
        </template>
      </el-table-column>

      <el-table-column
        prop="zh_name"
        :label="$t('message.myAccount.logisticsTrackUrlZhName')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="en_name"
        :label="$t('message.myAccount.logisticsTrackUrlEnName')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="query_url"
        :label="$t('message.myAccount.logisticsTrackUrlAddress')"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <a
            v-if="scope.row.query_url"
            :href="scope.row.query_url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ scope.row.query_url }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_default"
        :label="$t('message.myAccount.logisticsTrackUrlIsDefault')"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_default ? 'success' : 'info'" size="mini" effect="plain">
            {{ formatIsDefault(scope.row.is_default) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="scope"
        :label="$t('message.myAccount.logisticsTrackUrlScope')"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag size="mini" effect="plain">
            {{ formatScope(scope.row.scope) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="owner_type"
        :label="$t('message.myAccount.logisticsTrackUrlOwner')"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.owner_type }}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        :label="$t('message.myAccount.logisticsTrackUrlCreatedAt')"
        width="180"
        align="center"
      />
      <el-table-column
        prop="updated_at"
        :label="$t('message.myAccount.logisticsTrackUrlUpdatedAt')"
        width="180"
        align="center"
      />
    </el-table>

    <el-row type="flex" justify="end" style="margin-top: 12px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="curPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
      />
    </el-row>

    <LogisticsTrackUrlDialog
      :visible.sync="dialogVisible"
      :submitType="submitType"
      :currentData="currentRow"
      @close="handleDialogClose"
      @ok="handleDialogOk"
    />
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import LogisticsTrackUrlDialog from '@/pages/setting-page/components/logistics-track-url-dialog.vue'
import {
  fetchLogisticsQueryUrlList,
  deleteLogisticsQueryUrls
} from '@/common/common-func'
import { resolvePreferenceProviderUuid } from '@/common/global-user-settings'
import { config } from '@/common/commonconfig'

export default {
  name: 'logistics-track-url',
  components: {
    PageHead,
    LogisticsTrackUrlDialog
  },
  data () {
    return {
      loading: false,
      tableData: [],
      curPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      submitType: 'add',
      currentRow: {}
    }
  },
  computed: {
    provider_uuid () {
      const uuid = resolvePreferenceProviderUuid(this.$store, this.roleType)
      if (uuid) return uuid
      const fallback = localStorage.getItem('shop_provider_uuid')
      return fallback || ''
    },
    isProviderRole () {
      return this.roleType === config.provider.role || this.roleType === config.operator.role
    }
  },
  mounted () {
    if (!this.isProviderRole && !this.provider_uuid) {
      this.$message.error(this.$t('message.myAccount.noShop'))
      return
    }
    this.loadData()
  },
  watch: {
    provider_uuid (newVal, oldVal) {
      if (this.isProviderRole) return
      if (newVal && newVal !== oldVal) {
        this.curPage = 1
        this.loadData()
      }
    }
  },
  methods: {
    fetchLogisticsQueryUrlList,
    deleteLogisticsQueryUrls,
    openCreateDialog () {
      if (!this.ensureProviderUuid()) return
      this.submitType = 'add'
      this.currentRow = {}
      this.dialogVisible = true
    },
    handleEdit (row) {
      this.submitType = 'edit'
      this.currentRow = { ...row }
      this.dialogVisible = true
    },
    handleDelete (row) {
      if (!row || !row.id) return
      const payload = { ids: [row.id] }
      if (!this.isProviderRole) {
        payload.provider_uuid = this.provider_uuid
      }
      this.deleteLogisticsQueryUrls(payload).then(res => {
        this.$message.success(this.$t('common.deleteSuccessful'))
        this.loadData()
      }).catch(error => {
        const msg = error && error.msg && (error.msg[this.$languageType] || error.msg.en_us || error.msg.zh_cn)
        this.$message.error(msg || this.$t('common.operationFailed'))
      })
    },
    handleDialogClose () {
      this.dialogVisible = false
    },
    handleDialogOk () {
      this.dialogVisible = false
      this.loadData()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.curPage = 1
      this.loadData()
    },
    handleCurrentChange (val) {
      this.curPage = val
      this.loadData()
    },
    loadData () {
      if (!this.ensureProviderUuid()) return
      this.loading = true
      const params = {
        page_number: this.curPage,
        page_size: this.pageSize
      }
      if (this.isProviderRole) {
        params.scope = 'all'
      } else {
        params.provider_uuid = this.provider_uuid
      }
      this.fetchLogisticsQueryUrlList(params).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          const data = res.data || {}
          this.tableData = data.results || []
          this.total = data.total || 0
        } else {
          this.tableData = []
          this.total = 0
        }
      }).catch(() => {
        this.tableData = []
        this.total = 0
      }).finally(() => {
        this.loading = false
      })
    },
    formatScope (scope) {
      if (scope === 'default') {
        return this.$t('message.myAccount.logisticsTrackUrlScopeDefault')
      }
      if (scope === 'custom') {
        return this.$t('message.myAccount.logisticsTrackUrlScopeCustom')
      }
      return scope || ''
    },
    formatIsDefault (flag) {
      return flag ? this.$t('common.yes') : this.$t('common.no')
    },
    ensureProviderUuid () {
      if (this.isProviderRole) {
        return true
      }
      if (!this.provider_uuid) {
        this.$message.error(this.$t('message.myAccount.noShop'))
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>
.logistics-track-url {
  min-height: 400px;
}
::v-deep .el-table__body-wrapper {
  overflow-x: hidden;
}
</style>
