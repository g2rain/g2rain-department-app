# 分层

目标目录顺序是 `shared -> components -> platform -> runtime -> views`，依赖方向为 `views -> runtime -> platform -> components -> shared`。

| 层 | 当前职责 | 代表内容 |
| --- | --- | --- |
| `shared` | 环境、URL、通用工具与构建期生成器 | `env.ts`、`utils`、`generator`、`config-util` |
| `components` | UI 与前端基础能力 | HTTP、错误、权限、RemoteSelect、QueryForm、TableSort |
| `platform` | 平台语义与宿主适配 | Store、i18n、Locale、qiankun apps |
| `runtime` | 启动与运行编排 | auth、boot、router、resource、micro-shells |
| `views` | 部门和数据权限业务用例 | department、relations、permission model/meta/group/rules |

`src/main.ts` 和 `src/App.vue` 是组合根。构建期 generator/config-util 位于 shared，但引用上层类型或模板组件，属于已知偏差，不能作为新运行时代码的依赖范例。

