# 依赖与协作

| 系统 | 本项目使用 | 不归本项目所有 |
| --- | --- | --- |
| `g2rain-department` | `/department/*` 管理 API | 部门、成员和数据权限的业务规则与持久化 |
| `g2rain-basis` | 资源下发、用户与机构辅助查询 | 用户/机构主数据和权限资源治理 |
| `g2rain-iam` | SSO、Token、公开密钥与客户端认证 | 会话、令牌签发和认证策略 |
| Gateway | `/api/` 代理、鉴权与转发 | 路由与服务端授权 |
| `g2rain-main-shell` | qiankun props、Locale、Token、路由事件 | 全局菜单、Tab 和子应用注册 |

前端依赖通过 `@shared`、`@/components`、`@platform` 和 `@runtime` 别名组织。新增代码遵循中央 Profile 的单向依赖，历史反向边记录在[架构偏差](deviations.md)。

