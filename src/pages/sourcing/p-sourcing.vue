<template>
  <div class="p-sourcing-page">
    <PageHead :title="$t('navigate.sourcing')" />

    <a-card :bordered="false" class="mt-16">
      <a-tabs :activeKey="activeStatus" @change="onTab">
        <a-tab-pane v-for="t in statusTabs" :tab="t.label" :key="t.value" />
      </a-tabs>

      <a-table :data-source="table.items" :loading="loading" :pagination="false" size="small">
        <template slot="expandedRowRender" slot-scope="record">
          <div class="his-item-list">
            <div class="his-item" v-for="(it, idx) in (record.items || [])" :key="it.item_id || idx">
              <div class="his-item__preview">
                <AuthImg v-if="it.source_type==='image' && it.image" :src="it.image" :styleInfo="'width:56px;height:56px;border-radius:6px;'" />
                <a-icon v-else-if="it.source_type==='url'" type="link" class="his-item__icon" />
                <a-icon v-else type="shopping" class="his-item__icon" />
              </div>
              <div class="his-item__meta">
                <div class="his-item__line">
                  <a-tag color="blue" size="small">{{ it.source_type }}</a-tag>
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
        <a-table-column :title="$t('sourcing.sourcingId')" dataIndex="sourcing_id" key="sourcing_id" width="220" />
        <a-table-column :title="$t('message.storage.userCode')" dataIndex="user_code" key="user_code" width="160" />
        <a-table-column :title="$t('common.status')" key="status" width="180">
          <template slot-scope="text, record">
            <a-tag :color="statusColor(record.status)">{{ statusLabel(record.status) }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column :title="$t('common.createTime')" dataIndex="created_at" key="created_at" />
        <a-table-column :title="$t('common.operation')" key="operate" width="260">
          <template slot-scope="text, record">
            <a-button v-if="record.status==='submitted'" type="primary" size="small" @click="startSourcing(record)">{{ $t('common.start') }}</a-button>
            <a-button v-else-if="record.status==='sourcing'" type="primary" size="small" @click="openQuoteModal(record)">{{ $t('common.inquiryConfirmation') }}</a-button>
          </template>
        </a-table-column>
      </a-table>
      <div class="mt-16" style="text-align:right">
        <a-pagination show-quick-jumper :pageSize="table.page_size" :current="table.page_number" :total="table.total" @change="loadList" />
      </div>
    </a-card>

    <!-- Quote input modal -->
    <a-modal class="global-modal-class" :title="$t('sourcing.feedbackQuote') + ' (' + currencySymbol + ')'" :visible="quoteModalVisible" @ok="confirmQuote" @cancel="closeQuoteModal">
      <a-input v-model="quoteInput" :placeholder="currencySymbol + ' 0.00'" />
    </a-modal>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import AuthImg from '@/components/auth-img.vue'
import { Modal, message } from 'ant-design-vue'
import bus, { EVENTS } from '@/common/event-bus'
export default {
  name: 'PSourcing',
  components: { PageHead, AuthImg },
  data() {
    return {
      loading: false,
      activeStatus: 'submitted',
      table: { items: [], total: 0, page_number: 1, page_size: 10 },
      quoteModalVisible: false,
      quoteInput: '',
      quoteRow: null,
    }
  },
  computed: {
    currencySymbol() { return '$' },
    statusTabs() {
      const zh = { submitted: '已提交', sourcing: '选品中', pending_confirmation: '待确认', completed: '已完成' }
      const en = { submitted: 'Submitted', sourcing: 'Sourcing', pending_confirmation: 'Pending confirmation', completed: 'Completed' }
      const dict = this.$i18n.locale === 'zh_cn' ? zh : en
      return [ 'submitted','sourcing','pending_confirmation','completed' ].map(v => ({ value: v, label: dict[v] }))
    }
  },
  created() {
    this.loadList(1)
    // refresh list when receiving WS notification
    this._unsub = (payload) => {
      // only refresh if visible tab matches payload.status or payload has no status restriction
      this.loadList(this.table.page_number)
    }
    bus.$on(EVENTS.SOURCING_NOTIFICATION, this._unsub)
  },
  beforeDestroy() { bus.$off(EVENTS.SOURCING_NOTIFICATION, this._unsub) },
  methods: {
    statusColor(s) {
      const map = {
        submitted: 'geekblue',
        sourcing: 'gold',
        pending_confirmation: 'purple',
        completed: 'green'
      }
      return map[s] || 'default'
    },
    statusLabel(s) {
      const map = this.statusTabs.reduce((acc,cur)=>{acc[cur.value]=cur.label;return acc},{}); return map[s] || s
    },
    onTab(activeKey) { this.activeStatus = activeKey; this.loadList(1) },
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
      Modal.confirm({
        title: this.$t('common.tips'),
        content: this.$t('sourcing.confirmStart'),
        okText: this.$t('common.confirm'),
        cancelText: this.$t('common.cancel'),
        className: 'theme-confirm-modal',
        onOk: async () => {
          await this.patchStatus(row.sourcing_id, { status: 'sourcing' })
          this.loadList()
        }
      })
    },
    openQuoteModal(row) {
      this.quoteRow = row
      this.quoteInput = ''
      this.quoteModalVisible = true
    },
    closeQuoteModal() { this.quoteModalVisible = false; this.quoteInput = ''; this.quoteRow = null },
    async confirmQuote() {
      const feedback = String(this.quoteInput || '').trim()
      if (feedback === '') { message.warning(this.$t('sourcing.priceRequired')); return }
      const row = this.quoteRow
      const items = (row.items || []).map(it => ({ item_id: it.item_id, feedback_quote: feedback }))
      await this.patchStatus(row.sourcing_id, { status: 'pending_confirmation', items })
      this.closeQuoteModal()
      this.loadList()
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
