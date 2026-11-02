# g2rain-department-app Agent Instructions

本文件是 AI Coding 在本项目中的执行入口。项目事实位于 `docs/project.yaml`，文档入口位于 `docs/index.md`。

## 项目定位

- 类型：Vue 3 部门与数据权限管理微前端 App
- 中央 Profile：`frontend-app 1.0.0`
- 固定基线：`architecture-v1.1.0`
- 当前采用状态：planned，构建失败
- 架构偏差：`docs/architecture/deviations.md`

项目负责部门、部门用户关系、数据权限模型/字段/元数据/小组/成员和规则配置的管理界面。服务端数据和规则属于 `g2rain-department`，认证属于 IAM，转发与最终授权属于 Gateway，全局入口属于 main-shell。

## 开始前

读取 `docs/project.yaml`、中央 Profile、架构偏差、分层与依赖、测试规范、完成定义以及任务对应需求。

## 执行规则

- 目标依赖方向为 `views -> runtime -> platform -> components -> shared`；组合入口为 `src/main.ts` 和 `src/App.vue`。
- 新代码不得扩大 `components -> platform/runtime`、`platform -> runtime`、`shared -> runtime/components/platform` 等已登记偏差。
- 页面、API、类型和页面专用工具放在 `src/views/<domain>`，并同步 `src/views/route-map.ts` 与 Basis 资源。
- 同时评估 qiankun 集成与独立模式；实例按 `appKey` 隔离并在卸载时清理。
- 前端页面元素权限不能替代服务端授权；当前 API 权限检查直接返回 `true`。
- 数据权限规则编辑器必须校验字段、操作符和值，并与后端契约保持一致；前端不是权限判定权威。
- `build:generate` 会覆盖 view、API、type、mock 和 route-map；执行前保存工作，执行后逐文件审查。
- `build:config` 会覆盖已跟踪的资源 JSON；当前 API parser 未接入主流程，`apiEndpoints` 为空。
- 不提交 Token、私钥、真实凭据或生产敏感地址；生产环境不得启用 Mock。
- 不修改 README；README 更新使用单独的 `generate` 命令。

## 完成前

先修复或确认已知构建错误，再运行 `npm run build`。涉及资源时审查 `npm run build:config` 输出；涉及运行时分别验证独立和集成模式；按 `docs/development/definition-of-done.md` 报告未验证项。

