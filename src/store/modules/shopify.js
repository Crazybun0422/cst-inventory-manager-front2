/**
 * @file shopify店铺相关的全局数据
 */

const state = {
  shopifyShopUrl: '', // localStorage.getItem('shopifyShopUrl') || '',
  //区分校色
  shopListDS: [],
  shopListP: [],
  shopListLoading: false,
  currentShopUrl: '',
}

const mutations = {
  setShopifyShopUrl: (state, url) => {
    // localStorage.setItem('shopifyShopUrl', url)
    state.shopifyShopUrl = url
  },
  SET_SHOP_LIST_DS(state, shopList) {
    state.shopListDS = shopList;
  },
  SET_SHOP_LIST_P(state, shopList) {
    state.shopListP = shopList;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_CURRENT_SHOP_URL(state, url) {
    state.currentShopUrl = url;
  }
}

const actions = {
  async fetchShopListByRole({ commit }, { roleType }) {
    commit('SET_LOADING', true);
    try {
      const { data = [] } = await axios.get('/api/shop-manager/enum', {
        params: {
          roleType // 将组件中的 roleType 参数传递给请求
        }
      });
      commit('SET_SHOP_LIST', data);
    } catch (error) {
      console.error(error);
    } finally {
      commit('SET_LOADING', false);
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
