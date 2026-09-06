# 业务页面约定

当前本地路由覆盖：

| 页面 | 主要用例 |
| --- | --- |
| `department` | 部门层级、新增子部门、状态、删除和人员关联 |
| `department_user_relation` | 部门成员查询、批量关联和移除 |
| `data_permission_model` / `field` | 权限模型及条件字段定义 |
| `data_permission_meta` | 数据权限元数据/策略维护与状态 |
| `data_permission_group` / `group_user_relation` | 权限小组、成员和状态管理 |
| `data_permission_other` | 基于元数据字段构建和保存规则配置 |

`user`、`organ`、`dict` 为辅助查询模块，不是 route-map 中的独立页面。

页面修改至少验证查询、保存、删除、状态变更、权限不可见/不可用、空数据和错误反馈。部门树需验证父子关系；成员关联需防重复；权限规则需验证解析、构建和后端契约。

