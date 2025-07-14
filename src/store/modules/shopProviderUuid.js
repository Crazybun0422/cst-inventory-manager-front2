const state = {
  shop_provider_uuid: [],  // 这p切换店铺时的p_uuid
  shopInfo: {},
  storageList: []
}
const mutations = {
  SET_STORAGE_LIST: (state, storageList) => {
    state.storage = storageList
  },
  SET_SHOP_INFO: (state, shopInfo) => {
    state.shopInfo = shopInfo
  },
  SET_SHOP_UUID: (state, uuid) => {
    state.shop_provider_uuid = uuid
  }
}
const actions = {
  setShopInfo ({ commit }, shopInfo) {
    commit('SET_SHOP_INFO', shopInfo)
  },
  updateShopInfo ({ commit }, shopInfo) {
    commit('SET_SHOP_INFO', shopInfo)
  },
  setStorageList ({ commit }, storageList) {
    commit('SET_STORAGE_LIST', storageList)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
