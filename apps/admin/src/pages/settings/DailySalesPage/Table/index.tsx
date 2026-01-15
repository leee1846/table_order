import { useMemo, useState, useRef, useEffect } from 'react';
import { InfoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { formatCurrency, formatPaymentMethodLabel } from '@repo/util/string';
import type { TPaymentType } from '@repo/api/types';
import { useAdminTranslation } from '@/config/i18n';
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
}

export const DailySalesTable = ({ rows }: Props) => {
  const { t } = useAdminTranslation();
  const [showTotalSalesTooltip, setShowTotalSalesTooltip] = useState(false);
  const [showActualSalesTooltip, setShowActualSalesTooltip] = useState(false);
  const totalSalesIconRef = useRef<HTMLDivElement>(null);
  const actualSalesIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        totalSalesIconRef.current &&
        !totalSalesIconRef.current.contains(event.target as Node)
      ) {
        setShowTotalSalesTooltip(false);
      }
      if (
        actualSalesIconRef.current &&
        !actualSalesIconRef.current.contains(event.target as Node)
      ) {
        setShowActualSalesTooltip(false);
      }
    };

    if (showTotalSalesTooltip || showActualSalesTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showTotalSalesTooltip, showActualSalesTooltip]);

  const handleTotalSalesIconClick = () => {
    setShowTotalSalesTooltip(!showTotalSalesTooltip);
  };

  const handleActualSalesIconClick = () => {
    setShowActualSalesTooltip(!showActualSalesTooltip);
  };

  const formatStatusLabel = (status: string): string => {
    switch (status) {
      case 'UNPAID':
        return t('미결제');
      case 'CANCEL':
        return t('취소');
      case 'PARTIAL_CANCEL':
        return t('부분취소');
      case 'NORMAL':
        return t('일반');
      default:
        return status || '-';
    }
  };

  const formatPaymentMethodLabelWithTranslation = (
    paymentMethod: string
  ): string => {
    const label = formatPaymentMethodLabel(paymentMethod);
    return t(label);
  };

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, cur) => {
          acc.totalSales += cur.totalSales ?? 0;
          acc.actualSales += cur.actualSales ?? 0;
          acc.discountAmount += cur.discountAmount ?? 0;
          acc.cancelAmount += cur.cancelAmount ?? 0;
          return acc;
        },
        {
          totalSales: 0,
          actualSales: 0,
          discountAmount: 0,
          cancelAmount: 0,
        }
      ),
    [rows]
  );

  const renderRows = () => {
    return rows.map((row) => (
      <S.TableRow key={row.id} isCancel={row.status === 'CANCEL'}>
        <td>{row.paymentTime || '-'}</td>
        <td>{row.tableName || '-'}</td>
        <td>{formatCurrency(row.totalSales ?? 0)}</td>
        <td>{formatCurrency(row.actualSales ?? 0)}</td>
        <td>{formatCurrency(row.discountAmount ?? 0)}</td>
        <td>{formatCurrency(row.cancelAmount ?? 0)}</td>
        <td>
          <S.StatusText cancel={row.isCanceled}>
            {formatStatusLabel(row.status)}
          </S.StatusText>
        </td>
        <td>
          <S.PaymentMethod>
            {formatPaymentMethodLabelWithTranslation(row.paymentMethod)}
          </S.PaymentMethod>
        </td>
      </S.TableRow>
    ));
  };

  return (
    <div>
      <UIStyles.setting.Table>
        <UIStyles.setting.Thead>
          <tr>
            <th>{t('결제시간')}</th>
            <th>{t('테이블명')}</th>
            <th>
              <S.HeaderLabel>
                {t('총 매출')}
                <S.IconWrapper
                  ref={totalSalesIconRef}
                  onClick={handleTotalSalesIconClick}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleTotalSalesIconClick();
                  }}
                >
                  <InfoIcon
                    width={18}
                    height={18}
                    color={theme.colors.grey[500]}
                  />
                  {showTotalSalesTooltip && (
                    <S.Tooltip>
                      <S.TooltipText>
                        {t('취소 매출을 제외한 총 매출')}
                      </S.TooltipText>
                      <S.TooltipArrow />
                    </S.Tooltip>
                  )}
                </S.IconWrapper>
              </S.HeaderLabel>
            </th>
            <th>
              <S.HeaderLabel>
                {t('실 매출')}
                <S.IconWrapper
                  ref={actualSalesIconRef}
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
            <th>{t('할인 금액')}</th>
            <th>{t('취소 금액')}</th>
            <th>{t('상태')}</th>
            <th>{t('결제 수단')}</th>
          </tr>
        </UIStyles.setting.Thead>

        <UIStyles.setting.Tbody>
          {renderRows()}
          <S.SummaryRow>
            <td>{t('총계')}</td>
            <td>-</td>
            <td>{formatCurrency(totals.totalSales)}</td>
            <td>{formatCurrency(totals.actualSales)}</td>
            <td>{formatCurrency(totals.discountAmount)}</td>
            <td>{formatCurrency(totals.cancelAmount)}</td>
            <td>-</td>
            <td>-</td>
          </S.SummaryRow>
        </UIStyles.setting.Tbody>
      </UIStyles.setting.Table>
    </div>
  );
};
