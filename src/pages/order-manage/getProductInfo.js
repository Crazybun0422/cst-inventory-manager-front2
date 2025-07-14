// 从接口拿到产品详情信息,将对应数量与之匹配
import ajax from '@/api/ajax'
import { dropShipper } from '@/common/commonconfig'

// TODO: 已转移到common-func文件夹下
// arr结构为[ {  "pid": "a4", "variants": [{"vid": "976e63aa", "quantity": 1},{}]}]
// export async function initProductData (arr, roleType = dropShipper) {
//   if (!arr || arr.length === 0) {
//     return []
//   }
//   let resultArr = []
//   const pageSize = arr.length // pageSize为产品数量
//   const variantIds = [] //变种id集合
//   arr.forEach(el => {
//     if (el.variants && el.variants.length !== 0) {
//       el.variants.forEach(variant => {
//         variantIds.push(variant.vid)
//       })
//     }
//   })
//   // 批量获取产品详情
//   return ajax({
//     url: "/api-prefix/api/product/query-product",
//     method: "get",
//     roleType: roleType,
//     params: { page_size: pageSize, cur_page: 1, 'product_variants.variant_id': variantIds.join(",") },
//     headers: {
//       "Content-Type": 'application/json',
//     }
//   }).then(res => {
//     resultArr = mergedVariantsArray(arr, res.data.result || [])
//     return resultArr; // 返回结果数组
//   })
// }

// 将产品详情信息和产品数量合并为一个对象 array1为订单中的产品id集合,array2为获取到的所有产品详情信息
export function mergedVariantsArray (array1, array2) {
  if (array1.length === 0 || array2.length === 0) {
    return []
  }
  const resultArr = []
  array1.forEach(item1 => {
    const matchingItem2 = array2.find(item2 => item2.product_uuid === item1.pid);
    item1 = Object.assign(item1, matchingItem2)
    if (matchingItem2) {
      item1.variants.forEach(variant1 => {
        const matchingVariant2 = matchingItem2.product_variants.find(variant2 => variant2.variant_id === variant1.vid);
        if (matchingVariant2) {
          matchingVariant2.main_image_url = matchingItem2.main_image_url
          matchingVariant2.quantity = variant1.quantity
        }
        variant1 = Object.assign(variant1, matchingVariant2)
      });
    }
  });
  // 将变种单独提出来作为一条
  array1.forEach(el => {
    if (el.variants && el.variants.length !== 0) {
      el.variants.forEach(variant => {
        resultArr.push({
          ...el,
          ...variant,
          product_variants: [variant]
        })
      })
    }
  })
  return resultArr
}
