# 构建、镜像与部署

## 本地构建与验证

本地源码验证（不构建或推送镜像）：

```bash
npm ci --legacy-peer-deps
npm run build
```

`npm run build` 执行 `vue-tsc` 与 Vite 构建，产物写入 `dist/`。仓库没有 `test` 或 `lint` 脚本，因此没有独立自动化测试套件；这不等同于已完成浏览器、集成或部署验证。资源变更还应单独执行并审查 `npm run build:config`。

## 本地容器构建

根目录 `Dockerfile` 使用 Node.js 22 构建静态产物，再使用 OpenResty（Nginx + Lua）运行；入口是 `/docker-entrypoint.sh`。本地和 CI 都使用同一个 Dockerfile、`VITE_BUILD_MODE=production`、基础镜像、入口与 OCI 构建参数。

```bash
./build.sh --tag 1.0.0 --build-mode production
# 等价的镜像目标：ghcr.io/g2rain/g2rain-department-app:1.0.0
```

Dockerfile 仅运行 Vite 构建，不能代替前述 `npm run build`，也不会运行资源配置生成。容器声明 `8080`；Nginx 实际监听 `SERVER_PORT`（默认 `80`），部署平台应显式映射所需端口。

最终镜像包含 Vite `dist/`、OpenResty/Nginx 模板、Lua 签名代码与 luaossl；不包含仓库源代码、`node_modules` 或构建阶段依赖。`.dockerignore` 排除了本地 `.env`、密钥文件和文档，但它只是构建上下文控制，不能替代凭据治理。

当前已跟踪的 `.env` 被排除，不会进入 Docker 构建上下文；已跟踪的 `.env.production` 会供 Vite 构建读取，其 `VITE_*` 值属于公开前端配置并可能被编译进静态资源。检查时未发现已跟踪的 Token、私钥或真实凭据；仍不得将生产密钥或私有地址放入任一 `VITE_*` 变量。生产 SSO、Gateway 和 IAM 配置应通过受控的运行时环境与部署配置注入。

运行时需要按部署环境设置 `GATEWAY_HOST`、`GATEWAY_PORT`、`IAM_HOST`、`IAM_PORT`、`SERVER_PORT`、`CONTEXT_PATH` 和（如适用）`SSO_BASE_URL`。将 `lua/keys/private-key.der`、`public-key.der`、`iam-key-id.txt` 与 `iam-public-key.pem` 以 Secret 或只读挂载注入 `/usr/local/openresty/nginx/lua/keys`，不要写入镜像层、Git 或命令行。虽然当前仓库没有已跟踪的密钥文件，`COPY lua/` 原本会把工作区中的未忽略密钥带进镜像；现已明确排除 `lua/keys/*`，仅保留说明文件。

## GHCR 发布

镜像为 `ghcr.io/g2rain/g2rain-department-app`。工作流 `.github/workflows/image.yml` 只响应推送的精确稳定标签 `v<major>.<minor>.<patch>`，不响应分支、Pull Request 或手动触发。它会校验：tag 提交在 `origin/main` 历史中、`docs/releases/v<版本>.md` 在该 tag 提交中存在且非空、以及 tag 版本等于 `package.json` 的版本；然后执行 `npm ci --legacy-peer-deps` 和 `npm run build`。

成功后，工作流仅用 GitHub 提供的 `GITHUB_TOKEN` 登录 GHCR，并推送 `1.0.0` 与 `sha-<完整提交 SHA>` 两个标签。只有两次推送都成功后才会在 Actions Summary 报告完整镜像地址。它不创建 GitHub Release、不部署服务，也不写入 `latest`。OCI 元数据包括 source、url、title、version、revision 和与根目录 LICENSE 一致的 `Apache-2.0` 许可证。

现有分支流程是 `feature/* → develop → main`。先将发布改动和同名发布说明按该流程合入并验证 `main`，再在该提交上创建并推送标签：

```bash
git tag v1.0.0
git push origin v1.0.0
```

首次成功推送后，如需允许匿名拉取，在 GitHub 的 **Package settings → Change visibility → Public** 将包设为公开；组织管理员禁止此操作时，联系管理员处理。已有 GHCR 包即使工作流具有 `packages: write`，也可能需在 **Package settings → Actions access** 向 `g2rain/g2rain-department-app` 授予写权限。遇到 `denied` 时，优先检查该设置和组织 Packages 策略。

公开后才能进行匿名拉取验证：

```bash
docker pull ghcr.io/g2rain/g2rain-department-app:1.0.0
```

本地构建、CI 构建与测试、容器构建、GHCR 推送、匿名拉取、在线演示和实际部署验证彼此独立。仓库未提供可作为本组件发布验收的在线演示；即使访问平台演示，也不证明此镜像、匿名拉取或实际部署已验证。本仓库不因准备发布内容而声称后四项已经完成。

