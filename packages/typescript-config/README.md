# @repo/typescript-config

Turborepo 전체에서 공유하는 TypeScript 설정입니다.

## 사용법

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
