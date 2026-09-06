# 测试

## 当前状态

- `package.json` 没有 test 或 lint 脚本。
- 未发现自动化测试套件；`test.api.ts` 是 Mock 数据，不是测试。
- 2026-09-06 执行 `npm run build`，在 `vue-tsc` 阶段失败：`src/platform/i18n/index.ts:52` 引用了不存在的 `localeCode`。
- Vite 构建因此未执行，自动化测试数为 0。

## 最低验证

| 变更 | 验证 |
| --- | --- |
| 任意源码 | `npm run build` |
| 页面/API | 查询、保存、删除、状态与错误态人工验证 |
| 部门关系 | 树结构、子部门、批量关联和重复成员 |
| 数据权限 | 模型字段、元数据、小组、成员与规则构建/解析 |
| 路由/权限 | 运行并审查 `npm run build:config` |
| runtime/platform | 独立和 qiankun 集成模式回归 |
| 部署 | 镜像、Context Path、代理、SSO 和 SPA 刷新 |

