import { useState, useEffect } from 'react';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import type { IGetShop } from '@repo/api/types';

interface UseCustomerLanguageSettingsReturn {
  showLanguageSelector: boolean;
}

/**
 * 고객 메뉴판 언어 설정을 관리하는 커스텀 훅
 *
 * @description
 * - 매장 기본 언어를 설정합니다 (사용자가 이미 언어를 선택한 경우 덮어쓰지 않음)
 * - 다국어 기능이 활성화되어 있고 언어가 선택되지 않은 경우 언어 선택 화면을 표시합니다
 *
 * @param shopDetailData - 매장 상세 데이터
 * @returns 언어 선택 화면 노출 여부
 */
export const useCustomerLanguageSettings = (
  shopDetailData: IGetShop | null
): UseCustomerLanguageSettingsReturn => {
  const { data: languageData, setData: setLanguageData } =
    useCustomerLanguageStore();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // 고객 메뉴판 기본 언어 설정
  useEffect(() => {
    if (!shopDetailData) {
      return;
    }

    // 사용자가 이미 언어를 선택한 경우 기본값으로 덮어쓰지 않음
    if (languageData.isSelected) {
      return;
    }

    setLanguageData({
      currentLanguage: shopDetailData.shopSetting.shopLanguage,
    });
  }, [shopDetailData, setLanguageData, languageData.isSelected]);

  // 고객 메뉴판 언어 선택 화면 노출 여부
  useEffect(() => {
    if (!shopDetailData) {
      return;
    }

    if (!shopDetailData.shopSetting.useLocale) {
      setShowLanguageSelector(false);
      return;
    }

    if (languageData.isSelected) {
      setShowLanguageSelector(false);
      return;
    }

    setShowLanguageSelector(true);
  }, [shopDetailData, languageData, setShowLanguageSelector, setLanguageData]);

  return {
    showLanguageSelector,
  };
};
