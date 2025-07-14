/**
 * @file 仓储管理相关
 */
// TODO: 增加仓储定义的Vuex   需要考虑 新增仓储和仓储定义后的数据重置
import { generateUniqueMD5, getStorage, getStorageDefinition, isRequestSuccessful } from '@/common/common-func'
const state = {
  storageListByUser: [],    // 获取的是用户对应的已关联的仓储列表
  storageDefinitionListByProvider: [], // 获取的是p的门店列表
}

const mutations = {
  SET_STORAGE_LIST (state, { userProviderMd5, storageList }) {
    state.storageListByUser = {
      ...state.storageListByUser,
      [userProviderMd5]: Array.isArray(storageList) ? storageList : [],
    };
  },
  SET_STORAGE_DEFINITION_LIST (state, { userProviderMd5, storageDefinitionList }) {
    state.storageDefinitionListByProvider = {
      ...state.storageDefinitionListByProvider,
      [userProviderMd5]: Array.isArray(storageDefinitionList) ? storageDefinitionList : [],
    };
  },

}

const actions = {
  async fetchStorageListIfNeeded ({ state, dispatch }, { username, provider_uuid }) {
    const userProviderMd5 = generateUniqueMD5(username, provider_uuid);
    // 如果当前用户的数据已存在，则直接返回
    if (state.storageListByUser[userProviderMd5] && state.storageListByUser[userProviderMd5].length > 0) {
      return state.storageListByUser[userProviderMd5];
    }
    // 如果数据不存在，调用 fetchStorageList 进行请求
    const storageList = await dispatch('fetchStorageList', { username, provider_uuid });
    return storageList;
  },
  async fetchStorageDefinitionListIfNeeded ({ state, dispatch }, { username, provider_uuid }) {
    // 查询p的门店列表
    // 如果当前用户的数据已存在，则直接返回
    const userProviderMd5 = generateUniqueMD5(username, provider_uuid);
    if (state.storageDefinitionListByProvider[userProviderMd5] && state.storageDefinitionListByProvider[userProviderMd5].length > 0) {
      return state.storageDefinitionListByProvider[userProviderMd5];
    }
    // 如果数据不存在，调用 fetchStorageDefinitionList 进行请求
    const storageDefinitionList = await dispatch('fetchStorageDefinitionList', { username, provider_uuid });
    return storageDefinitionList;
  },

  async fetchStorageList ({ commit }, { username, provider_uuid }) {
    // 该函数可以用于重置仓储列表
    try {
      const userProviderMd5 = generateUniqueMD5(username, provider_uuid);
      const res = await getStorage(provider_uuid);
      const storageList = isRequestSuccessful(res.code) ? res.data : [];
      commit('SET_STORAGE_LIST', { userProviderMd5, storageList });
      return storageList;
    } catch (error) {
      throw error;
    }
  },
  async fetchStorageDefinitionList ({ commit }, { username, provider_uuid }) {
    try {
      const userProviderMd5 = generateUniqueMD5(username, provider_uuid);
      const res = await getStorageDefinition(provider_uuid);
      const storageDefinitionList = isRequestSuccessful(res.code) ? res.data : [];
      commit('SET_STORAGE_DEFINITION_LIST', { userProviderMd5, storageDefinitionList });
      return storageDefinitionList;
    } catch (error) {
      throw error;
    }
  },
};


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
