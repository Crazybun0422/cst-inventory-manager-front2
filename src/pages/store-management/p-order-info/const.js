/**
 * @file 订单信息常量
 * @date 2024/03/17
 */

import VueI18n from '@/common/vuei18n.js'

// 支付状态
export const EWIS_PAYMENT_STATUS_VALUE = {
  paid: 'PAID', // 已支付
  refunded: 'REFUNDED', // 退款
  partiallyRefunded: 'PARTIALLY_REFUNDED', // 部分退款
}

export const EWIS_PAYMENT_STATUS_TEXT = {
  [EWIS_PAYMENT_STATUS_VALUE.paid]: VueI18n.t('message.orderInfo.paid'), // 已支付
  [EWIS_PAYMENT_STATUS_VALUE.refunded]: VueI18n.t('message.orderInfo.refunded'), // 退款
  [EWIS_PAYMENT_STATUS_VALUE.partiallyRefunded]: VueI18n.t('message.orderInfo.partiallyRefunded'), // 部分退款
}

export const EWIS_PAYMENT_STATUS_TYPE = {
  [EWIS_PAYMENT_STATUS_VALUE.paid]: 'success', // 已支付
  [EWIS_PAYMENT_STATUS_VALUE.refunded]: 'warning', // 退款
  [EWIS_PAYMENT_STATUS_VALUE.partiallyRefunded]: 'success', // 部分退款
}

export const EWIS_PAYMENT_STATUS = {
  value: EWIS_PAYMENT_STATUS_VALUE,
  text: EWIS_PAYMENT_STATUS_TEXT,
  type: EWIS_PAYMENT_STATUS_TYPE,
}

// 订单状态
export const EWIS_FULFILLMENT_STATUS_VALUE = {
  fulfilled: 'FULFILLED', // 完成
  unfulfilled: 'UNFULFILLED', // 未完成
  partiallyFulfilled: 'PARTIALLY_FULFILLED', // 部分完成
}

export const EWIS_FULFILLMENT_STATUS_TEXT = {
  [EWIS_FULFILLMENT_STATUS_VALUE.fulfilled]: VueI18n.t('message.orderInfo.fulfilled'), // 完成
  [EWIS_FULFILLMENT_STATUS_VALUE.unfulfilled]: VueI18n.t('message.orderInfo.unfulfilled'), // 未完成
  [EWIS_FULFILLMENT_STATUS_VALUE.partiallyFulfilled]: VueI18n.t('message.orderInfo.partiallyFulfilled'), // 部分完成
}

export const EWIS_FULFILLMENT_STATUS_TYPE = {
  [EWIS_FULFILLMENT_STATUS_VALUE.fulfilled]: 'success', // 已支付
  [EWIS_FULFILLMENT_STATUS_VALUE.unfulfilled]: 'danger', // 退款
  [EWIS_FULFILLMENT_STATUS_VALUE.partiallyFulfilled]: 'success', // 部分退款
}

export const EWIS_FULFILLMENT_STATUS = {
  value: EWIS_FULFILLMENT_STATUS_VALUE,
  text: EWIS_FULFILLMENT_STATUS_TEXT,
  type: EWIS_FULFILLMENT_STATUS_TYPE,
}