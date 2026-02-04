import { useState } from 'react';
import styled from '@emotion/styled';
import {
  TotalDiscountIcon,
  AmountChangeIcon,
  CloseIcon,
  DocumentIcon,
  RingIcon,
} from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { i18n as I18nInstance } from 'i18next';
import { IPayment } from '@repo/api/types';
import { toast } from '@repo/feature/utils';
import { PickupNotificationDialog } from '../orderSection/dialogs/PickupNotificationDialog';

const { colors } = theme;

export type ActionGridProps = {
  onPress?: (id: string) => void;
  i18nInstance?: I18nInstance;
  paymentList: IPayment[];
  refetchOrderHistories?: () => void;
  usePickupAlert?: boolean;
  shopCode: string;
  tableNumber: string;
  pickupAlertMessage?: string;
};

export function ActionGrid({
  onPress,
  i18nInstance,
  paymentList,
  refetchOrderHistories,
  usePickupAlert = false,
  shopCode,
  tableNumber,
  pickupAlertMessage,
}: ActionGridProps) {
  const { t } = useTranslation('admin', { i18n: i18nInstance });
  const navigate = useNavigate();
  const [isPickupDialogOpen, setIsPickupDialogOpen] = useState(false);

  const handleAllDiscount = async () => {
    await refetchOrderHistories?.();

    if (paymentList.length > 0) {
      toast(t('일부 결제 내역이 있어 할인할 수 없습니다'));
      return;
    }
    onPress?.('all-discount');
  };

  const handlePickupClick = () => {
    setIsPickupDialogOpen(true);
  };

  const handlePickupDialogClose = () => {
    setIsPickupDialogOpen(false);
  };

  //선택 취소, 전체 취소, 전체 할인
  return (
    <Wrap>
      <CloseButton type="button" onClick={() => navigate(-1)}>
        <CloseIcon width={40} height={40} color={colors.grey[600]} />
      </CloseButton>

      <Grid>
        <ActionBtn onClick={() => onPress?.('add-menu')}>
          <img src={DocumentIcon} alt={t('메뉴 추가')} />
          <label>{t('메뉴 추가')}</label>
        </ActionBtn>
        {usePickupAlert && (
          <ActionBtn onClick={handlePickupClick}>
            <img src={RingIcon} alt={t('알림 발송')} />
            <label>{t('알림 발송 ')}</label>
          </ActionBtn>
        )}
        {/* <ActionBtn onClick={() => onPress?.('amount-change')}>
          <img src={AmountChangeIcon} alt={t('금액 변경')} />
          <label>{t('금액 변경')}</label>
        </ActionBtn>
        <ActionBtn onClick={handleAllDiscount}>
          <img src={TotalDiscountIcon} alt={t('전체 할인')} />
          <label>{t('전체 할인')}</label>
        </ActionBtn> */}
      </Grid>

      <PickupNotificationDialog
        isOpen={isPickupDialogOpen}
        onClose={handlePickupDialogClose}
        shopCode={shopCode}
        tableNumber={tableNumber}
        defaultMessage={pickupAlertMessage}
        i18nInstance={i18nInstance}
      />
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 30px;
  right: 40px;
  cursor: pointer;
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const ActionBtn = styled.button`
  border-radius: 16px;
  background: ${colors.grey[100]};
  color: ${colors.grey[600]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 8px;
  height: 140px;

  font-size: 19.999px;
  font-style: normal;
  font-weight: 500;
  line-height: 29.998px; /* 150% */
  letter-spacing: -0.5px;
`;
