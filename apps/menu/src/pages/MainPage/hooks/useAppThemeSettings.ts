import { useEffect, useContext } from 'react';
import { ThemeModeContext, type ThemeModeContextValue } from '@repo/ui';
import type { IGetShopThemeMenu } from '@repo/api/types';

/**
 * 상점 설정에 따라 앱 테마(다크/라이트 모드)를 적용함
 *
 * @param shopThemeData - 매장 상세 데이터
 */
export const useAppThemeSettings = (
  shopThemeData: IGetShopThemeMenu | null
): void => {
  // HMR 중 context 손실을 방지하기 위해 직접 useContext 사용
  const context = useContext<ThemeModeContextValue | undefined>(
    ThemeModeContext
  );

  useEffect(() => {
    // context가 없으면 early return (HMR 중에 발생할 수 있음)
    if (!context) {
      return;
    }

    if (shopThemeData?.useDarkTheme) {
      context.setMode('dark');
      return;
    }

    context.setMode('light');
  }, [shopThemeData?.useDarkTheme, context]);
};
