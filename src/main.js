import Vue from 'vue'
import ElementUI from 'element-ui'

import App from './App.vue'
import VueRouter from 'vue-router'



import { getRouter, resetRouter } from './router'
import './assets/icons/iconfont.js'
import './assets/icons/iconfont.css'
import axios from "axios"
import VueI18n from 'vue-i18n'
import ajax from '@/api/ajax'
import { Notification } from 'element-ui'
import { getLanguage } from '@/common/language'
import { baseUrl } from '@/common/commonconfig'
import { getRoleType, isRequestSuccessful } from '@/common/common-func'
import { getColumnWidth } from './utils/el_table'
import { configMixin } from './common/config-mixin'
import getFileIndependently from '@/common/download-file-mixin'
import zh_cn from '@/assets/i18/zh'
import en_us from '@/assets/i18/en'

import store from './store'
import 'default-passive-events'
import JsonViewer from 'vue-json-viewer'
import './styles/element-variables.scss'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './assets/css/global.scss'
import { initPermission } from './permission'
import sourcingWS from '@/common/ws-notify'
import { getRoleTypeForP } from '@/common/common-func'
import { config, dropShipper } from '@/common/commonconfig'
import bus, { EVENTS } from '@/common/event-bus'

function changeFavicon(newIconURL) {
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = newIconURL;
}


async function fetchInitConfig() {
  return fetch('/api/config/init-config')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(result => {
      if (result && result.data) {
        console.log('Init config:', result.data);
        return result.data;
      }
      throw new Error('Invalid config data format');
    })
    .catch(error => {
      console.error('Failed to fetch init config:', error);
      throw error;
    });
}






async function init() {
  // 这里可以使用 await
  const data = await fetchInitConfig();
  if (data) {
    store.dispatch("init/init", {
      titleZhcn: data.homepage_title,
      titleEnus: data.homepage_title_en,
      favicon: data.homepage_icon,
      mainFunction: data.main_function,
    });
    if (data.main_function === "Homepage") {
      resetRouter(true);
    }

  }
  initPermission()
  // Init WS notifications after permissions are set
  try {
    let role = getRoleType(window.location.pathname) || dropShipper
    if (role === config.provider.role) role = getRoleTypeForP()
    // DS 端已有头部的 WebSocket，实现统一的 bus 转发；此处仅在 P 端启动全局 WS
    if (role !== dropShipper) sourcingWS.start()
  } catch (e) { /* ignore */ }

  // 继续创建 Vue 实例
  new Vue({
    render: h => h(App),
    router: getRouter(),
    store,
    i18n,
    created() {
      this.setTheme();
      const userLanguage = this.$store.state.user.defaultLanguage || data.locale || this.$i18n.locale;
      this.$i18n.locale = userLanguage;
      changeFavicon(data.homepage_icon);
      document.title = this.$i18n.locale === "en_us" ? data.homepage_title_en : data.homepage_title;
      // P 端：监听并在右下角弹出通知；DS 端走 Header 内置逻辑
      try {
        let role = getRoleType(window.location.pathname) || dropShipper
        if (role === config.provider.role) role = getRoleTypeForP()
        if (role !== dropShipper) {
          this._pBusNotify = (msgData) => {
            if (!msgData) return
            // 仅处理选品通知
            if (msgData.type === EVENTS.SOURCING_NOTIFICATION || msgData.event === EVENTS.SOURCING_NOTIFICATION || (msgData.sourcing_id && msgData.status)) {
              const zh = { submitted: '已提交', sourcing: '选品中', pending_confirmation: '待确认', completed: '已完成' }
              const en = { submitted: 'Submitted', sourcing: 'Sourcing', pending_confirmation: 'Pending confirmation', completed: 'Completed' }
              const dict = this.$i18n.locale === 'zh_cn' ? zh : en
              const label = dict[msgData.status] || msgData.status
              const title = this.$t('navigate.sourcing')
              const content = `${this.$t('sourcing.sourcingId') || 'ID'}: ${msgData.sourcing_id || ''} · ${label}`
              this.$notify({
                title,
                message: this.$createElement('i', {
                  style: 'color: teal; cursor: pointer;',
                  on: { click: () => { this.$router.push({ name: 'p-sourcing' }); window.focus() } }
                }, content),
                duration: 0,
                offset: 100,
                type: 'success'
              })
            }
          }
          bus.$on(EVENTS.SOURCING_NOTIFICATION, this._pBusNotify)
        }
      } catch (e) { /* ignore */ }
    },
    beforeDestroy() { if (this._pBusNotify) bus.$off(EVENTS.SOURCING_NOTIFICATION, this._pBusNotify) },
    methods: {
      setTheme() {
        const currentTheme = localStorage.getItem('theme') || 'defaultTheme';
        document.documentElement.classList.remove(
          currentTheme === 'defaultTheme' ? 'darkTheme' : 'defaultTheme'
        );
        document.documentElement.classList.add(currentTheme);
      }
    }
  }).$mount('#app');
}

Vue.use(Antd);
// 配置中英文全局变量
Vue.prototype.$languageType = getLanguage()
Vue.prototype.$getColumnWidth = getColumnWidth;
Vue.use(JsonViewer)
// 配置中英文
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: getLanguage(),
  messages: {
    en_us: en_us,
    zh_cn: zh_cn
  }
})

Vue.use(ElementUI, { size: 'small' })
Vue.use(VueRouter)
Vue.mixin(configMixin)   // 在全局混入配置后 所有组件都可以直接访问this.config来获取配置参数
Vue.mixin(getFileIndependently)  // 在全局混入下载文件方法
Vue.config.productionTip = false
axios.defaults.baseURL = baseUrl
// TODO: :axios看是否可以去掉 没用到
Vue.prototype.$axios = axios
Vue.prototype.$ajax = ajax
Vue.prototype.$notify = Notification
Vue.prototype.$isRequestSuccessful = isRequestSuccessful
Vue.prototype.$getRoleType = getRoleType

init()




