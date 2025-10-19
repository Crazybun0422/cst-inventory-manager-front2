import CryptoJS from 'crypto-js'

export function encryptPassword(aesKey, password) {
  const key = CryptoJS.enc.Base64.parse(aesKey)
  const encrypted = CryptoJS.AES.encrypt(password, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

// 登录
export function signIn(reqData) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/sign-in/',
      method: 'POST',
      data: reqData,
      roleType: this.roleType
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error) // 若请求出错，则将错误信息作为 Promise 的 reject 值返回
    })
  })
}

// 查询HOME数据
export function loadHomeData(roleType = null) {
  let cureentRoleType = roleType !== null ? roleType : this.roleType
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/home/',
      method: 'GET',
      roleType: cureentRoleType
    }).then((res) => {
      if (this.$isRequestSuccessful(res.code)) {
        resolve(res.data)
      } else {
        reject(res)
      }
    }).catch((error) => {
      reject(error) // 若请求出错，则将错误信息作为 Promise 的 reject 值返回
    })
  })
}

// home信息存储和相关操作
export function storeHomeData(resData, roleType = null) {
  return (() => {
    const { user, user_avatar_url, shops, default_settings } = resData
    // 可能需要将 角色信息存到cookie 或者localstorage
    localStorage.setItem(
      this.config[this.roleType].userName,
      user.username
    )
    localStorage.setItem(
      this.config[this.roleType].userRole,
      user.user_role
    )
    localStorage.setItem(
      this.config[this.roleType].userRelatedId,
      user.user_related_id
    )
    // 保存店铺信息
    localStorage.setItem(
      this.config[this.roleType].shopList,
      JSON.stringify(shops)
    )
    this.$store.dispatch('tagsView/delAllPDSViews')

    // 设置个人偏好的语言种类
    const defaultLanguage =
      default_settings?.defaultLanguage || 'en_us'
    this.$store.dispatch('user/getDefaultLanguage', defaultLanguage)
    this.$i18n.locale = defaultLanguage
    // 设置主题
    const defaultTheme = default_settings?.defaultTheme || 'defaultTheme'
    this.$store.dispatch('user/changeSetting', {
      key: 'theme',
      value: defaultTheme,
      persist: false
    })

  })
}

// 查询ds关联的仓储 或者p创建的仓储定义 用于判断初次登录时是否需要关联和创建仓储
// TODO: 该接口多个地方使用，使用vuex优化减少接口调用
export function getWarehouseRelatedInfo(roleType = null) {
  let cureentRoleType = roleType !== null ? roleType : this.roleType
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/query-provider/all',
      method: 'get',
      roleType: cureentRoleType
    }).then((res) => {
      if (this.$isRequestSuccessful(res.code)) {
        resolve(res.data)
      } else {
        reject(res)
      }
    })
      .catch((error) => {
        reject(error) // 若请求出错，则将错误信息作为 Promise 的 reject 值返回
      })
  })
}

export function getCsrfTokenFromServer() {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/get-csrf-token/',
      method: 'get'
    }).then((res) => {
      if (res?.csrf_token) {
        resolve(res.csrf_token)
      } else {
        this.$message.error(this.$t('message.signUp.csrfTokenError'))
        reject('')
      }
    }).catch((error) => {
      reject(error)
    })
  })
}

export function getAesKey(formData) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/get-aes-key/',
      method: 'get',
      params: {
        username: formData.username
      },
    }).then((res) => {
      if (this.$isRequestSuccessful(res.code)) {
        const aesKey = res.data.aes_key
        const encryptedPassword = encryptPassword(aesKey, formData.password)
        resolve(encryptedPassword)
      } else {
        reject(res)
      }
    }).catch((error) => {
      reject(error)
    }
    )
  })
}

export function getAesKeyLogin(formData) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/get-aes-key-login/',
      method: 'get',
      params: {
        username: formData.username
      },
    }).then((res) => {
      if (this.$isRequestSuccessful(res.code)) {
        const aesKey = res.data.aes_key
        const encryptedPassword = encryptPassword(aesKey, formData.password)
        resolve(encryptedPassword)
      } else {
        reject(res)
      }
    }).catch((error) => {
      reject(error)
    }
    )
  })
}
// 注册函数
export function register(formData, customHeaders) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/register/',
      method: 'post',
      data: formData,
      customHeaders: customHeaders
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// shopify修改账密
export function modifyShopifyAccount(formData, customHeaders) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/customer-settings/change-user-info-directly',
      method: 'post',
      data: formData,
      customHeaders: customHeaders
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// shopify三方认证
export function shopifyAuth(thirdPartyParams, customHeaders) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/auth/third-part-verify/',
      method: 'POST',
      data: thirdPartyParams, // 将参数直接放入请求的 body
      customHeaders: customHeaders,
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// shopify三方认证2
export function shopifyDirectAuth(queryParms, customHeaders) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/auth/shopify-direct-auth/',
      method: 'POST',
      params: queryParms,
      customHeaders: customHeaders,
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}


// 查询用户字段列表
export function queryUserFields(queryParms, roleType = null) {
  let cureentRoleType = roleType !== null ? roleType : this.roleType
  return new Promise((resolve, reject) => {
    this.$ajax({
      method: 'get',
      url: '/api-prefix/api/customer/query-specific',
      params: queryParms,
      roleType: cureentRoleType
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}
