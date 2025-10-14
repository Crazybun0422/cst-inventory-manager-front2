
// 默认主题
export const defaultTheme = "theme-white"

// 谷歌登录需要的客户端ID
export const clientId =
  '1000218360866-0o6jun4s6b6f5eia3g8e50o5dr2ahjrl.apps.googleusercontent.com'
export const baseUrl = ''

//部署形式 (本地部署或者云部署)   
//TODO: 本地部署不支持注册P账号 登录界面分两份 云部署登录界面提供角色选项
export const deployType = 'local' // local/cloud 

// 两种角色对应的名称
export const provider = 'provider'
export const dropShipper = 'dropShipper'
export const operator = 'operator'

// 登录时返回的角色名称
export const providerName = 'Provider'
export const dropShipperName = 'Drop shipper'
export const operatorName = 'Operator'
const providerPathPrefix = '/p'
const dropShipperPathPrefix = '/ds'
export const allowedRoles = [provider, dropShipper, operator];
const allowedRoleNames = [providerName, dropShipperName, operatorName];
export const config = {
  roles: allowedRoles, // 存儲所有角色列表 新增角色需要在此处添加
  roleNames: allowedRoleNames,
  pRoleList: [provider, operator],
  loginRoleType: {
    provider: "PROVIDER",
    dropShipper: "DS",
    operator: "PROVIDER",
  },
  provider: {
    role: provider,
    roleName: providerName,
    pathPrefix: providerPathPrefix,
    homePathName: 'p-home',
    loginPath: `${providerPathPrefix}/login`,
    homePath: `${providerPathPrefix}/home`,
    keyInformationPath: `${providerPathPrefix}/key-information`,
    forgotPasswordPath: `${providerPathPrefix}/turn-the-table`,
    settingsPath: `${providerPathPrefix}/settings`,
    accessToken: 'p_access_token',
    csrfToken: 'p_csrf_token',
    userName: "pUserName",
    userRole: "pUserRole",
    userRelatedId: "pUserRelatedId",
    avatarBase64: "pAvatarBase64",
    shopList: "pShopList",
  },
  operator: {
    role: operator,
    roleName: operatorName,
    pathPrefix: providerPathPrefix,
    homePathName: 'p-home',
    loginPath: `${providerPathPrefix}/login`,
    homePath: `${providerPathPrefix}/home`,
    keyInformationPath: `${providerPathPrefix}/key-information`,
    forgotPasswordPath: `${providerPathPrefix}/turn-the-table`,
    settingsPath: `${providerPathPrefix}/settings`,
    accessToken: 'p_access_token',
    csrfToken: 'p_csrf_token',
    userName: "pUserName",
    userRole: "pUserRole",
    userRelatedId: "pUserRelatedId",
    avatarBase64: "pAvatarBase64",
    shopList: "pShopList",
  },
  dropShipper: {
    role: dropShipper,
    roleName: dropShipperName,
    pathPrefix: dropShipperPathPrefix,
    homePathName: 'ds-home',
    loginPath: `${dropShipperPathPrefix}/login`,
    homePath: `${dropShipperPathPrefix}/home`,
    keyInformationPath: `${dropShipperPathPrefix}/key-information`,
    thirdPartKeyInformation: `${dropShipperPathPrefix}/third-part-key-information`,
    forgotPasswordPath: `${dropShipperPathPrefix}/turn-the-table`,
    erpLoginPath: `${dropShipperPathPrefix}/erp-login`,  // 新增路径
    settingsPath: `${dropShipperPathPrefix}/settings`,
    thirdPartSuccessRedirect: `${dropShipperPathPrefix}/thirdpart-success-redirect`,
    accessToken: 'ds_access_token',
    csrfToken: 'ds_csrf_token',
    userName: "userName",
    userRole: "userRole",
    userRelatedId: "userRelatedId",
    avatarBase64: "avatarBase64",
    shopList: "shopList",

    shopOrders: `${dropShipperPathPrefix}/ds-order-info`
  },
  signUpPath: '/signup',
  toolsConfig: '/tools/config',
  privatePolicy: '/private-policy',
  priceTag: '/price-tag',
  estyTermsOfService: '/esty-collector-tos',
  estyPrivacyPolicy: '/esty-collector-pp',
  mainPage: '/',
  checkout: '/esty-checkout/:planId',
  estyIntroduction: '/esty-introduction'
}
