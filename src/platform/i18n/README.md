# g2rain-department-app 国际化用法
# g2rain-app-template 国际化用法

## 写法
## 三种写法

| 场景 | 写法 |
|------|------|
| 模板 | `{{ $t('KEY', '默认文案') }}` |
| JS | `t('KEY', '默认文案')` |
## 约定

## Key 命名
## 页面默认值

| 前缀 | Tag | 说明 |
|------|-----|------|
| `G2_*` | G2RAIN_SHARED | 跨应用通用 |
| `DE_*` | DEPARTMENT | 本应用专属（模块用表名大写：`DE_DEPARTMENT_*`） |
## 独立运行（`mode=alone`）

## Tags（`.env`）
## 集成运行（qiankun）

`G2RAIN_SHARED,DEPARTMENT`

完整 key 见 [KEYS.md](./KEYS.md)。
