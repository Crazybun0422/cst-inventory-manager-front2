// 打印产品标签
export function printProductLabel (product_uuids, productTagParams) {
  // 经典列表会出现多个产品同id的情况，所以这里需要去重
  const productUuids = [...new Set(product_uuids)];
  // 将数组转换为查询字符串
  const productUuidsParam = productUuids.map(uuid => `product_uuids=${uuid}`).join('&');

  // 如果有其他参数，也可以在这里转换并添加
  const additionalParams = Object.entries(productTagParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  // 组合所有参数
  const combinedParams = productUuidsParam + (additionalParams ? `&${additionalParams}` : '');

  return new Promise((resolve, reject) => {
    this.$ajax({
      url: `/api-prefix/api/product/product-print-label?${combinedParams}`,
      method: 'get',
      roleType: this.roleType
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

// 获取产品标签列表
export function getProductLabelList (params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/customer-settings/print-label-info-list',
      method: 'get',
      params: params,
      roleType: this.roleType
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}