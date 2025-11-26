import { useTranslation } from 'react-i18next';
import * as S from '@/pages/MainPage/CartButton/cartButton.style';
import { useState } from 'react';
import { CartList } from '@/pages/MainPage/CartList';
import { OrderCompleteModal } from '@/pages/MainPage/OrderCompleteModal';
import { PaymentsModal } from '@/pages/MainPage/PaymentsModal';
import { SplitPaymentModal } from '@/pages/MainPage/SplitPaymentModal';

export const CartButton = () => {
  const { t } = useTranslation();
  /** 장바구니 모달 */
  const [isCartListOpen, setIsCartListOpen] = useState(false);
  /** 주문 완료 모달 */
  const [isOrderCompleteModalOpen, setIsOrderCompleteModalOpen] =
    useState(false);
  /** 결제 방법 선택 모달 */
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'card' | 'cash' | 'split'
  >('card');
  /** 분할 결제 모달 */
  const [isSplitPaymentModalOpen, setIsSplitPaymentModalOpen] = useState(false);

  const openPaymentModal = () => {
    if (selectedPaymentMethod === 'split') {
      setIsSplitPaymentModalOpen(true);
    }
    setIsPaymentsModalOpen(false);
  };

  return (
    <>
      <S.Container type="button" onClick={() => setIsCartListOpen(true)}>
        <p>{t('장바구니')}</p>
        <p>99</p>
      </S.Container>

      {/* 장바구니 모달 */}
      {isCartListOpen && (
        <CartList
          onClose={() => setIsCartListOpen(false)}
          openPaymentsModal={() => setIsPaymentsModalOpen(true)}
        />
      )}

      {/* 결제 방법 선택 모달 */}
      {isPaymentsModalOpen && (
        <PaymentsModal
          onClose={() => setIsPaymentsModalOpen(false)}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          openNextModal={openPaymentModal}
        />
      )}

      {/* 분할 결제 모달 */}
      {isSplitPaymentModalOpen && (
        <SplitPaymentModal onClose={() => setIsSplitPaymentModalOpen(false)} />
      )}

      {/* 주문 완료 모달 */}
      {isOrderCompleteModalOpen && (
        <OrderCompleteModal
          onClose={() => setIsOrderCompleteModalOpen(false)}
        />
      )}
    </>
  );
};
