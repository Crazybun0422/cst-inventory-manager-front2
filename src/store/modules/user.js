import { setLanguge, getLanguage } from '@/common/language'
import { loadGlobalSettings, hasGlobalSettingsToken } from '@/common/global-user-settings'
import { normalizeTheme, THEME_DEFAULT, applyDocumentTheme } from '@/common/theme'

function pickFirstString (...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

const state = {
  roles: null,
  shouldRefreshEmails: false,
  shouldRefreshDownloads: false,
  isLoginExpiredNotified: false,
  dsCurrentProviderUuid: null,
  providerIdMap: {},  // id和名称的映射
  shops: [],  // 当前账号的店铺列�?
  defaultLanguage: getLanguage(),
  theme: THEME_DEFAULT
}

const mutations = {
  CHANGE_SETTING: (state, { key, value, persist = true }) => {
    const shouldPersist = persist && key !== 'theme' && key !== 'defaultLanguage'
    if (shouldPersist) {
      try {
        localStorage.setItem(key, value)
      } catch (e) { }
    }
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      state[key] = value
    }
  },
  SET_THEME (state, theme) {
    const normalized = normalizeTheme(theme)
    state.theme = normalized
    applyDocumentTheme(normalized)
  },
  SET_DEFAULT_LANGUAGE (state, language) {
    state.defaultLanguage = language
    setLanguge(language)
  },
  SET_SHOPS (state, shops) {
    state.shops = shops
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  DEL_ROLES: (state) => {
    state.roles = null
  },
  SET_SHOULD_REFRESH_EMAILS (state, value) {
    state.shouldRefreshEmails = value;
  },
  resetLoginExpiredNotification (state) {
    state.isLoginExpiredNotified = false;
  },
  setLoginExpiredNotification (state) {
    state.isLoginExpiredNotified = true;
  },
  SET_SHOULD_REFRESH_DOWNLOADS (state, value) {
    state.shouldRefreshDownloads = value;
  },
  SET_DS_CURRENT_PROVIDER_UUID (state, value) {
    state.dsCurrentProviderUuid = value
  },
  SET_PROVIDER_ID_MAP (state, value) {
    state.providerIdMap = value
  }
}

const actions = {
  changeSetting ({ commit }, data) {
    if (data && data.key === 'theme') {
      commit('SET_THEME', data.value)
      return
    }
    commit('CHANGE_SETTING', data)
  },
  getDefaultLanguage ({ commit }, language) {
    commit('SET_DEFAULT_LANGUAGE', language)
  },
  async fetchPreferences ({ commit }, { roleType, provider_uuid } = {}) {
    let language = getLanguage()
    let theme = THEME_DEFAULT
    if (!hasGlobalSettingsToken(roleType)) {
      commit('SET_THEME', normalizeTheme(theme))
      commit('SET_DEFAULT_LANGUAGE', language)
      return { theme: normalizeTheme(theme), language }
    }
    try {
      const data = await loadGlobalSettings({ roleType, provider_uuid }) || {}
      language = pickFirstString(
        data.default_language,
        data.defaultLanguage,
        data.language,
        data.ui_language,
        language
      ) || language
      theme = normalizeTheme(
        pickFirstString(
          data.default_theme,
          data.defaultTheme,
          data.theme,
          data.ui_theme,
          data.theme_preference,
          theme
        ) || theme
      )
    } catch (e) {
      // ignore errors, fall back to defaults
    }
    commit('SET_THEME', theme)
    commit('SET_DEFAULT_LANGUAGE', language)
    return { theme, language }
  },
  getShops ({ state, dispatch }, { }) {
    // TODO: 缓存home中的shops数据
  },
  getInfo ({ commit, state }) {
    const userRole = localStorage.getItem('userRole')
    commit('SET_ROLES', userRole)
    return { userRole }
  },
  delRoles ({ commit }) {
    localStorage.removeItem('userRole')
    commit('DEL_ROLES')
  },
  triggerEmailRefresh ({ commit }) {
    commit('SET_SHOULD_REFRESH_EMAILS', true);
  },
  resetEmailRefreshTrigger ({ commit }) {
    commit('SET_SHOULD_REFRESH_EMAILS', false);
  },
  triggerDownloadRefresh ({ commit }) {
    commit('SET_SHOULD_REFRESH_DOWNLOADS', true);
  },
  resetDownloadRefreshTrigger ({ commit }) {
    commit('SET_SHOULD_REFRESH_DOWNLOADS', false);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
