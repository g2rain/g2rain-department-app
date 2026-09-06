# 部署

本地发布构建应先执行：

```bash
npm ci --legacy-peer-deps
npm run build
```

当前 `npm run build` 因 i18n TypeScript 错误失败，修复前不得宣称可发布。

镜像脚本支持：

```bash
./build.sh --image g2rain/g2rain-department-app --tag <tag> --build-mode production
```

Docker 使用 Node 22 构建，再由 OpenResty 提供静态资源、Gateway/IAM 代理、公开密钥读取和签名辅助端点。注意当前 Dockerfile 直接执行 `npx vite build`，会绕过 `vue-tsc`，也不会运行 `build:config`；镜像成功不代表 Profile 构建验证通过或资源配置最新。

容器声明 8080，但 Nginx 默认监听 `SERVER_PORT=80`，部署平台需显式映射。发布前验证 Context Path、SSO、Gateway/IAM、资源 JSON、密钥挂载、SPA 刷新与静态缓存。

