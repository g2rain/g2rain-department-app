# 本地开发

环境要求：Node.js 22+、npm，以及可访问的 main-shell、IAM、Gateway、Basis 与 department 服务。

```bash
npm ci --legacy-peer-deps
npm run dev
```

默认应用编码为 `g2rain-department-app`，Context Path `/department`，开发端口 `3002`，Mock 默认关闭。独立模式通过 `?mode=alone` 或 `VITE_RUN_MODE=alone` 启用；默认空模式表示主应用集成意图。

联调需覆盖独立 SSO/资源加载，以及 qiankun 的 Token、Locale、初始路由、路由同步和卸载。提交前运行 `npm run build`；当前已知 i18n TypeScript 错误会阻断构建。

