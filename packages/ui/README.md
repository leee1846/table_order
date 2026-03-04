# @repo/ui

공유 UI 컴포넌트 및 스타일 라이브러리입니다. 프로젝트 전반에서 사용되는 React 컴포넌트, 아이콘, 테마 시스템을 제공합니다.

## 📋 역할 및 성격

이 패키지는 다음과 같은 성격을 가진 UI 라이브러리입니다:

- **재사용성**: 여러 프로젝트에서 공통으로 사용되는 UI 컴포넌트
- **일관성**: 통일된 디자인 시스템과 테마 적용
- **타입 안정성**: TypeScript로 작성되어 타입 안정성 보장
- **다크모드 지원**: 라이트/다크 모드 테마 지원

## 🛠️ 사용 기술

- **스타일링**: [Emotion](https://emotion.sh/) (`@emotion/react`, `@emotion/styled`)
- **React**: v19.1.1

## 📁 폴더 구조

```
packages/ui/
├── src/
│   ├── components/        # UI 컴포넌트
│   ├── contexts/         # 스타일 관련 React Context
│   ├── hooks/            # 스타일 관련 커스텀 훅
│   ├── icons/            # 아이콘 컴포넌트 및 이미지
│   ├── styles/           # 전역 설정 및 재사용 스타일
│   ├── theme/            # 스타일 테마 시스템
│   ├── fonts/            # 폰트 파일
│   └── provider.tsx      # ThemeProvider
```

## 📦 설치

이 패키지는 워크스페이스 내부 패키지이므로, 루트에서 `pnpm install`을 실행하면 자동으로 설치됩니다.

외부 프로젝트에서 사용하려면 `package.json`에 다음을 추가하세요:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

## 🚀 사용 방법

### Apps 프로젝트 초기 설정

#### 1. TypeScript 타입 설정

`@repo/ui`의 테마 타입을 Emotion에 등록하기 위해 프로젝트 루트에 `emotion.d.ts` 파일을 생성하세요:

```typescript
// emotion.d.ts
import '@emotion/react';
import type { Theme as UITheme } from '@repo/ui';

declare module '@emotion/react' {
  export interface Theme extends UITheme {}
}
```

#### 2. main.tsx 설정

앱의 진입점(`main.tsx` 또는 `App.tsx`)에서 Provider를 설정하세요:

```typescript
// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeModeProvider, DynamicThemeProvider } from '@repo/ui';
import { GlobalDialogContainer, ToastMessage } from '@repo/feature/components';
import { router } from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 다크모드 미지원 (기본 라이트 모드) */}
    <ThemeModeProvider active={false} initialMode="light">
      <DynamicThemeProvider>
        <RouterProvider router={router} />
        <GlobalDialogContainer />
        <ToastMessage />
      </DynamicThemeProvider>
    </ThemeModeProvider>

    {/* 다크모드 지원 */}
    {/* <ThemeModeProvider active={true}>
      <DynamicThemeProvider>
        <RouterProvider router={router} />
        <GlobalDialogContainer />
        <ToastMessage />
      </DynamicThemeProvider>
    </ThemeModeProvider> */}
  </StrictMode>
);
```

**필수 컴포넌트:**
- `GlobalDialogContainer`: 전역 다이얼로그 컨테이너 (다이얼로그를 전역에서 관리)
- `ToastMessage`: 토스트 메시지 컨테이너 (알림 메시지 표시)

**ThemeModeProvider Props:**
- `active`: 다크모드 활성화 여부 (기본값: `false`)
- `initialMode`: 초기 테마 모드 (`'light'` | `'dark'`, 기본값: `'light'`)

#### 3. 컴포넌트 및 아이콘 Import

```typescript
// 컴포넌트
import { BasicButton, Input, Dropdown } from '@repo/ui/components';

// 아이콘
import { MenuIcon, ArrowBackIcon, CheckIcon } from '@repo/ui/icons';
```

## 📝 참고사항

- Emotion을 사용하여 CSS-in-JS 방식으로 스타일링됩니다.
- 다크모드를 사용하려면 `ThemeModeProvider`와 `DynamicThemeProvider`를 함께 사용해야 합니다.
