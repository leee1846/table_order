import { useState, useRef, useEffect } from 'react';
import { InfoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { formatCurrency } from '@repo/util/string';
import type { IMenuSalesHistoryItem } from '@repo/api/types';
import { useAdminTranslation } from '@/config/i18n';
import * as S from './menuSalesHistoryPage.style';

interface Props {
  rows: IMenuSalesHistoryItem[];
  isLoading?: boolean;
}

const COLUMN_LENGTH = 4;

export const MenuSalesHistoryTable = ({ rows, isLoading }: Props) => {
  const { t } = useAdminTranslation();
  const [showSalesCountTooltip, setShowSalesCountTooltip] = useState(false);
  const [showTotalSalesTooltip, setShowTotalSalesTooltip] = useState(false);
  const salesCountIconWrapperRef = useRef<HTMLDivElement>(null);
  const totalSalesIconWrapperRef = useRef<HTMLDivElement>(null);

  const handleSalesCountIconClick = () => {
    setShowSalesCountTooltip(!showSalesCountTooltip);
  };

  const handleTotalSalesIconClick = () => {
    setShowTotalSalesTooltip(!showTotalSalesTooltip);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSalesCountTooltip &&
        salesCountIconWrapperRef.current &&
        !salesCountIconWrapperRef.current.contains(event.target as Node)
      ) {
        setShowSalesCountTooltip(false);
      }
      if (
        showTotalSalesTooltip &&
        totalSalesIconWrapperRef.current &&
        !totalSalesIconWrapperRef.current.contains(event.target as Node)
      ) {
        setShowTotalSalesTooltip(false);
      }
    };

    if (showSalesCountTooltip || showTotalSalesTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSalesCountTooltip, showTotalSalesTooltip]);

  const renderRows = () => {
    if (isLoading) {
      return (
        <S.EmptyRow>
          <td colSpan={COLUMN_LENGTH}>
            {t('메뉴별 매출 내역을 불러오는 중입니다.')}
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

    return rows.map((row, index) => (
      <tr key={`${row.menuName}-${index}`}>
        <td>{row.menuName}</td>
        <td>{formatCurrency(row.unitPrice ?? 0)}</td>
        <td>{`${row.salesCount ?? 0}개`}</td>
        <td>{formatCurrency(row.totalSalesAmount ?? 0)}</td>
      </tr>
    ));
  };

  const totalCount = rows.reduce((acc, cur) => acc + (cur.salesCount ?? 0), 0);
  const totalAmount = rows.reduce(
    (acc, cur) => acc + (cur.totalSalesAmount ?? 0),
    0
  );

  return (
    <UIStyles.setting.Table>
      <UIStyles.setting.Thead>
        <tr>
          <th>{t('메뉴명')}</th>
          <th>{t('단가')}</th>
          <th>
            <S.HeaderLabel>
              {t('판매수')}
              <S.IconWrapper
                ref={salesCountIconWrapperRef}
                onClick={handleSalesCountIconClick}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleSalesCountIconClick();
                }}
              >
                <InfoIcon
                  width={18}
                  height={18}
                  color={theme.colors.grey[500]}
                />
                {showSalesCountTooltip && (
                  <S.Tooltip>
                    <S.TooltipText>
                      {t('추가선택 수량은 중복되므로 제외')}
                    </S.TooltipText>
                    <S.TooltipArrow />
                  </S.Tooltip>
                )}
              </S.IconWrapper>
            </S.HeaderLabel>
          </th>
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
                      {t('할인액 미반영')}
                    </S.TooltipText>
                    <S.TooltipArrow />
                  </S.Tooltip>
                )}
              </S.IconWrapper>
            </S.HeaderLabel>
          </th>
        </tr>
      </UIStyles.setting.Thead>
      <UIStyles.setting.Tbody>
        {renderRows()}
        <S.SummaryRow>
          <td>{t('총계')}</td>
          <td>-</td>
          <td>{`${totalCount}개`}</td>
          <td>{formatCurrency(totalAmount)}</td>
        </S.SummaryRow>
      </UIStyles.setting.Tbody>
    </UIStyles.setting.Table>
  );
};
