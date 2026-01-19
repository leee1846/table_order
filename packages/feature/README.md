# @repo/feature

공유 기능 라이브러리입니다. apps하위 프로젝트에서 공통으로 사용되는 React 컴포넌트, 커스텀 훅, 유틸리티 함수, 상태 관리 스토어를 제공합니다.

## 📋 역할 및 성격

이 패키지는 다음과 같은 성격을 가진 기능 라이브러리입니다:

- **재사용성**: 여러 프로젝트에서 공통으로 사용되는 기능 컴포넌트 및 로직
- **도메인 특화**: 테이블 관리, 주문 처리, 다이얼로그, 토스트 메시지 등 비즈니스 로직 포함
- **상태 관리**: Zustand를 사용한 전역 상태 관리

## 🛠️ 사용 기술

- **상태 관리**: [Zustand](https://zustand-demo.pmnd.rs/) v5.0.2
- **드래그 앤 드롭**: [@dnd-kit](https://dndkit.com/) v6.1.0
- **스타일링**: [Emotion](https://emotion.sh/) (`@emotion/react`, `@emotion/styled`)
- **다국어**: [i18next](https://www.i18next.com/) v25.6.3
- **라우팅**: [React Router](https://reactrouter.com/) v7.9.4
- **React**: v19.1.1

## 📁 폴더 구조

```
packages/feature/
├── src/
│   ├── components/        # React 컴포넌트
│   ├── hooks/             # 커스텀 훅
│   ├── stores/            # Zustand 스토어
│   ├── utils/             # 유틸리티 함수
│   ├── zustand.ts         # Zustand re-export
│   └── assets/            # 정적 자산
```

## 📦 설치

이 패키지는 워크스페이스 내부 패키지이므로, 루트에서 `pnpm install`을 실행하면 자동으로 설치됩니다.

외부 프로젝트에서 사용하려면 `package.json`에 다음을 추가하세요:

```json
{
  "dependencies": {
    "@repo/feature": "workspace:*",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "i18next": "^25.6.3",
    "react-i18next": "16.3.5",
    "react-router-dom": "^7.9.4",
    "zustand": "^5.0.2"
  },
  "peerDependencies": {
    "react": "^19.0.1",
    "react-dom": "^19.1.1"
  }
}
```

## 🚀 사용 방법

### Apps 프로젝트 초기 설정

#### 1. 필수 컴포넌트 설정

앱의 진입점(`main.tsx`)에서 필수 컴포넌트를 추가하세요:

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
    <ThemeModeProvider active={false} initialMode="light">
      <DynamicThemeProvider>
        <RouterProvider router={router} />
        <GlobalDialogContainer />
        <ToastMessage />
      </DynamicThemeProvider>
    </ThemeModeProvider>
  </StrictMode>
);
```

**필수 컴포넌트:**
- `GlobalDialogContainer`: 전역 다이얼로그 컨테이너 (다이얼로그를 전역에서 관리)
- `ToastMessage`: 토스트 메시지 컨테이너 (알림 메시지 표시)

### 컴포넌트 사용

#### 전역 다이얼로그

```typescript
import { openDualActionDialog, openConfirmDialog } from '@repo/feature/utils';

// 확인 다이얼로그
openConfirmDialog({
  title: '확인',
  message: '정말 삭제하시겠습니까?',
  onConfirm: () => {
    // 확인 시 실행할 로직
  },
});

...
```

#### 토스트 메시지

```typescript
import { toast } from '@repo/feature/utils';

// 성공 메시지
toast.success('저장되었습니다.');
...
```

## 📝 참고사항

- `GlobalDialogContainer`와 `ToastMessage`는 앱의 루트 레벨에 필수로 포함되어야 합니다.
- 다이얼로그와 토스트 메시지는 전역 상태로 관리되며, 어디서든 유틸리티 함수를 통해 호출할 수 있습니다.
- 모든 컴포넌트는 Emotion을 사용하여 CSS-in-JS 방식으로 스타일링됩니다.
