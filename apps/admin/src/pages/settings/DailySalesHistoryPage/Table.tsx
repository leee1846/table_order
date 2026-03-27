import { useEffect, useMemo, useRef, useState } from 'react';
import { InfoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
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
  t: (key: string) => string
) => (
  <S.Metric>
    <span>{`${count ?? 0}${t('건')}`}</span>
    {typeof amount === 'number' && <strong>{formatCurrency(amount)}</strong>}
  </S.Metric>
);

export const DailySalesHistoryTable = ({ rows }: Props) => {
  const { t } = useAdminTranslation();
  const [showActualSalesTooltip, setShowActualSalesTooltip] = useState(false);
  const [showPricePerCustomerTooltip, setShowPricePerCustomerTooltip] =
    useState(false);
  const iconWrapperRef = useRef<HTMLDivElement>(null);
  const pricePerCustomerIconWrapperRef = useRef<HTMLDivElement>(null);

  const handleActualSalesIconClick = () => {
    setShowActualSalesTooltip(!showActualSalesTooltip);
  };

  const handlePricePerCustomerIconClick = () => {
    setShowPricePerCustomerTooltip(!showPricePerCustomerTooltip);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showActualSalesTooltip &&
        iconWrapperRef.current &&
        !iconWrapperRef.current.contains(event.target as Node)
      ) {
        setShowActualSalesTooltip(false);
      }
      if (
        showPricePerCustomerTooltip &&
        pricePerCustomerIconWrapperRef.current &&
        !pricePerCustomerIconWrapperRef.current.contains(event.target as Node)
      ) {
        setShowPricePerCustomerTooltip(false);
      }
    };

    if (showActualSalesTooltip || showPricePerCustomerTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActualSalesTooltip, showPricePerCustomerTooltip]);

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
        <td>{`${row.cancelCount ?? 0}${t('건')}`}</td>
        <td>{`${row.customerCount ?? 0}${t('명')}`}</td>
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
              <th>{t('총 매출')}</th>
              <th>
                <S.HeaderLabel>
                  {t('실 매출')}
                  <S.IconWrapper
                    ref={iconWrapperRef}
                    onClick={handleActualSalesIconClick}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      handleActualSalesIconClick();
                    }}
                  >
                    <InfoIcon
                      width={18}
                      height={18}
                      color={theme.colors.grey[500]}
                    />
                    {showActualSalesTooltip && (
                      <S.Tooltip>
                        <S.TooltipText>
                          {t('취소금액 및 할인이 반영된 금액')}
                        </S.TooltipText>
                        <S.TooltipArrow />
                      </S.Tooltip>
                    )}
                  </S.IconWrapper>
                </S.HeaderLabel>
              </th>
              <th>{t('총 취소')}</th>
              <th>{t('총 객수')}</th>
              <th>
                <S.HeaderLabel>
                  {t('객단가')}
                  <S.IconWrapper
                    ref={pricePerCustomerIconWrapperRef}
                    onClick={handlePricePerCustomerIconClick}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      handlePricePerCustomerIconClick();
                    }}
                  >
                    <InfoIcon
                      width={18}
                      height={18}
                      color={theme.colors.grey[500]}
                    />
                    {showPricePerCustomerTooltip && (
                      <S.Tooltip>
                        <S.TooltipText>
                          {t('매출/객수(*객수 미사용 시, 매출/테이블 수)')}
                        </S.TooltipText>
                        <S.TooltipArrow />
                      </S.Tooltip>
                    )}
                  </S.IconWrapper>
                </S.HeaderLabel>
              </th>
              <th>{t('카드')}</th>
              <th>{t('카드 취소')}</th>
              <th>{t('단순현금')}</th>
              <th>{t('단순현금 취소')}</th>
              <th>{t('할인')}</th>
              <th>{t('서비스')}</th>
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
              <td>{`${totals.cancelCount}${t('건')}`}</td>
              <td>{`${totals.customerCount}${t('명')}`}</td>
              <td>
                {formatCurrency(
                  Math.trunc(totals.actualSalesAmount / totals.customerCount)
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
