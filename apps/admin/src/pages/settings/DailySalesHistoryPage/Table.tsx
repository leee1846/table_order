import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { useOutsidePointerDismiss } from '@/hooks/useOutsidePointerDismiss';
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

type SalesHistoryHeaderTooltipId =
  | 'totalSales'
  | 'actualSales'
  | 'pricePerCustomer'
  | 'discount'
  | 'service';

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

function HeaderWithInfo({
  label,
  tooltipText,
  open,
  onToggle,
  wrapperRef,
  serviceColumn,
}: {
  label: string;
  tooltipText: string;
  open: boolean;
  onToggle: () => void;
  wrapperRef: RefObject<HTMLDivElement | null>;
  serviceColumn?: boolean;
}) {
  const handleTouchEnd = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onToggle();
  };

  return (
    <S.HeaderLabel>
      {label}
      <S.IconWrapper
        ref={wrapperRef}
        onClick={onToggle}
        onTouchEnd={handleTouchEnd}
      >
        <InfoIcon width={18} height={18} color={theme.colors.grey[500]} />
        {open &&
          (serviceColumn ? (
            <S.ServiceColumnTooltip>
              <S.TooltipText>{tooltipText}</S.TooltipText>
              <S.ServiceColumnTooltipArrow />
            </S.ServiceColumnTooltip>
          ) : (
            <S.Tooltip>
              <S.TooltipText>{tooltipText}</S.TooltipText>
              <S.TooltipArrow />
            </S.Tooltip>
          ))}
      </S.IconWrapper>
    </S.HeaderLabel>
  );
}

export const DailySalesHistoryTable = ({ rows }: Props) => {
  const { t } = useAdminTranslation();
  const [openHeaderTooltip, setOpenHeaderTooltip] = useState<
    SalesHistoryHeaderTooltipId | null
  >(null);
  const totalSalesIconWrapperRef = useRef<HTMLDivElement>(null);
  const iconWrapperRef = useRef<HTMLDivElement>(null);
  const pricePerCustomerIconWrapperRef = useRef<HTMLDivElement>(null);
  const discountIconWrapperRef = useRef<HTMLDivElement>(null);
  const serviceIconWrapperRef = useRef<HTMLDivElement>(null);
  const outsideDismissAnchorRef = useRef<HTMLDivElement | null>(null);

  const toggleHeaderTooltip = (id: SalesHistoryHeaderTooltipId) => {
    setOpenHeaderTooltip((current) => (current === id ? null : id));
  };

  useLayoutEffect(() => {
    outsideDismissAnchorRef.current =
      openHeaderTooltip === 'totalSales'
        ? totalSalesIconWrapperRef.current
        : openHeaderTooltip === 'actualSales'
          ? iconWrapperRef.current
          : openHeaderTooltip === 'pricePerCustomer'
            ? pricePerCustomerIconWrapperRef.current
            : openHeaderTooltip === 'discount'
              ? discountIconWrapperRef.current
              : openHeaderTooltip === 'service'
                ? serviceIconWrapperRef.current
                : null;
  }, [openHeaderTooltip]);

  useOutsidePointerDismiss({
    isActive: openHeaderTooltip !== null,
    anchorRef: outsideDismissAnchorRef,
    onDismiss: () => setOpenHeaderTooltip(null),
  });

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
                <HeaderWithInfo
                  label={t('총 매출')}
                  tooltipText={t('할인,취소 매출을 제외한 총 매출')}
                  open={openHeaderTooltip === 'totalSales'}
                  onToggle={() => toggleHeaderTooltip('totalSales')}
                  wrapperRef={totalSalesIconWrapperRef}
                />
              </th>
              <th>
                <HeaderWithInfo
                  label={t('실 매출')}
                  tooltipText={t('취소금액 및 할인이 반영된 금액')}
                  open={openHeaderTooltip === 'actualSales'}
                  onToggle={() => toggleHeaderTooltip('actualSales')}
                  wrapperRef={iconWrapperRef}
                />
              </th>
              <th>{t('총 취소')}</th>
              <th>{t('총 객수')}</th>
              <th>
                <HeaderWithInfo
                  label={t('총 객단가')}
                  tooltipText={t(
                    '총 매출/총 객수(*객수 미사용 시, 매출/테이블 수)'
                  )}
                  open={openHeaderTooltip === 'pricePerCustomer'}
                  onToggle={() => toggleHeaderTooltip('pricePerCustomer')}
                  wrapperRef={pricePerCustomerIconWrapperRef}
                />
              </th>
              <th>{t('카드')}</th>
              <th>{t('카드 취소')}</th>
              <th>{t('단순현금')}</th>
              <th>{t('단순현금 취소')}</th>
              <th>
                <HeaderWithInfo
                  label={t('할인')}
                  tooltipText={t(
                    'OK포스 할인을 제외한 할인 내역이 노출됩니다.'
                  )}
                  open={openHeaderTooltip === 'discount'}
                  onToggle={() => toggleHeaderTooltip('discount')}
                  wrapperRef={discountIconWrapperRef}
                />
              </th>
              <th>
                <HeaderWithInfo
                  label={t('서비스')}
                  tooltipText={t(
                    'OK포스 할인 내역은 서비스 항목에 노출됩니다.'
                  )}
                  open={openHeaderTooltip === 'service'}
                  onToggle={() => toggleHeaderTooltip('service')}
                  wrapperRef={serviceIconWrapperRef}
                  serviceColumn
                />
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
