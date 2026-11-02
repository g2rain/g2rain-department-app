# 资源配置生成

```bash
npm run build:config
```

工具读取 `src/views/route-map.ts` 和 `src/views/**/*.vue` 的权限指令，覆盖生成：

- `src/shared/config-util/config/resources.json`
- `src/shared/config-util/config/pages.json`
- `src/shared/config-util/config/page-elements.json`

这些 JSON 当前被 Git 跟踪。现有文件包含 8 个页面、26 个页面元素和 0 个 API 端点。API parser 和 writer 虽存在，但主流程已注释，因此不能把本命令当作完整 API 权限生成器。

修改路由或权限指令后运行命令并审查全部 JSON 差异，再与 Basis 资源登记保持一致。当前 Dockerfile不会自动刷新这些文件。

