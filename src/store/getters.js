const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  shop_provider_uuid: state => state.shopProviderUuid.shop_provider_uuid, // 店铺id通过all接口获取 p和ds共用
  shouldRefreshEmails: state => state.user.shouldRefreshEmails,
  shouldRefreshDownloads: state => state.user.shouldRefreshDownloads,
  shopifyShopUrl: state => state.shopify.shopifyShopUrl,
  shopList: state => state.shopify.shopList,
  shopListLoading: state => state.shopify.shopListLoading,
  theme: state => state.user.theme,
  getStorageListByUserId: (state) => (userId) => {
    return state.storageListByUser[username] || [];
  },
}
export default getters
