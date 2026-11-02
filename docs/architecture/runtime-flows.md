# 运行流程

## 独立模式

1. URL `mode=alone` 或 `VITE_RUN_MODE=alone` 选择独立模式。
2. 应用初始化 Store、i18n、Element Plus、权限插件和 HTTP。
3. 应用自行完成 IAM SSO/Token，再从 `/basis/authority/resources` 加载资源。
4. 使用 Web History，将获准 linkPath 映射到本地 route-map 页面。

## 集成模式

1. 默认空模式表达集成意图；未处于 qiankun 时直链应跳 main-shell 网关。
2. qiankun mount 通过 props 注入 `appKey`、Token、Client、Locale 与初始路由。
3. 应用先建立系统路由，再初始化 Token、资源和 Memory History 路由。
4. 路由变化通知 main-shell；update 刷新 Token、Locale 和路由。
5. unmount 按实例清理 Vue、Router、shell 和 Token 失效监听。

## 数据权限配置链路

管理端配置顺序应与后端策略语义一致：

1. `data_permission_model` / `field`：声明模块、表与可参与规则的字段。
2. `data_permission_meta`：为机构绑定模型并设置默认读写位。
3. `data_permission_group`：按所属部门路径创建权限组。
4. `data_permission_group_user_relation`：分配小组成员。
5. `data_permission_other`：在组上配置相对默认范围的例外规则。

运行时由业务服务经 starter 调用 department `policy_resolve` 消费结果；前端不执行行级隔离。页面约定见 [业务页面约定](../development/views-conventions.md)。

当前 i18n 加载失败的降级分支存在 TypeScript 编译错误，修复前构建无法完成。

