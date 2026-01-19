# @repo/typescript-config

공유 TypeScript 설정 라이브러리입니다. 프로젝트 전반에서 사용되는 TypeScript 컴파일러 설정을 제공합니다.

## 📁 폴더 구조

```
packages/typescript-config/
├── base.json              # 기본 TypeScript 설정 (Node.js 프로젝트용)
├── vite-react.json        # Vite React 프로젝트용 설정
├── nextjs.json            # Next.js 프로젝트용 설정
├── react-library.json     # React 라이브러리 프로젝트용 설정
├── images.d.ts           # 이미지 및 JSON 파일 타입 정의
├── woff2.d.ts            # 폰트 파일 타입 정의
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

- 필요에 따라 `tsconfig.json`에서 추가 설정을 오버라이드할 수 있습니다.
