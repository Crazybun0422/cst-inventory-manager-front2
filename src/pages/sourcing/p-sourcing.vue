<template>
  <div class="p-sourcing-page">
    <PageHead :title="$t('navigate.sourcing')" />

    <el-card shadow="never" class="mt-16">
      <el-tabs v-model="activeStatus" @tab-click="onTab">
        <el-tab-pane v-for="t in statusTabs" :label="t.label" :name="t.value" :key="t.value" />
      </el-tabs>

      <el-table :data="table.items" size="small" v-loading="loading">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="his-item-list">
              <div class="his-item" v-for="(it, idx) in (scope.row.items || [])" :key="it.item_id || idx">
                <div class="his-item__preview">
                  <AuthImg v-if="it.source_type==='image' && it.image" :src="it.image" :styleInfo="'width:56px;height:56px;border-radius:6px;'" />
                  <i v-else-if="it.source_type==='url'" class="el-icon-link his-item__icon"></i>
                  <i v-else class="el-icon-goods his-item__icon"></i>
                </div>
                <div class="his-item__meta">
                  <div class="his-item__line">
                    <el-tag size="mini" type="info" effect="dark">{{ it.source_type }}</el-tag>
                    <a v-if="it.source_type==='url'" class="his-item__link" :href="it.source_url" target="_blank" rel="noopener">{{ it.source_url }}</a>
                    <span v-else-if="it.source_type==='product'" class="his-item__text">{{ it.product_id }}</span>
                    <span v-else-if="it.source_type==='image'" class="his-item__text">{{ it.description }}</span>
                  </div>
                  <div class="his-item__sub">
                    <span v-if="it.quote">{{ $t('sourcing.expectedPrice') }}: {{ currencySymbol }} {{ it.quote }}</span>
                    <span v-if="it.feedback_quote" style="margin-left:12px">{{ $t('sourcing.feedbackQuote') }}: {{ currencySymbol }} {{ it.feedback_quote }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sourcing_id" :label="$t('sourcing.sourcingId')" width="220" />
        <el-table-column :label="$t('common.status')" width="160">
          <template slot-scope="scope">{{ statusLabel(scope.row.status) }}</template>
        </el-table-column>
        <el-table-column prop="created_at" :label="$t('common.createTime')" />
        <el-table-column :label="$t('common.operate')" width="220">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==='submitted'" type="primary" size="mini" @click="startSourcing(scope.row)">{{ $t('common.start') || 'Start' }}</el-button>
            <el-button v-else-if="scope.row.status==='sourcing'" type="success" size="mini" @click="quoteAndConfirm(scope.row)">{{ $t('common.inquiryConfirmation') || 'Confirm quote' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-16" style="text-align:right">
        <el-pagination background layout="prev, pager, next, jumper" :page-size="table.page_size" :current-page.sync="table.page_number" :total="table.total" @current-change="loadList" />
      </div>
    </el-card>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import AuthImg from '@/components/auth-img.vue'
export default {
  name: 'PSourcing',
  components: { PageHead, AuthImg },
  data() {
    return {
      loading: false,
      activeStatus: 'submitted',
      table: { items: [], total: 0, page_number: 1, page_size: 10 },
    }
  },
  computed: {
    currencySymbol() { return '$' },
    statusTabs() {
      const zh = { submitted: '已提交', sourcing: '选品中', pending_confirmation: '待确认', completed: '已完成' }
      const en = { submitted: 'Submitted', sourcing: 'Sourcing', pending_confirmation: 'Pending confirmation', completed: 'Completed' }
      const dict = this.$languageType === 'zh_cn' ? zh : en
      return [ 'submitted','sourcing','pending_confirmation','completed' ].map(v => ({ value: v, label: dict[v] }))
    }
  },
  created() { this.loadList(1) },
  methods: {
    statusLabel(s) {
      const map = this.statusTabs.reduce((acc,cur)=>{acc[cur.value]=cur.label;return acc},{}); return map[s] || s
    },
    onTab() { this.loadList(1) },
    async loadList(page) {
      this.loading = true
      try {
        const params = { page_number: page || this.table.page_number, page_size: this.table.page_size, status: this.activeStatus }
        const res = await this.$ajax({ url: '/api/admin/sourcing', method: 'get', params, roleType: this.roleType })
        if (this.$isRequestSuccessful(res.code)) {
          const data = res.data || { items: [], total: 0, page_number: 1, page_size: 10 }
          this.table = { items: data.items || [], total: data.total || 0, page_number: data.page_number || 1, page_size: data.page_size || 10 }
        }
      } finally { this.loading = false }
    },
    async startSourcing(row) {
      try {
        await this.$confirm(this.$t('common.confirm') + '?', this.$t('common.tips'), { type: 'warning' })
      } catch (e) { return }
      await this.patchStatus(row.sourcing_id, { status: 'sourcing' })
      this.loadList()
    },
    async quoteAndConfirm(row) {
      try {
        const { value } = await this.$prompt(this.$t('sourcing.feedbackQuote') + ' ('+ this.currencySymbol +')', this.$t('common.tips'), { inputType: 'number', inputPlaceholder: this.currencySymbol + ' 0.00' })
        const feedback = String(value || '').trim()
        if (feedback === '') return
        const items = (row.items || []).map(it => ({ item_id: it.item_id, feedback_quote: feedback }))
        await this.patchStatus(row.sourcing_id, { status: 'pending_confirmation', items })
        this.loadList()
      } catch (e) { /* cancelled */ }
    },
    async patchStatus(sourcing_id, body) {
      return await this.$ajax({ url: `/api/admin/sourcing/${sourcing_id}`, method: 'patch', data: body, roleType: this.roleType })
    }
  }
}
</script>

<style scoped>
.mt-16 { margin-top: 16px; }
.his-item-list { display: grid; grid-template-columns: 1fr; grid-row-gap: 8px; }
.his-item { display: flex; align-items: center; padding: 6px 0; }
.his-item__preview { width: 64px; display: flex; justify-content: center; }
.his-item__icon { font-size: 28px; color: var(--custom-color-primary); }
.his-item__meta { flex: 1; }
.his-item__line { display: flex; gap: 10px; align-items: center; margin-bottom: 4px; }
.his-item__link { color: var(--custom-color-primary); max-width: 520px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; }
.his-item__text { color: var(--custom-font-color); }
.his-item__sub { color: var(--custom-font-color2); font-size: 12px; }
</style>
