import { useState } from 'react';
import { ModalBackground } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { OrderSection } from '@/pages/settings/SalesOrderPage/OrderDetailModal/OrderSection';
import { PaymentSection } from '@/pages/settings/SalesOrderPage/OrderDetailModal/PaymentSection';
import * as S from './orderDetailModal.style';

interface Props {
  onClose: () => void;
}
export const OrderDetailModal = ({ onClose }: Props) => {
  const [tab, setTab] = useState<'order' | 'payment'>('payment');

  return (
    <ModalBackground position="top" onClick={onClose}>
      <S.Container>
        <button type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.colors.grey[700]} />
        </button>

        <S.Tab>
          <S.TabButton
            isSelected={tab === 'order'}
            onClick={() => setTab('order')}
          >
            주문 내역
          </S.TabButton>
          <S.TabButton
            isSelected={tab === 'payment'}
            onClick={() => setTab('payment')}
          >
            결제 내역
          </S.TabButton>
        </S.Tab>

        {tab === 'order' && <OrderSection />}
        {tab === 'payment' && <PaymentSection />}
      </S.Container>
    </ModalBackground>
  );
};
