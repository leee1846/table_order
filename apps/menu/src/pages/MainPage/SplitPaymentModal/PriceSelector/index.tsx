import { css } from '@emotion/react';
import { CheckButton, NumberInput } from '@repo/ui/components';
import { useTranslation } from 'react-i18next';
import * as S from '@/pages/MainPage/SplitPaymentModal/PriceSelector/priceSelector.style';
import { useState } from 'react';

export const PriceSelector = () => {
  const menuList = Array.from(
    { length: 40 },
    (_, index) => `menu-${index + 1}`
  );
  const { t } = useTranslation();

  const [isKeypadOpen, setIsKeypadOpen] = useState(false);

  return (
    <>
      <S.PersonCountContainer>
        <p>인원수</p>
        <NumberInput variant="square" size="M" value={1} onChange={() => {}} />
      </S.PersonCountContainer>

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
                <S.Price>{t('{{amount}}원', { amount: '10000???' })}</S.Price>
              </CheckButton>
              <S.ChangePriceButton
                type="button"
                onClick={() => setIsKeypadOpen(true)}
              >
                금액변경
              </S.ChangePriceButton>
            </button>
          </S.MenuItem>
        ))}
      </S.MenuList>
    </>
  );
};
