import { BasicButton, ModalBackground } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/splitPaymentModal.style';
import { useState, useMemo } from 'react';
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
import { toast } from '@repo/feature/utils';
import { useModalStore } from '@/stores/useModalStore';
import { CardPaymentProgressModal } from '@/pages/MainPage/CardPaymentProgressModal';

interface Props {
  onClose: () => void;
}

// 헬퍼: 메뉴 가격 계산 (메뉴 + 옵션)
const calculateCartMenuPrice = (cartMenu: ICartMenu): number => {
  const options = cartMenu.selectedOptions.map((option) => ({
    optionPrice: option.optionPrice,
    quantity: option.quantity,
  }));

  return calculateMenuTotalPrice(
    cartMenu.menuPrice,
    cartMenu.quantity,
    options
  );
};

// 헬퍼: 메뉴 배열의 총 가격 계산
const calculateMenusPrice = (menus: ICartMenu[]): number => {
  return menus.reduce((total, menu) => total + calculateCartMenuPrice(menu), 0);
};

export const SplitPaymentModal = ({ onClose }: Props) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();

  const { data: deviceData } = useDeviceData();
  const { data: cartData, clearCart } = useCartStore();
  const { data: modalData, setModalData, closeAllModals } = useModalStore();

  const [isPaymentByMenu, setIsPaymentByMenu] = useState(true);
  const [selectedMenus, setSelectedMenus] = useState<ICartMenuWithId[]>([]);
  const [paidMenuIds, setPaidMenuIds] = useState<Set<string>>(new Set());

  // 전체 메뉴 목록 (quantity만큼 펼쳐진 형태)
  const allMenus = useMemo(
    () =>
      cartData.menus.flatMap((menu, menuIndex) =>
        Array.from({ length: menu.quantity }, (_, index) => ({
          ...menu,
          quantity: 1,
          id: `${menu.menuSeq}-${menuIndex}-${index}`,
        }))
      ),
    [cartData.menus]
  );

  // 남아있는 메뉴 목록 (결제되지 않은 메뉴들)
  const remainingMenus = useMemo(
    () => allMenus.filter((menu) => !paidMenuIds.has(menu.id)),
    [allMenus, paidMenuIds]
  );

  // 총 결제 금액 (원래 전체 금액)
  const totalPrice = useMemo(
    () => calculateMenusPrice(cartData.menus),
    [cartData.menus]
  );

  // 선택된 메뉴의 금액
  const selectedMenusPrice = useMemo(
    () => (isPaymentByMenu ? calculateMenusPrice(selectedMenus) : 0),
    [isPaymentByMenu, selectedMenus]
  );

  // 남은 결제 금액
  const remainingPrice = useMemo(
    () => calculateMenusPrice(remainingMenus),
    [remainingMenus]
  );

  const onChangeMethod = (byMenu: boolean) => {
    if (isPaymentByMenu === byMenu) {
      return;
    }

    setIsPaymentByMenu(byMenu);
    setSelectedMenus([]);
  };

  const onPayByMenu = () => {
    if (selectedMenus.length === 0) {
      toast(t('선택된 메뉴가 없습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    // 선택된 메뉴 ID들을 미리 계산 (클로저로 캡처)
    const selectedIds = selectedMenus.map((menu) => menu.id);
    // 남은 메뉴가 모두 선택된 메뉴인지 확인 (남은 메뉴가 없을 때를 체크)
    const isAllRemainingMenusSelected =
      remainingMenus.length === selectedMenus.length;

    // 카드 결제 진행 모달 열기
    setModalData('isCardPaymentProgressModalOpened', true);

    // TODO:  카드 결제 API 호출 (추후 구현)
    setTimeout(() => {
      setModalData('isCardPaymentProgressModalOpened', false);

      // 선택된 메뉴들을 결제 완료 목록에 추가
      setPaidMenuIds((prev) => new Set([...prev, ...selectedIds]));

      // 선택 초기화
      setSelectedMenus([]);

      // 남은 메뉴가 없으면 (모든 메뉴가 결제되었으면) 장바구니 비우고 모달 닫기
      if (isAllRemainingMenusSelected) {
        clearCart();
        closeAllModals();
        toast(t('결제가 완료되었습니다.'), {
          position: 'center-center',
          duration: 1500,
        });
        // TODO: 주문내역 api를 호출 해야하는가?? 확인 필요.
      }
    }, 2000);
  };

  const onPayByPerson = () => {
    // TODO: 인원수 나누기 결제 (추후 구현)
  };

  const onPayment = () => {
    if (isPaymentByMenu) {
      onPayByMenu();
    } else {
      onPayByPerson();
    }
  };

  return (
    <>
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
                  menus={remainingMenus}
                  selectedMenus={selectedMenus}
                  setSelectedMenus={setSelectedMenus}
                />
              )}

              {!isPaymentByMenu && <PriceSelector totalPrice={totalPrice} />}

              <S.SelectorTotalContainer>
                <S.TotalInfo>
                  <p>{t('총 결제금액')}</p>
                  <p>
                    {t('{{amount}}원', { amount: formatCurrency(totalPrice) })}
                  </p>
                </S.TotalInfo>
                <S.RemainingAmount>
                  <p>{t('남은 결제 금액')}</p>
                  <p>
                    {t('{{amount}}원', {
                      amount: formatCurrency(remainingPrice),
                    })}
                  </p>
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
              {allMenus.map((menu) => (
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
              <BasicButton variant="Solid_Blue_2XL" onClick={onPayment}>
                {t('{{amount}}원 카드 결제', {
                  amount: formatCurrency(selectedMenusPrice),
                })}
              </BasicButton>
            </S.TotalContainer>
          </S.RightContainer>
        </S.Container>
      </ModalBackground>

      {/* 카드 결제 진행 모달 */}
      {modalData.isCardPaymentProgressModalOpened && (
        <CardPaymentProgressModal
          onClose={() =>
            setModalData('isCardPaymentProgressModalOpened', false)
          }
        />
      )}
    </>
  );
};
