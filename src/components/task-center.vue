<template>
  <div class="task-center">
    <a-popover
      placement="bottomRight"
      trigger="click"
      :overlayClassName="'task-center-popover'"
      :visible="visible"
      @visibleChange="v => visible = v"
    >
      <template slot="content">
        <div class="task-dropdown" :style="{ width: '560px' }">
          <div class="task-dropdown-header">
            <span>{{ $t('tasks.centerTitle') }}</span>
            <a @click="refresh" class="refresh">{{ $t('common.refresh') || 'Refresh' }}</a>
          </div>

          <a-table
            size="small"
            :pagination="false"
            :rowKey="row => row.mission_id || row.entity_id || row.task_name"
            :dataSource="displayTasks"
            :columns="columns"
            :locale="{ emptyText: $t('common.noDataAvailable') }"
          />
        </div>
      </template>

      <div class="task-indicator" @click="toggle">
        <div class="ring" :class="{ spinning: isSpinning }">
          <div class="dot"></div>
        </div>
        <div class="core">
          <span class="count">{{ runningCount }}</span>
        </div>
      </div>
    </a-popover>
  </div>
  </template>

<script>
import { Modal, message } from 'ant-design-vue'
import { getWebSocketUrl, getRoleType, getRoleTypeForP } from '@/common/common-func'
import { config, dropShipper } from '@/common/commonconfig'
import store from '@/store'

export default {
  name: 'TaskCenter',
  data () {
    return {
      visible: false,
      ws: null, // legacy/common socket (unused for progress after change)
      wsNotify: null,
      missionSockets: {}, // { [mission_id]: WebSocket }
      progressByMission: {},
      progressByFilename: {},
      lastAnyProgressAt: 0,
      tasks: [],
      isLoading: false
    }
  },
  computed: {
    themePrimaryColor () {
      // react to theme toggles via vuex
      const _theme = (this.$store && this.$store.state && this.$store.state.user && this.$store.state.user.theme) || ''
      /* eslint-disable no-unused-expressions */ _theme
      const v = getComputedStyle(document.documentElement).getPropertyValue('--custom-color-primary')
      return (v && v.trim()) || '#1890ff'
    },
    columns () {
      return [
        {
          title: this.$t('tasks.taskName'),
          key: 'task_name',
          className: 'tc-nowrap',
          customRender: (text, row) => this.$createElement('span', this.translateTaskName(row.task_name))
        },
        {
          title: this.$t('common.status'),
          key: 'status',
          width: 90,
          customRender: (text, row) => {
            const statusKey = (row.status || '').toLowerCase()
            const primary = this.themePrimaryColor
            const color = statusKey === 'running' ? primary : (statusKey === 'end' ? '#52c41a' : '#d9d9d9')
            return this.$createElement('a-tag', { props: { color } }, statusKey)
          }
        },
        {
          title: this.$t('tasks.progress'),
          key: 'progress',
          width: 200,
          align: 'center',
          customRender: (text, row) => {
            const p = this.getProgress(row)
            const strokeColor = this.themePrimaryColor
            return this.$createElement('a-progress', {
              props: {
                percent: p,
                size: 'small',
                status: p === 100 ? 'success' : 'active',
                strokeColor
              }
            })
          }
        },
        {
          title: this.$t('common.operation'),
          key: 'op',
          width: 80,
          align: 'center',
          customHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
          customRender: (text, row) => {
            const isEnd = (row.status || '').toLowerCase() === 'end'
            const clickHandler = (e) => { e && e.stopPropagation && e.stopPropagation(); if (isEnd) this.deleteTask(row) }
            return this.$createElement(
              'a',
              {
                attrs: { title: isEnd ? this.$t('common.delete') : '' },
                style: { cursor: isEnd ? 'pointer' : 'not-allowed' },
                on: { click: clickHandler }
              },
              [ this.$createElement('a-icon', { props: { type: 'delete' }, style: { color: isEnd ? 'var(--custom-color-danger, #ff4d4f)' : '#d9d9d9' } }) ]
            )
          }
        }
      ]
    },
    runningCount () {
      return this.tasks.filter(t => (t.status || '').toLowerCase() === 'running').length
    },
    isSpinning () {
      // Spin when running tasks exist or any ws progress in last 6s
      const recent = Date.now() - this.lastAnyProgressAt < 6000
      return this.runningCount > 0 || recent
    },
    relatedId () {
      let role = getRoleType(window.location.pathname) || dropShipper
      if (role === config.provider.role) role = getRoleTypeForP()
      const key = (config[role] && config[role].userRelatedId) || config.dropShipper.userRelatedId
      let rid = localStorage.getItem(key)
      if (role === config.provider.role || role === config.operator.role) {
        try {
          const shop = store.state.shopProviderUuid && store.state.shopProviderUuid.shopInfo
          if (shop && shop.provider_uuid) rid = shop.provider_uuid
        } catch (_) {}
      }
      return rid
    },
    displayTasks () {
      // Only show the four types required
      const allow = {
        'orders_manager.tasks.export_to_xls': 1,
        'shop_manager.task.fulfill_orders_task': 1,
        'shop_manager.task.start_export_shopify_orders': 1,
        'shop_manager.task.sync_products_task': 1
      }
      return (this.tasks || []).filter(t => allow[t.task_name])
    }
  },
  watch: {
    relatedId () {
      this.reconnect()
    }
  },
  methods: {
    toggle () { this.visible = !this.visible; if (this.visible) this.refresh() },
    translateTaskName (name) {
      const map = {
        'orders_manager.tasks.export_to_xls': this.$t('tasks.exportToXls'),
        'shop_manager.task.fulfill_orders_task': this.$t('tasks.fulfillOrders'),
        'shop_manager.task.start_export_shopify_orders': this.$t('tasks.exportShopifyOrders'),
        'shop_manager.task.sync_products_task': this.$t('tasks.syncProducts')
      }
      return map[name] || name
    },
    getProgress (row) {
      const mid = row.mission_id
      if (mid && this.progressByMission[mid] != null) return this.progressByMission[mid]

      // Fallback: try filename-based mapping for product sync
      if (row.task_name === 'shop_manager.task.sync_products_task' && row.shop_url) {
        const key = `sync_product_${row.shop_url}`
        const v = this.progressByFilename[key]
        if (v != null) return v
      }

      // As a safe default, if running, show latest known progress; else 100/0 by status
      if ((row.status || '').toLowerCase() === 'running') {
        const latest = this.latestProgressValue()
        return latest == null ? 0 : latest
      }
      return  (row.status || '').toLowerCase() === 'end' ? 100 : 0
    },
    latestProgressValue () {
      const arr = Object.values(this.progressByMission).concat(Object.values(this.progressByFilename))
      if (!arr.length) return null
      return arr[arr.length - 1]
    },
    refresh () {
      if (this.isLoading) return
      this.isLoading = true
      const params = {}
      this.$ajax({ url: '/api/task-record/task-list', method: 'get', params, roleType: this.roleType })
        .then(res => {
          if (this.$isRequestSuccessful(res.code)) {
            const list = Array.isArray(res.data) ? res.data : []
            this.tasks = list
            try { localStorage.setItem('taskRecordsCache', JSON.stringify(list)) } catch (_) {}
            // After tasks synced, ensure mission websockets are bound
            this.ensureMissionSockets()
          }
        })
        .finally(() => { this.isLoading = false })
    },
    ensureMissionSockets () {
      const base = getWebSocketUrl().replace(/\/$/, '')
      const runningIds = {}
      ;(this.tasks || []).forEach(t => {
        const mid = t.mission_id
        if (!mid) return
        const isRunning = (t.status || '').toLowerCase() === 'running'
        if (isRunning) {
          runningIds[mid] = 1
          if (!this.missionSockets[mid] || this.missionSockets[mid].readyState === WebSocket.CLOSED) {
            try {
              const ws = new WebSocket(`${base}/ws/common_progress/${encodeURIComponent(mid)}`)
              ws.onmessage = (evt) => {
                this.lastAnyProgressAt = Date.now()
                let msg = {}
                try { msg = JSON.parse(evt.data || '{}') } catch (_) { msg = {} }
                if (msg.progress != null) {
                  this.$set(this.progressByMission, mid, msg.progress)
                  if (Number(msg.progress) >= 100) {
                    try { ws.close() } catch (_) {}
                    delete this.missionSockets[mid]
                    // Mark end locally; then refresh once to sync status
                    const idx = (this.tasks || []).findIndex(x => x.mission_id === mid)
                    if (idx > -1) this.$set(this.tasks[idx], 'status', 'end')
                    this.refresh()
                  }
                }
              }
              ws.onerror = () => { try { ws.close() } catch (_) {} }
              ws.onclose = () => { /* noop */ }
              this.$set(this.missionSockets, mid, ws)
            } catch (_) {}
          }
        }
      })
      // Close sockets for missions no longer running
      Object.keys(this.missionSockets).forEach(mid => {
        if (!runningIds[mid]) {
          try { this.missionSockets[mid].close() } catch (_) {}
          this.$delete(this.missionSockets, mid)
        }
      })
    },
    deleteTask (row) {
      const taskId = row.entity_id || row.mission_id || row.related_id
      if (!taskId) return
      const self = this
      Modal.confirm({
        title: this.$t('common.confirmDeleteRecord'),
        zIndex: 4000,
        getContainer: () => document.body,
        okText: this.$t('common.confirm'),
        cancelText: this.$t('common.cancel'),
        onOk () {
          return self.$ajax({ url: '/api/task-record/task-delete', method: 'delete', params: { task_id: taskId }, roleType: self.roleType })
            .then(res => {
              if (self.$isRequestSuccessful(res.code)) {
                self.tasks = (self.tasks || []).filter(t => (t.entity_id || t.mission_id || t.related_id) !== taskId)
                try { localStorage.setItem('taskRecordsCache', JSON.stringify(self.tasks)) } catch (_) {}
                // close mission socket if exists
                const ws = self.missionSockets[taskId]
                if (ws) { try { ws.close() } catch (_) {} delete self.missionSockets[taskId] }
                message.success(self.$t('common.operationSuccessful'))
              } else {
                message.error(res.message || self.$t('common.operationFailed') || 'Failed')
              }
            })
        }
      })
    },
    connectWS () {
      this.closeWS()
      const base = getWebSocketUrl().replace(/\/$/, '')
      // Bind mission websockets based on current cache first
      this.ensureMissionSockets()
      // Notifications channel for export completion (optional, light)
      try {
        if (this.relatedId) {
          this.wsNotify = new WebSocket(`${base}/ws/notifications/${encodeURIComponent(this.relatedId)}`)
        }
        this.wsNotify.onmessage = (evt) => {
          let msg = {}
          try { msg = JSON.parse(evt.data || '{}') } catch (_) { msg = {} }
          if (msg && (msg.event === 'export_notification' || msg.filename)) {
            // On completion, refresh list to flip status
            this.refresh()
          }
        }
      } catch (_) {}
    },
    reconnect () { this.connectWS() },
    closeWS () {
      try { this.ws && this.ws.close() } catch (_) {}
      try { this.wsNotify && this.wsNotify.close() } catch (_) {}
      this.ws = null
      this.wsNotify = null
    }
  },
  mounted () {
    // Load cache first for instant display
    try {
      const cache = JSON.parse(localStorage.getItem('taskRecordsCache') || '[]')
      if (Array.isArray(cache)) this.tasks = cache
    } catch (_) {}
    // Always pull tasks on page load to ensure animation and sockets
    this.refresh()
    this.connectWS()
  },
  beforeDestroy () {
    this.closeWS()
  }
}
</script>

<style scoped lang="scss">
.task-indicator {
  position: relative;
  width: 28px; /* include ring space */
  height: 28px;
  margin: 0 10px;
  cursor: pointer;
}

.core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--custom-background-color, #fff);
  border: 1px solid var(--custom-border-color, #e8e8e8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--custom-font-color, #333);
  font-size: 12px;
  line-height: 1;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 26px;
  height: 26px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid transparent;
  /* top arc follows icon color: dark -> white, light -> black */
  border-top-color: var(--custom-icon-color, #000);
  border-right-color: var(--cursor-ring-color, rgba(0,0,0,0.18));
  border-bottom-color: var(--cursor-ring-color, rgba(0,0,0,0.18));
  border-left-color: var(--cursor-ring-color, rgba(0,0,0,0.18));
}
.ring.spinning { animation: spin 1s linear infinite; }

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.task-dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.task-dropdown-header .refresh { color: var(--custom-font-color4, #95a4fc); }

/* ensure the dropdown content clips its children */
.task-dropdown {
  box-sizing: border-box;
  overflow: hidden;
}

::v-deep .ant-table-thead > tr > th {
  background: var(--custom-background-color, #fff);
  color: var(--custom-font-color) !important;
  white-space: nowrap;
  word-break: keep-all;
}
/* no-wrap cells for task name */
::v-deep td.tc-nowrap { white-space: nowrap; word-break: keep-all; }
/* fixed layout to avoid overflow */
::v-deep .ant-table { table-layout: fixed; }
/* progress text color by theme */
.task-dropdown .ant-progress-text { color: var(--custom-font-color) !important; }
</style>

<!-- global (non-scoped) overlay tuning for proper stacking/containment -->
<style lang="scss">
.task-center-popover {
  .ant-popover-inner { padding: 0; border-radius: 8px; overflow: hidden; }
  .ant-popover-inner-content { padding: 8px 12px; }
}
</style>
