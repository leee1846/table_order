import { createPortal } from 'react-dom';
import * as S from '@/pages/MainPage/CartList/cartList.style';
import { BasicButton, NumberInput } from '@repo/ui/components';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { DeleteIcon, EmptedCartIcon } from '@repo/ui/icons';
import { theme, useThemeMode } from '@repo/ui';
import { openDualActionDialog } from '@repo/feature/utils';

const hasOptions = false;
const menuList = Array.from({ length: 5 });

interface Props {
  onClose: () => void;
  openOrderCompleteModal: () => void;
}
export const CartList = ({ onClose, openOrderCompleteModal }: Props) => {
  const { t } = useTranslation();
  const { mode } = useThemeMode();

  const [quantity, setQuantity] = useState(1);

  const closeCartList = () => {
    onClose();
  };

  const order = () => {
    openDualActionDialog({
      title: t('메뉴를 주문할까요?'),
      content: t('주방 접수된 이후에는 취소가 불가능해요.'),
      primaryText: t('주문하기'),
      secondaryText: t('이전으로'),
      onConfirm: () => {
        onClose();
        openOrderCompleteModal();
      },
    });
  };

  return createPortal(
    <S.Background onClick={closeCartList}>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <S.Title>{t('장바구니')}</S.Title>

        <S.OrderList>
          {menuList.length < 1 && (
            <S.NoContent>
              <EmptedCartIcon mode={mode} width={52} height={52} />
              <p>{t('현재 담긴 메뉴가 없어요.')}</p>
            </S.NoContent>
          )}

          {menuList.map((_, index) => (
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
                <S.DeleteButton onClick={() => {}}>
                  <DeleteIcon
                    color={
                      mode === 'dark'
                        ? theme.darkModeColors.grey[600]
                        : theme.colors.grey[600]
                    }
                  />
                </S.DeleteButton>
                <NumberInput
                  variant="square"
                  size="L"
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
          <BasicButton variant="Solid_Blue_2XL" onClick={order}>
            {t('주문하기')}
          </BasicButton>
        </S.TotalContainer>
      </S.Container>
    </S.Background>,
    document.body
  );
};
