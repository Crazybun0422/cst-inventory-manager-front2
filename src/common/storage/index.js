// DS 关联仓储
export function dsAddStorage (storageData) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/storage/add-storage',
      method: 'post',
      data: storageData,
      roleType: this.roleType,
      headers: {
        "Content-Type": 'application/json',
      }
    }).then(res => {
      if (this.$isRequestSuccessful(res.code)) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch((error) => {
      reject(error)
    })
  })
}

// 获取门店详情
export function getStoreDetail (name_of_provider) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/query-provider/detail',
      method: 'get',
      roleType: this.roleType,
      params: { name_of_provider: name_of_provider }
    }).then((res) => {
      resolve(res)
    })
      .catch((error) => {
        reject(error) // 若请求出错，则将错误信息作为 Promise 的 reject 值返回
      })
  })
}

// 查询ds已关联的仓储 如果携带provider_uuid则查询指定p的已关联仓储
export function queryDsRelateStorage (params = {}) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: "/api-prefix/api/storage/query-storage",
      method: "get",
      roleType: this.roleType,
      params: params
    }).then(res => {
      if (this.$isRequestSuccessful(res.code)) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch((error) => {
      reject(error)
    })
  })
}

// 查询门店列表 即p的列表
export function queryProviderList (params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/query-provider/list',
      method: 'get',
      params: params,
      roleType: this.roleType,
    }).then(res => {
      if (this.$isRequestSuccessful(res.code)) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch((error) => {
      reject(error)
    })
  })
}

// 创建或者关联仓储定义 （）
export function createOrAddProvider (reqData) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/create-add-provider/',
      method: 'post',
      data: reqData,
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded',
      },
      roleType: this.roleType,
    }).then(res => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}