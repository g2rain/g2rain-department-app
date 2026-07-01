# g2rain-department-app

## 1. 徽标与状态标识

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22-5FA04E?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vue](https://img.shields.io/badge/Vue-3.5.26-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![qiankun](https://img.shields.io/badge/qiankun-2.10.16-1f6feb)](https://qiankun.umijs.org/)

## 2. 项目简介

`g2rain-department-app` 是 G2rain 平台中的部门与数据权限前端子应用，负责承载部门树、人员归属、数据权限模型、权限元数据、权限组与策略配置等页面能力，并与主壳、统一认证和后端权限服务协同完成平台增强组件的可视化交付。

## 3. 平台定位

在 G2rain“企业级 AI 原生开源 SaaS 平台”体系中，`g2rain-department-app` 位于平台控制台子应用层，是部门与数据权限增强能力的前端承载应用。

它主要服务以下场景：
- 为平台运营与实施人员提供部门与数据权限的可视化配置入口
- 为 `g2rain-department` 后端服务提供配套的页面、表单与列表交互层
- 在开发阶段支持独立运行调试，在联调与交付阶段接入 `g2rain-main-shell` 统一验证
- 通过 OpenResty + Lua 与统一身份链路协同，完成前端到 API 的签名与令牌初始化流程

它与 `g2rain-department`、`g2rain-main-shell`、`g2rain-basis`、`g2rain-iam` 协同工作。

## 4. 核心能力

本章回答“这个仓库在平台里提供什么能力、解决什么问题”。

- 部门与数据权限页面承载能力：解决组织治理与权限治理的前端交互问题，通过 `src/views` 中的部门、部门成员、权限模型、权限元数据、权限组等页面提供统一管理入口。
- 双模式运行能力：解决开发调试与集成交付之间的切换问题，通过 `VITE_RUN_MODE`、qiankun 生命周期适配和主壳跳转工具支持独立运行与主壳集成两种模式。
- 资源驱动路由装载能力：解决页面菜单、资源路由与权限联动的问题，通过运行时资源加载、动态路由初始化和主壳消息适配按平台资源定义装载页面。
- 统一认证与签名协同能力：解决前端应用独立身份、SSO 建链与接口签名的问题，通过 `/keys/iam-key-id`、`/keys/iam-public-key`、`/lua/sign_code` 与 OpenResty Lua 脚本协同完成令牌初始化与签名链路。
- 代码生成与资源配置能力：解决表驱动页面快速初始化与资源配置导入的问题，通过 `build:generate` 生成页面骨架，通过 `build:config` 生成资源配置文件。
- OpenResty 交付能力：解决子应用前端独立部署与运行环境一致性问题，通过 `Dockerfile`、`nginx`、`lua`、`build.sh` 提供默认交付入口。

## 5. 技术栈

- 语言与运行时：`TypeScript`、`Node.js 22+`
- 前端框架：`Vue 3.5.26`、`Vue Router 4.6.4`、`Pinia 3.0.4`
- 构建工具：`Vite 7.3.0`、`vue-tsc 3.2.1`
- 微前端：`qiankun 2.10.16`、`vite-plugin-qiankun 1.0.15`
- UI 与交互：`Element Plus 2.13.0`
- 国际化：`vue-i18n 11.4.4`
- 调试与模拟：`vite-plugin-mock`、`mockjs`
- 安全与签名：`jose`、`elliptic`、`crypto-js`
- 交付与运行：`Dockerfile`、`OpenResty`、`nginx`、`lua`、`build.sh`

## 6. 快速开始

### 环境要求

- `Node.js 22+`
- `npm 10+`
- 可联通的后端服务与统一认证环境
- 如需镜像构建，需可用的 `Docker`

### 关键环境变量

| 变量名 | 说明 | 典型用途 |
| --- | --- | --- |
| `VITE_APPLICATION_CODE` | 应用编码 | 当前值 `g2rain-department-app` |
| `VITE_CONTEXT_PATH` | 部署上下文路径 | 当前值 `/department` |
| `VITE_BACKEND_ORIGIN` | 后端服务地址 | 本地代理目标 |
| `VITE_TOKEN_END_POINT` | Token 接口路径 | 默认 `/auth/token` |
| `VITE_AUTH_END_POINT` | 授权接口路径 | 默认 `/auth/authorize` |
| `VITE_SERVER_PORT` | 本地开发端口 | 当前值 `3002` |
| `VITE_SSO_BASE_URL` | SSO 根地址 | 登录跳转与回调 |
| `VITE_REDIRECT_URI` | 回调路径 | 默认 `/sso_callback` |
| `VITE_RUN_MODE` | 运行模式 | `alone` 为独立运行，留空为集成意图 |
| `VITE_MAIN_SHELL_REDIRECT_PREFIX` | 主壳网关前缀 | 默认 `/main/redirect` |
| `VITE_MAIN_SHELL_ORIGIN` | 主壳本地地址 | 本地联调时使用 |

### 运行模式说明

- 开发阶段可设置 `VITE_RUN_MODE=alone` 独立运行，方便单独调试页面。
- 联调阶段应部署到测试环境并接入 `g2rain-main-shell`，通过主壳完成完整认证、路由与资源联调验证。
- 当未设置 `VITE_RUN_MODE=alone` 且当前页面不是由 qiankun 挂载时，应用会跳转到主壳网关，而不是直接以子应用直链运行。

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

### 构建产物

```bash
npm run build
npm run preview
```

### 代码生成与资源配置

```bash
npm run build:generate -- --tables=department
npm run build:config
```

### 镜像构建

```bash
./build.sh
./build.sh --tag latest --build-mode production
```

## 7. 项目结构

本章回答“代码与模块是如何组织的、排查和扩展时应该先看哪里”。

```text
g2rain-department-app/
├── src/
│   ├── components
│   ├── platform
│   ├── runtime
│   ├── shared
│   └── views
├── lua/
├── nginx/
├── Dockerfile
├── build.sh
├── vite.config.ts
├── .env
└── .env.production
```

### 结构说明

- `src/components`：通用组件、权限指令、HTTP 封装与签名逻辑。
- `src/platform`：平台级适配层，承载 qiankun 生命周期、全局状态、国际化与错误体系。
- `src/runtime`：运行时引导层，承载 SSO、资源加载、动态路由和启动编排。
- `src/shared`：通用工具层，承载环境变量、运行模式判断、shell 网关跳转、页面生成器与资源配置工具。
- `src/views`：业务页面层，默认以“一个表一个目录”的规范组织页面、接口、类型与 mock。
- `lua`：OpenResty Lua 脚本，承载 IAM 公钥获取与应用私钥签名能力。
- `nginx`：默认应用运行环境配置，使用 OpenResty 并内置 Lua 支持。
- `build.sh` 与 `Dockerfile`：默认交付入口。

### src/views 模块说明

- `auth`：认证相关页面与回调处理。
- `department`：部门维护页面，通常包含 `index.vue`、`api.ts`、`type.ts`。
- `department_user_relation`：部门成员关系管理页面。
- `data_permission_model`：数据权限模型管理页面。
- `data_permission_meta`：数据权限元数据配置页面。
- `data_permission_field`：数据权限字段配置页面。
- `data_permission_group`：权限组配置页面。
- `data_permission_group_user_relation`：权限组与用户关系页面。
- `data_permission_other`：补充规则或特殊权限配置页面。
- `dict`、`organ`、`shared`、`user`：复用的通用页面或平台共享页面。

### 页面组织规范

- 默认根据数据库表生成页面，每个 `table` 对应 `src/views/<table>` 一个目录。
- 目录内通常包含 `vue` 页面、`api` 接口、`type` 类型定义，以及按需要生成的 `mock` 数据。
- 如需新增业务页面，也建议继续沿用该规范，便于后续 `build:config` 扫描与资源导入。

## 8. 核心业务流程

本章回答“这些能力在运行时是如何串起来工作的”。

#### 1. 独立运行与主壳集成主线

- 开发阶段设置 `VITE_RUN_MODE=alone` 时，应用直接独立启动。
- 集成意图下如果当前并非 qiankun 挂载，应用会先跳转到 `g2rain-main-shell` 网关入口。
- 真正由 qiankun 挂载后，`adapter.qiankun.ts` 接管生命周期、路由初始化和主壳消息通信。

#### 2. 资源加载与动态路由主线

- 启动后先执行运行时 boot 逻辑。
- 应用根据 `VITE_APPLICATION_CODE` 从平台资源接口加载页面资源、页面元素与 API 配置。
- `initRoutesFromResources` 根据资源生成可访问路由，再注入当前应用实例。
- 最终页面菜单、路由与资源权限保持同源一致。

#### 3. SSO 与签名认证主线

- 当检测到未登录时，运行时会通过 SSO 逻辑跳转统一认证入口。
- 回调完成后，应用重新加载资源并恢复目标页面。
- 调用需要签名的链路时，前端会访问 `/keys/iam-key-id`、`/keys/iam-public-key` 获取 IAM 侧信息，再调用 `/lua/sign_code` 完成签名协作。
- 这一主线与 OpenResty + Lua 共同组成子应用完整身份管理链路。

#### 4. 页面生成与资源导入主线

- 开发者执行 `npm run build:generate -- --tables=<table>`。
- 生成器根据表名输出 `src/views/<table>` 目录下的页面、接口、类型和可选 mock。
- 开发完成后执行 `npm run build:config`。
- 配置工具扫描页面、路由、接口与按钮权限，输出资源配置文件，供平台导入使用。

#### 5. OpenResty 交付主线

- `Dockerfile` 先在 Node 阶段构建前端产物。
- 运行阶段使用 OpenResty 作为默认应用运行环境。
- `nginx/default.conf.template` 提供静态资源与认证签名相关代理路径。
- `lua/sign.lua`、`lua/sign_api.lua` 负责私钥签名与 IAM 公钥协同能力。

## 9. 常用命令

```bash
npm run dev
npm run build
npm run preview
npm run build:generate -- --tables=department
npm run build:config
./build.sh
./build.sh --image g2rain/g2rain-department-app --tag latest --build-mode production
```

## 10. 质量与测试

- 当前仓库已形成统一前端子应用骨架，包含运行模式、签名链路、资源驱动路由和生成器工具。
- 当前扫描未发现独立测试体系说明，后续建议优先补齐运行模式切换、SSO 回调、动态路由和资源配置扫描的关键测试。
- 涉及主壳联调、签名和统一认证时，建议在接入测试环境后进行完整验证。

## 11. 相关仓库

- `g2rain-department`：部门与数据权限后端服务
- `g2rain-main-shell`：主壳与统一入口
- `g2rain-basis`：平台应用、资源、角色与权限底座
- `g2rain-app-template`：前端子应用模板来源之一

## 12. 使用建议

- 开发期优先使用 `alone` 模式提升页面调试效率。
- 联调期优先接入主壳验证完整的认证、路由、权限与资源链路。
- 对于新页面，建议优先沿用“按表生成目录”的组织规范，减少后续资源配置维护成本。
- 对于签名与密钥相关内容，建议统一通过 `lua/keys` 与部署环境注入，不直接写死到源码中。

## 13. 贡献指南

欢迎通过文档改进、Issue 反馈、测试补充、代码优化、功能增强等形式参与贡献。

建议流程：
1. Fork 本仓库
2. 创建特性分支
3. 提交修改
4. 推送分支
5. 提交 Pull Request

提交前请尽量确保：
- 遵循现有技术栈与代码规范
- 补充必要测试
- 更新相关文档
- 确保测试通过

## 14. 许可证

本项目基于 [Apache 2.0许可证](LICENSE) 开源。

## 15. 联系我们

- **站点**: https://www.g2rain.com/
- **Issues**: [GitHub Issues](https://github.com/g2rain/g2rain/issues)
- **讨论**: [GitHub Discussions](https://github.com/g2rain/g2rain/discussions)
- **邮箱**: g2rain_developer@163.com

## 16. 致谢

感谢所有为这个项目做出贡献的开发者们。

如果这个项目对您有帮助，欢迎 Star 支持。
