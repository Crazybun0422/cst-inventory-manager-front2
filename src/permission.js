import { getRouter, resetRouter } from '@/router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import { toLoginPage, getRoleType, getRoleTypeForP } from '@/common/common-func'
import { dropShipper, provider, config, operator } from '@/common/commonconfig'
// import '@/components/nprogress/nprogress.scss' // progress bar custom style
let roleExist = {
  dropShipper: false,
  provider: false,
  operator: false
}
const providerConfig = config.provider
const dropShipperConfig = config.dropShipper
export function initPermission() {
  NProgress.configure({ showSpinner: false }) // NProgress Configuration
  getRouter().beforeEach(async (to, from, next) => {
    if (!store.state.init.mainFunction) {
      const unwatch = store.watch(
        (state) => state.init.mainFunction,
        (newVal) => {
          if (newVal) {
            unwatch();
            // 数据加载完毕后，重新导航到当前目标（replace 避免重复历史记录）
            next({ ...to, replace: true });
          }
        }
      );
      return;
    }
    // 这里增加操作员的判断 如果是p  需要再判断 pUserRole是 provider还是 operator
    let roleType = getRoleType(from.path) ? getRoleType(from.path) : getRoleType(to.path)
    if (roleType === provider) {
      roleType = getRoleTypeForP()
    }
    if (to.path === config.dropShipper.loginPath || to.path === config.provider.loginPath) {
      next()
      return
    }



    NProgress.start()
    scrollTop()

    // 如果是跳转注册无需其他判断直接跳转
    let notLogin = [dropShipperConfig.loginPath,
    providerConfig.loginPath,
    config.signUpPath,
    dropShipperConfig.forgotPasswordPath,
    providerConfig.forgotPasswordPath,
    dropShipperConfig.erpLoginPath,
    dropShipperConfig.thirdPartKeyInformation,
    dropShipperConfig.thirdPartSuccessRedirect,
    config.toolsConfig,
    config.privatePolicy,
    config.estyTermsOfService,
    config.estyPrivacyPolicy,
    config.mainPage,
    config.checkout
    ]

    if (store.state.init.isHomePage()) {
      console.log(`Home Page Dealing...${to.path}`)

      next()

    }
    else {
      const accessToken = config[roleType] ? localStorage.getItem(config[roleType].accessToken) : localStorage.getItem(dropShipperConfig.accessToken) // accessToken存储在localStorage中获取token 默认返回ds

      console.log(`${store.state.init.mainFunction} Dealing...`)
      if (notLogin.includes(to.path)) { next() }
      else if (!accessToken && to.path !== config.signUpPath) {
        next(config[roleType] ? config[roleType].loginPath : dropShipperConfig.loginPath) // 跳转到登录页面
        //next() // 继续路由导航
      }
      else {
        const hasRoles = roleType //store.getters.roles
        if (roleExist[roleType]) {
          next()
        }
        else {
          try {
            // const { userRole } = await store.dispatch('user/getInfo')
            roleExist[roleType] = true
            const accessRoutes = await store.dispatch(
              'permission/generateRoutes',
              hasRoles
            )
            getRouter().addRoutes(accessRoutes)
            next({ ...to, replace: true }) // 继续路由导航
          } catch (error) {
            console.error(error)
            toLoginPage(hasRoles)
            NProgress.done()
          }
        }
      }
    }
  })
  getRouter().afterEach(() => {
    NProgress.done()
  })

}

function scrollTop() {
  // chrome
  document.body.scrollTop = 0
  // firefox
  document.documentElement.scrollTop = 0
  // safari
  window.pageYOffset = 0
}
