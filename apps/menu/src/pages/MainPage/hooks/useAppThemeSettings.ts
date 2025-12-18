import { useEffect, useContext } from 'react';
import type { IGetShop } from '@repo/api/types';
import { ThemeModeContext, type ThemeModeContextValue } from '@repo/ui';

/**
 * 상점 설정에 따라 앱 테마(다크/라이트 모드)를 적용함
 *
 * @param shopDetailData - 매장 상세 데이터
 */
export const useAppThemeSettings = (shopDetailData: IGetShop | null): void => {
  // HMR 중 context 손실을 방지하기 위해 직접 useContext 사용
  const context = useContext<ThemeModeContextValue | undefined>(
    ThemeModeContext
  );

  useEffect(() => {
    // context가 없으면 early return (HMR 중에 발생할 수 있음)
    if (!context) {
      return;
    }

    if (!shopDetailData?.shopSetting) {
      context.setMode('light');
      return;
    }

    if (shopDetailData.shopSetting.useDarkTheme) {
      context.setMode('dark');
      return;
    }

    context.setMode('light');
  }, [shopDetailData?.shopSetting, context]);
};
