import { useTranslation } from 'react-i18next';
import * as S from '@/pages/MainPage/CartButton/cartButton.style';
import { useState } from 'react';
import { CartList } from '@/pages/MainPage/CartList';
import { OrderCompleteModal } from '@/pages/MainPage/OrderCompleteModal';
import { PaymentsModal } from '@/pages/MainPage/PaymentsModal';

export const CartButton = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isOrderCompleteModalOpen, setIsOrderCompleteModalOpen] =
    useState(false);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);

  return (
    <>
      <S.Container type="button" onClick={() => setIsOpen(true)}>
        <p>{t('장바구니')}</p>
        <p>99</p>
      </S.Container>

      {isOpen && (
        <CartList
          onClose={() => setIsOpen(false)}
          openPaymentsModal={() => setIsPaymentsModalOpen(true)}
        />
      )}

      {isPaymentsModalOpen && (
        <PaymentsModal
          onClose={() => setIsPaymentsModalOpen(false)}
          openOrderCompleteModal={() => setIsOrderCompleteModalOpen(true)}
        />
      )}

      {isOrderCompleteModalOpen && (
        <OrderCompleteModal
          onClose={() => setIsOrderCompleteModalOpen(false)}
        />
      )}
    </>
  );
};
