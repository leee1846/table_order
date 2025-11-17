import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from './table.style';
import { formatCurrency } from '@repo/util';
import { useState } from 'react';
import { OrderDetailModal } from '@/pages/settings/SalesOrderPage/OrderDetailModal';

const LIST = [
  {
    id: 1,
    isCancel: false,
  },
  {
    id: 2,
    isCancel: false,
  },
  {
    id: 3,
    isCancel: false,
  },
  {
    id: 4,
    isCancel: false,
  },
  {
    id: 5,
    isCancel: true,
  },
];

export const Table = () => {
  const [isOpenOrderDetailModal, setIsOpenOrderDetailModal] = useState(false);

  const getTextColor = (isCancel: boolean, isPayment?: boolean) => {
    if (isPayment) {
      return isCancel ? theme.colors.semantic[400] : theme.colors.primary[500];
    }

    return isCancel ? theme.colors.semantic[400] : theme.colors.grey[700];
  };

  return (
    <div>
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
          {LIST.map((item) => (
            <tr key={item.id}>
              <S.ColorTd color={getTextColor(item.isCancel)}>
                111533431
              </S.ColorTd>
              <S.ColorTd color={getTextColor(item.isCancel)}>
                2025-01-01 12:00:00
              </S.ColorTd>
              <S.ColorTd color={getTextColor(item.isCancel)}>2</S.ColorTd>
              <S.ColorTd color={getTextColor(item.isCancel)}>
                {formatCurrency(100000)}
              </S.ColorTd>
              <S.ColorTd color={getTextColor(item.isCancel, true)}>
                카드
              </S.ColorTd>
              <td>2</td>
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
    </div>
  );
};
