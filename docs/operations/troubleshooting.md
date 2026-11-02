# 故障排查

| 现象 | 检查 |
| --- | --- |
| `npm run build` 报 `localeCode` 未定义 | `src/platform/i18n/index.ts` 的加载失败降级分支 |
| 子应用无法装载 | main-shell entry/activeRule、`/department` Context Path、静态资源地址与 CORS |
| 直链未进入应用 | 是否缺少 `mode=alone`；默认集成意图会跳主应用网关 |
| 页面为空 | Basis 资源返回的 linkPath、状态与本地 route-map 是否一致 |
| 按钮权限异常 | page-elements JSON、权限编码、资源下发和当前前端 provider |
| API 权限看似全部通过 | 当前 `hasApiPermission` 固定返回 true，检查服务端授权结果 |
| 部门请求 404/401 | `/department` 路由、Gateway 配置、Token 和后端部署 |
| 容器成功但源码构建失败 | Docker 当前绕过 vue-tsc；必须另跑 `npm run build` |
| 资源 JSON 漂移 | Docker 不自动生成；手工执行并审查 `npm run build:config` |
| 签名/密钥端点失败 | key 文件挂载、格式、权限和 luaossl 加载状态 |

