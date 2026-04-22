import { AntTooltip } from '@/feature/backoffice/components';
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
        <td>{t('{{value}}명', { value: row.customerCount ?? 0 })}</td>
        <td>{formatCurrency(row.pricePerCustomer ?? 0)}</td>
        <td>{t('{{value}}개', { value: row.tableCount ?? 0 })}</td>
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
              <AntTooltip
                title={t('할인,취소 매출을 제외한 총 매출')}
              />
            </S.HeaderLabel>
          </th>
          <th>{t('총 객수')}</th>
          <th>
            <S.HeaderLabel>
              {t('총 객단가')}
              <AntTooltip
                title={t('매출/객수(*객수 미사용 시, 매출/테이블 수)')}
              />
            </S.HeaderLabel>
          </th>
          <th>{t('총 테이블 수')}</th>
        </tr>
      </UIStyles.setting.Thead>
      <UIStyles.setting.Tbody>{renderRows()}</UIStyles.setting.Tbody>
    </UIStyles.setting.Table>
  );
};
