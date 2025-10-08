import { config, dropShipper } from '@/common/commonconfig'
import { getRoleType, getRoleTypeForP, getWebSocketUrl } from '@/common/common-func'
import bus, { EVENTS } from '@/common/event-bus'
import store from '@/store'

class SourcingWS {
  constructor() {
    this.ws = null
    this.timer = null
    this.retries = 0
  }

  getRelatedId() {
    let role = getRoleType(window.location.pathname) || dropShipper
    if (role === config.provider.role) role = getRoleTypeForP()
    const key = (config[role] && config[role].userRelatedId) || config.dropShipper.userRelatedId
    let rid = localStorage.getItem(key)
    // P 端优先用当前选择的 provider_uuid（与既有 header 逻辑保持一致）
    if (role === config.provider.role || role === config.operator.role) {
      try {
        const shop = store.state.shopProviderUuid && store.state.shopProviderUuid.shopInfo
        if (shop && shop.provider_uuid) rid = shop.provider_uuid
      } catch (_) {}
    }
    return { related_id: rid, role }
  }

  getUrl(related_id) {
    // 与 header 的拼接规则一致：<ws-base>/ws/notifications/<id>
    const base = getWebSocketUrl().replace(/\/$/, '')
    return `${base}/ws/notifications/${encodeURIComponent(related_id)}`
  }

  start() {
    const { related_id } = this.getRelatedId()
    if (!related_id) {
      // eslint-disable-next-line no-console
      console.warn('[WS] skip connect: related_id not found')
      return
    }
    // 已连接或正在连接时不重复连接
    if (this.ws && (this.ws.readyState === 0 || this.ws.readyState === 1)) return
    const url = this.getUrl(related_id)
    try {
      this.ws = new WebSocket(url)
    } catch (_) { return }

    this.ws.onopen = () => {
      this.retries = 0
      this.ping()
      // eslint-disable-next-line no-console
      console.log('[WS] connected', url)
    }
    this.ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data || '{}')
        if (data && (data.type === EVENTS.SOURCING_NOTIFICATION || data.event === EVENTS.SOURCING_NOTIFICATION || (data.sourcing_id && data.status))) {
          bus.$emit(EVENTS.SOURCING_NOTIFICATION, data)
        }
      } catch (e) {
        // ignore
      }
    }
    this.ws.onerror = () => { /* eslint-disable no-console */ console.warn('[WS] error'); this.scheduleReconnect() }
    this.ws.onclose = () => { /* eslint-disable no-console */ console.warn('[WS] closed'); this.scheduleReconnect() }
  }

  ping() {
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => { try { this.ws && this.ws.readyState === 1 && this.ws.send(JSON.stringify({ type: 'ping' })) } catch (_) {} }, 30000)
  }

  scheduleReconnect() {
    if (this.timer) { clearInterval(this.timer); this.timer = null }
    if (this.retries > 6) return
    const delay = Math.min(1000 * Math.pow(2, this.retries), 15000)
    this.retries++
    setTimeout(() => this.start(), delay)
  }
}

const sourcingWS = new SourcingWS()
export default sourcingWS
