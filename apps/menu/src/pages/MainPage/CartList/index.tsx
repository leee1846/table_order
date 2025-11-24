import * as S from '@/pages/MainPage/CartList/cartList.style';
import { BasicButton, NumberInput } from '@repo/ui/components';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { DeleteIcon } from '@repo/ui/icons';
import { theme, useThemeMode } from '@repo/ui';

interface Props {
  onClose: () => void;
}
export const CartList = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const hasOptions = true;

  const [quantity, setQuantity] = useState(1);

  const closeCartList = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClose();
  };

  return (
    <S.Background type="button" onClick={closeCartList}>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <S.Title>{t('장바구니')}</S.Title>

        <S.OrderList>
          {Array.from({ length: 4 }).map((_, index) => (
            <S.OrderItem key={`order-${index + 1}`}>
              <S.OrderMenu>
                <p>메뉴 이름???</p>
                <p>10000????</p>
              </S.OrderMenu>
              {hasOptions && (
                <S.Options>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <S.OptionItem key={`option-${index + 1}`}>
                      <p>
                        <span />
                        옵션 이름???adsasdsaddasdasdasdds
                      </p>
                      <div>
                        <p>10000????</p>
                        <p>10000????</p>
                      </div>
                    </S.OptionItem>
                  ))}
                  <div>
                    <button type="button">옵션</button>
                  </div>
                </S.Options>
              )}

              <S.ButtonContainer>
                <BasicButton variant="Outline_Navy_M" onClick={() => {}}>
                  <DeleteIcon
                    color={
                      mode === 'dark'
                        ? theme.darkModeColors.grey[600]
                        : theme.colors.grey[600]
                    }
                  />
                </BasicButton>
                <NumberInput
                  variant="square"
                  size="S"
                  min={1}
                  value={quantity}
                  onChange={setQuantity}
                />
              </S.ButtonContainer>
            </S.OrderItem>
          ))}
        </S.OrderList>

        <S.TotalContainer>
          <S.TotalInfo>
            <p>{t('합계')}</p>
            <p>10000??</p>
          </S.TotalInfo>
          <BasicButton variant="Solid_Sky_Blue_2XL" onClick={() => {}}>
            {t('주문하기')}
          </BasicButton>
        </S.TotalContainer>
      </S.Container>
    </S.Background>
  );
};
