import { useMemo } from 'react';
import { InfoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { formatCurrency } from '@repo/util/string';
import { useAdminTranslation } from '@/config/i18n';
import * as S from './dailySalesHistoryPage.style';

export type TSalesMetric = {
  count: number;
  amount?: number;
};

export type TDailySalesHistoryRow = {
  date: string;
  displayDate?: string;
  totalSales: TSalesMetric;
  actualSales: TSalesMetric;
  totalCancel: TSalesMetric;
  totalGuests: number;
  averageGuestPrice: number;
  usedPoint: number;
  card: TSalesMetric;
  cardCancel: TSalesMetric;
  cash: TSalesMetric;
  cashCancel: TSalesMetric;
  cashReceipt: TSalesMetric;
  cashReceiptCancel: TSalesMetric;
  discount: TSalesMetric;
  service: TSalesMetric;
};

interface Props {
  rows: TDailySalesHistoryRow[];
  isLoading?: boolean;
}

const COLUMN_LENGTH = 15;

const renderMetric = (metric: TSalesMetric, t: (key: string) => string) => (
  <S.Metric>
    <span>{`${metric.count ?? 0}${t('건')}`}</span>
    {typeof metric.amount === 'number' && (
      <strong>{formatCurrency(metric.amount)}</strong>
    )}
  </S.Metric>
);

const renderAmountOnly = (amount: number, suffix: string = '') => (
  <S.Metric>
    <strong>
      {formatCurrency(amount)}
      {suffix}
    </strong>
  </S.Metric>
);

export const DailySalesHistoryTable = ({ rows, isLoading }: Props) => {
  const { t } = useAdminTranslation();
  const totals = useMemo(() => {
    const initMetric = { count: 0, amount: 0 };
    const initialTotals = {
      totalSales: { ...initMetric },
      actualSales: { ...initMetric },
      totalCancel: { ...initMetric },
      card: { ...initMetric },
      cardCancel: { ...initMetric },
      cash: { ...initMetric },
      cashCancel: { ...initMetric },
      cashReceipt: { ...initMetric },
      cashReceiptCancel: { ...initMetric },
      discount: { ...initMetric },
      service: { ...initMetric },
      totalGuests: 0,
      usedPoint: 0,
    };

    type Totals = typeof initialTotals;

    return rows.reduce<Totals>((acc, row) => {
      const addMetric = (
        key:
          | 'totalSales'
          | 'actualSales'
          | 'totalCancel'
          | 'card'
          | 'cardCancel'
          | 'cash'
          | 'cashCancel'
          | 'cashReceipt'
          | 'cashReceiptCancel'
          | 'discount'
          | 'service',
        metric: TSalesMetric
      ) => {
        acc[key].count += metric.count ?? 0;
        const amount = typeof metric.amount === 'number' ? metric.amount : 0;
        acc[key].amount =
          typeof acc[key].amount === 'number'
            ? acc[key].amount + amount
            : amount;
      };

      addMetric('totalSales', row.totalSales);
      addMetric('actualSales', row.actualSales);
      addMetric('totalCancel', row.totalCancel);
      addMetric('card', row.card);
      addMetric('cardCancel', row.cardCancel);
      addMetric('cash', row.cash);
      addMetric('cashCancel', row.cashCancel);
      addMetric('cashReceipt', row.cashReceipt);
      addMetric('cashReceiptCancel', row.cashReceiptCancel);
      addMetric('discount', row.discount);
      addMetric('service', row.service);

      acc.totalGuests += row.totalGuests ?? 0;
      acc.usedPoint += row.usedPoint ?? 0;

      return acc;
    }, initialTotals);
  }, [rows]);

  const averageGuestPrice =
    totals.totalGuests > 0
      ? Math.round(
          (totals.totalSales.amount ?? 0) / Math.max(totals.totalGuests, 1)
        )
      : 0;

  const renderRows = () => {
    if (isLoading) {
      return (
        <S.EmptyRow>
          <td colSpan={COLUMN_LENGTH}>
            {t('일별 매출 내역을 불러오는 중입니다.')}
          </td>
        </S.EmptyRow>
      );
    }

    if (!rows.length) {
      return (
        <S.EmptyRow>
          <td colSpan={COLUMN_LENGTH}>{t('표시할 매출 내역이 없습니다.')}</td>
        </S.EmptyRow>
      );
    }

    return rows.map((row) => (
      <tr key={row.date}>
        <td>{row.displayDate ?? row.date}</td>
        <td>{renderMetric(row.totalSales, t)}</td>
        <td>{renderMetric(row.actualSales, t)}</td>
        <td>{`${row.totalCancel.count ?? 0}${t('건')}`}</td>
        <td>{`${row.totalGuests ?? 0}${t('명')}`}</td>
        <td>
          <S.Metric>
            <strong>{formatCurrency(row.averageGuestPrice)}</strong>
          </S.Metric>
        </td>
        <td>{renderAmountOnly(row.usedPoint, 'P')}</td>
        <td>{renderMetric(row.card, t)}</td>
        <td>{renderMetric(row.cardCancel, t)}</td>
        <td>{renderMetric(row.cash, t)}</td>
        <td>{renderMetric(row.cashCancel, t)}</td>
        <td>{renderMetric(row.cashReceipt, t)}</td>
        <td>{renderMetric(row.cashReceiptCancel, t)}</td>
        <td>{renderMetric(row.discount, t)}</td>
        <td>{renderMetric(row.service, t)}</td>
      </tr>
    ));
  };

  return (
    <UIStyles.setting.Table>
      <UIStyles.setting.Thead>
        <tr>
          <th>{t('날짜')}</th>
          <th>{t('총 매출')}</th>
          <th>{t('실 매출')}</th>
          <th>{t('총 취소')}</th>
          <th>{t('총 객수')}</th>
          <th>
            <S.HeaderLabel>
              {t('객단가')}
              <InfoIcon width={18} height={18} color={theme.colors.grey[500]} />
            </S.HeaderLabel>
          </th>
          <th>
            <S.HeaderLabel>
              {t('사용 포인트')}
              <InfoIcon width={18} height={18} color={theme.colors.grey[500]} />
            </S.HeaderLabel>
          </th>
          <th>{t('카드')}</th>
          <th>{t('카드 취소')}</th>
          <th>{t('단순현금')}</th>
          <th>{t('단순현금 취소')}</th>
          <th>{t('현금영수증')}</th>
          <th>{t('현금영수증 취소')}</th>
          <th>{t('할인')}</th>
          <th>{t('서비스')}</th>
        </tr>
      </UIStyles.setting.Thead>
      <UIStyles.setting.Tbody>
        <S.SummaryRow>
          <td>{t('총계')}</td>
          <td>{renderMetric(totals.totalSales, t)}</td>
          <td>{renderMetric(totals.actualSales, t)}</td>
          <td>{`${totals.totalCancel.count}${t('건')}`}</td>
          <td>{`${totals.totalGuests}${t('명')}`}</td>
          <td>
            <S.Metric>
              <strong>{formatCurrency(averageGuestPrice)}</strong>
            </S.Metric>
          </td>
          <td>{renderAmountOnly(totals.usedPoint, 'P')}</td>
          <td>{renderMetric(totals.card, t)}</td>
          <td>{renderMetric(totals.cardCancel, t)}</td>
          <td>{renderMetric(totals.cash, t)}</td>
          <td>{renderMetric(totals.cashCancel, t)}</td>
          <td>{renderMetric(totals.cashReceipt, t)}</td>
          <td>{renderMetric(totals.cashReceiptCancel, t)}</td>
          <td>{renderMetric(totals.discount, t)}</td>
          <td>{renderMetric(totals.service, t)}</td>
        </S.SummaryRow>
        {renderRows()}
      </UIStyles.setting.Tbody>
    </UIStyles.setting.Table>
  );
};
