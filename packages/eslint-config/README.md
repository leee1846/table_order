# @repo/eslint-config

공유 ESLint 설정 라이브러리입니다. 프로젝트 전반에서 사용되는 코드 린팅 규칙을 제공합니다.

## 🛠️ 사용 기술

- **ESLint**: v9.34.0 (Flat Config)
- **TypeScript ESLint**: v8.40.0
- **React ESLint Plugin**: v7.37.5
- **Prettier 통합**: `eslint-config-prettier`로 Prettier와 충돌 방지

## 📁 폴더 구조

```
packages/eslint-config/
├── base.js              # 기본 ESLint 설정 (Node.js 프로젝트용)
├── react-internal.js    # React 프로젝트용 설정
├── next.js              # Next.js 프로젝트용 설정
├── eslint.config.js     # 패키지 자체를 위한 ESLint 설정
├── package.json
└── README.md
```

## 📦 설치

이 패키지는 워크스페이스 내부 패키지이므로, 루트에서 `pnpm install`을 실행하면 자동으로 설치됩니다.

외부 프로젝트에서 사용하려면 `package.json`에 다음을 추가하세요:

```json
{
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "eslint": "^9.34.0"
  }
}
```

## 🚀 사용 방법

### React 프로젝트

프로젝트 루트에 `eslint.config.js` (또는 `eslint.config.mjs`) 파일을 생성하세요:

```javascript
import { config } from '@repo/eslint-config/react-internal';

export default [
  ...config,
  {
    // 프로젝트 특정 설정이 필요한 경우 추가
    files: ['src/**/*.{ts,tsx,js,jsx}'],
  },
];
```

### Next.js 프로젝트

```javascript
import { nextJsConfig } from '@repo/eslint-config/next-js';

export default [
  ...nextJsConfig,
  {
    // 프로젝트 특정 설정이 필요한 경우 추가
  },
];
```

### Node.js 프로젝트

```javascript
import { config } from '@repo/eslint-config/base';

export default [
  ...config,
  {
    // 프로젝트 특정 설정이 필요한 경우 추가
  },
];
```

### 린트 실행

설정이 적용되면 다음 명령어로 코드를 린트할 수 있습니다:

```bash
# 특정 파일 린트
npx eslint "src/**/*.{js,jsx,ts,tsx}"

# 또는 package.json에 스크립트 추가
{
  "scripts": {
    "lint": "eslint \"src/**/*.{js,jsx,ts,tsx}\""
  }
}
```

## ⚙️ 설정 내용

### base.js (기본 설정)

- JavaScript 권장 규칙 (`@eslint/js`)
- TypeScript ESLint 권장 규칙
- Prettier 통합 (`eslint-config-prettier`)
- Turborepo 플러그인 (환경 변수 검사)

### react-internal.js (React 설정)

- base 설정 포함
- React 권장 규칙 (`eslint-plugin-react`)
- React Hooks 규칙 (`eslint-plugin-react-hooks`)
- 브라우저 및 Service Worker 글로벌 변수

### next.js (Next.js 설정)

- base 설정 포함
- Next.js 플러그인 (`@next/eslint-plugin-next`)
- Next.js 특화 규칙

## 📝 참고사항

- ESLint 9.x의 Flat Config 형식을 사용합니다.
- Prettier와 함께 사용되며, `eslint-config-prettier`로 충돌을 방지합니다.
- 필요에 따라 프로젝트별로 `eslint.config.js`에서 추가 설정을 오버라이드할 수 있습니다.
- TypeScript 프로젝트에서는 TypeScript ESLint 규칙이 자동으로 적용됩니다.
