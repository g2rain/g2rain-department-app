# 发布记录

- [v1.0.0：部门与数据权限管理微前端首个稳定版与 GHCR 发布准备](v1.0.0.md)

仓库按 `feature/* → develop → main` 通过 Pull Request 集成。发布改动、工作流和同名发布说明先进入 `main` 并完成验证；随后在该提交创建精确 `v<major>.<minor>.<patch>` tag。稳定 tag 仅触发 GHCR 镜像构建和推送，不创建 GitHub Release、不部署服务、也不更新 `latest`。
