//  指定客户登录
export function customerLogin (params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api/customer/customer-login',
      method: 'post',
      roleType: this.roleType,
      params: params
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}