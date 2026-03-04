# @repo/util

공유 유틸리티 함수 라이브러리입니다. 프로젝트 전반에서 사용되는 범용적인 유틸리티 함수들을 제공합니다.

## 📋 역할 및 성격

이 패키지는 다음과 같은 성격을 가진 유틸리티 함수들을 제공합니다:

- **범용성**: 여러 프로젝트에서 공통으로 사용되는 유틸리티 함수
- **순수 함수**: 대부분의 함수가 사이드 이펙트가 없는 순수 함수
- **타입 안정성**: TypeScript로 작성되어 타입 안정성 보장
- **재사용성**: 특정 도메인에 종속되지 않는 범용적인 기능

## 📁 폴더 구조

```
packages/util/
├── src/
│   ├── app/              # Capacitor 앱 관련 유틸리티
│   ├── array/            # 배열 유틸리티
│   ├── calculation/      # 계산 유틸리티
│   ├── constants/        # 상수 정의
│   ├── date/             # 날짜 관련 유틸리티
│   ├── device/           # 기기 관련 유틸리티
│   ├── function/         # 함수 유틸리티
│   ├── string/           # 문자열 유틸리티
│   ├── time/             # 시간 관련 유틸리티
│   ├── timerManager/     # 타이머 관리
├── package.json
└── tsconfig.json
```

## 📦 설치

이 패키지는 워크스페이스 내부 패키지이므로, 루트에서 `pnpm install`을 실행하면 자동으로 설치됩니다.

외부 프로젝트에서 사용하려면 `package.json`에 다음을 추가하세요:

```json
{
  "dependencies": {
    "@repo/util": "workspace:*"
  }
}
```

## 🚀 사용 방법

### 모듈별 Import

이 패키지는 모듈별로 분리된 export를 제공합니다. 필요한 모듈만 import하여 사용할 수 있습니다:

```typescript
// 날짜 유틸리티
import { formatDateToYYYYMMDD, getDateRangeByPreset } from '@repo/util/date';

// 문자열 유틸리티
import { formatCurrency, isEmpty, isValidEmail } from '@repo/util/string';
...
```

### 사용 예시

#### 날짜 포맷팅

```typescript
import { formatDateToYYYYMMDD, formatDateToDash } from '@repo/util/date';

const date = new Date('2025-01-15');
formatDateToYYYYMMDD(date); // '20250115'
formatDateToDash(date); // '2025-01-15'
...
```

## 📝 참고사항

- Capacitor 관련 기능은 네이티브 앱 환경에서만 동작합니다.
