# 代码生成

页面骨架由 **g2rain-app-cli**（`g2rain-app generate`）生成，不再使用本仓内嵌引擎。

## 输入和输出

输入：`scripts/database.sql`

默认输出：

```text
src/views/<table>/
├── index.vue
├── api.ts
├── type.ts
└── mock.ts
```

同时更新 `src/views/route-map.ts`。

## 命令

```bash
# 推荐：直接把参数交给 node 包装脚本（避免 npm 吞掉 --tables / --no-*）
node ./scripts/run-generate.mjs --tables=department
node ./scripts/run-generate.mjs --tables=department,data_permission_model --skip-mock

# 或设置环境变量后：
# set G2RAIN_TABLES=department&& npm run build:generate
```

可选：`--skip-view` / `--skip-api` / `--skip-mock` / `--skip-route`（亦兼容 `--no-*`）；以及 `--cwd` / `--sql` / `--views` / `--route-map`。

依赖：`devDependency` `create-g2rain-app`（本地试点可为 `file:../g2rain-app-cli`）。

## 注意

- 生成结果需人工 Review；生成器会覆盖已有文件（route 已存在则跳过该项）。
- view 模板使用 i18n（`$t` / `@platform/i18n`）风格。
- 生成的页面从 `@g2rain/ui` 导入 `QueryForm` / `SortableTable` 等；本应用现有业务页可继续手写 `el-form`，新生成页按 CLI 模板即可。
