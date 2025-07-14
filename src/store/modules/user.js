// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import router, { resetRouter } from '@/router'
// import variables from '@/styles/element-variables.scss'
import { setLanguge, getLanguage } from '@/common/language'
const state = {
  roles: null,
  shouldRefreshEmails: false,
  shouldRefreshDownloads: false,
  isLoginExpiredNotified: false,
  dsCurrentProviderUuid: null,
  providerIdMap: {},  // id和名称的映射
  shops: [],  // 当前账号的店铺列表
  defaultLanguage: getLanguage(),
  // theme: variables.theme
  theme: localStorage.getItem('theme') || ''
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    localStorage.setItem(key, value) // 缓存起来，刷新的时候重新取用
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
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
    commit('CHANGE_SETTING', data)
  },
  getDefaultLanguage ({ commit }, language) {
    // const language = getLanguage()
    commit('SET_DEFAULT_LANGUAGE', language)
  },
  getShops ({ state, dispatch }, { }) {
    // TODO: 缓存home中的shops数据
  },
  // get user info
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
