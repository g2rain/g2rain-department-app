# 配置

| 变量 | 用途 |
| --- | --- |
| `VITE_APPLICATION_CODE` | Basis 资源加载使用的应用编码 |
| `VITE_CONTEXT_PATH` | Vite base、Router base 和代理前缀 |
| `VITE_BACKEND_ORIGIN` | 本地 Vite 代理目标 |
| `VITE_TOKEN_END_POINT`、`VITE_AUTH_END_POINT` | Token 与认证端点 |
| `VITE_SSO_BASE_URL`、`VITE_REDIRECT_URI` | 独立模式 SSO 与回调 |
| `VITE_MOCK_ENABLED` | Mock 开关，生产必须关闭 |
| `VITE_SERVER_PORT` | 开发服务端口 |
| `VITE_RUN_MODE` | `alone` 为独立模式；URL 参数优先 |
| `VITE_MAIN_SHELL_ORIGIN`、`VITE_MAIN_SHELL_REDIRECT_PREFIX` | 主应用网关跳转 |
| `VITE_I18N_TAGS` | 远程 i18n 消息标签 |

默认公开配置为应用编码 `g2rain-department-app`、Context Path `/department`、端口 `3002`、Mock 关闭。不要在文档、环境样例或日志中保存 Token 和密钥值。

容器 Nginx 模板需要 `GATEWAY_HOST`、`GATEWAY_PORT`、`IAM_HOST`、`IAM_PORT`、`SERVER_PORT`、`CONTEXT_PATH` 和 `SSO_BASE_URL`。

