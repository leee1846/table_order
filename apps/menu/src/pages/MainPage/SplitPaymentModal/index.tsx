import { BasicButton, ModalBackground } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/splitPaymentModal.style';
import { useState } from 'react';
import { MenuSelector } from '@/pages/MainPage/SplitPaymentModal/MenuSelector';
import { PriceSelector } from '@/pages/MainPage/SplitPaymentModal/PriceSelector';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { CloseIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { useCartStore } from '@/stores/useCartStore';
import type { ICartMenuWithId, ICartMenu } from '@/types/cart';
import { formatCurrency } from '@repo/util/string';
import { useDeviceData } from '@/hooks/useDeviceData';
import { calculateMenuTotalPrice } from '@/utils/calculation';

interface Props {
  onClose: () => void;
}
export const SplitPaymentModal = ({ onClose }: Props) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();

  const { data: deviceData } = useDeviceData();

  const [isPaymentByMenu, setIsPaymentByMenu] = useState(true);
  const [selectedMenus, setSelectedMenus] = useState<ICartMenuWithId[]>([]);

  const { data: cartData } = useCartStore();
  const menus = cartData.menus.flatMap((menu, menuIndex) =>
    Array.from({ length: menu.quantity }, (_, index) => ({
      ...menu,
      quantity: 1,
      id: `${menu.menuSeq}-${menuIndex}-${index}`,
    }))
  );

  const calculateCartMenuPrice = (cartMenu: ICartMenu): number => {
    const options = cartMenu.selectedOptions.map((option) => ({
      optionPrice: option.optionPrice,
      quantity: option.quantity,
      isMenuQuantityDependant: option.isMenuQuantityDependant,
    }));

    return calculateMenuTotalPrice(
      cartMenu.menuPrice,
      cartMenu.quantity,
      options
    );
  };

  const calculateTotalPrice = (): number => {
    return cartData.menus.reduce((total, menu) => {
      return total + calculateCartMenuPrice(menu);
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  const onChangeMethod = (byMenu: boolean) => {
    setIsPaymentByMenu((prev) => {
      if (prev === byMenu) {
        return prev;
      }

      setSelectedMenus([]);
      return byMenu;
    });
  };

  return (
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
        </S.CloseButton>

        <S.LeftContainer>
          <p>{t('분할 결제 방식을 선택하세요')}</p>
          <S.ToggleButtonContainer>
            <S.ToggleButton
              isActive={isPaymentByMenu}
              onClick={() => onChangeMethod(true)}
            >
              {t('메뉴별로 나누기')}
            </S.ToggleButton>
            <S.ToggleButton
              isActive={!isPaymentByMenu}
              onClick={() => onChangeMethod(false)}
            >
              {t('인원 수로 나누기')}
            </S.ToggleButton>
          </S.ToggleButtonContainer>

          <S.SelectorContainer>
            {isPaymentByMenu && (
              <MenuSelector
                menus={menus}
                selectedMenus={selectedMenus}
                setSelectedMenus={setSelectedMenus}
              />
            )}

            {!isPaymentByMenu && <PriceSelector totalPrice={totalPrice} />}

            <S.SelectorTotalContainer>
              <S.TotalInfo>
                <p>{t('총 결제금액')}</p>
                <p>{t('{{amount}}원', { amount: totalPrice })}</p>
              </S.TotalInfo>
              <S.RemainingAmount>
                <p>{t('남은 결제 금액')}</p>
                <p>{t('{{amount}}원', { amount: '????' })}</p>
              </S.RemainingAmount>
            </S.SelectorTotalContainer>
          </S.SelectorContainer>
        </S.LeftContainer>

        <S.RightContainer>
          <p>
            {t('테이블')}
            {deviceData?.tableNumber} {t('총 주문내역')}
          </p>

          <S.OrderList>
            {menus.map((menu) => (
              <li key={menu.id}>
                <S.MenuInfo>
                  <p>{menu.menuName}</p>
                  <p>{formatCurrency(menu.quantity)}</p>
                  <p>{formatCurrency(menu.menuPrice)}</p>
                </S.MenuInfo>

                <S.OptionList>
                  {menu.selectedOptions.map((option, index) => (
                    <li key={`${option.optionSeq}-${index + 1}`}>
                      <div>
                        <span />
                        <p>{option.optionName}</p>
                      </div>

                      <div>
                        <p>{formatCurrency(option.quantity)}</p>
                        <p>{formatCurrency(option.optionPrice)}</p>
                      </div>
                    </li>
                  ))}
                </S.OptionList>
              </li>
            ))}
          </S.OrderList>

          <S.TotalContainer>
            <BasicButton variant="Solid_Blue_2XL" onClick={onClose}>
              {t('{{amount}}원 카드 결제', { amount: 0 })}
            </BasicButton>
          </S.TotalContainer>
        </S.RightContainer>
      </S.Container>
    </ModalBackground>
  );
};
