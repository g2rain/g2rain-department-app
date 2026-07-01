# g2rain-department-app

## 1. 寰芥爣涓庣姸鎬佹爣璇?
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22-5FA04E?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vue](https://img.shields.io/badge/Vue-3.5.26-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![qiankun](https://img.shields.io/badge/qiankun-2.10.16-1f6feb)](https://qiankun.umijs.org/)

## 2. 椤圭洰绠€浠?
`g2rain-department-app` 鏄?G2rain 骞冲彴涓殑閮ㄩ棬涓庢暟鎹潈闄愬墠绔瓙搴旂敤锛岃礋璐ｆ壙杞介儴闂ㄦ爲銆佷汉鍛樺綊灞炪€佹暟鎹潈闄愭ā鍨嬨€佹潈闄愬厓鏁版嵁銆佹潈闄愮粍涓庣瓥鐣ラ厤缃瓑椤甸潰鑳藉姏锛屽苟涓庝富澹炽€佺粺涓€璁よ瘉鍜屽悗绔潈闄愭湇鍔″崗鍚屽畬鎴愬钩鍙板寮虹粍浠剁殑鍙鍖栦氦浠樸€?
## 3. 骞冲彴瀹氫綅

鍦?G2rain鈥滀紒涓氱骇 AI 鍘熺敓寮€婧?SaaS 骞冲彴鈥濅綋绯讳腑锛宍g2rain-department-app` 浣嶄簬骞冲彴鎺у埗鍙板瓙搴旂敤灞傦紝鏄儴闂ㄤ笌鏁版嵁鏉冮檺澧炲己鑳藉姏鐨勫墠绔壙杞藉簲鐢ㄣ€?
瀹冧富瑕佹湇鍔′互涓嬪満鏅細
- 涓哄钩鍙拌繍钀ヤ笌瀹炴柦浜哄憳鎻愪緵閮ㄩ棬涓庢暟鎹潈闄愮殑鍙鍖栭厤缃叆鍙?- 涓?`g2rain-department` 鍚庣鏈嶅姟鎻愪緵閰嶅鐨勯〉闈€佽〃鍗曚笌鍒楄〃浜や簰灞?- 鍦ㄥ紑鍙戦樁娈垫敮鎸佺嫭绔嬭繍琛岃皟璇曪紝鍦ㄨ仈璋冧笌浜や粯闃舵鎺ュ叆 `g2rain-main-shell` 缁熶竴楠岃瘉
- 閫氳繃 OpenResty + Lua 涓庣粺涓€韬唤閾捐矾鍗忓悓锛屽畬鎴愬墠绔埌 API 鐨勭鍚嶄笌浠ょ墝鍒濆鍖栨祦绋?
瀹冧笌 `g2rain-department`銆乣g2rain-main-shell`銆乣g2rain-basis`銆乣g2rain-iam` 鍗忓悓宸ヤ綔銆?
## 4. 鏍稿績鑳藉姏

鏈珷鍥炵瓟鈥滆繖涓粨搴撳湪骞冲彴閲屾彁渚涗粈涔堣兘鍔涖€佽В鍐充粈涔堥棶棰樷€濄€?
- 閮ㄩ棬涓庢暟鎹潈闄愰〉闈㈡壙杞借兘鍔涳細瑙ｅ喅缁勭粐娌荤悊涓庢潈闄愭不鐞嗙殑鍓嶇浜や簰闂锛岄€氳繃 `src/views` 涓殑閮ㄩ棬銆侀儴闂ㄦ垚鍛樸€佹潈闄愭ā鍨嬨€佹潈闄愬厓鏁版嵁銆佹潈闄愮粍绛夐〉闈㈡彁渚涚粺涓€绠＄悊鍏ュ彛銆?- 鍙屾ā寮忚繍琛岃兘鍔涳細瑙ｅ喅寮€鍙戣皟璇曚笌闆嗘垚浜や粯涔嬮棿鐨勫垏鎹㈤棶棰橈紝閫氳繃 `VITE_RUN_MODE`銆乹iankun 鐢熷懡鍛ㄦ湡閫傞厤鍜屼富澹宠烦杞伐鍏锋敮鎸佺嫭绔嬭繍琛屼笌涓诲３闆嗘垚涓ょ妯″紡銆?- 璧勬簮椹卞姩璺敱瑁呰浇鑳藉姏锛氳В鍐抽〉闈㈣彍鍗曘€佽祫婧愯矾鐢变笌鏉冮檺鑱斿姩鐨勯棶棰橈紝閫氳繃杩愯鏃惰祫婧愬姞杞姐€佸姩鎬佽矾鐢卞垵濮嬪寲鍜屼富澹虫秷鎭€傞厤鎸夊钩鍙拌祫婧愬畾涔夎杞介〉闈€?- 缁熶竴璁よ瘉涓庣鍚嶅崗鍚岃兘鍔涳細瑙ｅ喅鍓嶇搴旂敤鐙珛韬唤銆丼SO 寤洪摼涓庢帴鍙ｇ鍚嶇殑闂锛岄€氳繃 `/keys/iam-key-id`銆乣/keys/iam-public-key`銆乣/lua/sign_code` 涓?OpenResty Lua 鑴氭湰鍗忓悓瀹屾垚浠ょ墝鍒濆鍖栦笌绛惧悕閾捐矾銆?- 浠ｇ爜鐢熸垚涓庤祫婧愰厤缃兘鍔涳細瑙ｅ喅琛ㄩ┍鍔ㄩ〉闈㈠揩閫熷垵濮嬪寲涓庤祫婧愰厤缃鍏ョ殑闂锛岄€氳繃 `build:generate` 鐢熸垚椤甸潰楠ㄦ灦锛岄€氳繃 `build:config` 鐢熸垚璧勬簮閰嶇疆鏂囦欢銆?- OpenResty 浜や粯鑳藉姏锛氳В鍐冲瓙搴旂敤鍓嶇鐙珛閮ㄧ讲涓庤繍琛岀幆澧冧竴鑷存€ч棶棰橈紝閫氳繃 `Dockerfile`銆乣nginx`銆乣lua`銆乣build.sh` 鎻愪緵榛樿浜や粯鍏ュ彛銆?
## 5. 鎶€鏈爤

- 璇█涓庤繍琛屾椂锛歚TypeScript`銆乣Node.js 22+`
- 鍓嶇妗嗘灦锛歚Vue 3.5.26`銆乣Vue Router 4.6.4`銆乣Pinia 3.0.4`
- 鏋勫缓宸ュ叿锛歚Vite 7.3.0`銆乣vue-tsc 3.2.1`
- 寰墠绔細`qiankun 2.10.16`銆乣vite-plugin-qiankun 1.0.15`
- UI 涓庝氦浜掞細`Element Plus 2.13.0`
- 鍥介檯鍖栵細`vue-i18n 11.4.4`
- 璋冭瘯涓庢ā鎷燂細`vite-plugin-mock`銆乣mockjs`
- 瀹夊叏涓庣鍚嶏細`jose`銆乣elliptic`銆乣crypto-js`
- 浜や粯涓庤繍琛岋細`Dockerfile`銆乣OpenResty`銆乣nginx`銆乣lua`銆乣build.sh`

## 6. 蹇€熷紑濮?
### 鐜瑕佹眰

- `Node.js 22+`
- `npm 10+`
- 鍙仈閫氱殑鍚庣鏈嶅姟涓庣粺涓€璁よ瘉鐜
- 濡傞渶闀滃儚鏋勫缓锛岄渶鍙敤鐨?`Docker`

### 鍏抽敭鐜鍙橀噺

| 鍙橀噺鍚?| 璇存槑 | 鍏稿瀷鐢ㄩ€?|
| --- | --- | --- |
| `VITE_APPLICATION_CODE` | 搴旂敤缂栫爜 | 褰撳墠鍊?`g2rain-department-app` |
| `VITE_CONTEXT_PATH` | 閮ㄧ讲涓婁笅鏂囪矾寰?| 褰撳墠鍊?`/department` |
| `VITE_BACKEND_ORIGIN` | 鍚庣鏈嶅姟鍦板潃 | 鏈湴浠ｇ悊鐩爣 |
| `VITE_TOKEN_END_POINT` | Token 鎺ュ彛璺緞 | 榛樿 `/auth/token` |
| `VITE_AUTH_END_POINT` | 鎺堟潈鎺ュ彛璺緞 | 榛樿 `/auth/authorize` |
| `VITE_SERVER_PORT` | 鏈湴寮€鍙戠鍙?| 褰撳墠鍊?`3002` |
| `VITE_SSO_BASE_URL` | SSO 鏍瑰湴鍧€ | 鐧诲綍璺宠浆涓庡洖璋?|
| `VITE_REDIRECT_URI` | 鍥炶皟璺緞 | 榛樿 `/sso_callback` |
| `VITE_RUN_MODE` | 杩愯妯″紡 | `alone` 涓虹嫭绔嬭繍琛岋紝鐣欑┖涓洪泦鎴愭剰鍥?|
| `VITE_MAIN_SHELL_REDIRECT_PREFIX` | 涓诲３缃戝叧鍓嶇紑 | 榛樿 `/main/redirect` |
| `VITE_MAIN_SHELL_ORIGIN` | 涓诲３鏈湴鍦板潃 | 鏈湴鑱旇皟鏃朵娇鐢?|

### 杩愯妯″紡璇存槑

- 寮€鍙戦樁娈靛彲璁剧疆 `VITE_RUN_MODE=alone` 鐙珛杩愯锛屾柟渚垮崟鐙皟璇曢〉闈€?- 鑱旇皟闃舵搴旈儴缃插埌娴嬭瘯鐜骞舵帴鍏?`g2rain-main-shell`锛岄€氳繃涓诲３瀹屾垚瀹屾暣璁よ瘉銆佽矾鐢变笌璧勬簮鑱旇皟楠岃瘉銆?- 褰撴湭璁剧疆 `VITE_RUN_MODE=alone` 涓斿綋鍓嶉〉闈笉鏄敱 qiankun 鎸傝浇鏃讹紝搴旂敤浼氳烦杞埌涓诲３缃戝叧锛岃€屼笉鏄洿鎺ヤ互瀛愬簲鐢ㄧ洿閾捐繍琛屻€?
### 瀹夎渚濊禆

```bash
npm install
```

### 鏈湴寮€鍙?
```bash
npm run dev
```

### 鏋勫缓浜х墿

```bash
npm run build
npm run preview
```

### 浠ｇ爜鐢熸垚涓庤祫婧愰厤缃?
```bash
npm run build:generate -- --tables=department
npm run build:config
```

### 闀滃儚鏋勫缓

```bash
./build.sh
./build.sh --tag latest --build-mode production
```

## 7. 椤圭洰缁撴瀯

鏈珷鍥炵瓟鈥滀唬鐮佷笌妯″潡鏄浣曠粍缁囩殑銆佹帓鏌ュ拰鎵╁睍鏃跺簲璇ュ厛鐪嬪摢閲屸€濄€?
```text
g2rain-department-app/
鈹溾攢鈹€ src/
鈹?  鈹溾攢鈹€ components
鈹?  鈹溾攢鈹€ platform
鈹?  鈹溾攢鈹€ runtime
鈹?  鈹溾攢鈹€ shared
鈹?  鈹斺攢鈹€ views
鈹溾攢鈹€ lua/
鈹溾攢鈹€ nginx/
鈹溾攢鈹€ Dockerfile
鈹溾攢鈹€ build.sh
鈹溾攢鈹€ vite.config.ts
鈹溾攢鈹€ .env
鈹斺攢鈹€ .env.production
```

### 缁撴瀯璇存槑

- `src/components`锛氶€氱敤缁勪欢銆佹潈闄愭寚浠ゃ€丠TTP 灏佽涓庣鍚嶉€昏緫銆?- `src/platform`锛氬钩鍙扮骇閫傞厤灞傦紝鎵胯浇 qiankun 鐢熷懡鍛ㄦ湡銆佸叏灞€鐘舵€併€佸浗闄呭寲涓庨敊璇綋绯汇€?- `src/runtime`锛氳繍琛屾椂寮曞灞傦紝鎵胯浇 SSO銆佽祫婧愬姞杞姐€佸姩鎬佽矾鐢卞拰鍚姩缂栨帓銆?- `src/shared`锛氶€氱敤宸ュ叿灞傦紝鎵胯浇鐜鍙橀噺銆佽繍琛屾ā寮忓垽鏂€乻hell 缃戝叧璺宠浆銆侀〉闈㈢敓鎴愬櫒涓庤祫婧愰厤缃伐鍏枫€?- `src/views`锛氫笟鍔￠〉闈㈠眰锛岄粯璁や互鈥滀竴涓〃涓€涓洰褰曗€濈殑瑙勮寖缁勭粐椤甸潰銆佹帴鍙ｃ€佺被鍨嬩笌 mock銆?- `lua`锛歄penResty Lua 鑴氭湰锛屾壙杞?IAM 鍏挜鑾峰彇涓庡簲鐢ㄧ閽ョ鍚嶈兘鍔涖€?- `nginx`锛氶粯璁ゅ簲鐢ㄨ繍琛岀幆澧冮厤缃紝浣跨敤 OpenResty 骞跺唴缃?Lua 鏀寔銆?- `build.sh` 涓?`Dockerfile`锛氶粯璁や氦浠樺叆鍙ｃ€?
### src/views 妯″潡璇存槑

- `auth`锛氳璇佺浉鍏抽〉闈笌鍥炶皟澶勭悊銆?- `department`锛氶儴闂ㄧ淮鎶ら〉闈紝閫氬父鍖呭惈 `index.vue`銆乣api.ts`銆乣type.ts`銆?- `department_user_relation`锛氶儴闂ㄦ垚鍛樺叧绯荤鐞嗛〉闈€?- `data_permission_model`锛氭暟鎹潈闄愭ā鍨嬬鐞嗛〉闈€?- `data_permission_meta`锛氭暟鎹潈闄愬厓鏁版嵁閰嶇疆椤甸潰銆?- `data_permission_field`锛氭暟鎹潈闄愬瓧娈甸厤缃〉闈€?- `data_permission_group`锛氭潈闄愮粍閰嶇疆椤甸潰銆?- `data_permission_group_user_relation`锛氭潈闄愮粍涓庣敤鎴峰叧绯婚〉闈€?- `data_permission_other`锛氳ˉ鍏呰鍒欐垨鐗规畩鏉冮檺閰嶇疆椤甸潰銆?- `dict`銆乣organ`銆乣shared`銆乣user`锛氬鐢ㄧ殑閫氱敤椤甸潰鎴栧钩鍙板叡浜〉闈€?
### 椤甸潰缁勭粐瑙勮寖

- 榛樿鏍规嵁鏁版嵁搴撹〃鐢熸垚椤甸潰锛屾瘡涓?`table` 瀵瑰簲 `src/views/<table>` 涓€涓洰褰曘€?- 鐩綍鍐呴€氬父鍖呭惈 `vue` 椤甸潰銆乣api` 鎺ュ彛銆乣type` 绫诲瀷瀹氫箟锛屼互鍙婃寜闇€瑕佺敓鎴愮殑 `mock` 鏁版嵁銆?- 濡傞渶鏂板涓氬姟椤甸潰锛屼篃寤鸿缁х画娌跨敤璇ヨ鑼冿紝渚夸簬鍚庣画 `build:config` 鎵弿涓庤祫婧愬鍏ャ€?
## 8. 鏍稿績涓氬姟娴佺▼

鏈珷鍥炵瓟鈥滆繖浜涜兘鍔涘湪杩愯鏃舵槸濡備綍涓茶捣鏉ュ伐浣滅殑鈥濄€?
#### 1. 鐙珛杩愯涓庝富澹抽泦鎴愪富绾?
- 寮€鍙戦樁娈佃缃?`VITE_RUN_MODE=alone` 鏃讹紝搴旂敤鐩存帴鐙珛鍚姩銆?- 闆嗘垚鎰忓浘涓嬪鏋滃綋鍓嶅苟闈?qiankun 鎸傝浇锛屽簲鐢ㄤ細鍏堣烦杞埌 `g2rain-main-shell` 缃戝叧鍏ュ彛銆?- 鐪熸鐢?qiankun 鎸傝浇鍚庯紝`adapter.qiankun.ts` 鎺ョ鐢熷懡鍛ㄦ湡銆佽矾鐢卞垵濮嬪寲鍜屼富澹虫秷鎭€氫俊銆?
#### 2. 璧勬簮鍔犺浇涓庡姩鎬佽矾鐢变富绾?
- 鍚姩鍚庡厛鎵ц杩愯鏃?boot 閫昏緫銆?- 搴旂敤鏍规嵁 `VITE_APPLICATION_CODE` 浠庡钩鍙拌祫婧愭帴鍙ｅ姞杞介〉闈㈣祫婧愩€侀〉闈㈠厓绱犱笌 API 閰嶇疆銆?- `initRoutesFromResources` 鏍规嵁璧勬簮鐢熸垚鍙闂矾鐢憋紝鍐嶆敞鍏ュ綋鍓嶅簲鐢ㄥ疄渚嬨€?- 鏈€缁堥〉闈㈣彍鍗曘€佽矾鐢变笌璧勬簮鏉冮檺淇濇寔鍚屾簮涓€鑷淬€?
#### 3. SSO 涓庣鍚嶈璇佷富绾?
- 褰撴娴嬪埌鏈櫥褰曟椂锛岃繍琛屾椂浼氶€氳繃 SSO 閫昏緫璺宠浆缁熶竴璁よ瘉鍏ュ彛銆?- 鍥炶皟瀹屾垚鍚庯紝搴旂敤閲嶆柊鍔犺浇璧勬簮骞舵仮澶嶇洰鏍囬〉闈€?- 璋冪敤闇€瑕佺鍚嶇殑閾捐矾鏃讹紝鍓嶇浼氳闂?`/keys/iam-key-id`銆乣/keys/iam-public-key` 鑾峰彇 IAM 渚т俊鎭紝鍐嶈皟鐢?`/lua/sign_code` 瀹屾垚绛惧悕鍗忎綔銆?- 杩欎竴涓荤嚎涓?OpenResty + Lua 鍏卞悓缁勬垚瀛愬簲鐢ㄥ畬鏁磋韩浠界鐞嗛摼璺€?
#### 4. 椤甸潰鐢熸垚涓庤祫婧愬鍏ヤ富绾?
- 寮€鍙戣€呮墽琛?`npm run build:generate -- --tables=<table>`銆?- 鐢熸垚鍣ㄦ牴鎹〃鍚嶈緭鍑?`src/views/<table>` 鐩綍涓嬬殑椤甸潰銆佹帴鍙ｃ€佺被鍨嬪拰鍙€?mock銆?- 寮€鍙戝畬鎴愬悗鎵ц `npm run build:config`銆?- 閰嶇疆宸ュ叿鎵弿椤甸潰銆佽矾鐢便€佹帴鍙ｄ笌鎸夐挳鏉冮檺锛岃緭鍑鸿祫婧愰厤缃枃浠讹紝渚涘钩鍙板鍏ヤ娇鐢ㄣ€?
#### 5. OpenResty 浜や粯涓荤嚎

- `Dockerfile` 鍏堝湪 Node 闃舵鏋勫缓鍓嶇浜х墿銆?- 杩愯闃舵浣跨敤 OpenResty 浣滀负榛樿搴旂敤杩愯鐜銆?- `nginx/default.conf.template` 鎻愪緵闈欐€佽祫婧愪笌璁よ瘉绛惧悕鐩稿叧浠ｇ悊璺緞銆?- `lua/sign.lua`銆乣lua/sign_api.lua` 璐熻矗绉侀挜绛惧悕涓?IAM 鍏挜鍗忓悓鑳藉姏銆?
## 9. 甯哥敤鍛戒护

```bash
npm run dev
npm run build
npm run preview
npm run build:generate -- --tables=department
npm run build:config
./build.sh
./build.sh --image g2rain/g2rain-department-app --tag latest --build-mode production
```

## 10. 璐ㄩ噺涓庢祴璇?
- 褰撳墠浠撳簱宸插舰鎴愮粺涓€鍓嶇瀛愬簲鐢ㄩ鏋讹紝鍖呭惈杩愯妯″紡銆佺鍚嶉摼璺€佽祫婧愰┍鍔ㄨ矾鐢卞拰鐢熸垚鍣ㄥ伐鍏枫€?- 褰撳墠鎵弿鏈彂鐜扮嫭绔嬫祴璇曚綋绯昏鏄庯紝鍚庣画寤鸿浼樺厛琛ラ綈杩愯妯″紡鍒囨崲銆丼SO 鍥炶皟銆佸姩鎬佽矾鐢卞拰璧勬簮閰嶇疆鎵弿鐨勫叧閿祴璇曘€?- 娑夊強涓诲３鑱旇皟銆佺鍚嶅拰缁熶竴璁よ瘉鏃讹紝寤鸿鍦ㄦ帴鍏ユ祴璇曠幆澧冨悗杩涜瀹屾暣楠岃瘉銆?
## 11. 鐩稿叧浠撳簱

- `g2rain-department`锛氶儴闂ㄤ笌鏁版嵁鏉冮檺鍚庣鏈嶅姟
- `g2rain-main-shell`锛氫富澹充笌缁熶竴鍏ュ彛
- `g2rain-basis`锛氬钩鍙板簲鐢ㄣ€佽祫婧愩€佽鑹蹭笌鏉冮檺搴曞骇
- `g2rain-app-template`锛氬墠绔瓙搴旂敤妯℃澘鏉ユ簮涔嬩竴

## 12. 浣跨敤寤鸿

- 寮€鍙戞湡浼樺厛浣跨敤 `alone` 妯″紡鎻愬崌椤甸潰璋冭瘯鏁堢巼銆?- 鑱旇皟鏈熶紭鍏堟帴鍏ヤ富澹抽獙璇佸畬鏁寸殑璁よ瘉銆佽矾鐢便€佹潈闄愪笌璧勬簮閾捐矾銆?- 瀵逛簬鏂伴〉闈紝寤鸿浼樺厛娌跨敤鈥滄寜琛ㄧ敓鎴愮洰褰曗€濈殑缁勭粐瑙勮寖锛屽噺灏戝悗缁祫婧愰厤缃淮鎶ゆ垚鏈€?- 瀵逛簬绛惧悕涓庡瘑閽ョ浉鍏冲唴瀹癸紝寤鸿缁熶竴閫氳繃 `lua/keys` 涓庨儴缃茬幆澧冩敞鍏ワ紝涓嶇洿鎺ュ啓姝诲埌婧愮爜涓€?
## 13. 璐＄尞鎸囧崡

娆㈣繋閫氳繃鏂囨。鏀硅繘銆両ssue 鍙嶉銆佹祴璇曡ˉ鍏呫€佷唬鐮佷紭鍖栥€佸姛鑳藉寮虹瓑褰㈠紡鍙備笌璐＄尞銆?
寤鸿娴佺▼锛?1. Fork 鏈粨搴?2. 鍒涘缓鐗规€у垎鏀?3. 鎻愪氦淇敼
4. 鎺ㄩ€佸垎鏀?5. 鎻愪氦 Pull Request

鎻愪氦鍓嶈灏介噺纭繚锛?- 閬靛惊鐜版湁鎶€鏈爤涓庝唬鐮佽鑼?- 琛ュ厖蹇呰娴嬭瘯
- 鏇存柊鐩稿叧鏂囨。
- 纭繚娴嬭瘯閫氳繃

## 14. 璁稿彲璇?
鏈」鐩熀浜?[Apache 2.0璁稿彲璇乚(LICENSE) 寮€婧愩€?
## 15. 鑱旂郴鎴戜滑

- **绔欑偣**: https://www.g2rain.com/
- **Issues**: [GitHub Issues](https://github.com/g2rain/g2rain/issues)
- **璁ㄨ**: [GitHub Discussions](https://github.com/g2rain/g2rain/discussions)
- **閭**: g2rain_developer@163.com

## 16. 鑷磋阿

鎰熻阿鎵€鏈変负杩欎釜椤圭洰鍋氬嚭璐＄尞鐨勫紑鍙戣€呬滑銆?
濡傛灉杩欎釜椤圭洰瀵规偍鏈夊府鍔╋紝娆㈣繋 Star 鏀寔銆