# CLAUDE.md — packages/ui

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 코드 작성 시 `docs/conventions.md`의 규칙을 따른다.

## 패키지 역할

두 앱이 공유하는 디자인 시스템. 테마 토큰, 공통 UI 컴포넌트, 아이콘, 전역 스타일을 제공한다.

---

## 테마 시스템

### 구조

`createTheme(mode)` → `theme` 객체를 생성해 Emotion `ThemeProvider`로 주입.

```ts
theme.colors        // 라이트 고정 색상 (브랜드, 시맨틱)
theme.mode          // 현재 모드에 따라 자동 전환되는 색상 (grey, background 등)
theme.typography    // TYPOGRAPHY 상수
theme.zIndex        // 레이어 상수
theme.spacing       // 다이얼로그 너비 등 간격
```

컴포넌트 내에서 테마 접근:

```ts
import { useThemeMode } from '@repo/ui';

const { theme } = useThemeMode();
// theme.mode.grey[200], theme.colors.primary[500]
```

### 토큰 추가 방법

**색상** — `theme/colors.ts`의 `colors` 객체와 `theme/modeColors.ts`의 `darkModeColors` 객체 **모두** 추가해야 한다.

```ts
// colors.ts
export const colors = {
  newCategory: { 100: '#...', 200: '#...' },
} as const;

// modeColors.ts
export const darkModeColors = {
  newCategory: { 100: '#...', 200: '#...' },  // 다크모드 값
} as const;
```

**타이포그래피** — `theme/typography.ts`의 `TYPOGRAPHY` 상수에 추가.

```ts
// 네이밍 컨벤션: MT(Main Title), ST(Sub Title), BD(Body), CT(Caption) + 숫자
export const TYPOGRAPHY = {
  BD_4: { fontSize: '13px', lineHeight: '1.5', fontWeight: 400 },
} as const;
```

**zIndex** — `theme/zIndex.ts`에 추가.

```ts
export const zIndex = {
  newLayer: 1500,
} as const;
```

---

## 새 컴포넌트 추가

```
components/NewComponent/
  index.tsx
  newComponent.styles.ts
```

```tsx
// index.tsx
import { useThemeMode } from '../../hooks/useThemeMode';
import * as S from './newComponent.styles';

interface IProps {
  label: string;
  customStyle?: SerializedStyles;
}

export const NewComponent = ({ label, customStyle }: IProps) => {
  const { theme } = useThemeMode();
  return <S.Container theme={theme} css={customStyle}>{label}</S.Container>;
};
NewComponent.displayName = 'NewComponent';
```

```ts
// newComponent.styles.ts
import styled from '@emotion/styled';
import type { Theme } from '../../theme';

export const Container = styled.div<{ theme: Theme }>`
  color: ${({ theme }) => theme.mode.grey[900]};
`;
```

`components/index.ts`에 export 추가.

---

## 테마 프로바이더 계층

앱 진입점의 프로바이더 순서 (건드리지 않는다):

```
ThemeModeProvider        ← 라이트/다크 모드 상태 관리 (localStorage 동기화)
  └─ DynamicThemeProvider ← 모드에 따라 Emotion theme 동적 주입
       └─ 앱 컴포넌트들
```

정적 라이트 전용이 필요한 경우에만 `ThemeProvider` (non-dynamic) 사용.
