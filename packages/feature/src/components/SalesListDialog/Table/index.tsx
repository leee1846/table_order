import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from './table.style';
import { formatCurrency } from '@repo/util';
import { useState } from 'react';
import { OrderDetailModal } from '../OrderDetailModal';
import { mockSalesData } from '../mock';

export const Table = () => {
  const [isOpenOrderDetailModal, setIsOpenOrderDetailModal] = useState(false);

  const getTextColor = (isCancel: boolean, isPayment?: boolean) => {
    if (isPayment) {
      return isCancel ? theme.colors.semantic[400] : theme.colors.primary[500];
    }

    return isCancel ? theme.colors.semantic[400] : theme.colors.grey[700];
  };

  return (
    <>
      <UIStyles.tableStyles.Table>
        <UIStyles.tableStyles.Thead>
          <tr>
            <th>주문번호</th>
            <th>거래일자</th>
            <th>테이블 번호</th>
            <th>거래금액</th>
            <th>결제수단</th>
            <th>객수</th>
            <th>상세 내역</th>
          </tr>
        </UIStyles.tableStyles.Thead>
        <UIStyles.tableStyles.Tbody>
          {mockSalesData.map((item) => (
            <tr key={item.id}>
              <S.ColorTd color={getTextColor(item.isCancelled || false)}>
                {item.orderNumber}
              </S.ColorTd>
              <S.ColorTd color={getTextColor(item.isCancelled || false)}>
                {item.transactionDate}
              </S.ColorTd>
              <S.ColorTd color={getTextColor(item.isCancelled || false)}>
                {item.tableNumber}
              </S.ColorTd>
              <S.ColorTd color={getTextColor(item.isCancelled || false)}>
                {formatCurrency(item.transactionAmount)}
              </S.ColorTd>
              <S.ColorTd color={getTextColor(item.isCancelled || false, true)}>
                {item.paymentMethod}
              </S.ColorTd>
              <td>{item.guestCount}</td>
              <td>
                <BasicButton
                  variant="Outline_Navy_S"
                  onClick={() => setIsOpenOrderDetailModal(true)}
                >
                  보기
                </BasicButton>
              </td>
            </tr>
          ))}
        </UIStyles.tableStyles.Tbody>
      </UIStyles.tableStyles.Table>

      {/* 주문 내역 및 결제 내역 모달 */}
      {isOpenOrderDetailModal && (
        <OrderDetailModal onClose={() => setIsOpenOrderDetailModal(false)} />
      )}
    </>
  );
};
