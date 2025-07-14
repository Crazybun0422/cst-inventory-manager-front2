import { config } from '@/common/commonconfig.js'
const state = {
  visitedViews: [],
  cachedViews: [],
  dsVisitedViews: [],
  dsCachedViews: [],
  pVisitedViews: [],
  pCachedViews: []
}

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some((v) => v.name === view.name)) return
    state.visitedViews.push(Object.assign({}, view))
  },
  ADD_P_DS_VISITED_VIEW: (state, view) => {
    if (config.roles.includes(view.roleType)) {
      if (state.pVisitedViews.some((v) => v.name === view.name)) return
      state.pVisitedViews.push(Object.assign({}, view))

    }
    if (view.roleType === config.dropShipper.role) {
      if (state.dsVisitedViews.some((v) => v.name === view.name)) return
      state.dsVisitedViews.push(Object.assign({}, view))
    }

  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return
    // if (!view.meta.noCache) {
    state.cachedViews.push(view.name)
    // }
  },
  ADD_P_DS_CACHED_VIEW: (state, view) => {
    if (config.pRoleList.includes(view.roleType)) {
      if (state.pCachedViews.includes(view.name)) return
      // if (!view.meta.noCache) {
      state.pCachedViews.push(view.name)
      // }
    }
    if (view.roleType === config.dropShipper.role) {
      if (state.dsCachedViews.includes(view.name)) return
      // if (!view.meta.noCache) {
      state.dsCachedViews.push(view.name)
      // }
    }
  },

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_P_DS_VISITED_VIEW: (state, view) => {
    if (config.pRoleList.includes(view.roleType)) {
      for (const [i, v] of state.pVisitedViews.entries()) {
        if (v.path === view.path) {
          state.pVisitedViews.splice(i, 1)
          break
        }
      }
    }
    if (view.roleType === config.dropShipper.role) {
      for (const [i, v] of state.dsVisitedViews.entries()) {
        if (v.path === view.path) {
          state.dsVisitedViews.splice(i, 1)
          break
        }
      }
    }
  },

  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
  },
  DEL_P_DS_CACHED_VIEW: (state, view) => {
    if (config.pRoleList.includes(view.roleType)) {
      const index = state.pCachedViews.indexOf(view.name)
      index > -1 && state.pCachedViews.splice(index, 1)
    }
    if (view.roleType === config.dropShipper.role) {
      const index = state.dsCachedViews.indexOf(view.name)
      index > -1 && state.dsCachedViews.splice(index, 1)
    }
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter((v) => {
      return v.meta.affix || v.path === view.path
    })
  },
  DEL_OTHERS_P_DS_VISITED_VIEWS: (state, view) => {
    if (config.pRoleList.includes(view.roleType)) {
      state.pVisitedViews = state.pVisitedViews.filter((v) => {
        return v.meta.affix || v.path === view.path
      })
    }
    if (view.roleType === config.dropShipper.role) {
      state.dsVisitedViews = state.dsVisitedViews.filter((v) => {
        return v.meta.affix || v.path === view.path
      })
    }
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = []
    }
  },
  DEL_OTHERS_P_DS_CACHED_VIEWS: (state, view) => {
    if (config.pRoleList.includes(view.roleType)) {
      const index = state.pCachedViews.indexOf(view.name)
      if (index > -1) {
        state.pCachedViews = state.pCachedViews.slice(index, index + 1)
      } else {
        // if index = -1, there is no cached tags
        state.pCachedViews = []
      }
    }
    if (view.roleType === config.dropShipper.role) {
      const index = state.dsCachedViews.indexOf(view.name)
      if (index > -1) {
        state.dsCachedViews = state.dsCachedViews.slice(index, index + 1)
      } else {
        // if index = -1, there is no cached tags
        state.dsCachedViews = []
      }
    }
  },

  // DEL_ALL_VISITED_VIEWS: (state) => {
  //   // keep affix tags
  //   const affixTags = state.visitedViews.filter((tag) => tag.meta.affix)
  //   state.visitedViews = affixTags
  // },
  DEL_ALL_VISITED_VIEWS: (state) => {
    state.visitedViews = []
  },
  DEL_ALL_P_DS_VISITED_VIEWS: (state) => {
    state.pVisitedViews = []
    state.dsVisitedViews = []
  },
  DEL_ALL_CACHED_VIEWS: (state) => {
    state.cachedViews = []
  },
  DEL_ALL_P_DS_CACHED_VIEWS: (state) => {
    state.pCachedViews = []
    state.dsCachedViews = []
  },
  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  },
  UPDATE_P_DS_VISITED_VIEW: (state, view) => {
    if (config.pRoleList.includes(view.roleType)) {
      for (let v of state.pVisitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    }
    if (view.roleType === config.dropShipper.role) {
      for (let v of state.dsVisitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    }
  }
}

const actions = {
  addView ({ dispatch }, view) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addPDSView ({ dispatch }, view) {
    dispatch('addPDSVisitedView', view)
    dispatch('addPDSCachedView', view)
  },
  addVisitedView ({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  addPDSVisitedView ({ commit }, view) {
    commit('ADD_P_DS_VISITED_VIEW', view)
  },
  addCachedView ({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },
  addPDSCachedView ({ commit }, view) {
    commit('ADD_P_DS_CACHED_VIEW', view)
  },

  delView ({ dispatch, state }, view) {
    return new Promise((resolve) => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },

  delPDSView ({ dispatch, state }, view) {
    return new Promise((resolve) => {
      dispatch('delPDSVisitedView', view)
      dispatch('delPDSCachedView', view)
      if (config.pRoleList.includes(view.roleType)) {
        resolve({
          pVisitedViews: [...state.pVisitedViews],
          pCachedViews: [...state.pCachedViews]
        })
      }
      if (view.roleType === config.dropShipper.role) {
        resolve({
          dsVisitedViews: [...state.dsVisitedViews],
          dsCachedViews: [...state.dsCachedViews]
        })
      }
    })
  },
  delVisitedView ({ commit, state }, view) {
    return new Promise((resolve) => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delPDSVisitedView ({ commit, state }, view) {
    return new Promise((resolve) => {
      commit('DEL_P_DS_VISITED_VIEW', view)
      if (config.pRoleList.includes(view.roleType)) {
        resolve([...state.pVisitedViews])
      }
      if (view.roleType === config.dropShipper.role) {
        resolve([...state.dsVisitedViews])
      }
    })
  },
  delCachedView ({ commit, state }, view) {
    return new Promise((resolve) => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },
  delPDSCachedView ({ commit, state }, view) {
    return new Promise((resolve) => {
      commit('DEL_P_DS_CACHED_VIEW', view)
      if (config.pRoleList.includes(view.roleType)) {
        resolve([...state.pCachedViews])
      }
      if (view.roleType === config.dropShipper.role) {
        resolve([...state.dsCachedViews])
      }
    })
  },

  delOthersViews ({ dispatch, state }, view) {
    return new Promise((resolve) => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delOthersVisitedViews ({ commit, state }, view) {
    return new Promise((resolve) => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersPDSVisitedViews ({ commit, state }, view) {
    return new Promise((resolve) => {
      commit('DEL_OTHERS_P_DS_VISITED_VIEWS', view)
      if (config.pRoleList.includes(view.roleType)) {
        resolve([...state.pVisitedViews])
      }
      if (view.roleType === config.dropShipper.role) {
        resolve([...state.dsVisitedViews])
      }
    })
  },
  delOthersCachedViews ({ commit, state }, view) {
    return new Promise((resolve) => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },
  delOthersPDSCachedViews ({ commit, state }, view) {
    return new Promise((resolve) => {
      commit('DEL_OTHERS_P_DS_CACHED_VIEWS', view)
      if (config.pRoleList.includes(view.roleType)) {
        resolve([...state.pCachedViews])
      }
      if (view.roleType === config.dropShipper.role) {
        resolve([...state.dsCachedViews])
      }
    })
  },

  delAllViews ({ dispatch, state }, view) {
    return new Promise((resolve) => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delAllPDSViews ({ dispatch, state }) {
    return new Promise((resolve) => {
      dispatch('delAllPDSVisitedViews')
      dispatch('delAllPDSCachedViews')

      resolve({
        pVisitedViews: [...state.pVisitedViews],
        pCachedViews: [...state.pCachedViews],
        dsVisitedViews: [...state.dsVisitedViews],
        dsCachedViews: [...state.dsCachedViews]
      })


    })
  },
  delAllVisitedViews ({ commit, state }) {
    return new Promise((resolve) => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  delAllPDSVisitedViews ({ commit, state }) {
    return new Promise((resolve) => {
      commit('DEL_ALL_P_DS_VISITED_VIEWS')
      resolve([...state.pVisitedViews, ...state.dsVisitedViews])
    })
  },
  delAllCachedViews ({ commit, state }) {
    return new Promise((resolve) => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },
  delAllPDSCachedViews ({ commit, state }) {
    return new Promise((resolve) => {
      commit('DEL_ALL_P_DS_CACHED_VIEWS')
      resolve([...state.pCachedViews, ...state.dsCachedViews])
    })
  },

  updateVisitedView ({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  },
  updatePDSVisitedView ({ commit }, view) {
    commit('UPDATE_P_DS_VISITED_VIEW', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
