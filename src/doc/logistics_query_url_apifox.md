# Logistics Query URL API (Apifox)

物流查询链接管理相关接口已整理为 OpenAPI 文档，可直接导入 Apifox 以便调试与录入。默认环境服务器地址建议配置为 `{{base_url}} = https://{your-domain}`，接口均位于 `/api/logistics/query-url/` 路径下。

## 响应规范

- 所有接口返回统一结构：

```json
{
  "code": 17000,
  "msg": {
    "zh_cn": "物流操作成功",
    "en_us": "Logistics operation successful"
  },
  "data": {}
}
```

- `code` 为业务状态码，常见取值：
  - `17000`：物流操作成功。
  - `17008`：请求方法未定义。
  - `17009`：物流操作失败（通常为权限或校验异常）。
  - `17013`：无权限操作该物流查询链接。
  - `17014`：未找到物流查询链接。
  - `17015`：物流查询链接名称或地址已存在。
- `msg` 提供中英文提示，`data` 内容因接口而异。
- 时间字段（如 `created_at`、`updated_at`）均为 ISO 8601 字符串。

## 数据结构

### LogisticsQueryUrl

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 链接记录唯一标识。 |
| `zh_name` | `string` | 中文名称。 |
| `en_name` | `string` | 英文名称。 |
| `query_url` | `string` | 查询地址。 |
| `is_default` | `boolean` | 是否为管理员预置的默认链接。 |
| `scope` | `string` | `default` 或 `custom`，与 `is_default` 一致。 |
| `owner_type` | `string` | `admin` 或 `user`。 |
| `owner_related_id` | `string/null` | 自定义链接归属的 `related_id`。默认链接为 `null`。 |
| `editable` | `boolean` | 当前登录用户是否可编辑。 |
| `deletable` | `boolean` | 当前登录用户是否可删除。 |
| `created_at` | `string` | 创建时间。 |
| `updated_at` | `string` | 最后更新时间。 |
| `deleted_at` | `string/null` | 删除时间，仅软删后返回。 |

> 说明：管理员可增删改查所有记录，普通用户仅能新增/删除自身创建的链接，且不可修改或删除管理员预置的默认链接。

## 接口清单

### GET `/api/logistics/query-url/list`
- 描述：查询物流查询链接列表，支持按范围筛选。
- Query 参数：
  - `scope` (可选)：`default`、`custom`、`all`。管理员默认 `default`，普通用户默认 `all`。
- 返回示例：
```json
{
  "code": 17000,
  "msg": {
    "zh_cn": "物流操作成功",
    "en_us": "Logistics operation successful"
  },
  "data": {
    "results": [
      {
        "id": "662e9d9f6f2b4c0012f0d123",
        "zh_name": "菜鸟全球邮",
        "en_name": "Cainiao Global",
        "query_url": "https://global.cainiao.com/track",
        "is_default": true,
        "scope": "default",
        "owner_type": "admin",
        "owner_related_id": null,
        "editable": true,
        "deletable": true,
        "created_at": "2024-05-01T08:00:00",
        "updated_at": "2024-05-01T08:00:00"
      }
    ],
    "total": 1
  }
}
```

### GET `/api/logistics/query-url/detail`
- 描述：查看单条物流查询链接详情。
- Query 参数：
  - `id` (**必填**)：链接 ID。
- 返回：`data` 为单条 `LogisticsQueryUrl` 对象。

### POST `/api/logistics/query-url/create`
- 描述：新建物流查询链接。
- 请求体：
```json
{
  "zh_name": "顺丰国际",
  "en_name": "SF Express",
  "query_url": "https://www.sf-international.com/cn/sc/dynamic_function/waybill/"
}
```
- 说明：
  - 管理员创建的记录标记为 `is_default = true`，普通用户创建的记录归属于当前登录用户。
  - 若名称或 URL 与现有记录冲突，将返回 `17015`。
- 返回：`data` 为新建记录。

### PUT `/api/logistics/query-url/update`
- 描述：修改物流查询链接。
- 请求体：
```json
{
  "id": "662e9d9f6f2b4c0012f0d123",
  "zh_name": "菜鸟物流",
  "en_name": "Cainiao",
  "query_url": "https://global.cainiao.com/"
}
```
- 说明：
  - 仅管理员可修改默认链接；普通用户仅能修改自己创建的自定义链接。
  - 冲突时返回 `17015`，未找到时返回 `17014`。
- 返回：`data` 为更新后的记录。

### DELETE `/api/logistics/query-url/delete`
- 描述：批量删除物流查询链接（软删除）。
- 请求体：
```json
{
  "ids": ["662e9d9f6f2b4c0012f0d123", "662e9da86f2b4c0012f0d124"]
}
```
- 说明：
  - 普通用户只能删除自己创建的自定义链接。
  - 管理员可删除任意记录。
- 返回：
```json
{
  "code": 17000,
  "msg": {
    "zh_cn": "物流操作成功",
    "en_us": "Logistics operation successful"
  },
  "data": {
    "deleted_ids": [
      "662e9d9f6f2b4c0012f0d123",
      "662e9da86f2b4c0012f0d124"
    ]
  }
}
```

## Apifox 导入提示

1. 在 Apifox 中新建或选择项目，点击「导入」>「OpenAPI (JSON/YAML)」。
2. 将本仓库中 `logistics_query_url` 相关接口的 OpenAPI 片段粘贴，或直接使用上述接口配置手动录入。
3. 建议为管理员与普通用户分别配置环境变量：
   - `Authorization`：对应登录获取的 Token。管理员环境使用超级管理员账号，普通环境使用普通账号。
   - `related_id`：普通用户在调试自定义链接时需用到，可在 Apifox 环境变量中维护。
4. 导入后，可使用 Apifox 的「调试」功能快速验证增删改查流程，或在「数据模型」中补充示例数据以便协作。

