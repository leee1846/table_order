# @repo/ui

공유 React UI 컴포넌트 라이브러리 with Emotion CSS-in-JS

## 설치

모노레포 workspace 패키지로 자동 연결됩니다.

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1"
  }
}
```

⚠️ **중요:** 앱에서도 `@emotion/react`와 `@emotion/styled`를 직접 설치해야 합니다!

## 사용법

### 1. ThemeProvider로 앱 감싸기

```tsx
// main.tsx
import { ThemeProvider } from '@repo/ui';

<ThemeProvider>
  <App />
</ThemeProvider>;
```

### 2. 컴포넌트 사용

```tsx
import { Button } from '@repo/ui';

<Button variant="primary" size="md">클릭</Button>
<Button variant="secondary">보조</Button>
<Button variant="outline" size="lg">외곽선</Button>
<Button variant="ghost" disabled>비활성화</Button>
```

### 3. Theme 사용

```tsx
import styled from '@emotion/styled';

const CustomCard = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;
```

## 구조

```
packages/ui/src/
├── Button/              # 컴포넌트 폴더
│   ├── index.tsx        # 컴포넌트 로직
│   └── button.styles.ts # Emotion 스타일
├── theme/               # 디자인 토큰
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
├── styles/              # 글로벌 스타일
│   ├── reset.ts
│   └── global.ts
├── provider.tsx         # ThemeProvider
└── index.ts            # 통합 export
```

## Theme 구조

```typescript
theme.colors.primary.main; // #0070f3
theme.colors.grey[500]; // #6b7280
theme.typography.fontSize.base; // 1rem
theme.spacing[4]; // 1rem
theme.borderRadius.md; // 0.375rem
theme.shadows.md; // box-shadow
```
