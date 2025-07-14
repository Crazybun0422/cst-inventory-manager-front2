import Vue from 'vue'
import VueRouter from 'vue-router'
import { config } from '@/common/commonconfig'
import { navigationDataProvider, navigationDataDs } from '@/components/base-layout/navigate.js'
const dropShipperConfig = config.dropShipper
const providerConfig = config.provider

Vue.use(VueRouter)


export const mainPageRoutes = [
  {
    path: config.mainPage,
    component: () => import('@/pages/main-page/mainPage.vue'),
  },
  {
    path: config.checkout, // Dynamic route parameter `planId`
    name: 'checkout',
    component: () => import('@/pages/main-page/checkoutPage.vue'),
    props: true // Enables passing route params as props to the component
  },
  {
    path: config.estyIntroduction,
    name: 'config-info',
    component: () => import('@/pages/main-page/estyIntroduction.vue')
  },
  {
    path: config.estyTermsOfService,
    name: 'esty-collector-tos',
    component: () => import('@/pages/components/esty/TermsofService.vue')
  },
  {
    path: config.estyPrivacyPolicy,
    name: 'esty-collector-pp',
    component: () => import('@/pages/components/esty/PrivatePolicy.vue')
  },
  {
    path: config.dropShipper.thirdPartSuccessRedirect,
    name: 'thirdpart-success-redirect',
    component: () => import('@/pages/login/components/thirdpart-success-redirect.vue'),
  },
  {
    path: config.toolsConfig,
    name: 'config-info',
    component: () => import('@/pages/components/tool/config-tool.vue')
  },

  {
    path: '*',
    component: () => import('@/pages/error-page/404')
  }


]
export const constantRoutes = [
  {
    path: config.mainPage,
    component: () => import('@/pages/start-page'),
    redirect: (to) => {
      const queryParams = to.query;
      if (queryParams.hmac && queryParams.shop) {
        return `${dropShipperConfig.erpLoginPath}`;  // 使用配置中的路径
      }
      return `${dropShipperConfig.loginPath}`;
    }
  },
  {
    path: config.dropShipper.thirdPartSuccessRedirect,
    name: 'thirdpart-success-redirect',
    component: () => import('@/pages/login/components/thirdpart-success-redirect.vue'),
  },
  // 工具页面
  {
    path: config.toolsConfig,
    name: 'config-info',
    component: () => import('@/pages/components/tool/config-tool.vue')
  },
  {
    path: config.privatePolicy,
    name: 'private-policy',
    component: () => import('@/pages/components/private-policy.vue')
  },

  // erp-login 页面路由，使用 dropShipperConfig.erpLoginPath
  {
    path: `${dropShipperConfig.erpLoginPath}`,
    name: 'ds-erp-login',
    component: () => import('@/pages/erp-login')
  },
  {
    path: `${dropShipperConfig.thirdPartKeyInformation}`,
    name: 'ds-third-part-key-information',
    component: () => import('@/pages/third-part-key-information'),
    roles: ['Drop shipper']
  },
  {
    path: `${dropShipperConfig.loginPath}`,
    name: 'ds-login',
    component: () => import('@/pages/login-page')
  },
  {
    path: `${providerConfig.loginPath}`,
    name: 'p-login',
    component: () => import('@/pages/login-page')
  },
  {
    path: `${config.signUpPath}`,
    name: 'signup',
    component: () => import('@/pages/signup-page')
  },
  {
    path: `${providerConfig.forgotPasswordPath}`,
    name: 'p-turn-the-table',
    component: () => import('@/pages/forget-password')
  },
  {
    path: `${dropShipperConfig.forgotPasswordPath}`,
    name: 'ds-turn-the-table',
    component: () => import('@/pages/forget-password')
  },
  {
    path: '/404',
    component: () => import('@/pages/error-page/404')
  }
]

const providerRoutes = []
const dropShipperRoutes = []
function generateRoutes(navigateArr, routerArr) {
  if (navigateArr && navigateArr.length > 0) {
    navigateArr.forEach((item) => {
      if (!item.notRouter) {
        routerArr.push({
          path: item.path,
          name: item.name,
          component: () => import('@/pages/' + item.component),
          meta: {
            title: item.title,
            roles: item.role
          }
        })
      }
      if (item.children && item.children.length > 0) {
        generateRoutes(item.children, routerArr)
      }
    })
  }
}
generateRoutes(navigationDataProvider, providerRoutes)
generateRoutes(navigationDataDs, dropShipperRoutes)

export const asyncRoutes = [
  {
    path: `${dropShipperConfig.pathPrefix}`,
    name: 'ds-app-center',
    redirect: `${dropShipperConfig.pathPrefix}/home`,
    component: () => import('@/components/base-layout/index.vue'),
    roles: ['Provider', 'Drop shipper'],
    children: [
      {
        path: 'home',
        name: 'ds-home',
        component: () => import('@/pages/home/home-page.vue'),
        meta: {
          title: 'navigate.home',
          roles: ['Drop shipper']
        }
      },
      // {
      //   path: '/tools/config',
      //   name: 'config-info',
      //   component: () => import('@/pages/components/tool/config-tool.vue')
      // },
      {
        path: 'key-information',
        name: 'ds-key-information',
        component: () => import('@/pages/key-information-page'),
        roles: ['Drop shipper']
      },
      // {
      //   path: `${dropShipperConfig.thirdPartKeyInformation}`,
      //   name: 'ds-third-part-key-information',
      //   component: () => import('@/pages/third-part-key-information'),
      //   roles: ['Drop shipper']
      // },
      ...dropShipperRoutes,
    ]
  },
  {
    path: `${providerConfig.pathPrefix}`,
    name: 'p-app-center',
    redirect: `${providerConfig.pathPrefix}/home`,
    component: () => import('@/components/base-layout/index.vue'),
    roles: ['Provider', 'Operator'],
    children: [
      {
        path: 'home',
        name: 'p-home',
        component: () => import('@/pages/home/home-page.vue'),
        meta: {
          title: 'navigate.home',
          roles: ['Provider', 'Operator']
        }
      },
      {
        path: 'key-information',
        name: 'p-key-information',
        component: () => import('@/pages/key-information-page'),
        roles: ['Provider', 'Operator']
      },
      ...providerRoutes,
    ]
  },


  { path: '*', redirect: '/404' }
]

const createRouter = (isMainPage) =>
  new VueRouter({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
      // 如果 URL 中有 hash，则滚动到对应的元素
      if (to.hash) {
        return {
          selector: to.hash,
          behavior: 'smooth'
        };
      }
      // 如果有保存的位置（浏览器前进后退），则返回保存位置
      if (savedPosition) {
        return savedPosition;
      }
      // 默认滚动到顶部
      return { x: 0, y: 0 };
    },
    routes: isMainPage ? mainPageRoutes : [...constantRoutes, ...asyncRoutes]
  })
let router = createRouter(false)

export function resetRouter(isMainPage = false) {
  router = createRouter(isMainPage)
}

export function getRouter() {
  return router
}

