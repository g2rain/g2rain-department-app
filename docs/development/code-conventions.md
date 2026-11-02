# 代码约定

- 使用 TypeScript 和 Vue `<script setup lang="ts">`；领域类型放在对应 `views/<domain>/type.ts`。
- 页面通过同目录 `api.ts` 调用统一 HTTP Client，不重复实现 Token、签名或错误处理。
- 路由登记在 `src/views/route-map.ts`，路径需与 Basis 下发的 `linkPath` 一致。
- 新增、编辑、删除、状态变更和关联用户等操作使用明确的页面元素权限编码。
- 数据权限规则的字段、操作符和值必须类型明确，不直接拼接可执行表达式。
- 通用无状态工具放 shared，UI 原语放 components，平台适配放 platform，启动编排放 runtime。
- 新代码不得复制[已知反向依赖](../architecture/deviations.md)。
- 不提交 Token、密钥、真实身份数据、构建产物或无关格式化。

