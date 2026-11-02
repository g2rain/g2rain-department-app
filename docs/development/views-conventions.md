# 业务页面约定

当前本地路由覆盖：

| 页面 | 主要用例 |
| --- | --- |
| `department` | 部门层级、新增子部门、状态、删除和人员关联 |
| `department_user_relation` | 部门成员查询、批量关联和移除 |
| `data_permission_model` / `field` | 权限模型及条件字段定义 |
| `data_permission_meta` | 机构内策略元数据：绑定模型、默认读写位（映射运行时 `groupRead`/`groupWrite`）与状态 |
| `data_permission_group` / `group_user_relation` | 权限小组（挂所属 `deptPath`）、成员和状态；用于命中 Other 规则，不是“进组才有部门范围”的门控 |
| `data_permission_other` | 为「meta + 权限组」配置字段级例外规则（读写位 + 规则表达式） |

`user`、`organ`、`dict` 为辅助查询模块，不是 route-map 中的独立页面。

## 数据权限配置意图

后端当前语义是 **meta 默认部门范围 + 权限组挂例外规则**。配置与联调时注意：

1. 先配模型/字段，再配 meta 默认读写，再按部门路径建组并加人，最后在组上配 Other 规则。
2. 组的 `deptPath` 必须与用户主体增强得到的路径**精确一致**，Other 才会参与 `policy_resolve`。
3. 不要假设“未加入任何权限组 ⇒ 看不到部门数据”；部门范围由 meta 读写位 + 消费方隔离决定。
4. Other 规则应通过字段选择器生成 `=` / `IN` 条件，避免手写任意 SQL。

权威说明见后端 `g2rain-department` 的 `docs/design/data-permission-policy.md`。

页面修改至少验证查询、保存、删除、状态变更、权限不可见/不可用、空数据和错误反馈。部门树需验证父子关系；成员关联需防重复；权限规则需验证解析、构建和后端契约。

