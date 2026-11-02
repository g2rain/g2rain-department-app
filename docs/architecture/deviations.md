# 架构偏差

本项目目标采用 `frontend-app 1.0.0`。下列事实来自当前源码与构建；“待迁移”不授权普通需求顺带重构。

| 偏差 | 证据 | 风险 | 状态 |
| --- | --- | --- | --- |
| 当前构建失败 | `src/platform/i18n/index.ts:52` 引用不存在的 `localeCode` | 无法形成可发布构建 | 阻断采用 |
| 包元数据仍指向模板 | `package.json` repository/homepage/description 指向 `g2rain-app-template` | 发布、溯源与用户认知错误 | 待修复 |
| Docker 未执行类型检查 | Dockerfile 直接调用 `npx vite build` | 镜像构建可能绕过 `vue-tsc` 错误 | 待修复 |
| Docker 未刷新资源配置 | Dockerfile 未运行 `npm run build:config` | 已跟踪 JSON 可能与页面/权限指令漂移 | 待评估 |
| components/platform/shared 存在反向依赖 | HTTP、Error、RemoteSelect、i18n、adapter 与 config-util 的实际 import | 分层耦合并可能形成循环 chunk | 待迁移 |
| API 权限检查直接放行 | `ResourceManager.hasApiPermission` 返回 `true` | 前端 API 权限呈现不可靠 | 已知限制 |
| API 资源生成未启用 | config-util 的 API parser/writer 未接入主流程 | 当前 `apiEndpoints` 数量为 0 | 已知限制 |
| 自动化测试缺失 | 无 test/lint 脚本，未发现测试套件 | 双模式和权限规则依赖人工回归 | 待补充 |
| 构建脚本注释残留模板名 | `build.sh` 头部示例仍写 app-template | 运维人员可能复制错误命令 | 待修复 |

