import * as S from '@/pages/MainPage/Sidebar/sidebar.style';
import { CallBellIcon } from '@repo/ui/icons';
import { baseTheme } from '@repo/ui';
import { StaffCallModal } from '@/pages/MainPage/StaffCallModal';
import type { ICategoryWithMenus } from '@repo/api/types';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useDisableStaffCallStore } from '@/stores/useDisableStaffCallStore';
import { toast } from '@repo/feature/utils';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { LANGUAGE_CONFIG } from '@/constants/common';
import { LanguageSelectorModal } from '@/pages/MainPage/LanguageSelectorModal';
import { useModalStore } from '@/stores/useModalStore';
import { useShopDetailStore } from '@/stores/useShopDetailStore';

interface Props {
  categories: ICategoryWithMenus[];
  staffCallCategory?: ICategoryWithMenus;
  selectedCategorySeq: number;
  handleCategoryClick: (category: ICategoryWithMenus) => void;
}

export const Sidebar = ({
  categories,
  staffCallCategory,
  selectedCategorySeq,
  handleCategoryClick,
}: Props) => {
  const { t } = useCustomerTranslation();

  const isStaffCallModalOpened = useModalStore(
    (s) => s.data.isStaffCallModalOpened
  );
  const isLanguageSelectorModalOpened = useModalStore(
    (s) => s.data.isLanguageSelectorModalOpened
  );

  const currentLanguage = useCustomerLanguageStore(
    (s) => s.data.currentLanguage
  );
  const { data: disableStaffCallData } = useDisableStaffCallStore();
  const shopDetailData = useShopDetailStore((s) => s.data);

  const currentLanguageIcon = LANGUAGE_CONFIG[currentLanguage].flag;

  const handleStaffCallClick = () => {
    if (
      !useShopDetailStore.getState().data?.shopSetting?.isMenuboardOrderable
    ) {
      toast(t('주문하기 기능이 비활성화 되었습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    if (disableStaffCallData.disableStaffCall) {
      toast(t('잠시 후 다시 시도해주세요.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    useModalStore.getState().setModalData('isStaffCallModalOpened', true);
  };

  return (
    <>
      <S.Container role="navigation" aria-label={t('메뉴 카테고리')}>
        {categories.map((category) => {
          const categoryName =
            category.localeCategoryName?.[currentLanguage] ??
            category.categoryName;

          return (
            <S.CategoryButton
              isActive={selectedCategorySeq === category.categorySeq}
              key={category.categorySeq}
              type="button"
              onClick={() => handleCategoryClick(category)}
              aria-label={`${t('카테고리 선택')}: ${categoryName}`}
              aria-pressed={selectedCategorySeq === category.categorySeq}
            >
              {categoryName}
            </S.CategoryButton>
          );
        })}

        <S.FloatingContainer>
          {staffCallCategory && (
            <S.StaffCall>
              <button
                type="button"
                onClick={handleStaffCallClick}
                aria-label={t('직원 호출하기')}
              >
                <CallBellIcon
                  color={baseTheme.colors.white}
                  width={30}
                  height={30}
                />
                {staffCallCategory.localeCategoryName?.[currentLanguage] ??
                  staffCallCategory.categoryName}
              </button>
            </S.StaffCall>
          )}
          {shopDetailData?.shopSetting?.useLocale &&
            shopDetailData?.shopSetting?.shopLocaleMapList.length > 1 && (
              <S.Language>
                <button
                  type="button"
                  onClick={() =>
                    useModalStore
                      .getState()
                      .setModalData('isLanguageSelectorModalOpened', true)
                  }
                  aria-label={t('언어 선택하기')}
                >
                  <img src={currentLanguageIcon} alt={t('국기 아이콘')} />
                  LANGUAGE
                </button>
              </S.Language>
            )}
        </S.FloatingContainer>
      </S.Container>

      {isStaffCallModalOpened && staffCallCategory && (
        <StaffCallModal
          onClose={() =>
            useModalStore
              .getState()
              .setModalData('isStaffCallModalOpened', false)
          }
          category={staffCallCategory}
        />
      )}

      {isLanguageSelectorModalOpened && (
        <LanguageSelectorModal
          onClose={() =>
            useModalStore
              .getState()
              .setModalData('isLanguageSelectorModalOpened', false)
          }
        />
      )}
    </>
  );
};
