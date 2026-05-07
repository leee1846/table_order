import { useEffect, useMemo } from 'react';
import { BasicButton, ModalBackground } from '@repo/ui/components';
import * as S from '@/pages/MainPage/PaymentsModal/paymentsModal.style';
import {
  cardIcon,
  currencyIcon,
  splitIcon,
  payAfterIcon,
  CloseIcon,
} from '@repo/ui/icons';
import { css } from '@emotion/react';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import {
  openDualActionDialog,
  openConfirmDialog,
  toast,
} from '@repo/feature/utils';
import { useThemeMode } from '@repo/ui';
import { usePosOrderStore } from '@repo/feature/stores';
import { CardPaymentInstallmentModal } from '../CardPaymentInstallmentModal';
import { useModalStore } from '@/stores/useModalStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useCartStore } from '@/stores/useCartStore';
import { useShopStore } from '@/stores/useShopStore';
import {
  buildMenuSeqToCategoryMenuMap,
  calculateMenuTotalPrice,
  isOptionGroupIndependentInCategoryMenu,
} from '@/utils/calculation';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import type { ICancelOrderMenuRequest, IOrder } from '@repo/api/types';
// import { usePutCancelOrderMenu } from '@repo/api/queries';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { localizeOrders } from '@/utils/localizeOrders';

interface Props {
  onClose: () => void;
  selectedPaymentMethod: 'card' | 'cash' | 'split' | 'payAfter' | null;
  setSelectedPaymentMethod: (
    method: 'card' | 'cash' | 'split' | 'payAfter' | null
  ) => void;
  openNextModal: () => void;
  executePostpaidOrder: () => Promise<{
    orderGroupUuid: string;
    orderUuid: string;
    result: boolean;
    totalPrice: number;
    orders: IOrder[];
    cancelOrderMenuRequest: ICancelOrderMenuRequest;
  }>;
}

export const PaymentsModal = ({
  onClose,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  openNextModal,
  executePostpaidOrder,
}: Props) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();

  // 모달이 닫힐 때(언마운트 시) 선택된 결제 방법 초기화
  useEffect(() => {
    return () => {
      setSelectedPaymentMethod(null);
    };
  }, [setSelectedPaymentMethod]);
  const shopDetailData = useShopDetailStore((s) => s.data);
  const {
    data: modalData,
    setModalData,
    setCashPaymentInducementModal,
  } = useModalStore();
  const { data: cartData, clearCart } = useCartStore();
  // const { mutateAsync: cancelOrderMenu } = usePutCancelOrderMenu();
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData({ skipInitialRequest: true });

  const isPosLinked =
    !!shopDetailData?.shopSetting?.shopPosCode &&
    shopDetailData?.shopSetting?.shopPosCode !== 'NONE';

  const categories = useCategoryStore((s) => s.data.categories);

  // menuSeq → 카테고리 메뉴 맵 (isMenuQuantityIndependent 조회용, categories 변경 시에만 재빌드)
  const menuSeqToCategoryMenuMap = useMemo(
    () => buildMenuSeqToCategoryMenuMap(categories),
    [categories]
  );

  // 전체 카트의 총 합계 계산 (isMenuQuantityIndependent 옵션 수량 보정 포함)
  const totalPrice = useMemo(
    () =>
      cartData.menus.reduce((total, menu) => {
        const categoryMenu = menuSeqToCategoryMenuMap.get(menu.menuSeq);
        const options = menu.selectedOptions.map((option) => ({
          optionPrice: option.optionPrice,
          quantity: option.quantity,
          isMenuQuantityIndependent: isOptionGroupIndependentInCategoryMenu(
            categoryMenu,
            option.optionGroupSeq
          ),
        }));
        return total + calculateMenuTotalPrice(menu.menuPrice, menu.quantity, options);
      }, 0),
    [cartData.menus, menuSeqToCategoryMenuMap]
  );

  const onClickNext = () => {
    if (selectedPaymentMethod === null) {
      toast(t('결제 방법을 선택해주세요'), {
        position: 'center-center',
      });
      return;
    }
    if (selectedPaymentMethod === 'cash') {
      openDualActionDialog({
        title: t('현금 결제'),
        content: t('현금 결제로 주문하시겠습니까?'),
        primaryText: t('주문하기'),
        secondaryText: t('취소'),
        onConfirm: async () => {
          const response = await executePostpaidOrder();

          if (!response.result) {
            openConfirmDialog({
              title: t('오류'),
              content: t('주문에 실패했습니다. 다시 시도해주세요.'),
              confirmText: t('확인'),
            });
            return;
          }

          const handleOrderCompleteSuccess = async () => {
            const language =
              useCustomerLanguageStore.getState().data.currentLanguage;
            setModalData(
              'orderCompleteData',
              localizeOrders(response.orders, cartData.menus, language)
            );
            setModalData('orderCompleteTotalPrice', response.totalPrice);
            clearCart();
            setModalData('isCartListOpened', false);
            // 현금 결제 유도 설정이 활성화되어 있으면 전체 화면 다이얼로그 열기
            if (
              shopDetailData?.shopSetting?.usePrepaymentCashPaymentInducement
            ) {
              setCashPaymentInducementModal(true, totalPrice);
            } else {
              // 모달이 열리는 시점의 언어를 고정 — OrderCompleteModal에서 이 값으로 번역 표시
              setModalData('orderCompleteLanguage', language);
              setModalData('isOrderCompleteModalOpened', true);
              onClose();
            }
            await refreshTableOrderHistoriesData();
          };

          if (response.result && isPosLinked && response.orderUuid) {
            const handlePosOrderFailure = async () => {
              // try {
              //   if (response.cancelOrderMenuRequest.length > 0) {
              //     await cancelOrderMenu(response.cancelOrderMenuRequest);
              //   }
              // } catch {
              //   // 주문 취소 실패 시 무시
              // }
              openConfirmDialog({
                title: t('POS 오류'),
                content: t(
                  '주문 요청에 실패하였습니다. 직원에게 문의해주세요.'
                ),
                confirmText: t('확인'),
              });
            };

            const shopCode = String(
              useShopStore.getState().data?.shopCode ?? ''
            );
            usePosOrderStore
              .getState()
              .register(
                response.orderUuid,
                shopCode,
                handleOrderCompleteSuccess,
                handlePosOrderFailure
              );
            return;
          }

          handleOrderCompleteSuccess();
        },
      });
      return;
    }

    if (selectedPaymentMethod === 'payAfter') {
      openDualActionDialog({
        title: t('후불 결제'),
        content: t('후불 결제로 주문하시겠습니까?'),
        primaryText: t('주문하기'),
        secondaryText: t('취소'),
        onConfirm: async () => {
          const response = await executePostpaidOrder();

          if (!response.result) {
            openConfirmDialog({
              title: t('오류'),
              content: t('주문에 실패했습니다. 다시 시도해주세요.'),
              confirmText: t('확인'),
            });
            return;
          }

          const handleOrderCompleteSuccess = async () => {
            const language =
              useCustomerLanguageStore.getState().data.currentLanguage;
            setModalData(
              'orderCompleteData',
              localizeOrders(response.orders, cartData.menus, language)
            );
            setModalData('orderCompleteTotalPrice', response.totalPrice);
            clearCart();
            setModalData('isCartListOpened', false);
            // 모달이 열리는 시점의 언어를 고정 — OrderCompleteModal에서 이 값으로 번역 표시
            setModalData('orderCompleteLanguage', language);
            setModalData('isOrderCompleteModalOpened', true);
            onClose();
            await refreshTableOrderHistoriesData();
          };

          if (isPosLinked && response.orderUuid) {
            const handlePosOrderFailure = async () => {
              // try {
              //   if (response.cancelOrderMenuRequest.length > 0) {
              //     await cancelOrderMenu(response.cancelOrderMenuRequest);
              //   }
              // } catch {
              //   // 주문 취소 실패 시 무시
              // }
              openConfirmDialog({
                title: t('POS 오류'),
                content: t(
                  '주문 요청에 실패하였습니다. 직원에게 문의해주세요.'
                ),
                confirmText: t('확인'),
              });
            };

            const shopCode = String(
              useShopStore.getState().data?.shopCode ?? ''
            );
            usePosOrderStore
              .getState()
              .register(
                response.orderUuid,
                shopCode,
                handleOrderCompleteSuccess,
                handlePosOrderFailure
              );
            return;
          }

          handleOrderCompleteSuccess();
        },
      });
      return;
    }

    openNextModal();
  };

  return (
    <>
      <ModalBackground position="center">
        <S.Container
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-title"
        >
          <S.CloseButton
            type="button"
            onClick={onClose}
            aria-label={t('모달 닫기')}
          >
            <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
          </S.CloseButton>
          <S.Title id="payment-title">{t('결제 방법을 선택해주세요')}</S.Title>
          <S.PaymentMethodList
            role="radiogroup"
            aria-label={t('결제 방법을 선택해주세요')}
          >
            <S.PaymentMethodItem
              type="button"
              isSelected={selectedPaymentMethod === 'card'}
              onClick={() => setSelectedPaymentMethod('card')}
              role="radio"
              aria-checked={selectedPaymentMethod === 'card'}
              aria-label={t('카드 결제')}
            >
              <img src={cardIcon} alt="" aria-hidden="true" />
              {t('카드 결제')}
            </S.PaymentMethodItem>
            {shopDetailData?.shopSetting?.usePrepaymentCashPayment && (
              <S.PaymentMethodItem
                type="button"
                isSelected={selectedPaymentMethod === 'cash'}
                onClick={() => setSelectedPaymentMethod('cash')}
                role="radio"
                aria-checked={selectedPaymentMethod === 'cash'}
                aria-label={t('현금 결제')}
              >
                <img src={currencyIcon} alt="" aria-hidden="true" />
                {t('현금 결제')}
              </S.PaymentMethodItem>
            )}
            {shopDetailData?.shopSetting?.usePrepaymentDutch && (
              <S.PaymentMethodItem
                type="button"
                isSelected={selectedPaymentMethod === 'split'}
                onClick={() => setSelectedPaymentMethod('split')}
                role="radio"
                aria-checked={selectedPaymentMethod === 'split'}
                aria-label={t('나눠서 결제')}
              >
                <img src={splitIcon} alt="" aria-hidden="true" />
                {t('나눠서 결제')}
              </S.PaymentMethodItem>
            )}
            {shopDetailData?.shopSetting?.usePrepaymentDeferredPayment && (
              <S.PaymentMethodItem
                type="button"
                isSelected={selectedPaymentMethod === 'payAfter'}
                onClick={() => setSelectedPaymentMethod('payAfter')}
                role="radio"
                aria-checked={selectedPaymentMethod === 'payAfter'}
                aria-label={t('후불 결제')}
              >
                <img src={payAfterIcon} alt="" aria-hidden="true" />
                {t('후불 결제')}
              </S.PaymentMethodItem>
            )}
          </S.PaymentMethodList>
          <BasicButton
            variant="Solid_Blue_2XL"
            onClick={onClickNext}
            customStyle={css`
              width: 100%;
            `}
            aria-label={t('다음')}
          >
            {t('다음')}
          </BasicButton>
        </S.Container>
      </ModalBackground>

      {/* 카드 결제 > 할부 선택 모달 */}
      {selectedPaymentMethod === 'card' &&
        modalData.isCardPaymentInstallmentModalOpened && (
          <CardPaymentInstallmentModal
            onClose={() =>
              setModalData('isCardPaymentInstallmentModalOpened', false)
            }
            totalPrice={totalPrice}
          />
        )}
    </>
  );
};
