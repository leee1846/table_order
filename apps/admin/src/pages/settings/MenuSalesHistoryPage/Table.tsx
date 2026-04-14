import { useEffect, useMemo, useRef, useState } from 'react';
import { InfoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { formatCurrency } from '@repo/util/string';
import type { IMenuSalesHistoryItem, TShopLanguage } from '@repo/api/types';
import * as S from './menuSalesHistoryPage.style';
import { useAdminTranslation } from '@/config/i18n';

interface Props {
  rows: IMenuSalesHistoryItem[];
  currentLanguage: TShopLanguage;
}

export const MenuSalesHistoryTable = ({ rows, currentLanguage }: Props) => {
  const { t } = useAdminTranslation();
  const [showSalesCountTooltip, setShowSalesCountTooltip] = useState(false);
  const [showTotalSalesTooltip, setShowTotalSalesTooltip] = useState(false);
  const salesCountIconWrapperRef = useRef<HTMLDivElement>(null);
  const totalSalesIconWrapperRef = useRef<HTMLDivElement>(null);
  const orderedRows = useMemo(() => {
    if (!rows.length) {
      return [];
    }

    const result: IMenuSalesHistoryItem[] = [];
    const processedOptionSeqs = new Set<number>();

    // rows의 원래 순서를 유지하면서 순회
    rows.forEach((row) => {
      // 이미 처리된 옵션이면 스킵
      if (row.isOption === 1 && processedOptionSeqs.has(row.menuSeq)) {
        return;
      }

      // 부모 메뉴인 경우
      if (row.isOption !== 1) {
        result.push(row);

        // 해당 부모의 옵션들을 원래 rows 순서대로 찾아서 추가
        const options = rows.filter(
          (r) => r.isOption === 1 && r.parentMenuSeq === row.menuSeq
        );
        options.forEach((option) => {
          result.push(option);
          processedOptionSeqs.add(option.menuSeq);
        });
      } else {
        // 고아 옵션 (부모가 없는 옵션)
        const hasParent = rows.some(
          (r) => r.isOption !== 1 && r.menuSeq === row.parentMenuSeq
        );
        if (!hasParent) {
          result.push(row);
          processedOptionSeqs.add(row.menuSeq);
        }
      }
    });

    return result;
  }, [rows]);

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
    if (!orderedRows.length) {
      return (
        <S.EmptyRow>
          <td>{t('표시할 매출 내역이 없습니다.')}</td>
        </S.EmptyRow>
      );
    }

    return orderedRows.map((row) => (
      <S.TableRow
        key={`${row.menuSeq}-${row.isOption}-${row.parentMenuSeq}-${row.menuName}`}
        isOption={row.isOption === 1}
      >
        <td>
          <S.MenuName isOption={row.isOption === 1}>
            {row.localeMenuName?.[currentLanguage] ?? row.menuName}
          </S.MenuName>
        </td>
        <td>{formatCurrency(row.unitPrice ?? 0)}</td>
        <td>{t('{{count}}개', { count: row.salesCount ?? 0 })}</td>
        <td>{formatCurrency(row.totalSalesAmount ?? 0)}</td>
      </S.TableRow>
    ));
  };

  const totalCount = orderedRows.reduce(
    (acc, cur) => acc + (cur.salesCount ?? 0),
    0
  );
  const totalAmount = orderedRows.reduce(
    (acc, cur) => acc + (cur.totalSalesAmount ?? 0),
    0
  );

  return (
    <S.StyledTable>
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
                    <S.TooltipText>{t('할인액 미반영')}</S.TooltipText>
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
          <td>{t('{{count}}개', { count: totalCount })}</td>
          <td>{formatCurrency(totalAmount)}</td>
        </S.SummaryRow>
      </UIStyles.setting.Tbody>
    </S.StyledTable>
  );
};
