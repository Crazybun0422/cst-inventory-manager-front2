import i18n from "@/common/vuei18n"
// 批量修改订单时的选项
export const batchModifyOrderOptions = [{
  value: 'state',
  label: {
    zh_cn: '州/省',
    en_us: 'State'
  }
},
{
  value: 'zip_code',
  label: {
    zh_cn: '邮编',
    en_us: 'Zip Code'
  }
},
{
  value: 'recipient_phone',
  label: {
    zh_cn: '收件人电话',
    en_us: 'Recipient Phone'
  }

},
{
  value: 'ioss_number',
  label: {
    zh_cn: 'IOSS号',
    en_us: 'IOSS Number'
  }

}
]
// 批量修改订单时仓储的选项
export const batchModifyOrderWarehouseOptions = [{
  value: 'storage_uuid',
  label: {
    zh_cn: '仓储',
    en_us: 'Warehouse'
  }

}]

// 日志中显示修改字段对应的名称
export const logFieldMapping = {
  products: i18n.t('message.productManagement.product'),
  recipient_name: i18n.t('message.orderManagement.consignee'),
  country: i18n.t('message.orderManagement.receivingCountry'),
  state: i18n.t('common.stateProvince'),
  city: i18n.t('common.city'),
  address_1: i18n.t('message.orderManagement.address') + '1',
  address_2: i18n.t('message.orderManagement.address') + '2',
  recipient_phone: i18n.t('common.phone'),
  zip_code: i18n.t('common.zipCode'),
  house_number: i18n.t('message.orderManagement.roomNumber'),
  company_name: i18n.t('message.orderManagement.nameOfReceivingCompany'),
  recipient_email: i18n.t('common.email'),
  area: i18n.t('message.orderManagement.receivingRegion'),
  recipient_mobile: i18n.t('common.mobilePhone'),
  storage_uuid: i18n.t('message.myAccount.warehousing'),
  order_type: i18n.t('message.orderManagement.orderType'),
  order_status: i18n.t('common.status'),
  cs_reference: i18n.t('message.orderManagement.csReferenceNumber'),
  shipping_code: i18n.t('common.transportCode'),
  cod_type: i18n.t('message.orderManagement.cashOnDeliveryType'),
  cod_amount: i18n.t('message.orderManagement.cashOnDeliveryAmount'),
  ioss_number: i18n.t('message.orderManagement.iossNumber'),
  vat_number: i18n.t('message.orderManagement.vatNo'),
  id_card: i18n.t('message.orderManagement.idNo'),
  customer_remark: i18n.t('message.orderManagement.notes'),
}