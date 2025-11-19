# @repo/api

공통 API 패키지입니다. axios와 @tanstack/react-query를 기반으로 구성되어 있습니다.

## 구조

- `cores/`: axios instance 및 endpoints 정의
- `fetchers/`: API 호출 함수들
- `queries/`: React Query hooks
- `types/`: TypeScript 타입 정의

## 사용 방법법

### 1. package.json에 의존성 추가

```json
{
  "dependencies": {
    "@repo/api": "workspace:*",
    "@tanstack/react-query": "^5.62.8",
    "axios": "^1.7.9"
  }
}
```

그 다음 의존성을 설치합니다:

```bash
pnpm install
```
