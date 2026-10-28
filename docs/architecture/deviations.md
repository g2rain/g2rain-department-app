# 架构偏差

本项目目标采用 `frontend-app 1.0.0`。下列事实来自当前源码与构建；“待迁移”不授权普通需求顺带重构。

| 偏差 | 证据 | 风险 | 状态 |
| --- | --- | --- | --- |
| Docker 未执行类型检查 | Dockerfile 直接调用 `npx vite build` | 镜像构建可能绕过 `vue-tsc` 错误 | 待修复 |
| Docker 未刷新资源配置 | Dockerfile 未运行 `npm run build:config` | 已跟踪 JSON 可能与页面/权限指令漂移 | 待评估 |
| platform 反向依赖 runtime | i18n / locale.store / message-handlers 仍调 runtime HTTP（与 member 同构） | 分层耦合 | 待迁移 |
| API 权限检查直接放行 | `ResourceManager.hasApiPermission` 返回 `true` | 前端 API 权限呈现不可靠 | 已知限制 |
| API 资源生成未启用 | `create-g2rain-app build-config` 不写 apiEndpoints | 当前 `apiEndpoints` 数量为 0 | 已知限制 |
| 自动化测试缺失 | 无 test/lint 脚本，未发现测试套件 | 双模式和权限规则依赖人工回归 | 待补充 |
| UserSelect 依赖 views API | `components/UserSelect.vue` 调用 `views/user/api` | components→views 反向依赖（域组件，appkit 暂无等价物） | 已知保留 |
