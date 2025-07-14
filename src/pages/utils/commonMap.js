// 仓储map
import ajax from '@/api/ajax'
import { isRequestSuccessful } from '@/common/common-func'
let storageList = []
let storageMap = []
function querymStorage () {
  ajax({
    url: "/api-prefix/api/storage/query-storage",
    method: "get",
  }).then(res => {
    if (isRequestSuccessful(res.code)) {
      storageList = res.data.map(item => ({
        label: item.name,
        value: item.storage_uuid
      }));
      res.data.forEach((obj) => {
        storageMap[obj.storage_uuid] = obj.name
      })
    }
  }).catch(error => {
    console.error(error);
  })
}
querymStorage()
export { storageList, storageMap }