import { useState } from 'react';
import { ModalBackground } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useAdminTranslation } from '@/config/i18n';
import type { IOrderHistoryItem } from '@repo/api/types';
import { OrderSection } from './OrderSection';
import { PaymentSection } from './PaymentSection';
import * as S from './orderDetailModal.style';

interface Props {
  order: IOrderHistoryItem;
  onClose: () => void;
}
export const OrderDetailModal = ({ order, onClose }: Props) => {
  const { t } = useAdminTranslation();
  const [tab, setTab] = useState<'order' | 'payment'>('order');

  return (
    <ModalBackground position="center" onClick={onClose}>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.colors.grey[700]} />
        </button>

        <S.Tab>
          <S.TabButton
            isSelected={tab === 'order'}
            onClick={() => setTab('order')}
          >
            {t('주문 내역')}
          </S.TabButton>
          <S.TabButton
            isSelected={tab === 'payment'}
            onClick={() => setTab('payment')}
          >
            {t('결제 내역')}
          </S.TabButton>
        </S.Tab>

        {tab === 'order' && <OrderSection order={order} />}
        {tab === 'payment' && <PaymentSection order={order} />}
      </S.Container>
    </ModalBackground>
  );
};
