// 查询订单
export function getOrderInfoList (params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/order/query-order',
      method: 'get',
      params: params,
      roleType: this.roleType,
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

// 批量修改物流
export function batchUpdateLogistics (params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/order/batch-modify-report-provider',
      method: 'put',
      data: params,
      roleType: this.roleType,
    }).then(res => {
      resolve(res)
    }
    ).catch((error) => {
      reject(error)
    })
  })
}

// 删除物流
export function deleteLogistics (data) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/shipping_status/delete-shipping-status',
      method: 'delete',
      roleType: this.roleType,
      data: data
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

//查询订单日志
export function getLog (params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api/audit_log/audit-log-retrieve',
      method: 'get',
      params: params,
      roleType: this.roleType,
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}