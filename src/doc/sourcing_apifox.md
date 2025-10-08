# Sourcing API (Apifox)

Sourcing 相关接口已同步至 Apifox，涵盖用户侧与管理端常用能力。

## 数据结构与通用约定

- 所有接口均返回统一响应格式：

```json
{
  "code": 13000,
  "msg": {
    "zh_cn": "操作成功",
    "en_us": "Operation successful"
  },
  "data": {}
}
```

- `code` 为业务状态码，常见取值：
  - `13000`：操作成功。
  - `13001`：Sourcing 操作失败（通常为服务端异常）。
  - `13002`：未找到对应单据。
  - `13003`：状态值非法。
  - `13004`：条目校验不通过。
  - `13005`：请求参数非法。
- `msg` 提供中英文文案，`data` 结构因接口而异。
- 时间字段（如 `created_at`、`updated_at`）返回格式为 `YYYY-MM-DD HH:MM:SS`。

### Sourcing 主体结构

| 字段                | 类型               | 说明                                                        |
|-------------------|------------------|-----------------------------------------------------------|
| `sourcing_id`     | `string`         | Sourcing 单唯一标识，系统默认生成 UUID，可外部自定义。                        |
| `related_id`      | `string`         | 单据所属关联 ID（用户侧为当前登录用户的 `related_id`）。                      |
| `user_code`       | `string`         | 归属用户编码。未显式传入时，会回退到 `UserProviderMap` 中 `CUSTOMER` 关系的默认值。 |
| `status`          | `string`         | 单据状态，见下文“状态枚举”。                                           |
| `purchase_reason` | `string`         | 采购理由，可选。                                                  |
| `notes`           | `string`         | 备注信息，可选。                                                  |
| `items`           | `SourcingItem[]` | 单据条目列表，结构见下文。                                             |
| `deleted`         | `number`         | 软删除标记，`0` 表示有效。                                           |
| `created_at`      | `string`         | 创建时间。                                                     |
| `updated_at`      | `string`         | 最后更新时间。                                                   |

### SourcingItem 结构

| 公共字段 | 类型 | 说明 |
| --- | --- | --- |
| `item_id` | `string` | 条目 ID，创建时可省略，系统自动生成。 |
| `source_type` | `string` | 货源类型，见下文“条目类型枚举”。部分接口在部分更新场景下可省略。 |
| `quote` | `string` | 客户端报价，必填。 |
| `feedback_quote` | `string` | 供应商反馈报价，可选。 |
| `created_at` | `string` | 条目创建时间。 |
| `updated_at` | `string` | 条目更新时间。 |

| `source_type` | 额外字段 | 说明 |
| --- | --- | --- |
| `url` | `source_url` (`string`) | 必填，目标商品链接。 |
| `image` | `image` (`string`)、`description` (`string`) | 均为必填，分别为图片地址与描述。 |
| `product` | `product_id` (`string`) | 必填，内部商品 ID。 |

### 枚举说明

- 状态枚举（`status`）：`draft`、`submitted`、`sourcing`、`pending_confirmation`、`completed`。
- 条目来源类型（`source_type`）：`url`、`image`、`product`。

## 用户侧接口

### GET `/api/sourcing`
- 描述：分页查询当前登录用户的 sourcing 单。
- 请求参数：
  - `page_number` (query，可选，默认 `1`)
  - `page_size` (query，可选，默认 `10`)
  - `status` (query，可选，支持 `draft/submitted/sourcing/pending_confirmation/completed`)
- 返回：
```json
{
  "code": 13000,
  "msg": {
    "zh_cn": "获取列表成功",
    "en_us": "List fetched successfully"
  },
  "data": {
    "items": [
      {
        "sourcing_id": "SRC-202401010001",
        "status": "submitted",
        "purchase_reason": "价格最低",
        "user_code": "10001",
        "related_id": "rel_123",
        "created_at": "2024-01-01 10:00:00",
        "items": [
          {
            "item_id": "item-1",
            "source_type": "url",
            "source_url": "https://example.com/product",
            "quote": "9.80",
            "feedback_quote": "9.50"
          }
        ]
      }
    ],
    "total": 1,
    "page_number": 1,
    "page_size": 10
  }
}
```

### POST `/api/sourcing`
- 描述：创建 sourcing 单，支持一次录入多个条目。
- 请求体示例：
```json
{
  "status": "submitted",
  "purchase_reason": "价格最低",
  "items": [
    {
      "source_type": "url",
      "source_url": "https://example.com/product",
      "quote": "9.80",
      "feedback_quote": "9.50"
    },
    {
      "source_type": "image",
      "image": "https://static.example.com/img.png",
      "description": "24cm 红色陶瓷碗",
      "quote": "11.00"
    },
    {
      "source_type": "product",
      "product_id": "PD-10001",
      "quote": "8.90"
    }
  ]
}
```
- 返回：
```json
{
  "code": 13000,
  "msg": {
    "zh_cn": "操作成功",
    "en_us": "Operation successful"
  },
  "data": {
    "sourcing_id": "a3d58a4a-74a9-4a8a-8fb9-b8746f331d73",
    "status": "submitted"
  }
}
```

### PUT `/api/sourcing/{sourcing_id}`
- 描述：更新 sourcing 单，需传入需要修改的字段，`items` 为覆盖式更新。
- 请求体示例：
```json
{
  "status": "pending_confirmation",
  "purchase_reason": "价格最低",
  "items": [
    {
      "item_id": "item-1",
      "source_type": "url",
      "source_url": "https://example.com/new-product",
      "quote": "9.60",
      "feedback_quote": "9.30"
    }
  ]
}
```

### DELETE `/api/sourcing/{sourcing_id}`
- 描述：删除 sourcing 单（软删除）。

## 管理端接口

### GET `/api/admin/sourcing`
- 描述：分页查询所有用户的 sourcing 单。
- 请求参数：
  - `page_number`、`page_size`
  - `related_id`、`user_code`（可选过滤）
  - `status`、`sourcing_id`
  - `start_date`、`end_date`（YYYY-MM-DD，过滤创建时间）

### GET `/api/admin/sourcing/{sourcing_id}`
- 描述：查看单个 sourcing 单详情。

### PATCH `/api/admin/sourcing/{sourcing_id}`
- 描述：更新指定 sourcing 单的部分字段。
- 请求体示例：
```json
{
  "status": "sourcing",
  "current_related_id": "rel_123",
  "items": [
    {
      "item_id": "item-1",
      "feedback_quote": "9.20"
    }
  ]
}
```
- 说明：
  - `current_related_id` 为可选，若传入则仅当单据仍属于该用户时才会更新。
  - `items` 支持部分更新，未提供的字段保持不变；若传入新的条目（无 `item_id`），则需包含完整字段。
