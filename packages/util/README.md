# @repo/util

공통으로 사용되는 순수 함수 유틸리티 라이브러리입니다.

## 설치 방법

앱의 `package.json`에 의존성을 추가합니다.

```json
{
  "dependencies": {
    "@repo/util": "workspace:*"
  }
}
```

그 다음 의존성을 설치합니다:

```bash
pnpm install
```

## 사용 방법

필요한 유틸 함수를 import해서 사용합니다:

```typescript
import { isEmpty } from '@repo/util';

// 문자열이 비어있는지 확인
if (isEmpty(userInput)) {
  console.log('입력값이 비어있습니다');
}

// 예시
isEmpty(''); // true
isEmpty('  '); // true
isEmpty(null); // true
isEmpty(undefined); // true
isEmpty('hello'); // false
isEmpty(' hello '); // false
```
