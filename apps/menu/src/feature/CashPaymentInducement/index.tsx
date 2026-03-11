import { getTodayDateString } from '@repo/util/date';
import { formatCurrency } from '@repo/util/string';
import { printerIcon } from '@repo/ui/icons';
import { useDeviceData } from '@/hooks/useDeviceData';
import * as S from './cashPaymentInducement.style';
import { useModalStore } from '@/stores/useModalStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useTableGroupStore } from '@/stores/useTableGroupStore';

/**
 * 현금 결제 유도 UI
 * SSE "PAYMENT" type 메시지 수신 시 조건 충족 시 모달 창 닫음
 */
export const CashPaymentInducement = () => {
  const { t } = useCustomerTranslation();
  const { data: modalData } = useModalStore();
  const { data: deviceData } = useDeviceData();
  const tableGroupsData = useTableGroupStore((s) => s.data);
  const tableName = tableGroupsData?.map((tableGroup) => {
    const table = tableGroup.tableList?.find(
      (table) => table.tableNumber === deviceData?.tableNumber
    );
    return table?.tableName ?? '';
  });

  return (
    <S.Container>
      <S.LeftContainer>
        <img src={printerIcon} alt={t('현금 결제 유도')} />
        <h1>{t('현금 결제를 선택하셨어요!')}</h1>
        <p>{t('카운터에서 결제를 진행해 주세요.')}</p>
      </S.LeftContainer>
      <S.RightContainer>
        <S.TableName>{tableName}</S.TableName>
        <S.Date>{getTodayDateString()}</S.Date>
        <S.PaymentContainer>
          <p>{t('결제할 금액')}</p>
          <p>{formatCurrency(modalData.cashPaymentInducementTotalPrice)}</p>
        </S.PaymentContainer>
      </S.RightContainer>
    </S.Container>
  );
};
