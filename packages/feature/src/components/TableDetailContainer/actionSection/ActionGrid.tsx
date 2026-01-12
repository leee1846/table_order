import styled from '@emotion/styled';
import {
  ListAltAddIcon,
  CancelIcon,
  CurrencyExchangeIcon,
  DeleteIcon,
  DiscountIcon,
  ExitToAppIcon,
} from '@repo/ui/icons';
import { theme, TYPOGRAPHY } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { i18n as I18nInstance } from 'i18next';
import { IPayment } from '@repo/api/types';
import { toast } from '@repo/feature/utils';

const { colors } = theme;

export type ActionGridProps = {
  onPress?: (id: string) => void;
  i18nInstance?: I18nInstance;
  paymentList: IPayment[];
  refetchOrderHistories?: () => void;
};

export function ActionGrid({
  onPress,
  i18nInstance,
  paymentList,
  refetchOrderHistories,
}: ActionGridProps) {
  const { t } = useTranslation('admin', { i18n: i18nInstance });
  const navigate = useNavigate();

  const handleSelectCancel = async () => {
    await refetchOrderHistories?.();

    if (paymentList.length > 0) {
      toast(t('일부 결제 내역이 있어 취소할 수 없습니다.'));
      return;
    }
    onPress?.('select-cancel');
  };

  const handleAllCancel = async () => {
    await refetchOrderHistories?.();

    if (paymentList.length > 0) {
      toast(t('일부 결제 내역이 있어 취소할 수 없습니다.'));
      return;
    }
    onPress?.('all-cancel');
  };

  const handleAllDiscount = async () => {
    await refetchOrderHistories?.();

    if (paymentList.length > 0) {
      toast(t('일부 결제 내역이 있어 할인할 수 없습니다'));
      return;
    }
    onPress?.('all-discount');
  };

  //선택 취소, 전체 취소, 전체 할인
  return (
    <Wrap>
      <Grid>
        <ActionBtn
          onClick={() => onPress?.('add-menu')}
          style={{ color: colors.white, background: colors.black }}
        >
          <ListAltAddIcon width={24} height={24} color={colors.white} />
          <label>{t('메뉴 추가')}</label>
        </ActionBtn>
        <ActionBtn onClick={handleSelectCancel}>
          <CancelIcon width={24} height={24} color={colors.grey[300]} />
          <label>{t('선택 취소')}</label>
        </ActionBtn>
        <ActionBtn onClick={handleAllCancel}>
          <DeleteIcon width={24} height={24} color={colors.grey[300]} />
          <label>{t('전체 취소')}</label>
        </ActionBtn>
        <ActionBtn onClick={() => onPress?.('amount-change')}>
          <CurrencyExchangeIcon
            width={24}
            height={24}
            color={colors.grey[300]}
          />
          <label>{t('금액 변경')}</label>
        </ActionBtn>
        <ActionBtn onClick={handleAllDiscount}>
          <DiscountIcon width={24} height={24} color={colors.grey[300]} />
          <label>{t('전체 할인')}</label>
        </ActionBtn>
      </Grid>
      <ExitButtonWrap>
        <BasicButton
          variant="Solid_Grey_2XL"
          iconPosition="right"
          icon={
            <ExitToAppIcon width={24} height={24} color={colors.grey[700]} />
          }
          onClick={() => navigate(-1)}
        >
          <label>{t('나가기')}</label>
        </BasicButton>
      </ExitButtonWrap>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 60%;
  gap: 12px;
`;

const ActionBtn = styled.button`
  border-radius: 16px;
  background: ${colors.grey[900]};
  color: ${colors.grey[300]};
  ${TYPOGRAPHY.MT_6}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 8px;
  padding: 15px 24px;
  &:first-of-type {
    grid-column: span 2;
    grid-row: span 1;
  }

  /* 금액 변경, 전체 할인: 2x1 */
  &:nth-of-type(4),
  &:nth-of-type(5) {
    grid-column: span 2;
`;

const ExitButtonWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
