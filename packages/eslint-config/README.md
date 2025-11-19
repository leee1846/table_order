# @repo/eslint-config

Turborepo 전체에서 공유하는 ESLint 설정입니다.

## 사용 방법

### React 프로젝트

프로젝트의 `package.json`에 다음을 추가하세요:

```json
{
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "eslint": "^9.34.0"
  }
}
```

`eslint.config.js` 파일을 생성하고:

```javascript
import { config } from '@repo/eslint-config/react-internal';

export default [...config];
```

### Next.js 프로젝트

```javascript
import { nextJsConfig } from '@repo/eslint-config/next-js';

export default [...nextJsConfig];
```

### Node.js 프로젝트

```javascript
import { config } from '@repo/eslint-config/base';

export default [...config];
```
