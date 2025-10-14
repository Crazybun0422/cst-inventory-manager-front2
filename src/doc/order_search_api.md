# Order Keyword Search APIs

面向订单检索新增两个接口，用于在 Tracking Number、Reference、Order ID 与 SKU 四个字段中执行模糊匹配，并支持返回符合条件订单的详细列表与状态统计。

## GET `/api/order/search-order-by-keyword`

根据关键字分页查询订单列表。查询条件遵循现有 `query-order` 接口的规则，在此基础上追加 `keyword` 模糊搜索能力。

### 请求参数

| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `keyword` | string | 是 | 检索关键字，会自动去除首尾空格并用于模糊匹配。大小写不敏感。 |
| `page_number` | integer | 是 | 页码，从 1 开始。 |
| `page_size` | integer | 是 | 每页返回的订单数量。 |
| `provider_uuid` | string | 条件必填 | 当登录用户为 Provider / Operator 时必填，用于限定可访问的客户范围。Drop Shipper 用户无需传递。 |
| 其他查询条件 | - | 否 | 与 `query-order` 一致，例如 `order_status`、`storage_uuid`、时间区间等，会与关键字结果取交集。 |

### 返回体示例

```json
{
  "code": 11000,
  "msg": {
    "zh_cn": "订单操作成功",
    "en_us": "Order operation successful"
  },
  "data": {
    "keyword": "AB12",
    "page_number": 1,
    "page_size": 20,
    "results": [
      {
        "order_id": "ORD240101000001",
        "order_status": 20,
        "cs_reference": "REF-AB12-01",
        "shipping_statuses": [
          {
            "tracking_number": "TRK-AB12-001",
            "shipping_company": "DHL"
          }
        ]
      }
    ],
    "total": 3
  }
}
```

### 行为说明

- `keyword` 会被转义后构建为正则表达式，支持匹配 Tracking Number、Reference、Order ID 与 SKU 的任意部分。
- 返回结构与 `query-order` 一致，`results` 为订单列表，`total` 为在分页前命中的总订单数量。
- 所有额外的查询条件（如状态、仓库、时间区间、`tracking_number` 等物流筛选项）会先过滤可访问订单，再与关键字命中结果取交集。
- Drop Shipper 用户仅能看到自身订单；Provider / Operator 会根据 `provider_uuid` 限定其名下客户。
- SKU 检索通过订单与产品、产品变体的关联管道执行，确保能够命中变体级别的 SKU 信息。

## GET `/api/order/count-order-by-keyword`

对关键字命中的订单进行状态统计，统计规则与 `query-count-status` 相同，但支持关键字模糊匹配。

### 请求参数

| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `keyword` | string | 是 | 检索关键字，匹配逻辑同上。 |
| `provider_uuid` | string | 条件必填 | 当用户为 Provider / Operator 时必须提供。 |
| 其他查询条件 | - | 否 | 与 `query-count-status` 相同，会与关键字结果共同作用。 |

### 返回体示例

```json
{
  "code": 11000,
  "msg": {
    "zh_cn": "订单操作成功",
    "en_us": "Order operation successful"
  },
  "data": [
    {"order_status": 10, "count": 5},
    {"order_status": 20, "count": 8},
    {"order_status": 30, "count": 1}
  ]
}
```

### 行为说明

- 统计仅针对关键字命中的订单执行，支持同样的角色权限与附加筛选条件（包括物流条件）。
- 若没有任何订单匹配关键字，则返回 `data: []`。

