import { useMemo } from 'react';
import { InfoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { formatCurrency, formatPaymentMethodLabel } from '@repo/util/string';
import type { TPaymentType } from '@repo/api/types';
import * as S from '../dailySalesPage.style';

export type TDailySaleRow = {
  id: string;
  paymentTime: string;
  tableName: string;
  totalSales: number;
  actualSales: number;
  discountAmount: number;
  cancelAmount: number;
  usedPoint: number;
  status: string;
  paymentMethod: string;
  paymentType?: TPaymentType | null;
  isSplit?: boolean;
  isCanceled?: boolean;
};

interface Props {
  rows: TDailySaleRow[];
  isLoading?: boolean;
}

export const DailySalesTable = ({ rows, isLoading = false }: Props) => {
  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, cur) => {
          acc.totalSales += cur.totalSales ?? 0;
          acc.actualSales += cur.actualSales ?? 0;
          acc.discountAmount += cur.discountAmount ?? 0;
          acc.cancelAmount += cur.cancelAmount ?? 0;
          acc.usedPoint += cur.usedPoint ?? 0;
          return acc;
        },
        {
          totalSales: 0,
          actualSales: 0,
          discountAmount: 0,
          cancelAmount: 0,
          usedPoint: 0,
        }
      ),
    [rows]
  );

  const renderRows = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={9}>당일 매출 내역을 불러오는 중입니다.</td>
        </tr>
      );
    }

    if (!rows.length) {
      return (
        <tr>
          <td colSpan={9}>표시할 매출 내역이 없습니다.</td>
        </tr>
      );
    }

    return rows.map((row) => (
      <tr key={row.id}>
        <td>{row.paymentTime || '-'}</td>
        <td>{row.tableName || '-'}</td>
        <td>{formatCurrency(row.totalSales ?? 0)}</td>
        <td>{formatCurrency(row.actualSales ?? 0)}</td>
        <td>{formatCurrency(row.discountAmount ?? 0)}</td>
        <td>{formatCurrency(row.cancelAmount ?? 0)}</td>
        <td>{formatCurrency(row.usedPoint ?? 0)}</td>
        <td>
          <S.StatusText cancel={row.isCanceled}>
            {row.status || '-'}
          </S.StatusText>
        </td>
        <td>
          <S.PaymentMethod>
            {formatPaymentMethodLabel(row.paymentMethod)}
          </S.PaymentMethod>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <UIStyles.setting.Table>
        <UIStyles.setting.Thead>
          <tr>
            <th>결제시간</th>
            <th>테이블명</th>
            <th>
              <S.HeaderLabel>
                총 매출
                <InfoIcon
                  width={18}
                  height={18}
                  color={theme.colors.grey[500]}
                />
              </S.HeaderLabel>
            </th>
            <th>
              <S.HeaderLabel>
                실 매출
                <InfoIcon
                  width={18}
                  height={18}
                  color={theme.colors.grey[500]}
                />
              </S.HeaderLabel>
            </th>
            <th>할인 금액</th>
            <th>취소 금액</th>
            <th>
              <S.HeaderLabel>
                사용 포인트
                <InfoIcon
                  width={18}
                  height={18}
                  color={theme.colors.grey[500]}
                />
              </S.HeaderLabel>
            </th>
            <th>상태</th>
            <th>결제 수단</th>
          </tr>
        </UIStyles.setting.Thead>

        <UIStyles.setting.Tbody>
          <S.SummaryRow>
            <td>총계</td>
            <td>-</td>
            <td>{formatCurrency(totals.totalSales)}</td>
            <td>{formatCurrency(totals.actualSales)}</td>
            <td>{formatCurrency(totals.discountAmount)}</td>
            <td>{formatCurrency(totals.cancelAmount)}</td>
            <td>{formatCurrency(totals.usedPoint)}</td>
            <td>-</td>
            <td>-</td>
          </S.SummaryRow>
          {renderRows()}
        </UIStyles.setting.Tbody>
      </UIStyles.setting.Table>
    </div>
  );
};
