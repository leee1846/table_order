import { createPortal } from 'react-dom';
import * as S from '@/pages/MainPage/CartList/cartList.style';
import { BasicButton, NumberInput } from '@repo/ui/components';
import { useTranslation } from 'react-i18next';
import { DeleteIcon, EmptedCartIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { openDualActionDialog, toast } from '@repo/feature/utils';
import { useCartStore } from '@/stores/useCartStore';
import { formatCurrency } from '@repo/util/string';

interface Props {
  onClose: () => void;
  openPaymentsModal: () => void;
}
export const CartList = ({ onClose, openPaymentsModal }: Props) => {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const {
    data: cartData,
    removeFromCart,
    updateCartItemQuantity,
  } = useCartStore();

  const removeMenu = (index: number) => {
    removeFromCart(index);
    toast(t('메뉴가 삭제되었습니다.'), {
      position: 'center-center',
      duration: 2000,
    });
  };

  const order = () => {
    openDualActionDialog({
      title: t('메뉴를 주문할까요?'),
      content: t('주방 접수된 이후에는 취소가 불가능해요.'),
      primaryText: t('주문하기'),
      secondaryText: t('이전으로'),
      onConfirm: () => {
        onClose();
        openPaymentsModal();
      },
    });
  };

  return createPortal(
    <S.Background onClick={onClose}>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <S.Title>{t('장바구니')}</S.Title>

        <S.OrderList>
          {cartData.menus.length < 1 && (
            <S.NoContent>
              <EmptedCartIcon theme={theme} width={52} height={52} />
              <p>{t('현재 담긴 메뉴가 없어요.')}</p>
            </S.NoContent>
          )}

          {cartData.menus.map((menu, index) => (
            <S.OrderItem key={`order-${index + 1}`}>
              <S.OrderMenu>
                <p>{menu.menuName}</p>
                <p>{formatCurrency(menu.menuPrice)}</p>
              </S.OrderMenu>
              {menu.selectedOptions.length > 0 && (
                <S.Options>
                  {menu.selectedOptions.map((option) => (
                    <S.OptionItem key={option.optionSeq}>
                      <p>
                        <span />
                        {option.optionName}
                      </p>
                      <div>
                        <p>{formatCurrency(option.quantity)}</p>
                        <p>{formatCurrency(option.optionPrice)}</p>
                      </div>
                    </S.OptionItem>
                  ))}
                  {menu.selectedOptions.length > 0 && (
                    <div>
                      <button type="button">옵션</button>
                    </div>
                  )}
                </S.Options>
              )}

              <S.ButtonContainer>
                <S.DeleteButton onClick={() => removeMenu(index)}>
                  <DeleteIcon color={theme.mode.grey[600]} />
                </S.DeleteButton>
                <NumberInput
                  variant="square"
                  size="L"
                  min={1}
                  value={menu.quantity}
                  onChange={(value) => updateCartItemQuantity(index, value)}
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
