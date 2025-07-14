import ajax from '@/api/ajax'
export async function getCustomerList (queryType, query, roleType) {
  let provider_uuid = localStorage.getItem('shop_provider_uuid')
  let queryParms = {
    provider_uuid
  }
  if (query) {
    queryParms[queryType] = query
  }
  const res = await ajax({
    method: 'get',
    url: '/api-prefix/api/customer/query-specific',
    params: queryParms,
    roleType: roleType
  })
  return res
}