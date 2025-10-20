import ajax from '@/api/ajax'
import i18n from "@/common/vuei18n"
import CryptoJS from 'crypto-js'
import { getLanguage } from '@/common/language'
import { mergedVariantsArray } from '@/pages/order-manage/getProductInfo'
import countries from '@/common/country-by-abbreviation.json';
import { dropShipper, provider, config } from '@/common/commonconfig'
import { Message } from 'element-ui';
import { get } from 'lodash'

// 引用各模块的公共函数
export * from '@/common/authentication'
export * from '@/common/storage'
export * from '@/common/store-management'
export * from '@/common/my-account'
export * from '@/common/order-management'
export * from '@/common/product-management'
export * from '@/common/customer-management'

// 从配置文件中获取配置信息
const dropShipperConfig = config.dropShipper
const providerConfig = config.provider

// 统一的请求方法
export function commonRequest(requestParams) {
  return Promise((resolve, reject) => {
    this.$ajax({ ...requestParams, roleType: this.roleType }).then((res) => {
      this.$isRequestSuccessful(res.code) ? resolve(res.data) : reject()
    }).catch(reject)
  })
}

// 统一判断成功码

export function isRequestSuccessful(statusCode) {
  if (statusCode === 200 || statusCode % 1000 === 0) {
    return true
  } else {
    return false
  }
}

// 多字符串生产MD5

export function generateUniqueMD5(...strings) {
  const combinedString = strings.join('|');
  const md5Hash = CryptoJS.MD5(combinedString).toString();
  return md5Hash;
}

export function get_unread_message_count(params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/customer/count-unread',
      method: 'get',
      params: params,
      roleType: this.roleType,
    }).then(res => {
      resolve(res)
    }).catch(reject)
  })
}

//查询所有的物流渠道
export async function query_all_logistics_channels(queryParams, roleType) {
  const res = await ajax({
    method: 'get',
    url: '/api-prefix/api/logistics/fetch-all-channels',
    params: queryParams,
    roleType
  })
  return res
}

// 查询门店所有客户
export async function query_all_customers(queryParams, roleType) {
  const res = await ajax({
    method: 'get',
    url: '/api-prefix/api/customer/get-customers',
    params: queryParams,
    roleType
  })
  return res
}

export function removeEmptyStringValues(obj) {
  // 创建一个新对象用于存储过滤后的键值对
  const filteredObj = {}

  // 遍历原对象中的每个键值对
  for (const key in obj) {
    // 如果值不是空字符串，则将键值对添加到新对象中
    if (obj[key] !== '') {
      filteredObj[key] = obj[key]
    }
  }

  return filteredObj
}
export function copyData(text, col_name) {
  // 点击后复制row中的订单id
  navigator.clipboard.writeText(text).then(() => {
    Message.success(`${col_name} ${i18n.t("common.copyComplete")}`)
  }, () => {
    Message.error(`${col_name} ${i18n.t("common.copyFailed")}`)
  })
}

export function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export async function getConsignee(queryParam) {

  const res = await ajax({
    url: "/api-prefix/api/customer-settings/contact_info",
    method: "get",
    params: queryParam,
    headers: {
      "Content-Type": 'application/json',
    }
  })
  return res
}

export function getRoleType(routerStr) {
  // 该函数主要用于判断获取token 其中Operator和Provider的token是一样的
  for (const key in config) {
    if (config.hasOwnProperty(key) && config[key].pathPrefix) {
      if (routerStr.startsWith(config[key].pathPrefix)) {
        // 加入了操作员所以p需要判断是Operator还是Provider
        if (config[key].role === config.provider.role) {
          // 第一次登录时存在问题  
          console.log(`1路由以 '${config[key].pathPrefix}' 开头: `, routerStr, "key:", key, "role: ", getRoleTypeForP());
          return getRoleTypeForP()
        }
        console.log(`2路由以 '${config[key].pathPrefix}' 开头: `, routerStr, "key:", key, "role: ", config[key].role);
        return config[key].role;
      }
    }
  }
  // 如果没有找到匹配的前缀，返回 null
  return null;
}

// 当角色为p时需要再判断 是Operator还是Provider
export function getRoleTypeForP() {
  // 第一次登录时存在问题 localStorage没有对应的值
  const userRole = localStorage.getItem('pUserRole') ? localStorage.getItem('pUserRole') : 'Operator'
  if (userRole === config.provider.roleName) {
    return config.provider.role
  } else if (userRole === config.operator.roleName) {
    return config.operator.role
  }
  return null
}

export function toLoginPage(roleType) {
  // if (store.state.init.isHomePage()) {
  //   return "/"
  // }
  return config[roleType] ? config[roleType].loginPath : dropShipperConfig.loginPath
}

// 实现路由按角色过滤
export function filterRoutesByRole(routes, role) {
  return routes
    .filter(route => {
      // 检查角色是否匹配
      if (route.role.includes(role)) {
        // 递归过滤子路由
        if (route.children) {
          route.children = filterRoutesByRole(route.children, role);
        }
        return true;
      }
      return false;
    });
};

export function showErrorAlert(errorInfo) {
  let content = ''; // 初始化展示内容为空字符串

  // 判断errorInfo的类型
  if (typeof errorInfo === 'string') {
    // 如果是字符串，直接使用
    content = errorInfo;
  } else if (Array.isArray(errorInfo) && errorInfo.length > 0) {
    if (typeof errorInfo[0] === 'string') {
      // 如果是数组字符串，生成无序列表
      content = `<div style="min-height: 200px; max-height: 200px; overflow-y: auto;"><ul style=" text-align: left;">${errorInfo.map(item => `<li>${item}</li>`).join('')}</ul></div>`;
    } else if (typeof errorInfo[0] === 'object') {
      // 如果是数组字典字符串，生成key:value形式的无序列表
      content = `<div style="min-height: 200px; max-height: 200px; overflow-y: auto;"><ul style=" text-align: left;">${errorInfo.map(item => {
        return `<li>${item['order_id']}: ${item['message']}</li>`;
      }).join('')}</ul></div>`;
    }
  }
  // 使用处理后的content调用this.$alert
  return content;
}

// 获取pdf文件
export async function getProductTagPdf(fileName, roleType) {
  try {
    const res = await ajax({
      url: '/api-prefix/api/get-file/',
      method: 'get',
      responseType: 'blob', // 确保以 blob 类型接收响应数据
      params: {
        filename: fileName
      },
      roleType: roleType
    });
    // 创建 Blob 对象
    const pdfBlob = new Blob([res], { type: 'application/pdf' });

    // 创建临时下载链接
    const downloadUrl = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName; // 设置下载的文件名
    // link.setAttribute('download', fileName); // 为下载的文件命名
    document.body.appendChild(link);
    link.click();

    // 清理并移除链接
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('下载 PDF 文件时出错:', error);
  }
}
// 获取excel文件
export async function getExcelFile(fileName) {
  try {
    const res = await ajax({
      url: '/api-prefix/api/get-file/',
      method: 'get',
      responseType: 'blob', // 确保以 blob 类型接收响应数据
      params: {
        filename: fileName
      },
    });
    // 创建 Blob 对象
    const excelBlob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // 创建临时下载链接
    const downloadUrl = window.URL.createObjectURL(excelBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName; // 设置下载的文件名
    // link.setAttribute('download', fileName); // 为下载的文件命名
    document.body.appendChild(link);
    link.click();

    // 清理并移除链接
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('下载 Excel 文件时出错:', error);
  }
}

export function getCountryByAbbreviation(abbreviation) {
  const langType = getLanguage();
  // 使用 Array.find 方法查找与给定缩写匹配的国家对象
  const countryObj = countries.find(country => country.abbreviation === abbreviation);
  // 如果找到匹配的对象，则返回国家名称；否则返回未找到的提示或null
  return countryObj ? countryObj.country[langType] : abbreviation;
}

// TODO: 这个函数使用很多可以优化在storage文件中已经提取了一个需要替换 查询ds已关联的仓储
export async function getStorage(provider_uuid, roleType = dropShipper) {
  const queryParams = {}
  if (provider_uuid !== '') {
    queryParams.provider_uuid = provider_uuid
  }
  const res = await ajax({
    url: "/api-prefix/api/storage/query-storage",
    method: "GET",
    roleType: roleType,
    params: queryParams
  })
  return res
}

// TODO: 同上也需要优化使用很多 查询仓储定义
export async function getStorageDefinition(provider_uuid, roleType = dropShipper) {
  const queryParams = {}
  if (provider_uuid !== '') {
    queryParams.provider_uuid = provider_uuid
  }
  const res = await ajax({
    url: "/api-prefix/api/storage/query-storage-definition",
    roleType: roleType,
    method: "GET",
    params: queryParams
  })
  return res
}

// 通过系统号查询产品质检上架的相关信息
export const fetchProductList = (params, roleType) => {
  return ajax({
    method: 'get',
    url: '/api-prefix/api/storage-m/get-related-products',
    params: params,
    roleType: roleType
  });

};

/** 文件下载
 * @param {String} content  返回结果
 * @param {String} fileName 文件名
 */
export const download = (content, filename) => {
  const eleLink = document.createElement('a')
  eleLink.download = filename
  eleLink.style.display = 'none'
  // 字符内容转变成blob地址
  const blob = new Blob([content])
  eleLink.href = URL.createObjectURL(blob)
  // 触发点击
  document.body.appendChild(eleLink)
  eleLink.click()
  // 然后移除
  document.body.removeChild(eleLink)
}

// 下拉列表转映射表
export function listToMap(list) {
  const result = list.reduce((acc, { value, label }) => {
    // 仅包含value为0和1的项
    // if (value === 0 || value === 1) {
    //   acc[value] = label;
    // }
    acc[value] = label;
    return acc;
  }, {});
  return result
}
// 数组字段转映射表
export function mapArrayToObject(items, keyProp, valueProp) {
  const mappedObject = {};
  items.forEach(item => {
    if (item[keyProp] && item[valueProp]) {
      mappedObject[item[keyProp]] = item[valueProp];
    }
  });
  return mappedObject;
}

// 上传文件请求头修改
export function getGlobalHeaders(roleType) {
  let accessToken = localStorage.getItem(config[roleType] ? config[roleType].accessToken : dropShipperConfig.accessToken)
  let csrfToken = localStorage.getItem(config[roleType] ? config[roleType].csrfToken : dropShipperConfig.csrfToken)
  return {
    'Authorization': `Bearer ${accessToken}`,
    'X-CSRFToken': csrfToken
  }
}

// 获取cookie
export function getCookie(name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

export function isNonEmptyObject(value) {
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length > 0
  }
  return false
}

export function objectToFormData(object) {
  const formData = new FormData()
  Object.keys(object).forEach((key) => {
    const value = object[key]
    if (Array.isArray(value)) {
      value.forEach((subValue, i) => {
        formData.append(key + `[${i}]`, subValue)
      })
    } else {
      formData.append(key, object[key])
    }
  })
  return formData
}

export function formatTimestamp(timestamp) {
  // 判断时间戳是否为数字
  if (typeof timestamp !== 'number') {
    return '';
  }
  // 创建一个新的Date对象，使用时间戳乘以1000转换成毫秒
  const date = new Date(timestamp * 1000);

  // 获取年、月、日、小时、分钟和秒
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的，所以加1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // 组合成最终的字符串
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function qualifiedQuantityTotal(quality_check) {
  if (!quality_check) return 0
  return quality_check.reduce((acc, cur) => {
    return acc + cur.qualified_quantity
  }, 0)
}
export function unqualifiedQuantityTotal(quality_check) {
  if (!quality_check) return 0
  return quality_check.reduce((acc, cur) => {
    return acc + cur.unqualified_quantity
  }, 0)
}

export function putawayTotal(putaway) {
  if (!putaway) return 0
  return putaway.reduce((acc, cur) => {
    return acc + cur.number
  }, 0)
}

export function fetchSpecificElementsQueryResults(queryParam) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/order/query-specific-elements',
      method: 'get',
      params: queryParam,
      headers: {
        'Content-Type': 'application/json'
      },
      roleType: this.roleType
    }).then((res) => {
      if (this.$isRequestSuccessful(res.code)) {
        const remoteQueryResult = res.data
        resolve(remoteQueryResult)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}

// 获取p 一件代发 发货通知等出库字段列表
export function fetchDropshippingSpecificElements(queryParam, roleType) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/dropshipping/specific-element',
      method: 'get',
      params: queryParam,
      headers: {
        'Content-Type': 'application/json'
      },
      roleType: roleType
    }).then((res) => {
      if (this.$isRequestSuccessful(res.code)) {
        const remoteQueryResult = res.data
        resolve(remoteQueryResult)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}

// 获取波次策略
export function fetchWaveStrategy(queryParam, roleType) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/customer-settings/query-specific-wave-strategies',
      method: "get",
      params: queryParam,
      headers: {
        "Content-Type": 'application/json',
      },
      roleType: roleType,
    }).then((res) => {
      if (this.$isRequestSuccessful(res.code)) {
        const remoteQueryResult = res.data
        resolve(remoteQueryResult)
      } else {
        reject(new Error("Failed to fetch wave strategy: " + res.msg[this.$languageType])); // 提供更具体的错误信息
      }
    }).catch(error => {
      reject(new Error("AJAX request failed: " + res.msg[this.$languageType])); // 捕获并传递AJAX请求错误
    })
  })
}

// 获取p 发货单列表字段列表
export function fetchDeliveryListSpecificElements(queryParam, roleType) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/delivery_list/query-delivery-specific-element',
      method: 'get',
      params: queryParam,
      headers: {
        'Content-Type': 'application/json'
      },
      roleType: roleType
    }).then((res) => {
      if (this.$isRequestSuccessful(res.code)) {
        const remoteQueryResult = res.data
        resolve(remoteQueryResult)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}

// 波次单号列表查询
export function fetchWaveOrderList(queryParam, roleType) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/delivery_list/query-wave-list-specific-element',
      method: 'get',
      params: queryParam,
      headers: {
        'Content-Type': 'application/json'
      },
      roleType: roleType
    }).then((res) => {
      if (this.$isRequestSuccessful(res.code)) {
        const remoteQueryResult = res.data
        resolve(remoteQueryResult)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}

// 获取api名称列表
export function getApiNameListInfo() {
  return new Promise((resolve, reject) => {
    this.$ajax({
      method: 'get',
      url: '/api-prefix/api/logistics/get-api-name-list',
      roleType: this.roleType
    }).then(res => {
      if (this.$isRequestSuccessful(res.code)) {
        const result = res.data
        resolve(result)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}

// 装袋字段列表查询
export function fetchBaggingListSpecificElements(params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/dropshipping/query-bagged-specific-element',
      method: 'get',
      params: params,
      roleType: this.roleType
    }).then((res) => {
      if (this.$isRequestSuccessful(res.code)) {
        const remoteQueryResult = res.data
        resolve(remoteQueryResult)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}

// 打印袋标
export function fetchBagLabel(params) {
  //bag_numbers需要转 this.changeBagForm.bag_number.map(item => `order_ids=${item.order_id}`).join('&')
  const bagNumbersQuery = params.bag_numbers.map(item => `bag_numbers=${item}`).join('&');
  const providerUuidQuery = `provider_uuid=${params.provider_uuid}`;
  const queryString = `${bagNumbersQuery}&${providerUuidQuery}`;
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: `/api-prefix/api/dropshipping/print-bagged-list?${queryString}`,
      method: 'get',
      roleType: this.roleType
    }).then((res) => {
      if (this.$isRequestSuccessful(res.code)) {
        resolve(res.data)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}

// 查询物流api关键字接口
export function queryLogisticsApi(queryParams) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      method: 'get',
      url: '/api-prefix/api/logistics/query-specific-element-api',
      params: queryParams,
      roleType: this.roleType
    }).then(res => {
      if (this.$isRequestSuccessful(res.code)) {
        resolve(res.data)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}

// 查询物流渠道关键字接口
export function queryLogisticsChannels(queryParams) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      method: 'get',
      url: '/api-prefix/api/logistics/query-specific-element-channels',
      params: queryParams,
      roleType: this.roleType
    }).then(res => {
      if (this.$isRequestSuccessful(res.code)) {
        resolve(res.data)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}

export function fetchLogisticsQueryUrlList(queryParams) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      method: 'get',
      url: '/api-prefix/api/logistics/query-url/list',
      params: queryParams,
      roleType: this.roleType
    }).then(res => {
      if (this.$isRequestSuccessful(res.code)) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}

export function createLogisticsQueryUrl(data) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      method: 'post',
      url: '/api-prefix/api/logistics/query-url/create',
      data,
      roleType: this.roleType
    }).then(res => {
      if (this.$isRequestSuccessful(res.code)) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}

export function updateLogisticsQueryUrl(data) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      method: 'put',
      url: '/api-prefix/api/logistics/query-url/update',
      data,
      roleType: this.roleType
    }).then(res => {
      if (this.$isRequestSuccessful(res.code)) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}

export function deleteLogisticsQueryUrls(data) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      method: 'delete',
      url: '/api-prefix/api/logistics/query-url/delete',
      data,
      roleType: this.roleType
    }).then(res => {
      if (this.$isRequestSuccessful(res.code)) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}

export function toShippingDetail(row) {
  //TODO: 跳转到物流详情页 需要从row中获取 url
  let url = 'http://www.baidu.com'
  window.open(url);
}

export function inBags(queryParam) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: '/api-prefix/api/dropshipping/put-into-bag',
      method: 'put',
      params: queryParam,
      roleType: this.roleType
    }).then((res) => {
      if (this.$isRequestSuccessful(res.code)) {
        resolve(res.data)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}

export function initProductData(arr) {
  if (!arr || arr.length === 0) {
    return []
  }
  let resultArr = []
  const pageSize = arr.length // pageSize为产品数量
  const variantIds = [] //变种id集合
  arr.forEach(el => {
    if (el.variants && el.variants.length !== 0) {
      el.variants.forEach(variant => {
        variantIds.push(variant.vid)
      })
    }
  })
  let queryParam = { page_size: pageSize, cur_page: 1, 'product_variants.variant_id': variantIds.join(",") }
  if (this.config.pRoleList.includes(this.roleType)) {
    queryParam.provider_uuid = this.provider_uuid
  }
  return new Promise((resolve, reject) => {
    // 批量获取产品详情
    this.$ajax({
      url: "/api-prefix/api/product/query-product",
      method: "get",
      roleType: this.roleType,
      params: queryParam,
      headers: {
        "Content-Type": 'application/json',
      }
    }).then(res => {
      if (this.$isRequestSuccessful(res.code)) {
        resultArr = mergedVariantsArray(arr, res.data.result || [])
        resolve(resultArr)
      } else {
        reject(res)
      }
    }).catch(reject)

  })

}

// 实现动态调整tag的颜色

export function getTagStyle(status, colorMap) {
  // 根据 status 获取对应的颜色值
  const color = colorMap[status] || "#40b5ff"; // 设置默认颜色
  return {
    backgroundColor: '#fff',
    color: color, // 标签文字颜色（根据需要调整）
    "border-color": color
  }
}

// 获取告警
export function getAlarmList(params) {
  return new Promise((resolve, reject) => {
    this.$ajax({
      url: "/api-prefix/api/alarms/current/",
      method: "get",
      roleType: this.roleType,
      params: params,
    }).then((res) => {
      resolve(res)
    }).catch(reject)
  })
}

export function getWebSocketUrl() {

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

  const hostname = window.location.hostname;

  // 检查 hostname 是否为纯数字（含点），即 IP 地址
  const isNumericHostname = /^[0-9.]+$/.test(hostname);

  let port = window.location.port; // 默认使用当前端口
  let path = '/websocket';
  if (isNumericHostname && port) {
    port = '8082';
    path = '';
  }

  const host = port ? `${hostname}:${port}` : hostname;

  return `${protocol}://${host}${path}`;
}
