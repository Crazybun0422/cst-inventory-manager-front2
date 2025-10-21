import axios from 'axios'
import { getRouter } from '@/router'
import i18n from "@/common/vuei18n"
import store from '../store';
import { getLanguage } from '@/common/language'
import { toLoginPage, getRoleType, getCookie, isNonEmptyObject } from '@/common/common-func'
import { dropShipper, provider, config } from '@/common/commonconfig'
import showMessage from '@/common/secondary-packaging-components.js'
const dropShipperConfig = config.dropShipper
const providerConfig = config.provider
const commonConfig = config
const instance = axios.create({
  // 当创建实例的时候配置默认配置
  responseType: 'json',
  xsrfCookieName: 'xsrf-token',
  timeout: 60 * 1000

})
// const loginUrl = `${process.env.VUE_APP_CAS}?service=${utils.casConfig.service}?redirect=${utils.casConfig.redirect}`

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    if (!(config.headers && config.headers.Authorization)) {
      const roleType = config.roleType ? config.roleType : dropShipper;
      let accessToken = localStorage.getItem(
        commonConfig[roleType]
          ? commonConfig[roleType].accessToken
          : dropShipperConfig.accessToken
      );
      if (store.state.init.isHomePage()) {
        accessToken = localStorage.getItem(
          "accessToken"
        )
        console.log("xxxxxxxxx", accessToken)
      }
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }

    }
    const roleType = config.roleType ? config.roleType : dropShipper;
    let csrfToken = localStorage.getItem(
      commonConfig[roleType]
        ? commonConfig[roleType].csrfToken
        : dropShipperConfig.csrfToken
    );
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    // 如果有自定义请求头则添加覆盖
    if (config.customHeaders) {
      for (let key in config.customHeaders) {
        config.headers[key] = config.customHeaders[key]
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 添加一个响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 兼容流程中没有code字段
    let langType = getLanguage()
    // 不需要展示错误的 code集合
    const notShowCode = [12004, 11006, 4004] // [6005, 7005]
    const skipErrorMessage = response.config && response.config.skipErrorMessage
    if (response.data.code && response.data.code != 200 && response.data.code % 1000) {
      if (!skipErrorMessage && isNonEmptyObject(response.data.msg) && !notShowCode.includes(response.data.code)) {
        showMessage(response.data.msg[langType])
      }
      // 如果没登录 返回登录页面 
      if (response.data.code === 2003) {
        // 设置标记 限制多个2003只显示一次notific
        if (store.state.init.isHomePage()) {
          getRouter().push("/");
          return;
        }
        const currentRoute = getRouter().currentRoute;
        if (!skipErrorMessage) {
          showMessage(i18n.t("common.loginExpired"))
        }
        if (currentRoute.path !== dropShipperConfig.loginPath || currentRoute.path !== providerConfig.loginPath) {
          // 当前不是登录页面，执行跳转操作

          const loginPath = toLoginPage(getRoleType(currentRoute.path))
          getRouter().push(loginPath);
        }
      }
      return Promise.resolve(response.data)
    }
    return Promise.resolve(response.data)
  },
  (error) => {
    const skipErrorMessage = error.config && error.config.skipErrorMessage
    const code = error.response
      ? error.response.status
      : error.code || error.message
    let message = ''
    switch (code) {
      case 996:
        message = '授权失败'
        // window.open(loginUrl, '_self')
        break
      case 401:
      case 403:
      case 500:
        message = error.message

        // getRouter().replace('/login')
        break
      case 'ECONNABORTED':
        message = '连接异常！'
        break
      case 'Network Error':
        message = '网络异常！'
        break
      default:
        // 4.系统错误，比如500、404等
        message = '系统异常，请稍后重试！'
        // getRouter().replace('/404')
        break
    }
    // Notification.error({
    //   title: 'error',
    //   message: message
    // })


    if (!skipErrorMessage) {
      showMessage(message)
    }
    return Promise.reject(error)
  }
)
function setNotification() {
  store.commit('user/setLoginExpiredNotification');
}

export default instance
