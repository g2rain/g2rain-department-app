# 测试

## 当前状态

- `package.json` 没有 test 或 lint 脚本。
- 未发现自动化测试套件；`test.api.ts` 是 Mock 数据，不是测试。
- 当前没有独立自动化测试套件，自动化测试数为 0；`npm run build` 是类型检查与 Vite 构建的完整可用验证。
- 发布准备工作流在干净的 GitHub runner 上执行 `npm ci --legacy-peer-deps` 后运行 `npm run build`。本地应先完成相同安装，再单独记录构建结果；容器构建、浏览器联调和实际部署不由此推导。

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

