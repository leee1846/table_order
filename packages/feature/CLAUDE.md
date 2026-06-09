# CLAUDE.md — packages/feature

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 코드 작성 시 `docs/conventions.md`의 규칙을 따른다.

## 패키지 역할

두 앱이 공유하는 기능 단위 컴포넌트, Zustand 전역 스토어, 다이얼로그·토스트 시스템, 커스텀 훅.

```
src/
├── components/    # 기능 단위 공유 컴포넌트 (TableDetailContainer, GlobalDialogContainer 등)
├── stores/        # Zustand 전역 스토어
├── hooks/         # 공유 커스텀 훅
└── utils/         # 다이얼로그·토스트 유틸 함수
```

---

## 다이얼로그 시스템

`GlobalDialogContainer`가 앱 루트에 마운트되어 스토어의 큐를 렌더링한다. 직접 컴포넌트를 띄우지 않고 유틸 함수로만 호출한다.

패키지 내부에서는 상대 경로로 import한다.

```ts
// 패키지 내부 (hooks/, components/ 등)
import { openConfirmDialog, openDualActionDialog, openLongContentDialog } from '../utils/dialog';

// 확인 버튼 1개
openConfirmDialog({
  title: '안내',
  content: '처리되었습니다.',
  confirmText: '확인',
  onConfirm: () => {},
  size: 'small',           // tiny | xsmall | small | medium | large | xlarge | 2xlarge
  position: 'center',      // center | top
});

// 버튼 2개 (주요 액션 + 취소)
openDualActionDialog({
  title: '삭제 확인',
  content: '정말 삭제하시겠습니까?',
  primaryText: '삭제',
  secondaryText: '취소',
  onPrimary: () => {},
  onSecondary: () => {},
});

// 스크롤 가능한 긴 내용
openLongContentDialog({ title: '이용약관', content: longText, confirmText: '확인' });
```

> 앱(`apps/admin`, `apps/menu`)에서는 `@repo/feature/utils`로 import한다.

---

## 토스트 시스템

패키지 내부에서는 상대 경로로 import한다.

```ts
// 컴포넌트 내부: 훅 사용
import { useToast } from '../hooks/useToast';
const toast = useToast();
toast('저장되었습니다.', { position: 'top-right', duration: 3000 });

// 컴포넌트 외부 (스토어 액션, 유틸 함수 등): 직접 함수 호출
import { toast } from '../utils/toast';
toast('오류가 발생했습니다.', { position: 'bottom-center' });
```

position 옵션: `top-left | top-center | top-right | bottom-left | bottom-center | bottom-right | center-center`

> 앱에서는 `@repo/feature/hooks`, `@repo/feature/utils`로 import한다.

---

## 새 Zustand 스토어 추가

```ts
// stores/useNewFeatureStore.ts
import { create } from 'zustand';

interface INewFeatureStore {
  data: TItem[];
  setData: (data: TItem[]) => void;
  reset: () => void;
}

const initialState = { data: [] };

export const useNewFeatureStore = create<INewFeatureStore>((set) => ({
  ...initialState,
  setData: (data) => set({ data }),
  reset: () => set(initialState),
}));
```

`stores/index.ts`에 export 추가.

**컴포넌트 외부에서 접근할 때:**

```ts
useNewFeatureStore.getState().setData(items);
```

---

## 새 Feature 컴포넌트 추가

해당 컴포넌트에서만 쓰이는 훅·유틸·서브 컴포넌트는 같은 폴더 안에 둔다 (`docs/conventions.md` 폴더 구조 참고).

```tsx
// components/NewFeature/index.tsx
import { useGetSomething } from '@repo/api';
import { openConfirmDialog } from '../../utils';
import * as S from './newFeature.styles';

interface IProps {
  shopSeq: number;
  onClose: () => void;
}

/** 새 기능 컴포넌트 */
export const NewFeature = ({ shopSeq, onClose }: IProps) => {
  const { data } = useGetSomething({ shopSeq });

  const handleConfirm = () => {
    openConfirmDialog({ title: '완료', content: '처리되었습니다.', confirmText: '확인' });
    onClose();
  };

  return <S.Container>...</S.Container>;
};
NewFeature.displayName = 'NewFeature';
```

`components/index.ts`에 export 추가.

