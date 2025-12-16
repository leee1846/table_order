import { useEffect } from 'react';
import { useThemeMode } from '@repo/ui';
import type { IGetShop } from '@repo/api/types';

/**
 * 상점 설정에 따라 앱 테마(다크/라이트 모드)를 적용함
 *
 * @param shopDetailData - 매장 상세 데이터
 */
export const useAppThemeSettings = (shopDetailData: IGetShop | null): void => {
  const { setMode } = useThemeMode();

  useEffect(() => {
    if (!shopDetailData?.shopSetting) {
      setMode('light');
      return;
    }

    if (shopDetailData.shopSetting.useDarkTheme) {
      setMode('dark');
      return;
    }

    setMode('light');
  }, [shopDetailData?.shopSetting, setMode]);
};
