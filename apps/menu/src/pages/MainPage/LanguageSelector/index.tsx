import * as S from '@/pages/MainPage/LanguageSelector/languageSelector.style';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { LANGUAGE_CONFIG } from '@/constants/common';
import type { TShopLanguage } from '@repo/api/types';

export const LANGUAGE_CONFIG_LIST = Object.entries(LANGUAGE_CONFIG).map(
  ([value, config]) => ({
    value: value as TShopLanguage,
    label: config.label,
  })
);

export const LanguageSelector = () => {
  const { data: shopDetailData } = useShopDetailData();
  const { setData: setLanguageData } = useLanguageStore();

  if (!shopDetailData) {
    return null;
  }

  return (
    <S.Container>
      <h1>언어 선택</h1>
      <p>주문에 사용하실 언어를 선택해 주세요.</p>
      <S.Buttons>
        {shopDetailData.shopSetting.shopLocaleMapList.map((lang) => {
          const config = LANGUAGE_CONFIG[lang.localeCode as TShopLanguage];
          if (!config) {
            return null;
          }

          return (
            <S.Button key={lang.localeCode}>
              <button
                type="button"
                onClick={() =>
                  setLanguageData({
                    currentLanguage: lang.localeCode as TShopLanguage,
                    isSelected: true,
                  })
                }
              >
                <img src={config.flag} alt={lang.localeCode} />
                {config.label}
              </button>
            </S.Button>
          );
        })}
      </S.Buttons>
    </S.Container>
  );
};
