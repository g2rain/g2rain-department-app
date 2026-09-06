# 组件与平台能力

## components

- `http`：Axios Client、认证拦截器、刷新屏障、签名、参数序列化和 Mock。
- `permission`：页面元素和 API 权限接口。
- `RemoteSelect`：用户、机构、字典、通用远程选择与状态开关。
- `QueryForm`、`TableSort`：查询表单、列配置与排序。
- `micro-app`：主子应用消息原语与窗口事件适配。
- `error`、`loading`：统一错误模型、呈现与加载状态。

## platform/runtime

platform 提供 Store、i18n、Locale 和 qiankun 适配；runtime 编排认证、HTTP、资源、路由和实例 shell。当前部分基础组件与 platform 相互依赖，新增能力必须优先通过接口注入收敛边界。

