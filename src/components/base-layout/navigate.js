// 提示：
//  下面的导航路由是给左侧导航栏使用的，所有路由使用的全路径
//  而且这个路径会动态生成路由 所有path需要/开头 以保证视为根路径 例： /app-center/***/***/* path需唯一
// notRouter: true, // 是否需要生成路由的标记
// 本文件由于他不能响应式切换语言 需要同步一份到 navigate.vue了

// import VueI18n from '@/common/vuei18n.js'

import { config } from "@/common/commonconfig"
function isShopifyExpandable() {
  const strShopList = localStorage.getItem(config.dropShipper.shopList)
  const storedShops = JSON.parse(
    strShopList
  )
  if (Array.isArray(storedShops) && storedShops.length > 0)
    return true

  return false
}
export const navigationDataProvider = [
  {
    title: 'navigate.sourcing',
    name: 'p-sourcing',
    path: '/p/sourcing',
    icon: 'el-icon-search',
    component: 'sourcing/p-sourcing.vue',
    role: ['Provider', 'Operator']
  },
  {
    title: 'navigate.myInventory',
    name: 'myinventory',
    path: '',
    icon: 'el-icon-box',
    role: ['Provider', 'Operator'],
    notRouter: true,
    children: [

      {
        title: 'navigate.warehousingServices',
        name: 'p-warehouse-servers',
        path: '/p-warehouse-servers',
        role: ['Provider', 'Operator'],
        icon: 'el-icon-s-home',
        notRouter: true,
        children: [
          {
            title: 'navigate.warehousingDefinition',
            name: 'p-warehousing-definition',
            component: 'warehousing-servers/warehousing-definition.vue',
            path: '/p/warehousing-definition',
            role: ['Provider', 'Operator'],
          },
          {
            title: 'navigate.warehouseReceipt',
            name: 'p-addWarehouse',
            path: '/p/addWarehouse',
            component: 'warehousing-servers/p-add-warehouse.vue',
            role: ['Provider', 'Operator'],
          },
          {
            title: 'navigate.storageOutWarehouse',
            name: 'p-outbound',
            path: '/p/outbound',
            component: 'warehousing-servers/p-outbound.vue',
            role: ['Provider', 'Operator'],
            children: [
              {
                title: 'navigate.onePieceForShipping',
                name: 'p-one-piece-for-shipping',
                path: '/p/p-one-piece-for-shipping',
                component: 'warehousing-servers/storage-out-warehouse/p-one-piece-for-shipping.vue',
                role: ['Provider', 'Operator'],
              },
              {
                title: 'navigate.shippingNotice',
                name: 'p-shipping-notice',
                path: '/p/p-shipping-notice',
                component: 'warehousing-servers/storage-out-warehouse/p-shipping-notice.vue',
                role: ['Provider', 'Operator'],
              },
              {
                title: 'navigate.listOfShippingOrders',
                name: 'p-list-of-shipping-orders',
                path: '/p/p-list-of-shipping-orders',
                component: 'warehousing-servers/storage-out-warehouse/p-list-of-shipping-orders.vue',
                role: ['Provider', 'Operator'],
              },
              {
                title: 'navigate.waveOrder',
                name: 'p-wave-order',
                path: '/p/p-wave-order',
                component: 'warehousing-servers/storage-out-warehouse/p-wave-order.vue',
                role: ['Provider', 'Operator'],
              },

              {
                title: 'navigate.toReview',
                name: 'p-to-review',
                path: '/p/p-to-review',
                component: 'warehousing-servers/storage-out-warehouse/p-to-review.vue',
                role: ['Provider', 'Operator'],
              },

              {
                title: 'navigate.batchWeighing',
                name: 'p-batch-weighing',
                path: '/p/p-batch-weighing',
                component: 'warehousing-servers/storage-out-warehouse/p-batch-weighing.vue',
                role: ['Provider', 'Operator'],
              },
              {
                title: 'navigate.bagging',
                name: 'p-bagging',
                path: '/p/p-bagging',
                component: 'warehousing-servers/storage-out-warehouse/p-bagging.vue',
                role: ['Provider', 'Operator'],
              },
            ]
          },
          {
            title: 'navigate.inventory',
            name: 'p-inventory',
            path: '/p-inventory',
            role: ['Provider', 'Operator'],
            notRouter: true,
            children: [
              {
                title: 'navigate.inventoryStatistics',
                name: 'p-stock-statistics',
                path: '/p/stock-statistics',
                component: 'stock-manage/p-stock-statistics.vue',
                role: ['Provider', 'Operator']
              }
            ]
          },
        ]
      },

      {
        title: 'navigate.productManagement',
        name: 'p-product',
        path: '/p-product',
        icon: 'el-icon-s-goods',
        role: ['Provider', 'Operator'],
        notRouter: true,
        children: [

          {
            title: 'navigate.product',
            name: 'p-sub-product',
            path: '/p/product',
            component: 'product-manage/p-product.vue',
            role: ['Provider', 'Operator'],
          }]
      },
      {
        title: 'navigate.orderManagement',
        name: 'p-order',
        path: '/p-order',
        icon: 'el-icon-s-order',
        role: ['Provider', 'Operator'],
        notRouter: true,
        children: [

          {
            title: 'navigate.order',
            name: 'p-sub-order',
            path: '/p/order',
            component: 'order-manage/p-order.vue',
            role: ['Provider', 'Operator'],
          }]
      },
    ]
  },

  {
    title: 'navigate.storeManagement',
    name: 'p-store-management',
    path: '/p-store-management',
    icon: 'el-icon-s-shop',
    role: ['Provider', 'Operator'],
    notRouter: true,
    children: [
      {
        title: 'navigate.shopify',
        name: 'p-store-management',
        path: '/p/p-store-management',
        icon: 'iconfont icon-cst-inventory-shopify1',
        component: 'store-management/shopify-platform.vue',
        role: ['Provider', 'Operator'],
        children: [
          {
            title: 'navigate.orderInfo',
            name: 'p-order-info',
            path: '/p/p-order-info',
            component: 'store-management/p-order-info/index.vue',
            role: ['Provider', 'Operator'],
          },
          {
            title: 'navigate.productInfo',
            name: 'p-product-info',
            path: '/p/p-product-info',
            component: 'store-management/p-product-info/index.vue',
            role: ['Provider', 'Operator'],
          },
          {
            title: 'navigate.storeSettings',
            name: 'p-user-info',
            path: '/p/p-user-info',
            component: 'store-management/p-user-info/index.vue',
            role: ['Provider', 'Operator'],
          },
        ]
      },
    ]
  },
  {
    title: 'navigate.customerManagement',
    name: 'p-customer-management',
    path: '/p-customer-management',
    icon: 'el-icon-s-custom',
    role: ['Provider', 'Operator'],
    notRouter: true,
    children: [
      {
        title: 'message.customerManagement.customer',
        name: 'p-customer',
        path: '/p/customer',
        component: 'customer-management/index.vue',
        role: ['Provider', 'Operator'],
      },
      {
        title: 'navigate.mail',
        name: 'p-mail',
        path: '/p/mail',
        component: 'setting-page/p-mail.vue',
        role: ['Provider', 'Operator'],
      },]
  },
  {
    title: 'navigate.myAccount',
    name: 'p-settings',
    path: '/p-settings',
    icon: 'el-icon-user',
    role: ['Provider'],
    notRouter: true,
    children: [
      {
        title: 'navigate.personalSettings',
        name: 'p-sub-settings',
        path: '/p/settings',
        component: 'setting-page/p-settings-page.vue',
        role: ['Provider'],
      },
      // {
      //   title: 'navigate.mail',
      //   name: 'p-mail',
      //   path: '/p/mail',
      //   component: 'setting-page/p-mail.vue',
      //   role: ['Provider'],
      // },
      {
        title: 'navigate.logistics',
        name: 'p-logistics',
        path: '/p/logistics',
        component: 'setting-page/logistics-providers.vue',
        role: ['Provider'],
      },
      {
        title: 'navigate.warehousingSetting',
        name: 'p-warehousing-setting',
        path: '/p/warehousing-setting',
        component: 'setting-page/p-warehousing-setting.vue',
        role: ['Provider'],
      }
    ]
  }
]
export const navigationDataDs = [
  {
    title: 'navigate.dashboard',
    name: 'ds-dashboard',
    path: '/ds/home',
    icon: 'el-icon-s-data',
    role: ['Drop shipper']
  },
  {
    title: 'navigate.sourcing',
    name: 'ds-sourcing',
    path: '/ds/sourcing',
    icon: 'el-icon-search',
    role: ['Drop shipper'],
    component: 'sourcing/ds-sourcing.vue'
  },
  {
    title: 'navigate.myInventory',
    name: 'myinventory',
    path: '',
    icon: 'el-icon-box',
    role: ['Drop shipper'],
    notRouter: true,
    children: [
      {
        title: 'navigate.warehousingServices',
        name: 'ds-warehouse-servers',
        path: '/ds-warehouse-servers',
        icon: 'el-icon-s-home',
        role: ['Drop shipper'],

        children: [
          {
            title: 'navigate.warehousing',
            name: 'ds-warehousing',
            path: "/ds/warehousing",
            component: 'warehousing-servers/warehousing.vue',
            role: ['Drop shipper'],
          },
          {
            title: 'navigate.storageInWarehouse',
            name: 'ds-addWarehouse',
            path: '/ds/addWarehouse',
            component: 'warehousing-servers/ds-add-warehouse.vue',
            role: ['Drop shipper'],
          },
        ]
      },
      {
        title: 'navigate.productManagement',
        name: 'ds-product',
        path: '/ds-product',
        icon: 'el-icon-s-goods',
        role: ['Drop shipper'],
        notRouter: true,
        children: [
          {
            title: 'navigate.product',
            name: 'ds-sub-product',
            path: '/ds/product',
            component: 'product-manage/ds-product.vue',
            role: ['Drop shipper'],
          }
        ]
      },
      {
        title: 'navigate.orderManagement',
        name: 'ds-order',
        path: '/ds-order',
        icon: 'el-icon-s-order',
        role: ['Drop shipper'],
        notRouter: true,
        children: [
          {
            title: 'navigate.order',
            name: 'ds-sub-order',
            path: '/ds/order',
            component: 'order-manage/ds-order.vue',
            role: ['Drop shipper'],
          }
        ]
      }
    ]
  },

  {
    title: 'navigate.storeManagement',
    name: 'ds-store-management',
    path: '/ds-store-management',
    icon: 'el-icon-s-shop',
    role: ['Drop shipper'],
    notRouter: true,
    children: [
      {
        title: 'navigate.shopify',
        name: 'ds-store-management',
        path: '/ds/ds-store-management',
        icon: 'iconfont icon-cst-inventory-shopify1',
        component: 'store-management/shopify-platform.vue',
        notRouter: true, // 是否需要生成路由
        condition: isShopifyExpandable,
        role: ['Drop shipper'],
        children: [
          {
            title: 'navigate.orderInfo',
            name: 'ds-order-info',
            path: '/ds/ds-order-info',
            component: 'store-management/p-order-info/index.vue',
            condition: true,
            role: ['Drop shipper'],
          },
          {
            title: 'navigate.productInfo',
            name: 'ds-product-info',
            path: '/ds/ds-product-info',
            component: 'store-management/p-product-info/index.vue',
            condition: true,
            role: ['Drop shipper'],
          },
          {
            title: 'navigate.storeSettings',
            name: 'ds-user-info',
            path: '/ds/ds-user-info',
            component: 'store-management/p-user-info/index.vue',
            condition: true,
            role: ['Drop shipper'],
          },
        ]
      },
    ]
  },
  {
    title: 'navigate.myAccount',
    name: 'ds-settings',
    path: '/ds-settings',
    icon: 'el-icon-user',
    role: ['Drop shipper'],
    notRouter: true,
    children: [
      {
        title: 'navigate.personalSettings',
        name: 'ds-sub-settings',
        path: '/ds/settings',
        component: 'setting-page/ds-settings-page.vue',
        role: ['Drop shipper'],
      },
      {
        title: 'navigate.mail',
        name: 'ds-mail',
        path: '/ds/mail',
        component: 'setting-page/ds-mail.vue',
        role: ['Drop shipper'],
      },
      {
        title: 'navigate.webhook',
        name: 'ds-webhook-subscribe',
        path: '/ds/webhook',
        component: 'setting-page/webhook.vue',
        role: ['Drop shipper'],
      },
      // {
      //   title: "webhook订阅注册",
      //   name: 'webhook subscribe',
      //   path: '/ds/webhook-subscribe',
      //   component: 'setting-page/ds-webhook-subscribe.vue',
      //   role: ['Drop shipper'],
      // },
      // {
      //   title: "webhook日志",
      //   name: 'webhook',
      //   path: '/ds/webhook-log',
      //   component: 'setting-page/ds-webhook-log.vue',
      //   role: ['Drop shipper'],
      // }
    ]
  }
]
