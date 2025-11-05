// 引入其他模块的常量
export * from './my-account/field-maping.js'
export * from './order-management/field-maping.js'
export * from './customer-management/field-maping.js'
// 语言种类
export const languageOptions = [{
  value: 'en_us',
  label: {
    zh_cn: 'English',
    en_us: 'English'
  }
}, {
  value: 'zh_cn',
  label: {
    zh_cn: '中文',
    en_us: '中文'
  }
}]

// 默认主题
export const defaultThemeOptions = [
  {
    value: 'defaultTheme',
    label: {
      en_us: 'Light',
      zh_cn: '浅色'
    }
  },
  {
    value: 'darkTheme',
    label: {
      en_us: 'Dark',
      zh_cn: '深色'
    }
  }
]

// 产品分类中英文映射
export const productCategoryMap = {
  1: { 'en_us': 'Smart Home', 'zh_cn': '智能家居' },
  2: { 'en_us': 'Smart Security', 'zh_cn': '智能安防' },
  3: { 'en_us': 'Smart Health', 'zh_cn': '智能健康' },
  4: { 'en_us': 'Smart Entertainment', 'zh_cn': '智能娱乐' },
  5: { 'en_us': 'Smart Travel', 'zh_cn': '智能出行' },
  6: { 'en_us': 'Smart Office', 'zh_cn': '智能办公' },
  7: { 'en_us': 'Smart Wearable', 'zh_cn': '智能穿戴' },
  8: { 'en_us': 'Smart Accessories', 'zh_cn': '智能配件' },
  9: { 'en_us': 'Smart Appliances', 'zh_cn': '智能电器' },
}
// 产品状态映射
export const productStatusMap = {
  1: { 'en_us': 'Enable', 'zh_cn': '启用' },
  2: { 'en_us': 'Disable', 'zh_cn': '禁用' },
}
// 产品单位中英文映射
export const productUnitMap = {
  1: { 'en_us': 'pieces', 'zh_cn': '件' },
  2: { 'en_us': 'boxes', 'zh_cn': '箱' },
  3: { 'en_us': 'sets', 'zh_cn': '套' },
  4: { 'en_us': 'pairs', 'zh_cn': '对' },
  5: { 'en_us': 'kilograms', 'zh_cn': '千克' },
  6: { 'en_us': 'meters', 'zh_cn': '米' },
  7: { 'en_us': 'liters', 'zh_cn': '升' },
  8: { 'en_us': 'grams', 'zh_cn': '克' },
  9: { 'en_us': 'millimeters', 'zh_cn': '毫米' },
}

// 产品页面字段选择映射表
export const fieldSelectMap = [
  {
    value: 'product_variants.product_code_sku',
    label: {
      en_us: 'Product Code/SKU',
      zh_cn: '产品编码/SKU'
    }
  },
  {
    value: 'product_variants.product_barcode',
    label: {
      en_us: 'Product Barcode',
      zh_cn: '产品条码'
    }
  },
  {
    value: 'chinese_name',
    label: {
      en_us: 'Chinese Name',
      zh_cn: '中文名称'
    }
  },
  {
    value: 'english_name',
    label: {
      en_us: 'English Name',
      zh_cn: '英文名称'
    }
  },
  {
    value: 'product_variants.sub_chinese_name',
    label: {
      en_us: 'Sub Chinese Name',
      zh_cn: '子产品中文名称'
    }
  },
  {
    value: 'product_variants.sub_english_name',
    label: {
      en_us: 'Sub English Name',
      zh_cn: '子产品英文名称'
    }
  },
]
// DS入库单页面字段选择映射表
export const addWarehouseFieldSelectMap = [

  {
    value: 'system_number',
    label: {
      en_us: 'System Number',
      zh_cn: '系统编号'
    }
  },
  {
    value: 'shipment_number',
    label: {
      en_us: 'Shipment Number',
      zh_cn: '运单编号'
    }
  },
  {
    value: 'reference_number',
    label: {
      en_us: 'Reference Number',
      zh_cn: '参考编号'
    }
  },
  {
    value: 'tags',
    label: {
      en_us: 'Tags',
      zh_cn: '标记'
    }
  },

]
// P入库单页面字段选择映射表
export const pAddWarehouseFieldSelectMap = [

  {
    value: 'warehousing_list',
    label: {
      en_us: 'Warehousing list',
      zh_cn: '入库清单'
    }
  },
  {
    value: 'shipment_number',
    label: {
      en_us: 'Shipment Number',
      zh_cn: '运单编号'
    }
  },
  {
    value: 'reference_number',
    label: {
      en_us: 'Reference Number',
      zh_cn: '参考编号'
    }
  },

]

// 入库单页面时间筛选映射表
export const addWarehouseTimeSelectMap = [
  {
    value: 'create_time',
    label: {
      en_us: 'Create Time',
      zh_cn: '创建时间'
    }
  },

]
// 入库页面审核状态映射表
// 草稿 - Draft
// 未收货 - Not Received
// 仓库已收货 - Warehouse Received
// 已质检 - Quality Checked
// 已上架 - Shelved
// 已完成 - Completed
// 作废 - Invalidated
export const addWarehouseStatusMap = [
  {
    value: 0,
    label: {
      en_us: 'Draft',
      zh_cn: '草稿'
    }
  },
  {
    value: 1,
    label: {
      en_us: 'Awaiting Receipt',
      zh_cn: '未收货'
    }
  },
  {
    value: 2,
    label: {
      en_us: 'Warehouse Received',
      zh_cn: '仓库已收货'
    }
  },
  {
    value: 3,
    label: {
      en_us: 'Inspected',
      zh_cn: '已质检'
    }
  },
  {
    value: 4,
    label: {
      en_us: 'Shelved',
      zh_cn: '已上架'
    }
  },
  {
    value: 5,
    label: {
      en_us: 'Completed',
      zh_cn: '已完成'
    }
  },
  {
    value: 6,
    label: {
      en_us: 'Invalidated',
      zh_cn: '作废'
    }
  },
]

export const pAddWarehouseStatusMap = [
  {
    value: 1,
    label: {
      en_us: 'Not received',
      zh_cn: '未收货'
    }
  },
  {
    value: 2,
    label: {
      en_us: 'Warehouse Received',
      zh_cn: '已收货'
    }
  },
  {
    value: 3,
    label: {
      en_us: 'Inspected',
      zh_cn: '已质检'
    }
  },
  {
    value: 4,
    label: {
      en_us: 'Shelved',
      zh_cn: '已上架'
    }
  },
  {
    value: 5,
    label: {
      en_us: 'Completed',
      zh_cn: '已完成'
    }
  },
  {
    value: 6,
    label: {
      en_us: 'Invalidated',
      zh_cn: '作废'
    }
  },
]

// 状态对应标记的颜色

export const statusMarkColorMap = {
  0: 'danger',
  1: 'danger',
  2: 'warning',
  3: 'warning',
  4: 'warning',
  5: 'success',
  6: 'info'

}
// p状态对应标记的颜色
export const pStatusMarkColorMap = {
  1: 'danger',
  2: 'warning',
  3: 'warning',
  4: 'warning',
  5: 'success',
  6: 'info'

}

// 订单页面状态映射表  我前端传的字符串数字   返回的是整型  所以我把value改为整数了
export const StockEntryStatusEnum =
  [
    {
      value: 0,
      label: {
        en_us: 'Draft',
        zh_cn: '草稿'
      }
    },
    {
      value: 1,
      label: {
        en_us: 'Confirmed',
        zh_cn: '已确认'
      }
    },
    {
      value: 2,
      label: {
        en_us: 'Processing',
        zh_cn: '处理中'
      }
    },
    {
      value: 3,
      label: {
        en_us: 'Awaiting Shipment',
        zh_cn: '待发货'
      }
    },
    {
      value: 4,
      label: {
        en_us: 'Unpaid',
        zh_cn: '未付款'
      }
    },
    {
      value: 9,
      label: {
        en_us: 'Paid',
        zh_cn: '已付款'
      }
    },
    {
      value: 5,
      label: {
        en_us: 'Partially Shipped',
        zh_cn: '部分发货'
      }
    },
    {
      value: 6,
      label: {
        en_us: 'Fully Shipped',
        zh_cn: '全部发货'
      }
    },
    {
      value: 7,
      label: {
        en_us: 'Issue',
        zh_cn: '问题单'
      }
    },
    {
      value: 8,
      label: {
        en_us: 'Returned',
        zh_cn: '已退货'
      }
    },
  ]

//日期类型映射表
export const dateTypeMap = [
  {
    value: 1,
    label: {
      en_us: 'Create Time',
      zh_cn: '创建时间'
    }
  },
  {
    value: 'receiving_goods',
    label: {
      en_us: 'Receiving Time',
      zh_cn: '收货时间'
    }
  },
  {
    value: 'delivery_time',
    label: {
      en_us: 'Delivery Time',
      zh_cn: '发货时间'
    }
  },
  {
    value: 'submission_confirmation_time',
    label: {
      en_us: 'Submission confirmation time',
      zh_cn: '提交确认时间'
    }
  },]


export const StockEntryStatusMap = {
  0: {
    en_us: 'Draft',
    zh_cn: '草稿'
  },
  1: {
    en_us: 'Confirmed',
    zh_cn: '已确认'
  },
  2: {
    en_us: 'Processing',
    zh_cn: '处理中'
  },
  3: {
    en_us: 'Awaiting Shipment',
    zh_cn: '待发货'
  },
  4: {
    en_us: 'Unpaid',
    zh_cn: '未付款'
  },
  5: {
    en_us: 'Partially Shipped',
    zh_cn: '部分发货'
  },
  6: {
    en_us: 'Fully Shipped',
    zh_cn: '全部发货'
  },
  7: {
    en_us: 'Issue',
    zh_cn: '问题件'
  },
  8: {
    en_us: 'Returned',
    zh_cn: '已退货'
  },
  9: {
    en_us: 'Paid',
    zh_cn: '已付款'
  }
}


// 订单状态对应标记的颜色
export const orderStatusMarkColorMap = {
  0: 'danger',
  1: 'warning',
  2: 'warning',
  3: 'warning',
  4: 'warning',
  5: 'warning',
  6: 'success',
  7: 'danger',
  8: 'info',
  9: 'warning'
}


//入库类型映射表
export const warehousingTypeList = [
  {
    label: {
      en_us: 'Purchase Receipt',
      zh_cn: '采购入库'
    },
    value: 1
  },
  {
    label: {
      en_us: 'Return to warehouse',
      zh_cn: '退货入库'
    },
    value: 2
  }
]
export const entryTypeMap = {
  1: {
    "en_us": "Purchase Receipt",
    'zh_cn': '采购入库'
  },
  2: {
    "en_us": 'Return to warehouse',
    'zh_cn': '退货入库'
  }
}
// 运输方式映射表
export const deliveryMethodList = [
  {
    label: {
      en_us: 'Express delivery',
      zh_cn: '快递'
    },
    value: 1
  },
  {
    label: {
      en_us: 'Their delivery',
      zh_cn: '自提'
    },
    value: 2
  },
  {
    label: {
      en_us: 'Sea Transportation',
      zh_cn: '海运'
    },
    value: 3
  },
  {
    label: {
      en_us: 'Air Transportation',
      zh_cn: '空运'
    },
    value: 4
  }
]
// 装箱类型
export const packingTypeList = [
  {
    label: {
      en_us: "Factory original",
      zh_cn: '出厂原装'
    },
    value: 1
  },
  {
    label: {
      en_us: "Mixed",
      zh_cn: '混装'
    },
    value: 2
  },
]
//入库分类映射表
export const entryCategoryList = [
  {
    label: {
      en_us: 'One piece for shipping',
      zh_cn: '一件代发'
    },
    value: 1
  },
  {
    label: {
      en_us: 'transport',
      zh_cn: '转运'
    },
    value: 2
  },
]
// 单位
export const unitOptions = [
  {
    label: {
      en_us: 'box',
      zh_cn: '箱'
    },
    value: 0
  },
]

// 订单类型
export const orderTypeList = [
  {
    value: 1,
    label: {
      en_us: 'One piece for shipping',
      zh_cn: '一件代发'
    }
  },
]
export const orderTypeMap = {
  1: {
    "en_us": "One piece for shipping",
    'zh_cn': '一件代发'
  },
}
// ds订单列表查询
export const orderFieldSelectMap = [
  {
    value: 'tracking_number',
    label: {
      en_us: 'Tracking Number',
      zh_cn: '物流号'
    }
  },
  {
    value: 'cs_reference',
    label: {
      en_us: 'Reference',
      zh_cn: '客户服务参考编号'
    }
  },
  {
    value: 'order_id',
    label: {
      en_us: 'Order Id',
      zh_cn: '订单Id'
    }
  },
  {
    value: 'sku',
    label: {
      en_us: 'Sku',
      zh_cn: '产品编码/SKU'
    }
  }
]

// p订单列表查询
export const pOrderFieldSelectMap = [
  {
    value: 'system_number',
    label: {
      en_us: 'System Number',
      zh_cn: '系统单号'
    }
  },

  {
    value: 'tracking_number',
    label: {
      en_us: 'Tracking number',
      zh_cn: '物流号'
    }
  },
  {
    value: 'transfer_number',
    label: {
      en_us: 'Transfer number',
      zh_cn: '转单号'
    }
  }, {
    value: 'cs_reference',
    label: {
      en_us: 'Reference',
      zh_cn: '参考编号'
    }
  }
]


export const verifyTypeMap = [
  {
    value: 1,
    label: {
      en_us: 'Company',
      zh_cn: '公司'
    }
  },
  {
    value: 2,
    label: {
      en_us: 'Personal',
      zh_cn: '个人'
    }
  }
]

// 联系人设置的搜索映射

export const contactFieldSelectMap = [
  {
    value: 'name',
    label: {
      en_us: 'Name',
      zh_cn: '姓名'
    }
  },
  {
    value: 'country',
    label: {
      en_us: 'Country',
      zh_cn: '国家'
    }
  },
  {
    value: 'state',
    label: {
      en_us: 'State',
      zh_cn: '省/州'
    }
  },
  {
    value: 'city',
    label: {
      en_us: 'City',
      zh_cn: '城市'
    }
  },
  {
    value: 'address',
    label: {
      en_us: 'Address',
      zh_cn: '地址'
    }
  },
  {
    value: 'postal_code',
    label: {
      en_us: 'Postal Code',
      zh_cn: '邮编'
    }
  },
  {
    value: 'phone',
    label: {
      en_us: 'Phone Number',
      zh_cn: '电话号码'
    }
  }
]
// 联系人类型映射表
export const contactTypeMap = [

  {
    value: "sender",
    label: {
      en_us: 'Sender',
      zh_cn: '发件人'
    }
  },
  {
    value: 'recipient',
    label: {
      en_us: 'Recipient',
      zh_cn: '收件人'
    }
  }
]

// webhooks类型映射表
export const webhooksTypeMap = [
  {
    value: 1,
    label: {
      en_us: 'Product Creation',
      zh_cn: '产品创建'
    }
  },
  {
    value: 2,
    label: {
      en_us: 'Product Update',
      zh_cn: '产品更新'
    }
  },
  {
    value: 3,
    label: {
      en_us: 'Product Removal',
      zh_cn: '产品移除'
    }
  },
  {
    value: 4,
    label: {
      en_us: 'Order Creation',
      zh_cn: '订单创建'
    }
  },
  {
    value: 5,
    label: {
      en_us: 'Order Update',
      zh_cn: '订单更新'
    }
  },
  {
    value: 6,
    label: {
      en_us: 'Order Removal',
      zh_cn: '订单移除'
    }
  },
  {
    value: 7,
    label: {
      en_us: 'Tracking Creation',
      zh_cn: '物流跟踪创建'
    }
  },
  {
    value: 8,
    label: {
      en_us: 'Tracking Update',
      zh_cn: '物流跟踪更新'
    }
  },
  {
    value: 9,
    label: {
      en_us: 'Tracking Removal',
      zh_cn: '物流跟踪移除'
    }
  }
]
// webhooks类型键值对映射表
export const webhooksTypeMapKeyValue = {
  1: {
    en_us: 'Product Creation',
    zh_cn: '产品创建'
  },
  2: {
    en_us: 'Product Update',
    zh_cn: '产品更新'
  },
  3: {
    en_us: 'Product Removal',
    zh_cn: '产品移除'
  },
  4: {
    en_us: 'Order Creation',
    zh_cn: '订单创建'
  },
  5: {
    en_us: 'Order Update',
    zh_cn: '订单更新'
  },
  6: {
    en_us: 'Order Removal',
    zh_cn: '订单移除'
  },
  7: {
    en_us: 'Tracking Creation',
    zh_cn: '物流跟踪创建'
  },
  8: {
    en_us: 'Tracking Update',
    zh_cn: '物流跟踪更新'
  },
  9: {
    en_us: 'Tracking Removal',
    zh_cn: '物流跟踪移除'
  }
}

// 订单标记映射表
export const orderMarkMap = [
  {
    value: '1',
    label: {
      en_us: 'Urgent',
      zh_cn: '紧急'
    }
  },
  {
    value: '2',
    label: {
      en_us: 'Important',
      zh_cn: '重要'
    }
  },
  {
    value: '3',
    label: {
      en_us: 'Normal',
      zh_cn: '一般'
    }
  },
  {
    value: '4',
    label: {
      zh_cn: '警告',
      en_us: 'Warning',

    }
  },
  {
    value: '5',
    label: {
      zh_cn: '正常',
      en_us: 'Normal',

    }
  }
]
export const orderStatusOptions = [{
  value: 1, label: {
    zh_cn: '未发货',
    en_us: 'Not Shipped'
  }
}, {
  value: 2, label: {
    zh_cn: '部分发货',
    en_us: 'Partially Shipped'
  }
}, {
  value: 3, label: {
    zh_cn: '全部发货',
    en_us: 'Fully Shipped'
  }
}]
export const orderStatusMap = {
  1: {
    zh_cn: '未发货',
    en_us: 'Not Shipped'
  },
  2: {
    zh_cn: '部分发货',
    en_us: 'Partially Shipped'
  },
  3: {
    zh_cn: '全部发货',
    en_us: 'Fully Shipped'
  }
}
// 对应颜色map
export const orderStatusColorMap = {
  1: 'danger',
  2: 'warning',
  3: 'success'
}
// 物流API查询字段映射表
export const logisticsApiFieldSelectMap = [
  {
    value: 'api_name',
    label: {
      en_us: 'Api Name',
      zh_cn: 'Api 名称'
    }
  },

]

// 物流渠道查询字段映射表
export const logisticsChannelFieldSelectMap = [
  {
    value: 'channel_name',
    label: {
      en_us: 'Channel Name',
      zh_cn: '渠道名称'
    }
  },

]

// 货币符号映射表
export const currencyCodes = [
  { label: '美元', symbol: '$', value: 'USD' },
  { label: '英镑', symbol: '£', value: 'GBP' },
  { label: '欧元', symbol: '€', value: 'EUR' },
  { label: '人民币', symbol: '¥', value: 'CNY' },
  { label: '卢布', symbol: '₽', value: 'RUB' }
]
// 货币符号映射表
export const currencySymbolMap = {
  'USD': '$',
  'GBP': '£',
  'EUR': '€',
  'CNY': '¥',
  'RUB': '₽'
}

// 仓储设置查询字段映射表
export const warehousingSettingFieldSelectMap = [
  {
    value: 'warehouse_name',
    label: {
      en_us: 'Warehouse Name',
      zh_cn: '仓储名称'
    }
  },
  {
    value: 'code_for_short',
    label: {
      en_us: 'Code for short',
      zh_cn: '简称代码'
    }
  },
]

export const partitionSettingSelectMap = [
  {
    value: 'section_name',
    label: {
      en_us: 'Partition name',
      zh_cn: '分区名称'
    }
  },
  {
    value: 'short_code',
    label: {
      en_us: 'Code for short',
      zh_cn: '简称代码'
    }
  },
]

export const shelvesSettingFieldSelectMap = [
  {
    value: 'shelf_name',
    label: {
      en_us: 'Shelf name',
      zh_cn: '货架名称'
    }
  },
  {
    value: 'short_code',
    label: {
      en_us: 'Code for short',
      zh_cn: '简称代码'
    }
  },
]
//货位 相关字段
export const cargoLocationSettingFieldSelectMap = [
  {
    value: 'location_number',
    label: {
      zh_cn: '货位号',
      en_us: 'Location number',

    }
  },
  {
    value: 'location_note',
    label: {
      zh_cn: '货位备注',
      en_us: 'Location note',

    }
  },
]

//货位类型
export const locationTypeMap = [
  {
    value: 0,
    label: {
      zh_cn: '拣货位',
      en_us: 'Picking location',

    }
  },
  {
    value: 1,
    label: {
      zh_cn: '存储位',
      en_us: 'Storage location',

    }
  },
  {
    value: 2,
    label: {
      zh_cn: '暂存位',
      en_us: 'Temporary storage location',
    }
  }
]

//尺寸类型
export const sizeTypeMap = [
  {
    value: 0,
    label: {
      zh_cn: '小货位',
      en_us: 'Small location',

    }
  },
  {
    value: 1,
    label: {
      zh_cn: '中货位',
      en_us: 'Medium location',

    }
  },
  {
    value: 2,
    label: {
      zh_cn: '大货位',
      en_us: 'Large location',
    }
  },
  {
    value: 3,
    label: {
      zh_cn: '托盘',
      en_us: 'Pallet',
    }
  }
]

// ABC分类
export const abcClassificationMap = [
  {
    value: 0,
    label: {
      zh_cn: '小货位',
      en_us: 'Small location',

    }
  },
  {
    value: 1,
    label: {
      zh_cn: '中货位',
      en_us: 'Medium location',

    }
  },
  {
    value: 3,
    label: {
      zh_cn: '大货位',
      en_us: 'Large location',
    }
  },
  {
    value: 4,
    label: {
      zh_cn: '托盘',
      en_us: 'Pallet',
    }
  }
]
// 库位产品规格

export const locationProductSpecificationMap = [
  {
    value: 0,
    label: {
      zh_cn: '小物品',
      en_us: 'Small items',

    }
  },
  {
    value: 1,
    label: {
      zh_cn: '中物品',
      en_us: 'Medium items',

    }
  },
  {
    value: 3,
    label: {
      zh_cn: '大物品',
      en_us: 'Large items',
    }
  },
  {
    value: 4,
    label: {
      zh_cn: '超大物品',
      en_us: 'Extra large items',
    }
  }
]

// 表格翻页
export const DIRECTION = {
  before: 'before',
  after: 'after'
}

// 纸张类型
export const paperTypeMap = [
  {
    value: 0,
    label: {
      zh_cn: '热敏',
      en_us: 'Thermal',
    }
  },
  {
    value: 1,
    label: {
      zh_cn: 'A4',
      en_us: 'A4',

    }
  }
]
// 打印类型
export const printTypeMap = [{
  value: 0,
  label: {
    zh_cn: '本地标签',
    en_us: 'Local Label',
  }
}, {
  value: 1,
  label: {
    zh_cn: '服务商标签',
    en_us: 'Service Provider Label',
  }
},
{
  value: 2,
  label: {
    zh_cn: '系统面单',
    en_us: 'System Sheet',
  }
},
{
  value: 3,
  label: {
    zh_cn: '上传标签',
    en_us: 'Upload Label',
  }
}
]

// 清除运单类型
export const clearOrderTypeMap = [
  {
    value: 0,
    label: {
      zh_cn: '运单号',
      en_us: 'Tracking Number',
    }
  },
  {
    value: 1,
    label: {
      zh_cn: '转单号',
      en_us: 'Transfer Number',
    }
  }
]

//发货单状态
export const deliveryStatusMap =
  [
    {
      value: 1,
      label: {
        zh_cn: '已接单',
        en_us: 'Order Received',

      }
    },
    {
      value: 2,
      label: {
        zh_cn: '已分配',
        en_us: 'Assigned',

      }
    },
    {
      value: 3,
      label: {
        zh_cn: '已生成波次',
        en_us: 'Wave Generated',

      }
    },
    {
      value: 4,
      label: {
        zh_cn: '已拣货',
        en_us: 'Picked',

      }
    },
    {
      value: 5,
      label: {
        zh_cn: '已复合',
        en_us: 'Compound',

      }
    },
    {
      value: 6,
      label: {
        zh_cn: '已称重',
        en_us: 'Weighed',

      }
    },
    {
      value: 7,
      label: {
        zh_cn: '已出库',
        en_us: 'Shipped',

      }
    },
    {
      value: 8,
      label: {
        zh_cn: '已打包',
        en_us: 'Packaged',

      }
    },
    {
      value: 0,
      label: {
        zh_cn: '作废',
        en_us: 'Invalidated',

      }
    },
  ]

// 是否有运单号
export const hasTrackingNumberMap = [
  {
    value: 0,
    label: {
      zh_cn: '无',
      en_us: 'No',

    }
  },
  {
    value: 1,
    label: {
      zh_cn: '有',
      en_us: 'Yes',

    }
  }
]

// 出库-一件代发的代发单状态字段映射
export const onePiceForShippingStatusMap = [

  {
    value: 0,
    label: {
      zh_cn: '确认',
      en_us: 'Confirm',

    }
  },
  {
    value: 1,
    label: {
      zh_cn: '配货',
      en_us: 'Distribution',

    }
  },
  {
    value: 2,
    label: {
      zh_cn: '待拣货',
      en_us: 'Awaiting picking',

    }
  },
  {
    value: 8,
    label: {
      zh_cn: '拣货完成',
      en_us: 'Picking completed',

    }
  },
  {
    value: 3,
    label: {
      zh_cn: '复核完成',
      en_us: 'Checked',

    }
  },

  {
    value: 4,
    label: {
      zh_cn: '待付款',
      en_us: 'Awaiting payment',

    }
  },
  {
    value: 5,
    label: {
      zh_cn: '已付款',
      en_us: 'Paid',

    }
  },
  {
    value: 6,
    label: {
      zh_cn: '已发货',
      en_us: 'Dispatched',

    }
  },
  {
    value: 7,
    label: {
      zh_cn: '删除',
      en_us: 'Delete',

    }
  },
  {
    value: 255,
    label: {
      zh_cn: '全部',
      en_us: 'All',

    }
  },
]

// 一件代发 代发单状态对应的颜色
export const onePiceForShippingStatusColorMap = {
  255: 'primary',
  0: 'warning',
  1: 'warning',
  2: 'warning',
  3: 'warning',
  4: 'warning',
  5: 'warning',
  6: 'success',
  7: 'danger',
  8: 'warning',
}

// p订单列表查询
export const pPrintOrderFieldSelectMap = [
  {
    value: 'wave_number',
    label: {
      zh_cn: '波次单号',
      en_us: 'Wave Number',

    }
  }
]

// p波次单状态
export const pPrintOrderStatus = [
  {
    value: 1,
    label: {
      zh_cn: '已生成',
      en_us: 'Generated',

    }
  },
  {
    value: 2,
    label: {
      zh_cn: '已拣货',
      en_us: 'Picked',

    }
  },
]

export const outputFormatMap = [
  {
    value: 0,
    label: {
      zh_cn: 'PDF',
      en_us: 'PDF',

    }
  }
]

export const numberTypeMap = [
  {
    value: 0,
    label: {
      zh_cn: '条码',
      en_us: 'Wave Number',

    }
  },
  {
    value: 1,
    label: {
      zh_cn: 'SKU',
      en_us: 'SKU',

    }
  },
  {
    value: 2,
    label: {
      zh_cn: '产品ID',
      en_us: 'Product ID',

    }
  }
]

// p订单列表查询
export const pOrderChangeOrderMap = [
  {
    value: 'bag_number',
    label: {
      zh_cn: '袋号',
      en_us: 'Bag number',

    }
  }
]
export const operateTypeOptions = [
  {
    value: 1,
    label: {
      zh_cn: '新装',
      en_us: 'New bag',

    }
  },
  {
    value: 2,
    label: {
      zh_cn: '续装',
      en_us: 'Continue bagging',

    }
  }
]

export const baggedStatusMap = [
  {
    value: 1,
    label: {
      en_us: 'Unloaded orders',
      zh_cn: '未装订单'
    }
  },
  // {
  //   value: 0,
  //   label: {
  //     en_us: 'Installed orders',
  //     zh_cn: '已装订单'
  //   }
  // },
]
export const baggedStatusColorMap = {
  0: 'success',
  1: 'danger'
}
// 二次分拣单号下拉列表
export const secondSortingOrderFieldSelectMap = [
  {
    value: 'tracking_number',
    label: {
      zh_cn: '运单号',
      en_us: 'Waybill number',
    }
  },
  {
    value: 'UPS_tracking_number',
    label: {
      zh_cn: 'UPS运单单号-自动截取',
      en_us: 'UPS waybill number-automatic interception',
    }
  },
  {
    value: 'Fedex_tracking_number',
    label: {
      zh_cn: 'Fedex运单单号-自动截取',
      en_us: 'Fedex waybill number-automatic interception',
    }
  },
  {
    value: 'USPS_tracking_number',
    label: {
      zh_cn: 'USPS运单单号-自动截取',
      en_us: 'USPS waybill number-automatic interception',
    }
  },
  {
    value: 'JNT_tracking_number',
    label: {
      zh_cn: 'JNT运单单号-自动截取',
      en_us: 'JNT waybill number-automatic interception',
    }
  }
]

// 复核完成状态映射表
export const secondSortingOrderStatusMap =
{
  0: {
    zh_cn: '未完成',
    en_us: 'Not checked',
  },
  1: {
    zh_cn: '已完成',
    en_us: 'Checked',
  }


}

// p一件代发列表查询
export const pOnePeiceForShippingFieldSelectMap = [
  {
    value: 'order_id',
    label: {
      en_us: 'Order Id',
      zh_cn: '订单号'
    }
  }, {
    value: 'cs_reference',
    label: {
      en_us: 'Reference',
      zh_cn: '参考编号'
    }
  },

  {
    value: 'tracking_number',
    label: {
      en_us: 'Tracking number',
      zh_cn: '物流号'
    }
  },
  {
    value: 'sku',
    label: {
      en_us: 'Sku',
      zh_cn: '产品编码/SKU'
    }
  },
  {
    value: 'barcode',
    label: {
      en_us: 'Barcode',
      zh_cn: '产品条码'
    }
  },
]

// p一件代发时间筛选类型
export const pOnePeiceForShippingTimeSelectMap = [
  {
    value: 'create_time',
    label: {
      en_us: 'Create Time',
      zh_cn: '创建时间'
    }
  },
  {
    value: 'confirm_time',
    label: {
      en_us: 'Confirm Time',
      zh_cn: '确认时间'
    }
  },
  {
    value: 'shipping_time',
    label: {
      en_us: 'Shipping time',
      zh_cn: '发货时间'
    }
  },

]

// 发货单列表中 发货单状态映射表
export const deliveryOrderStatusMap = [
  {
    value: 0,
    label: {
      en_us: 'Received',
      zh_cn: '已接单'
    }
  },
  {
    value: 1,
    label: {
      en_us: 'Assigned',
      zh_cn: '已分配'
    }
  },
  {
    value: 2,
    label: {
      en_us: 'Wave Generated',
      zh_cn: '已生成波次'
    }
  },
  {
    value: 3,
    label: {
      en_us: 'Picked',
      zh_cn: '已拣货'
    }
  },
  {
    value: 4,
    label: {
      en_us: 'Verified',
      zh_cn: '已复核'
    }
  },
  {
    value: 5,
    label: {
      en_us: 'Weighed',
      zh_cn: '已称重'
    }
  },
  {
    value: 6,
    label: {
      en_us: 'Shipped',
      zh_cn: '已出库'
    }
  },
  {
    value: 7,
    label: {
      en_us: 'Canceled',
      zh_cn: '已作废'
    }
  },
  {
    value: 8,
    label: {
      en_us: 'Packed',
      zh_cn: '打包完成'
    }
  },
  {
    value: 9,
    label: {
      en_us: 'Completed',
      zh_cn: '已完成'
    }
  },
  {
    value: 10,
    label: {
      en_us: 'Payment Completed',
      zh_cn: '已付款'
    }
  }
]
// 发货单列表中 发货单状态对应的颜色
export const deliveryOrderStatusColorMap = {
  0: 'warning',
  1: 'warning',
  2: 'warning',
  3: 'warning',
  4: 'warning',
  5: 'warning',
  6: 'warning',
  7: 'info',
  8: 'warning',
  9: 'success',
  10: 'warning'
}

// p发货单列表查询
export const deliveryOrderFieldSelectMap = [
  {
    value: 'order_id',
    label: {
      en_us: 'Order Id',
      zh_cn: '订单号'
    }
  },

  {
    value: 'tracking_number',
    label: {
      en_us: 'Tracking number',
      zh_cn: '物流号'
    }
  },
  {
    value: 'delivery_list_number',
    label: {
      en_us: 'Delivery list number',
      zh_cn: '发货单号'
    }
  }
]

//波次单列表字段
export const waveOrderFieldSelectMap = [
  {
    value: 'wave_number',
    label: {
      en_us: 'Wave Number',
      zh_cn: '波次单号'
    }
  }

]
//波次单状态映射表
export const waveOrderStatusSelectMap = [
  {
    value: 0,
    label: {
      en_us: 'Created',
      zh_cn: '已生成'
    }
  },
  {
    value: 1,
    label: {
      en_us: 'Pick Completed',
      zh_cn: '拣货完成'
    }
  }
]
// 波次单状态颜色对照
export const waveOrderStatusColorMap = {
  0: 'warning',
  1: 'success'
}

//装袋字段列表查询
export const baggingFieldSelectMap = [
  {
    value: 'logistic_service',
    label: {
      en_us: 'Logistic Service',
      zh_cn: '物流服务'
    }
  },
  {
    value: 'channel_code',
    label: {
      en_us: 'Channel Code',
      zh_cn: '渠道代码'
    }
  },
  {
    value: 'bag_number',
    label: {
      en_us: 'Bag Number',
      zh_cn: '袋号'
    }
  }
]

// 店铺管理查询字段映射
export const storeManagementFieldSelectMap = [
  {
    value: 'sku',
    label: {
      en_us: 'Sku',
      zh_cn: 'SKU'
    }
  },
  {
    value: 'title',
    label: {
      en_us: 'Title',
      zh_cn: '标题'
    }
  },
]

// 来源Map
export const souringMap = {
  0: {
    en_us: 'Web',
    zh_cn: 'Web'
  },
  1: {
    en_us: 'Shopify',
    zh_cn: 'Shopify'
  }
}

// 来源颜色Map
export const sourceColorMap = {
  0: "#40b5ff",
  1: "#94bd46"
}

// 邮件查询选项
export const queryTypeOptions = [
  {
    value: 'user_code',
    label: {
      en_us: 'Customer Code',
      zh_cn: '客户编号'
    },

  },
  {
    value: 'username',
    label: {
      en_us: 'Customer Name',
      zh_cn: '客户姓名'
    },

  }
]