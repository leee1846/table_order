# @repo/ui

공유 React UI 컴포넌트 라이브러리 with Emotion CSS-in-JS

## 설치 방법

앱의 `package.json`에 의존성을 추가합니다

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1"
  }
}
```

그 다음 의존성을 설치합니다:

```bash
pnpm install
```

## 사용 방법

### 1. ThemeProvider로 앱 감싸기

```tsx
// main.tsx
import { ThemeProvider } from '@repo/ui';

<ThemeProvider>
  <App />
</ThemeProvider>;
```

### 2. Theme 사용

```tsx
import styled from '@emotion/styled';
import { theme } from '@repo/ui';

const CustomCard = styled.div`
  background-color: ${theme.colors.grey[800]};
`;
```

### 3. 컴포넌트 사용

```tsx
import { Dropdown } from '@repo/ui/components';

<Dropdown options={[]} value={''} onChange={() => {}} />;
```
