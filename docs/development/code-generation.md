# 代码生成

```bash
npm run build:generate -- --tables=department,data_permission_model
```

- 输入：必填 `--tables=<逗号分隔表名>` 或 `--tables <列表>`。
- 表结构：`src/shared/generator/database.sql`，当前包含八个部门/数据权限表。
- 默认输出：`src/views/<table>/index.vue`、`api.ts`、`type.ts`、`mock.ts`，并更新 `route-map.ts`。
- 开关：`--no-view`、`--no-api`、`--no-mock`、`--no-route`。

生成器直接写文件，会覆盖已有的定制页面和 API。执行前必须保存工作区，使用 `--no-*` 缩小范围，生成后逐文件审查并运行构建。生成结果不是架构事实。

