# Conventions

---

## 명명 규칙 (비표준 항목만)

| 대상 | 규칙 | 예시 |
|------|------|------|
| Zustand 스토어 | `use*Store` | `usePosOrderStore` |
| 아이콘 컴포넌트 | PascalCase + `Icon` | `AddIcon` |
| 스타일 파일 | camelCase + `.styles.ts` | `basicButton.styles.ts` |
| TS Interface | `I` prefix | `IProps`, `IPosOrderStore` |
| TS Type | `T` prefix | `TDialogConfig` |

Props 인터페이스는 항상 `IProps`로 고정한다.

---

## 컴포넌트 폴더 구조

해당 컴포넌트에서만 쓰이는 파일은 같은 폴더 안에 둔다.

```
ComponentName/
  index.tsx
  componentName.styles.ts
  componentName.types.ts
  useComponentName.ts
  componentNameUtils.ts
  SubComponent/
```

---

## 컴포넌트 작성 규칙

- `displayName` 필수: `ComponentName.displayName = 'ComponentName'`
- named export만 사용 (default export 금지)
- 스타일 import: `import * as S from './componentName.styles'`
- **`useMemo` / `useCallback` / `memo` 추가 금지** — React Compiler가 자동 처리

---

## 스타일 토큰

```ts
import { theme, TYPOGRAPHY } from '@repo/ui';

theme.colors.*   // 고정 색상 (라이트 전용)
theme.mode.*     // 다크모드 대응 색상 → ({ theme }) => theme.mode.grey[900]
TYPOGRAPHY.BD_1  // 타이포그래피 상수
```

---

## TypeScript

- `any` 금지, 타입 단언(`as`, `<T>value`) 금지
- `noUncheckedIndexedAccess` 활성화 — 배열 인덱스 접근 후 undefined 체크 필수
- exported 함수에 반환 타입 명시

---

## JSDoc

`packages/ui` · `packages/feature` · `packages/api` exported 항목에만 추가.  
앱 내부 페이지 컴포넌트·자명한 one-liner는 불필요.

---

## 순수 함수

`packages/util` 내 함수는 순수 함수만 허용 — 외부 상태 읽기·쓰기·인자 변형 금지.
