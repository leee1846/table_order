# @repo/typescript-config

공유 TypeScript 설정 라이브러리입니다. 프로젝트 전반에서 사용되는 TypeScript 컴파일러 설정을 제공합니다.

## 📁 폴더 구조

```
packages/typescript-config/
├── base.json              # 기본 TypeScript 설정 (Node.js 프로젝트용)
├── vite-react.json        # Vite React 프로젝트용 설정
├── vite-react-app.json    # apps용: @repo/* 패키지 소스 경로 매핑 (IDE 실시간 타입용)
├── nextjs.json            # Next.js 프로젝트용 설정
├── react-library.json     # React 라이브러리 프로젝트용 설정
├── images.d.ts            # 이미지 및 JSON 파일 타입 정의
├── woff2.d.ts             # 폰트 파일 타입 정의
```

## 📦 설치

이 패키지는 워크스페이스 내부 패키지이므로, 루트에서 `pnpm install`을 실행하면 자동으로 설치됩니다.

외부 프로젝트에서 사용하려면 `package.json`에 다음을 추가하세요:

```json
{
  "devDependencies": {
    "@repo/typescript-config": "workspace:*"
  }
}
```

## 🚀 사용 방법

### Vite React 프로젝트

`tsconfig.json`에서 확장:

```json
{
  "extends": "@repo/typescript-config/vite-react.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo"
  },
  "include": ["src"]
}
```

### Apps (menu, admin 등) – IDE 실시간 타입 + CLI(dist) 분리

apps에서는 **두 개의 tsconfig**를 사용해 다음을 나눕니다.

| 용도 | 사용하는 설정 | `@repo/*` 해석 |
|------|----------------|----------------|
| **IDE** | `tsconfig.app.json` | 패키지 **소스** → 수정 시 실시간 반영 |
| **check-types / build** | `tsconfig.app.check.json` | **dist** (빌드된 .d.ts) → 패키지 소스를 앱 설정으로 검사하지 않음 |

- **`tsconfig.app.json`**  
  - `extends`: `@repo/typescript-config/vite-react-app.json`  
  - `paths`에 `@/*`와 **`@repo/*` 전부** 명시 (자식 config의 `paths`가 부모를 덮어쓰므로, 앱에서 다시 적어야 IDE가 소스를 봄).
- **`tsconfig.app.check.json`**  
  - `extends`: `./tsconfig.app.json`  
  - `paths`는 `@/*`만 두고 `@repo/*`는 없음 → `@repo/*`는 node_modules(dist)로만 해석.

**package.json 스크립트**

- `check-types`: `tsc -p tsconfig.app.check.json && tsc -p tsconfig.node.json`  
  → dist 기준 타입 검사만 수행.
- `build:dev` / `build:prod` / `build:stage`: 동일하게 `tsconfig.app.check.json`으로 타입 검사 후 vite 빌드.

**새 앱 추가 시**

1. `tsconfig.app.json`: `extends`를 `@repo/typescript-config/vite-react-app.json`로 하고, `paths`에 `@/*`와 `@repo/api`, `@repo/util`, `@repo/feature`, `@repo/ui` 경로(앱 기준 `../../packages/.../src`)를 넣음.
2. `tsconfig.app.check.json`: `extends`를 `./tsconfig.app.json`로 하고, `compilerOptions.paths`는 `{ "@/*": ["./src/*"] }`만 지정.

### Next.js 프로젝트

```json
{
  "extends": "@repo/typescript-config/nextjs.json"
}
```

### React 라이브러리

```json
{
  "extends": "@repo/typescript-config/react-library.json"
}
```

### Node.js 프로젝트

```json
{
  "extends": "@repo/typescript-config/base.json"
}
```

## 📝 참고사항

- 필요에 따라 각 프로젝트의 `tsconfig.json`에서 추가 설정을 오버라이드할 수 있습니다.
- packages 타입 변경 후 앱에서 반영되려면: **IDE**는 `tsconfig.app.json`으로 소스를 보므로 바로 반영되고, **check-types**는 패키지 `pnpm run build`로 dist가 갱신된 뒤에 실행해야 합니다.
