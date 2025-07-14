// 接口汇总
export const apiMap = {
  loginApi,
  registerApi,
  warehouseApi
}

// 登录相关接口
export const loginApi = {
  login: {
    url: '/api-prefix//sign-in/',
    method: 'post'
  },
  getAesKeyLogin: {
    url: '/api-prefix/get-aes-key-login/',
    method: 'get',
  },
  getCaptcha: {
    url: '/api-prefix/captcha/',
    method: 'get'
  },
  checkCaptcha: {
    url: '/api-prefix/captcha/check',
    method: 'get'
  },
  emailChangePassword:
  {
    url: '/api-prefix/change-password/',
    method: 'get'
  }
}
// 注册相关接口
export const registerApi = {
  register: {
    url: '/api-prefix/register/',
    method: 'post'
  },
  getAesKeyRegister: {
    url: '/api-prefix/get-aes-key/',
    method: 'get'
  }
}

// 仓储相关接口
export const warehouseApi = {

}