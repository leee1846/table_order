import { useMemo } from 'react';
import { AntTooltip } from '@/feature/backoffice/components';
import * as UIStyles from '@repo/ui/styles';
import { formatCurrency } from '@repo/util/string';
import { useAdminTranslation } from '@/config/i18n';
import * as S from './dailySalesHistoryPage.style';

export type TDailySalesHistoryRow = {
  saleDate: string;
  displayDate?: string;
  totalSalesCount: number;
  totalSalesAmount: number;
  actualSalesCount: number;
  actualSalesAmount: number;
  cancelCount: number;
  cancelAmount: number;
  customerCount: number;
  pricePerCustomer: number;
  cardSalesCount: number;
  cardSalesAmount: number;
  cardCancelCount: number;
  cardCancelAmount: number;
  cashSalesCount: number;
  cashSalesAmount: number;
  cashCancelCount: number;
  cashCancelAmount: number;
  discountCount: number;
  discountAmount: number;
  serviceCount: number;
  serviceAmount: number;
};

interface Props {
  rows: TDailySalesHistoryRow[];
}

const renderMetric = (
  count: number,
  amount: number,
  t: (key: string, options?: { value: number | string }) => string
) => (
  <S.Metric>
    <span>{t('{{value}}건', { value: count ?? 0 })}</span>
    {typeof amount === 'number' && <strong>{formatCurrency(amount)}</strong>}
  </S.Metric>
);

export const DailySalesHistoryTable = ({ rows }: Props) => {
  const { t } = useAdminTranslation();

  const totals = useMemo(() => {
    const initialTotals = {
      totalSalesCount: 0,
      totalSalesAmount: 0,
      actualSalesCount: 0,
      actualSalesAmount: 0,
      cancelCount: 0,
      cancelAmount: 0,
      customerCount: 0,
      pricePerCustomer: 0,
      cardSalesCount: 0,
      cardSalesAmount: 0,
      cardCancelCount: 0,
      cardCancelAmount: 0,
      cashSalesCount: 0,
      cashSalesAmount: 0,
      cashCancelCount: 0,
      cashCancelAmount: 0,
      discountCount: 0,
      discountAmount: 0,
      serviceCount: 0,
      serviceAmount: 0,
    };

    type Totals = typeof initialTotals;

    return rows.reduce<Totals>((acc, row) => {
      acc.totalSalesCount += row.totalSalesCount ?? 0;
      acc.totalSalesAmount += row.totalSalesAmount ?? 0;
      acc.actualSalesCount += row.actualSalesCount ?? 0;
      acc.actualSalesAmount += row.actualSalesAmount ?? 0;
      acc.cancelCount += row.cancelCount ?? 0;
      acc.cancelAmount += row.cancelAmount ?? 0;
      acc.customerCount += row.customerCount ?? 0;
      acc.pricePerCustomer += row.pricePerCustomer ?? 0;
      acc.cardSalesCount += row.cardSalesCount ?? 0;
      acc.cardSalesAmount += row.cardSalesAmount ?? 0;
      acc.cardCancelCount += row.cardCancelCount ?? 0;
      acc.cardCancelAmount += row.cardCancelAmount ?? 0;
      acc.cashSalesCount += row.cashSalesCount ?? 0;
      acc.cashSalesAmount += row.cashSalesAmount ?? 0;
      acc.cashCancelCount += row.cashCancelCount ?? 0;
      acc.cashCancelAmount += row.cashCancelAmount ?? 0;
      acc.discountCount += row.discountCount ?? 0;
      acc.discountAmount += row.discountAmount ?? 0;
      acc.serviceCount += row.serviceCount ?? 0;
      acc.serviceAmount += row.serviceAmount ?? 0;

      return acc;
    }, initialTotals);
  }, [rows]);

  const renderRows = () => {
    if (!rows.length) {
      return (
        <S.EmptyRow>
          <td> {t('표시할 매출 내역이 없습니다.')}</td>
        </S.EmptyRow>
      );
    }

    return rows.map((row) => (
      <tr key={row.saleDate}>
        <td>{row.displayDate ?? row.saleDate}</td>
        <td>{renderMetric(row.totalSalesCount, row.totalSalesAmount, t)}</td>
        <td>{renderMetric(row.actualSalesCount, row.actualSalesAmount, t)}</td>
        <td>{t('{{value}}건', { value: row.cancelCount ?? 0 })}</td>
        <td>{t('{{value}}명', { value: row.customerCount ?? 0 })}</td>
        <td>{formatCurrency(row.pricePerCustomer)}</td>
        <td>{renderMetric(row.cardSalesCount, row.cardSalesAmount, t)}</td>
        <td>{renderMetric(row.cardCancelCount, row.cardCancelAmount, t)}</td>
        <td>{renderMetric(row.cashSalesCount, row.cashSalesAmount, t)}</td>
        <td>{renderMetric(row.cashCancelCount, row.cashCancelAmount, t)}</td>
        <td>{renderMetric(row.discountCount, row.discountAmount, t)}</td>
        <td>{renderMetric(row.serviceCount, row.serviceAmount, t)}</td>
      </tr>
    ));
  };

  return (
    <S.TableWrapper>
      <S.FixedHeader>
        <UIStyles.setting.Table>
          <UIStyles.setting.Thead>
            <tr>
              <th>{t('날짜')}</th>
              <th>
                <S.HeaderLabel>
                  {t('총 매출')}
                  <AntTooltip title={t('할인,취소 매출을 제외한 총 매출')} />
                </S.HeaderLabel>
              </th>
              <th>
                <S.HeaderLabel>
                  {t('실 매출')}
                  <AntTooltip title={t('취소금액 및 할인이 반영된 금액')} />
                </S.HeaderLabel>
              </th>
              <th>{t('총 취소')}</th>
              <th>{t('총 객수')}</th>
              <th>
                <S.HeaderLabel>
                  {t('총 객단가')}
                  <AntTooltip
                    title={t(
                      '총 매출/총 객수(*객수 미사용 시, 매출/테이블 수)'
                    )}
                  />
                </S.HeaderLabel>
              </th>
              <th>{t('카드')}</th>
              <th>{t('카드 취소')}</th>
              <th>{t('단순현금')}</th>
              <th>{t('단순현금 취소')}</th>
              <th>
                <S.HeaderLabel>
                  {t('할인')}
                  <AntTooltip
                    title={t('OK포스 할인을 제외한 할인 내역이 노출됩니다.')}
                  />
                </S.HeaderLabel>
              </th>
              <th>
                <S.HeaderLabel>
                  {t('서비스')}
                  <AntTooltip
                    title={t('OK포스 할인 내역은 서비스 항목에 노출됩니다.')}
                    placement="topRight"
                  />
                </S.HeaderLabel>
              </th>
            </tr>
          </UIStyles.setting.Thead>
        </UIStyles.setting.Table>
      </S.FixedHeader>
      <S.ScrollableTable>
        <UIStyles.setting.Table>
          <UIStyles.setting.Tbody>{renderRows()}</UIStyles.setting.Tbody>
        </UIStyles.setting.Table>
      </S.ScrollableTable>
      <S.FixedFooter>
        <UIStyles.setting.Table>
          <UIStyles.setting.Tbody>
            <S.SummaryRow>
              <td>{t('총계')}</td>
              <td>
                {renderMetric(
                  totals.totalSalesCount,
                  totals.totalSalesAmount,
                  t
                )}
              </td>
              <td>
                {renderMetric(
                  totals.actualSalesCount,
                  totals.actualSalesAmount,
                  t
                )}
              </td>
              <td>{t('{{value}}건', { value: totals.cancelCount })}</td>
              <td>{t('{{value}}명', { value: totals.customerCount })}</td>
              <td>
                {formatCurrency(
                  totals.customerCount > 0
                    ? Math.trunc(totals.totalSalesAmount / totals.customerCount)
                    : 0
                )}
              </td>
              <td>
                {renderMetric(totals.cardSalesCount, totals.cardSalesAmount, t)}
              </td>
              <td>
                {renderMetric(
                  totals.cardCancelCount,
                  totals.cardCancelAmount,
                  t
                )}
              </td>
              <td>
                {renderMetric(totals.cashSalesCount, totals.cashSalesAmount, t)}
              </td>
              <td>
                {renderMetric(
                  totals.cashCancelCount,
                  totals.cashCancelAmount,
                  t
                )}
              </td>
              <td>
                {renderMetric(totals.discountCount, totals.discountAmount, t)}
              </td>
              <td>
                {renderMetric(totals.serviceCount, totals.serviceAmount, t)}
              </td>
            </S.SummaryRow>
          </UIStyles.setting.Tbody>
        </UIStyles.setting.Table>
      </S.FixedFooter>
    </S.TableWrapper>
  );
};
