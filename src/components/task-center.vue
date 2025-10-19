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
    themeColors () {
      const theme =
        (this.$store && this.$store.state && this.$store.state.user && this.$store.state.user.theme) ||
        ''
      /* eslint-disable no-unused-expressions */ theme
      const style = getComputedStyle(document.documentElement)
      const readVar = (name, fallback) => {
        const value = style.getPropertyValue(name)
        return (value && value.trim()) || fallback
      }
      return {
        primary: readVar('--custom-color-primary', '#1890ff'),
        success: readVar('--custom-color-success', '#52c41a'),
        warning: readVar('--custom-color-warning', '#faad14'),
        danger: readVar('--custom-color-danger', '#ff4d4f'),
        info: readVar('--custom-color-info', '#d9d9d9')
      }
    },
    themePrimaryColor () {
      // react to theme toggles via vuex
      const _theme = (this.$store && this.$store.state && this.$store.state.user && this.$store.state.user.theme) || ''
      /* eslint-disable no-unused-expressions */ _theme
      return this.themeColors.primary || '#1890ff'
    },
    isDarkTheme () {
      const theme =
        (this.$store && this.$store.state && this.$store.state.user && this.$store.state.user.theme) ||
        ''
      /* eslint-disable no-unused-expressions */ theme
      return theme === 'darkTheme'
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
          width: 110,
          customRender: (text, row) => {
            const statusKey = this.normalizeStatusKey(row.status)
            const style = this.buildStatusStyle(statusKey)
            const label = this.formatStatusLabel(statusKey, row.status)
            return this.$createElement('span', { class: 'status-pill', style }, label)
          }
        },
        {
          title: this.$t('tasks.progress'),
          key: 'progress',
          width: 200,
          align: 'center',
          customRender: (text, row) => {
            const rawPercent = this.getProgress(row)
            const percent = this.normalizeProgressValue(rawPercent) ?? 0
            const statusKey = this.normalizeStatusKey(row.status)
            const colors = this.resolveProgressColors(statusKey, percent)
            const progressStatus = this.resolveProgressStatus(statusKey, percent)
            return this.$createElement(
              'div',
              { class: 'progress-cell', style: { '--progress-text-color': colors.text } },
              [
                this.$createElement('a-progress', {
                  props: {
                    percent,
                    size: 'small',
                    status: progressStatus,
                    strokeColor: colors.bar
                  }
                })
              ]
            )
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
      return (this.tasks || []).filter(t => this.normalizeStatusKey(t.status) === 'running').length
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
    normalizeStatusKey (status) {
      if (status == null) return 'unknown'
      return String(status).trim().toLowerCase() || 'unknown'
    },
    hasRunningTasks (list = this.tasks) {
      return (list || []).some(item => this.normalizeStatusKey(item.status) === 'running')
    },
    clearProgressState () {
      this.lastAnyProgressAt = 0
      this.progressByMission = {}
      this.progressByFilename = {}
    },
    normalizeProgressValue (value) {
      if (value == null || value === '') return null
      if (typeof value === 'number' && !Number.isNaN(value)) {
        return Math.max(0, Math.min(100, value))
      }
      const str = String(value).trim()
      if (!str) return null
      const cleaned = str.endsWith('%') ? str.slice(0, -1) : str
      const parsed = parseFloat(cleaned)
      if (Number.isNaN(parsed)) return null
      return Math.max(0, Math.min(100, parsed))
    },
    resolveProgressColors (statusKey, percent) {
      const palette = this.themeColors || {}
      const completedKeys = { end: 1, success: 1, completed: 1, finish: 1, finished: 1 }
      const failedKeys = { failed: 1, fail: 1, error: 1, stopped: 1 }
      const pendingKeys = { pending: 1, wait: 1, waiting: 1, queued: 1, queue: 1 }
      const textColor = this.isDarkTheme ? '#ffffff' : '#000000'
      if (percent >= 100 || completedKeys[statusKey]) {
        const color = palette.success || '#52c41a'
        return { bar: color, text: textColor }
      }
      if (failedKeys[statusKey]) {
        const color = palette.danger || '#ff4d4f'
        return { bar: color, text: textColor }
      }
      if (pendingKeys[statusKey]) {
        const color = palette.warning || '#faad14'
        return { bar: color, text: textColor }
      }
      const primary = this.themePrimaryColor || palette.primary || '#1890ff'
      return { bar: primary, text: textColor }
    },
    resolveProgressStatus (statusKey, percent) {
      const completedKeys = { end: 1, success: 1, completed: 1, finish: 1, finished: 1 }
      const failedKeys = { failed: 1, fail: 1, error: 1, stopped: 1 }
      const pendingKeys = { pending: 1, wait: 1, waiting: 1, queued: 1, queue: 1 }
      if (percent >= 100 || completedKeys[statusKey]) return 'success'
      if (failedKeys[statusKey]) return 'exception'
      if (pendingKeys[statusKey]) return 'normal'
      return 'active'
    },
    formatStatusLabel (statusKey, rawStatus) {
      const dict = {
        running: this.$t('tasks.statuses.running'),
        processing: this.$t('tasks.statuses.running'),
        pending: this.$t('tasks.statuses.pending'),
        wait: this.$t('tasks.statuses.pending'),
        waiting: this.$t('tasks.statuses.pending'),
        queued: this.$t('tasks.statuses.pending'),
        queue: this.$t('tasks.statuses.pending'),
        end: this.$t('tasks.statuses.completed'),
        success: this.$t('tasks.statuses.completed'),
        completed: this.$t('tasks.statuses.completed'),
        finish: this.$t('tasks.statuses.completed'),
        finished: this.$t('tasks.statuses.completed'),
        failed: this.$t('tasks.statuses.failed'),
        fail: this.$t('tasks.statuses.failed'),
        error: this.$t('tasks.statuses.failed'),
        stopped: this.$t('tasks.statuses.failed'),
        unknown: this.$t('tasks.statuses.unknown')
      }
      if (dict[statusKey]) return dict[statusKey]
      if (rawStatus != null && rawStatus !== '') return String(rawStatus)
      return this.$t('tasks.statuses.unknown')
    },
    resolveStatusColor (statusKey) {
      const palette = this.themeColors
      const map = {
        running: palette.primary,
        processing: palette.primary,
        pending: palette.warning,
        wait: palette.warning,
        waiting: palette.warning,
        queued: palette.info,
        queue: palette.info,
        end: palette.success,
        success: palette.success,
        completed: palette.success,
        finish: palette.success,
        finished: palette.success,
        failed: palette.danger,
        fail: palette.danger,
        error: palette.danger,
        stopped: palette.danger
      }
      return map[statusKey] || palette.info
    },
    buildStatusStyle (statusKey) {
      const baseColor = this.resolveStatusColor(statusKey)
      const bgAlpha = this.isDarkTheme ? 0.32 : 0.14
      const borderAlpha = this.isDarkTheme ? 0.5 : 0.22
      return {
        backgroundColor: this.applyAlpha(baseColor, bgAlpha),
        borderColor: this.applyAlpha(baseColor, borderAlpha),
        color: baseColor
      }
    },
    applyAlpha (color, alpha) {
      const parsed = this.parseColor(color)
      if (!parsed) return color
      const clamped = Math.min(1, Math.max(0, alpha))
      const { r, g, b } = parsed
      return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${clamped})`
    },
    parseColor (color) {
      if (!color) return null
      const value = color.trim()
      if (value.startsWith('#')) {
        let hex = value.slice(1)
        if (hex.length === 3) {
          hex = hex.split('').map(ch => ch + ch).join('')
        }
        if (hex.length === 6 || hex.length === 8) {
          const num = parseInt(hex.slice(0, 6), 16)
          return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255
          }
        }
      }
      const rgbMatch = value.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i)
      if (rgbMatch) {
        return {
          r: parseFloat(rgbMatch[1]),
          g: parseFloat(rgbMatch[2]),
          b: parseFloat(rgbMatch[3])
        }
      }
      return null
    },
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
      if (mid && this.progressByMission[mid] != null) {
        const stored = this.normalizeProgressValue(this.progressByMission[mid])
        if (stored != null) return stored
      }

      // Fallback: try filename-based mapping for product sync
      if (row.task_name === 'shop_manager.task.sync_products_task' && row.shop_url) {
        const key = `sync_product_${row.shop_url}`
        const v = this.normalizeProgressValue(this.progressByFilename[key])
        if (v != null) return v
      }

      // As a safe default, if running, show latest known progress; else 100/0 by status
      if (this.normalizeStatusKey(row.status) === 'running') {
        const latest = this.latestProgressValue()
        return latest == null ? 0 : latest
      }
      return this.normalizeStatusKey(row.status) === 'end' ? 100 : 0
    },
    latestProgressValue () {
      const arr = Object.values(this.progressByMission)
        .concat(Object.values(this.progressByFilename))
        .map(v => this.normalizeProgressValue(v))
        .filter(v => v != null)
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
            if (!this.hasRunningTasks(list)) this.clearProgressState()
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
                let msg = {}
                try { msg = JSON.parse(evt.data || '{}') } catch (_) { msg = {} }
                const progress = this.normalizeProgressValue(msg.progress)
                if (progress != null) {
                  if (progress < 100) {
                    this.lastAnyProgressAt = Date.now()
                  }
                  this.$set(this.progressByMission, mid, progress)
                  if (progress >= 100) {
                    try { ws.close() } catch (_) {}
                    delete this.missionSockets[mid]
                    // Mark end locally; then refresh once to sync status
                    const idx = (this.tasks || []).findIndex(x => x.mission_id === mid)
                    if (idx > -1) this.$set(this.tasks[idx], 'status', 'end')
                    if (!this.hasRunningTasks()) this.clearProgressState()
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
      if (!this.hasRunningTasks()) this.clearProgressState()
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
                if (!self.hasRunningTasks()) self.clearProgressState()
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
      // Export completion notifications are now forwarded via global ws-notify -> bus
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
    // Listen to global export notifications
    try {
      const bus = require('@/common/event-bus').default
      const { EVENTS } = require('@/common/event-bus')
      this._onExport = () => this.refresh()
      bus.$on(EVENTS.EXPORT_NOTIFICATION, this._onExport)
    } catch (_) {}
  },
  beforeDestroy () {
    this.closeWS()
    try {
      const bus = require('@/common/event-bus').default
      const { EVENTS } = require('@/common/event-bus')
      if (this._onExport) bus.$off(EVENTS.EXPORT_NOTIFICATION, this._onExport)
    } catch (_) {}
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
.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  text-transform: capitalize;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
</style>

<!-- global (non-scoped) overlay tuning for proper stacking/containment -->
<style lang="scss">
.task-center-popover {
  .ant-popover-inner { padding: 0; border-radius: 8px; overflow: hidden; }
  .ant-popover-inner-content { padding: 8px 12px; }
}
.task-dropdown .progress-cell .ant-progress-text {
  color: var(--progress-text-color, var(--custom-font-color, #333)) !important;
  font-weight: 600;
}
</style>
