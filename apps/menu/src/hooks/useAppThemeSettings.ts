import { useEffect, useContext } from 'react';
import { ThemeModeContext, type ThemeModeContextValue } from '@repo/ui';
import type { IGetShopThemeMenu } from '@repo/api/types';

/**
 * 매장 설정에 따라 앱 테마(다크/라이트 모드)를 적용하는 커스텀 훅
 *
 * @description
 * - 매장 테마 설정에 따라 다크/라이트 모드를 자동으로 적용합니다
 * - MainPage에서만 사용되며, 다른 페이지로 이동 시 항상 라이트 모드로 복원됩니다
 *
 * @param shopThemeData - 매장 테마 메뉴 데이터 (useDarkTheme 속성 포함)
 */
export const useAppThemeSettings = (
  shopThemeData: IGetShopThemeMenu | null
): void => {
  const context = useContext<ThemeModeContextValue | undefined>(
    ThemeModeContext
  );

  // 매장 테마 설정 변경 시 테마 모드 업데이트
  useEffect(() => {
    // context가 없으면 early return (HMR 중에 발생할 수 있음)
    if (!context) {
      return;
    }

    // MainPage에서 매장 설정에 따라 테마 변경
    // shopThemeData.useDarkTheme가 true이면 dark 모드, false이면 light 모드 적용
    if (shopThemeData?.useDarkTheme) {
      context.setMode('dark');
    } else {
      context.setMode('light');
    }

    // cleanup: MainPage에서 벗어날 때 항상 light 모드로 복원
    // 다른 페이지로 이동하거나 컴포넌트가 언마운트될 때 실행됨
    return () => {
      context.setMode('light');
    };
  }, [shopThemeData?.useDarkTheme, context]);
};
