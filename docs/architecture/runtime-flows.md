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

当前 i18n 加载失败的降级分支存在 TypeScript 编译错误，修复前构建无法完成。

