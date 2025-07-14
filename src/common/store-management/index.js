// 开始同步产品
export function startSyncProducts(params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/shop-manager/sync-all-products',
      method: 'post',
      roleType: this.roleType,
      params: params
    }).then((res) => {
      this.$isRequestSuccessful(res.code) ? resolve(res) : reject(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 开始同步订单
export function startSyncOrder(params, data) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/shop-manager/fulfill-orders',
      method: 'post',
      roleType: this.roleType,
      params: params,
      data: data
    }).then((res) => {
      this.$isRequestSuccessful(res.code) ? resolve(res) : reject(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 获取产品同步状态
export function getSyncStatus(params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/shop-manager/query-product-sync-mission',
      method: 'get',
      roleType: this.roleType,
      params: params
    }).then((res) => {
      this.$isRequestSuccessful(res.code) ? resolve(res) : reject(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 获取导出订单任务状态
export function getSyncOrderStatus(params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/shop-manager/query-export-mission',
      method: 'get',
      roleType: this.roleType,
      params: params
    }).then((res) => {
      this.$isRequestSuccessful(res.code) ? resolve(res) : reject(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 停止同步产品
export function stopSyncProducts(params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/shop-manager/stop-product-sync-mission',
      method: 'put',
      roleType: this.roleType,
      params: params
    }).then((res) => {
      this.$isRequestSuccessful(res.code) ? resolve(res) : reject(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 停止同步订单
export function stopSyncOrder(params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/shop-manager/stop-fulfill-mission',
      method: 'put',
      roleType: this.roleType,
      params: params
    }).then((res) => {
      this.$isRequestSuccessful(res.code) ? resolve(res) : reject(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 重置产品同步
export function resetSyncProducts(params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/shop-manager/stop-product-sync-mission',
      method: 'delete',
      roleType: this.roleType,
      params: params
    }).then((res) => {
      this.$isRequestSuccessful(res.code) ? resolve(res) : reject(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 重置订单同步
export function resetSyncOrder(params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/shop-manager/reset-fulfill-mission',
      method: 'put',
      roleType: this.roleType,
      params: params
    }).then((res) => {
      this.$isRequestSuccessful(res.code) ? resolve(res) : reject(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 查看店铺订单批量履行状态
export function getBatchFulfillStatus(params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/shop-manager/query-fulfill-mission',
      method: 'get',
      roleType: this.roleType,
      params: params
    }).then((res) => {
      this.$isRequestSuccessful(res.code) ? resolve(res) : reject(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 获取模版文件
export function getTemplateFile(params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/get-template-files/',
      method: 'get',
      roleType: this.roleType,
      params: params,
      responseType: 'blob'
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 查询店铺用户信息
export function getUserInfo(params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/shop-manager/get-user-info',
      method: 'get',
      roleType: this.roleType,
      params: params
    }).then((res) => {
      this.$isRequestSuccessful(res.code) ? resolve(res) : reject(res)
    }).catch((error) => {
      reject(error)
    })
  })
}