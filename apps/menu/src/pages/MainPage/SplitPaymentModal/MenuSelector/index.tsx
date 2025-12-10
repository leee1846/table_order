import { CheckButton } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/MenuSelector/menuSelector.style';
import { css } from '@emotion/react';
import { useState } from 'react';
import { OptionDetailModal } from '@/pages/MainPage/SplitPaymentModal/MenuSelector/OptionDetailModal';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';

export const MenuSelector = () => {
  const menuList = Array.from(
    { length: 40 },
    (_, index) => `menu-${index + 1}`
  );
  const { t } = useCustomerTranslation();

  const [isOptionDetailModalOpen, setIsOptionDetailModalOpen] = useState(false);

  const onClickOptionDetail = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsOptionDetailModalOpen(true);
  };

  return (
    <>
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
                checked={true}
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
                <div onClick={onClickOptionDetail}>{t('옵션')}</div>
              </S.ButtonRightContainer>
            </button>
          </S.MenuItem>
        ))}
      </S.MenuList>

      {isOptionDetailModalOpen && (
        <OptionDetailModal onClose={() => setIsOptionDetailModalOpen(false)} />
      )}
    </>
  );
};
