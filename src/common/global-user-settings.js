import ajax from '@/api/ajax'
import { config } from '@/common/commonconfig'

function pickFirstString (...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function normalizeUpdatePayload (updates = {}) {
  const normalized = { ...updates }
  const language = pickFirstString(
    normalized.language,
    normalized.defaultLanguage,
    normalized.default_language,
    normalized.ui_language
  )
  const theme = pickFirstString(
    normalized.theme,
    normalized.defaultTheme,
    normalized.default_theme,
    normalized.ui_theme,
    normalized.theme_preference
  )

  if (language) {
    normalized.language = language
  } else {
    delete normalized.language
  }
  if (theme) {
    normalized.theme = theme
  } else {
    delete normalized.theme
  }

  ;['defaultLanguage', 'default_language', 'ui_language'].forEach((key) => {
    if (key in normalized) delete normalized[key]
  })
  ;['defaultTheme', 'default_theme', 'ui_theme', 'theme_preference'].forEach((key) => {
    if (key in normalized) delete normalized[key]
  })
  return normalized
}

function resolveAccessTokenKey (roleType) {
  if (!roleType) return ''
  if (roleType === config.operator.role) {
    return config.provider.accessToken
  }
  const configEntry = config[roleType]
  return configEntry && configEntry.accessToken ? configEntry.accessToken : ''
}

function hasStoredToken (key) {
  if (!key) return false
  try {
    return !!localStorage.getItem(key)
  } catch (e) {
    return false
  }
}

function hasAuthTokenForRole (roleType) {
  const key = resolveAccessTokenKey(roleType)
  return hasStoredToken(key)
}

function hasAnyAuthToken () {
  return Array.isArray(config.roles) && config.roles.some((role) => hasAuthTokenForRole(role))
}

function hasAuthToken (roleType) {
  if (roleType) return hasAuthTokenForRole(roleType)
  return hasAnyAuthToken()
}

export function hasGlobalSettingsToken (roleType) {
  return hasAuthToken(roleType)
}

export async function loadGlobalSettings ({ roleType, provider_uuid } = {}) {
  try {
    const params = {}
    if (provider_uuid) params.provider_uuid = provider_uuid
    const res = await ajax({
      url: '/api-prefix/api/customer-settings/global-user-settings',
      method: 'get',
      params,
      roleType,
      skipErrorMessage: true
    })
    if (res && (res.code === 200 || res.code === 0 || res.code === undefined) && res.data) {
      return res.data || {}
    }
  } catch (e) {}
  return {}
}

export async function updateGlobalSettings ({ updates = {}, roleType, provider_uuid } = {}) {
  const normalizedUpdates = normalizeUpdatePayload(updates)
  if (!hasAuthToken(roleType)) {
    return { ...normalizedUpdates }
  }
  const data = { ...normalizedUpdates }
  if (provider_uuid) data.provider_uuid = provider_uuid
  try {
    const res = await ajax({
      url: '/api-prefix/api/customer-settings/global-user-settings',
      method: 'post',
      data,
      headers: { 'Content-Type': 'application/json' },
      roleType,
      skipErrorMessage: true
    })
    if (res && res.data) {
      return res.data
    }
  } catch (e) {}
  return { ...normalizedUpdates }
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
