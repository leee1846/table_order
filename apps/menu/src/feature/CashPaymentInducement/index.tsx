import { getTodayDateString } from '@repo/util/date';
import { formatCurrency } from '@repo/util/string';
import { printerIcon } from '@repo/ui/icons';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { useDeviceData } from '@/hooks/useDeviceData';
import * as S from './cashPaymentInducement.style';
import { useModalStore } from '@/stores/useModalStore';

/**
 * 현금 결제 유도 전체 화면 컴포넌트
 * UI 없이 화면 전체를 가리는 컴포넌트
 */
export const CashPaymentInducement = () => {
  const { data: modalData } = useModalStore();
  const { data: deviceData } = useDeviceData();
  const { data: tableGroupsData } = useTableGroupData();
  const tableName = tableGroupsData?.map((tableGroup) => {
    const table = tableGroup.tableList?.find(
      (table) => table.tableNumber === deviceData?.tableNumber
    );
    return table?.tableName ?? '';
  });

  return (
    <S.Container>
      <S.LeftContainer>
        <img src={printerIcon} alt="현금 결제 유도" />
        <h1>현금 결제를 선택하셨어요!</h1>
        <p>카운터에서 결제를 진행해 주세요.</p>
      </S.LeftContainer>
      <S.RightContainer>
        <S.TableName>{tableName}</S.TableName>
        <S.Date>{getTodayDateString()}</S.Date>
        <S.PaymentContainer>
          <p>결제할 금액</p>
          <p>{formatCurrency(modalData.cashPaymentInducementTotalPrice)}</p>
        </S.PaymentContainer>
      </S.RightContainer>
    </S.Container>
  );
};
