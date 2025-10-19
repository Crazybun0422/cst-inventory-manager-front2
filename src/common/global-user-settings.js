import ajax from '@/api/ajax'
import { config } from '@/common/commonconfig'

// Simple in-memory cache for global user settings (keyed by role/provider)
const memoryCache = {}

function cacheKey ({ provider_uuid = '', roleType = '' } = {}) {
  return provider_uuid ? `p:${provider_uuid}` : `ds:${roleType || 'default'}`
}

export async function loadGlobalSettings ({ roleType, provider_uuid } = {}) {
  const key = cacheKey({ provider_uuid, roleType })
  if (memoryCache[key]) return memoryCache[key]
  try {
    const params = {}
    if (provider_uuid) params.provider_uuid = provider_uuid
    const res = await ajax({
      url: '/api-prefix/api/customer-settings/global-user-settings',
      method: 'get',
      params,
      roleType
    })
    if (res && (res.code === 200 || res.code === 0 || res.code === undefined) && res.data) {
      memoryCache[key] = res.data || {}
      return memoryCache[key]
    }
  } catch (e) {}
  memoryCache[key] = {}
  return memoryCache[key]
}

export async function updateGlobalSettings ({ updates = {}, roleType, provider_uuid } = {}) {
  const key = cacheKey({ provider_uuid, roleType })
  // merge into cache first
  memoryCache[key] = { ...(memoryCache[key] || {}), ...updates }
  const data = { ...updates }
  if (provider_uuid) data.provider_uuid = provider_uuid
  try {
    await ajax({
      url: '/api-prefix/api/customer-settings/global-user-settings',
      method: 'post',
      data,
      headers: { 'Content-Type': 'application/json' },
      roleType
    })
  } catch (e) {}
  return memoryCache[key]
}

export function resolvePreferenceProviderUuid (store, roleType) {
  if (!roleType || typeof roleType !== 'string') return ''
  try {
    const state = store && store.state
    if (roleType === config.provider.role || roleType === config.operator.role) {
      const shopInfo = state && state.shopProviderUuid && state.shopProviderUuid.shopInfo
      if (shopInfo && shopInfo.provider_uuid) return shopInfo.provider_uuid
      const key = (config[roleType] && config[roleType].userRelatedId) || config.provider.userRelatedId
      if (key) {
        const stored = localStorage.getItem(key)
        if (stored) return stored
      }
    }
    if (roleType === config.dropShipper.role) {
      const dsUuid = state && state.user && state.user.dsCurrentProviderUuid
      if (dsUuid) return dsUuid
    }
  } catch (e) { /* ignore */ }
  return ''
}
