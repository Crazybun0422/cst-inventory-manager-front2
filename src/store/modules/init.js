/**
 * @file 全局初始化相关的数据，包括中文标题、英文标题、favicon 等
 */

const state = {
    titleZhcn: '长沙持服科技有限公司',   // 初始的中文标题
    titleEnus: 'Continuserv Tech',  // 初始的英文标题
    favicon: '/favicon.ico',    // 默认的 favicon 路径
    mainFunction: null, //HomePage or Business ERP
    isHomePage: function () {
        return this.mainFunction === "Homepage"
    }
}

const mutations = {
    setTitleZhcn(state, title) {
        state.titleZhcn = title;
    },
    setTitleEnus(state, title) {
        state.titleEnus = title;
    },
    setFavicon(state, faviconPath) {
        state.favicon = faviconPath;
    },
    setMainFunction(state, mainFunction) {
        state.mainFunction = mainFunction;
    }
}

const actions = {
    /**
     * 初始化全局数据
     * @param {Object} context Vuex context
     * @param {Object} payload 包含 titleZhcn, titleEnus, favicon 的对象
     */
    async init({ commit }, { titleZhcn, titleEnus, favicon, mainFunction }) {
        // 这里可以根据需要调用接口或者执行其他异步逻辑
        // 简单地直接将传入的数据保存到 state 中
        if (titleZhcn) commit('setTitleZhcn', titleZhcn);
        if (titleEnus) commit('setTitleEnus', titleEnus);
        if (favicon) commit('setFavicon', favicon);
        if (mainFunction) commit('setMainFunction', mainFunction);
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
