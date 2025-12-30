import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import type { IOrderHistoryItem } from '@repo/api/types';
import * as UIStyles from '@repo/ui/styles';
import * as S from './table.style';
import { formatCurrency, formatPaymentMethodLabel } from '@repo/util/string';

const { colors } = theme;

interface TableProps {
  orders: IOrderHistoryItem[];
  isLoading?: boolean;
  onSelectOrder: (order: IOrderHistoryItem) => void;
}

export const Table = ({ orders, isLoading, onSelectOrder }: TableProps) => {
  const getTextColor = (isCancel: boolean, isPayment?: boolean) => {
    if (isPayment) {
      return isCancel ? colors.semantic[400] : colors.primary[500];
    }

    return isCancel ? colors.semantic[400] : colors.grey[700];
  };

  const formatDateTime = (dateString: string) => {
    try {
      // Timestamp를 Date로 변환
      const date = new Date(Number(dateString));
      const year = String(date.getFullYear()).slice(-2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch {
      return dateString;
    }
  };

  // 취소 여부 확인 (결제 내역에서 취소된 항목이 있는지)
  const isCancelled = (order: IOrderHistoryItem) => {
    return order.paymentList?.some((payment) => payment.isCanceled) ?? false;
  };

  return (
    <UIStyles.setting.Table>
      <UIStyles.setting.Thead>
        <tr>
          <th>주문번호</th>
          <th>거래일자</th>
          <th>테이블 번호</th>
          <th>거래금액</th>
          <th>결제수단</th>
          <th>객수</th>
          <th>상세 내역</th>
        </tr>
      </UIStyles.setting.Thead>
      <UIStyles.setting.Tbody>
        {isLoading ? (
          <tr style={{ height: '100%' }}>
            <td
              colSpan={7}
              style={{
                padding: '24px',
                textAlign: 'center',
                color: colors.grey[600],
              }}
            >
              주문 내역을 불러오는 중입니다.
            </td>
          </tr>
        ) : orders.length === 0 ? (
          <tr style={{ height: '100%' }}>
            <td
              colSpan={7}
              style={{
                padding: '24px',
                textAlign: 'center',
                color: colors.grey[600],
              }}
            >
              표시할 주문 내역이 없어요.
            </td>
          </tr>
        ) : (
          orders.map((order, index) => {
            const cancelled = isCancelled(order);
            return (
              <tr key={`${order.orderNumber}-${index}`}>
                <S.ColorTd color={getTextColor(cancelled)}>
                  {order.orderNumber}
                </S.ColorTd>
                <S.ColorTd color={getTextColor(cancelled)}>
                  {formatDateTime(order.orderClearedDate)}
                </S.ColorTd>
                <S.ColorTd color={getTextColor(cancelled)}>
                  {order.tableNumber}
                </S.ColorTd>
                <S.ColorTd color={getTextColor(cancelled)}>
                  {formatCurrency(order.paidAmount)}
                </S.ColorTd>
                <S.ColorTd color={getTextColor(cancelled, true)}>
                  {formatPaymentMethodLabel(order.paymentMethod)}
                </S.ColorTd>
                <td>{order.customerCount}</td>
                <td>
                  <BasicButton
                    variant="Outline_Navy_S"
                    onClick={() => onSelectOrder(order)}
                  >
                    보기
                  </BasicButton>
                </td>
              </tr>
            );
          })
        )}
      </UIStyles.setting.Tbody>
    </UIStyles.setting.Table>
  );
};
