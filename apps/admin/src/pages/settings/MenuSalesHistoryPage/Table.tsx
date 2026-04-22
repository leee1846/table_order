import { useMemo } from 'react';
import { AntTooltip } from '@/feature/backoffice/components';
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
        <td>{t('{{value}}개', { value: row.salesCount ?? 0 })}</td>
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
              <AntTooltip
                title={t('추가선택 수량은 중복되므로 제외')}
              />
            </S.HeaderLabel>
          </th>
          <th>
            <S.HeaderLabel>
              {t('총 매출')}
              <AntTooltip title={t('할인액 미반영')} />
            </S.HeaderLabel>
          </th>
        </tr>
      </UIStyles.setting.Thead>
      <UIStyles.setting.Tbody>
        {renderRows()}
        <S.SummaryRow>
          <td>{t('총계')}</td>
          <td>-</td>
          <td>{t('{{value}}개', { value: totalCount })}</td>
          <td>{formatCurrency(totalAmount)}</td>
        </S.SummaryRow>
      </UIStyles.setting.Tbody>
    </S.StyledTable>
  );
};
