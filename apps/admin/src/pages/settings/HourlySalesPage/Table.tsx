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
  const [showTotalSalesTooltip, setShowTotalSalesTooltip] = useState(false);
  const [showPricePerCustomerTooltip, setShowPricePerCustomerTooltip] =
    useState(false);
  const totalSalesIconWrapperRef = useRef<HTMLDivElement>(null);
  const pricePerCustomerIconWrapperRef = useRef<HTMLDivElement>(null);

  const handleTotalSalesIconClick = () => {
    setShowTotalSalesTooltip(!showTotalSalesTooltip);
  };

  const handlePricePerCustomerIconClick = () => {
    setShowPricePerCustomerTooltip(!showPricePerCustomerTooltip);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showTotalSalesTooltip &&
        totalSalesIconWrapperRef.current &&
        !totalSalesIconWrapperRef.current.contains(event.target as Node)
      ) {
        setShowTotalSalesTooltip(false);
      }
      if (
        showPricePerCustomerTooltip &&
        pricePerCustomerIconWrapperRef.current &&
        !pricePerCustomerIconWrapperRef.current.contains(event.target as Node)
      ) {
        setShowPricePerCustomerTooltip(false);
      }
    };

    if (showTotalSalesTooltip || showPricePerCustomerTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTotalSalesTooltip, showPricePerCustomerTooltip]);

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
        <td>{formatCurrency(row.totalSalesAmount ?? 0)}</td>
        <td>{t('{{count}}명', { count: row.customerCount ?? 0 })}</td>
        <td>{formatCurrency(row.pricePerCustomer ?? 0)}</td>
        <td>{t('{{count}}개', { count: row.tableCount ?? 0 })}</td>
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
              {t('총 매출')}
              <S.IconWrapper
                ref={totalSalesIconWrapperRef}
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
                      {t('할인,취소 매출을 제외한 총 매출')}
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
              {t('총 객단가')}
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
