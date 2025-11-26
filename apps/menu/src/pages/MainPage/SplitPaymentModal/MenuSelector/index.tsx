import { CheckButton } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/MenuSelector/menuSelector.style';
import { css } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { OptionDetailModal } from '@/pages/MainPage/SplitPaymentModal/MenuSelector/OptionDetailModal';

export const MenuSelector = () => {
  const menuList = Array.from({ length: 4 }, (_, index) => `menu-${index + 1}`);
  const { t } = useTranslation();

  const [isOptionDetailModalOpen, setIsOptionDetailModalOpen] = useState(false);

  return (
    <>
      <S.Container>
        <S.SelectedMenuContainer>
          <p>{t('선택한 메뉴')}</p>
          <p>
            <span>{t('{{count}}개', { count: 2 })}</span>/
            {t('{{count}}개', { count: 3 })}
          </p>
        </S.SelectedMenuContainer>

        <S.MenuList>
          {menuList.map((_, index) => (
            <S.MenuItem key={`menu-${index + 1}`} isSelected={true}>
              <button type="button">
                <CheckButton
                  checked={false}
                  customStyle={css`
                    & > div {
                      width: 28px;
                      height: 28px;
                    }
                  `}
                >
                  <S.MenuName>메뉴 이름???????????</S.MenuName>
                </CheckButton>
                <S.ButtonRightContainer>
                  <p>{t('{{amount}}원', { amount: 10000 })}</p>
                  <button
                    type="button"
                    onClick={() => setIsOptionDetailModalOpen(true)}
                  >
                    {t('옵션')}
                  </button>
                </S.ButtonRightContainer>
              </button>
            </S.MenuItem>
          ))}
        </S.MenuList>

        <S.TotalContainer>
          <S.TotalInfo>
            <p>{t('총 결제금액')}</p>
            <p>{t('{{amount}}원', { amount: 10000 })}</p>
          </S.TotalInfo>
          <S.RemainingAmount>
            <p>{t('남은 결제 금액')}</p>
            <p>{t('{{amount}}원', { amount: 10000 })}</p>
          </S.RemainingAmount>
        </S.TotalContainer>
      </S.Container>

      {isOptionDetailModalOpen && (
        <OptionDetailModal onClose={() => setIsOptionDetailModalOpen(false)} />
      )}
    </>
  );
};
