import { resolvePreferenceProviderUuid } from '@/common/global-user-settings'

// 查询当前指定物流的内部渠道和代码
export function getLogisticsInternalChannel (params = {}) {
  return new Promise((resolve, reject) => {
    const queryParams = { ...params }
    if (!queryParams.provider_uuid) {
      let providerUuid = ''
      try {
        const store = this && this.$store
        providerUuid = resolvePreferenceProviderUuid(store, this && this.roleType)
      } catch (e) {
        providerUuid = ''
      }
      if (!providerUuid && typeof localStorage !== 'undefined') {
        providerUuid = localStorage.getItem('shop_provider_uuid') || ''
      }
      if (providerUuid) {
        queryParams.provider_uuid = providerUuid
      }
    }
    if (!queryParams.provider_uuid) {
      return reject(new Error('provider_uuid is required for getLogisticsInternalChannel'))
    }
    this.$ajax({
      url: '/api-prefix/api/logistics/get-specified-channels',
      method: 'get',
      roleType: this.roleType,
      params: queryParams
    }).then((res) => {
      this.$isRequestSuccessful(res.code) ? resolve(res) : reject(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 页面默认参数设置
export function setDefaultParams (params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api/customer-settings/default-settings-update',
      method: 'put',
      roleType: this.roleType,
      data: params
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

