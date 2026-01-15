import { useState, useRef, useEffect } from 'react';
import { InfoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { formatCurrency } from '@repo/util/string';
import type { IHourlySalesItem } from '@repo/api/types';
import { useAdminTranslation } from '@/config/i18n';
import * as S from './hourlySalesPage.style';

interface Props {
  rows: IHourlySalesItem[];
}

export const HourlySalesTable = ({ rows }: Props) => {
  const { t } = useAdminTranslation();
  const [showActualSalesTooltip, setShowActualSalesTooltip] = useState(false);
  const [showPricePerCustomerTooltip, setShowPricePerCustomerTooltip] =
    useState(false);
  const actualSalesIconWrapperRef = useRef<HTMLDivElement>(null);
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
        actualSalesIconWrapperRef.current &&
        !actualSalesIconWrapperRef.current.contains(event.target as Node)
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

  const renderRows = () => {
    if (!rows.length) {
      return (
        <S.EmptyRow>
          <td>{t('표시할 매출 내역이 없습니다.')}</td>
        </S.EmptyRow>
      );
    }

    return rows.map((row) => (
      <tr key={row.hour}>
        <td>{row.hour}</td>
        <td>
          {formatCurrency(row.actualSalesAmount ?? 0)}
          <S.Metric>
            <span>{`${row.actualSalesCount ?? 0}${t('건')}`}</span>
          </S.Metric>
        </td>
        <td>{`${row.customerCount ?? 0}${t('명')}`}</td>
        <td>{formatCurrency(row.pricePerCustomer ?? 0)}</td>
        <td>{`${row.tableCount ?? 0}${t('개')}`}</td>
      </tr>
    ));
  };

  return (
    <UIStyles.setting.Table>
      <UIStyles.setting.Thead>
        <tr>
          <th>{t('시간대')}</th>
          <th>
            <S.HeaderLabel>
              {t('실 매출')}
              <S.IconWrapper
                ref={actualSalesIconWrapperRef}
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
          <th>{t('총 테이블 수')}</th>
        </tr>
      </UIStyles.setting.Thead>
      <UIStyles.setting.Tbody>{renderRows()}</UIStyles.setting.Tbody>
    </UIStyles.setting.Table>
  );
};
