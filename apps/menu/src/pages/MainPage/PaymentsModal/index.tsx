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
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { openDualActionDialog } from '@repo/feature/utils';
import { useThemeMode } from '@repo/ui';
import { CardPaymentInstallmentModal } from '../CardPaymentInstallmentModal';
import { CashPaymentInducement } from '@/feature/CashPaymentInducement';
import { useModalStore } from '@/stores/useModalStore';
import { useCartStore } from '@/stores/useCartStore';
import { calculateMenuTotalPrice } from '@/utils/calculation';
import type { ICartMenu } from '@/types/cart';

interface Props {
  onClose: () => void;
  selectedPaymentMethod: 'card' | 'cash' | 'split' | 'payAfter' | null;
  setSelectedPaymentMethod: (
    method: 'card' | 'cash' | 'split' | 'payAfter'
  ) => void;
  openNextModal: () => void;
  executePostpaidOrder: () => Promise<{
    orderGroupUuid: string;
    result: boolean;
    totalPrice: number;
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
  const { data: shopDetailData } = useShopDetailData();
  const { data: modalData, setModalData } = useModalStore();
  const { data: cartData } = useCartStore();

  // 카트 메뉴의 총 가격 계산
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

  // 전체 카트의 총 합계 계산
  const calculateTotalPrice = (): number => {
    return cartData.menus.reduce((total, menu) => {
      return total + calculateCartMenuPrice(menu);
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  const onClickNext = () => {
    if (selectedPaymentMethod === 'cash') {
      openDualActionDialog({
        title: t('현금 결제'),
        content: t('현금 결제로 주문하시겠습니까?'),
        primaryText: t('주문하기'),
        secondaryText: t('취소'),
        onConfirm: async () => {
          const response = await executePostpaidOrder();
          if (response.result) {
            // 현금 결제 유도 설정이 활성화되어 있으면 전체 화면 다이얼로그 열기
            if (
              shopDetailData?.shopSetting?.usePrepaymentCashPaymentInducement
            ) {
              setModalData('cashPaymentInducementTotalPrice', totalPrice);
              setModalData('isCashPaymentInducementModalOpened', true);
              return;
            }

            setModalData('isOrderCompleteModalOpened', true);
            onClose();
          }
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
          if (response.result) {
            setModalData('isOrderCompleteModalOpened', true);
            onClose();
          }
        },
      });
      return;
    }

    openNextModal();
  };

  return (
    <>
      <ModalBackground position="center" onClick={onClose}>
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

      {/* 현금 결제 유도 모달 */}
      {modalData.isCashPaymentInducementModalOpened && (
        <CashPaymentInducement />
      )}
    </>
  );
};
