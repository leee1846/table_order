# @repo/prettier-config

공유 Prettier 설정 라이브러리입니다. 프로젝트 전반에서 사용되는 코드 포맷팅 규칙을 제공합니다.

## 📁 폴더 구조

```
packages/prettier-config/
├── index.js              # Prettier 공통 설정
├── .prettierrc.js        # 패키지 자체를 위한 Prettier 설정
├── package.json
└── README.md
```

## 📦 설치

이 패키지는 워크스페이스 내부 패키지이므로, 루트에서 `pnpm install`을 실행하면 자동으로 설치됩니다.

외부 프로젝트에서 사용하려면 `package.json`에 다음을 추가하세요:

```json
{
  "devDependencies": {
    "@repo/prettier-config": "workspace:*",
    "prettier": "^3.6.2"
  }
}
```

## 🚀 사용 방법

### package.json 설정

프로젝트의 `package.json`에 `prettier` 필드를 추가하여 설정을 확장합니다:

```json
{
  "prettier": "@repo/prettier-config"
}
```

### 포맷팅 실행

설정이 적용되면 다음 명령어로 코드를 포맷팅할 수 있습니다:

```bash
# 특정 파일 포맷팅
npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,md}"

# 또는 package.json에 스크립트 추가
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,md}\""
  }
}
```

## ⚙️ 설정 내용

현재 적용된 주요 설정:

- **들여쓰기**: 2칸 스페이스
- **세미콜론**: 항상 사용
- **따옴표**: 작은따옴표 사용 (JSX는 큰따옴표)
- **후행 쉼표**: ES5 호환 가능한 곳에만
- **한 줄 최대 길이**: 80자
- **화살표 함수 파라미터**: 항상 괄호 사용

전체 설정은 `index.js` 파일을 참고하세요.

## 📝 참고사항

- 필요에 따라 프로젝트별로 `.prettierrc.js` 파일을 생성하여 설정을 오버라이드할 수 있습니다.
- ESLint와 함께 사용할 경우 `eslint-config-prettier`를 사용하여 충돌을 방지하세요.
