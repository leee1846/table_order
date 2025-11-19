# @repo/prettier-config

Turborepo 전체에서 공유하는 Prettier 설정입니다.

## 사용 방방법

프로젝트의 `package.json`에 다음을 추가하세요:

```json
{
  "prettier": "@repo/prettier-config"
}
```

또는 `.prettierrc.js` 파일을 생성하고:

```js
module.exports = require('@repo/prettier-config');
```
