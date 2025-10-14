import { config, dropShipper } from '@/common/commonconfig'
import { getRoleType, getRoleTypeForP, getWebSocketUrl } from '@/common/common-func'
import bus, { EVENTS } from '@/common/event-bus'
import store from '@/store'

// 简单可靠：按 URL 去重管理连接；open 时登记，error/close 时移除。
class SourcingWS {
  constructor() {
    // channels[url] = { ws, pingTimer }
    this.channels = {}
  }

  // 收集需要维持的 ID：related_id 始终尝试；P 端有 provider_uuid 再额外尝试
  collectIds() {
    const ids = new Set()
    let role = getRoleType(window.location.pathname) || dropShipper
    if (role === config.provider.role) role = getRoleTypeForP()
    const key = (config[role] && config[role].userRelatedId) || config.dropShipper.userRelatedId
    const rid = localStorage.getItem(key)
    if (rid) ids.add(rid)
    if (role === config.provider.role || role === config.operator.role) {
      try {
        const shop = store.state.shopProviderUuid && store.state.shopProviderUuid.shopInfo
        if (shop && shop.provider_uuid) ids.add(shop.provider_uuid)
      } catch (_) { /* ignore */ }
    }
    return Array.from(ids)
  }

  getUrl(id) {
    const base = getWebSocketUrl().replace(/\/$/, '')
    return `${base}/ws/notifications/${encodeURIComponent(id)}`
  }

  ensureUrl(url) {
    const ch = this.channels[url]
    if (ch && ch.ws && (ch.ws.readyState === 0 || ch.ws.readyState === 1)) return
    try {
      const ws = new WebSocket(url)
      const entry = { ws, pingTimer: null }
      this.channels[url] = entry
      ws.onopen = () => {
        if (entry.pingTimer) clearInterval(entry.pingTimer)
        entry.pingTimer = setInterval(() => {
          try { ws && ws.readyState === 1 && ws.send(JSON.stringify({ type: 'ping' })) } catch (_) {}
        }, 30000)
        // eslint-disable-next-line no-console
        console.log('[WS] connected', url)
      }
      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data || '{}')
          if (data && (data.type === EVENTS.SOURCING_NOTIFICATION || data.event === EVENTS.SOURCING_NOTIFICATION || (data.sourcing_id && data.status))) {
            bus.$emit(EVENTS.SOURCING_NOTIFICATION, data)
          }
          if (data && (data.event === EVENTS.EXPORT_NOTIFICATION || data.filename)) {
            bus.$emit(EVENTS.EXPORT_NOTIFICATION, data)
          }
        } catch (_) { /* ignore */ }
      }
      const cleanup = () => {
        try { entry.pingTimer && clearInterval(entry.pingTimer) } catch (_) {}
        delete this.channels[url]
        // 轻量重试一次，保持简单
        setTimeout(() => this.ensureUrl(url), 3000)
      }
      ws.onerror = cleanup
      ws.onclose = cleanup
    } catch (_) { /* ignore */ }
  }

  start() {
    const ids = this.collectIds()
    if (!ids.length) {
      // eslint-disable-next-line no-console
      console.warn('[WS] skip connect: no ids')
      return
    }
    ids.map(id => this.getUrl(id)).forEach(url => this.ensureUrl(url))
  }
}

const sourcingWS = new SourcingWS()
export default sourcingWS
