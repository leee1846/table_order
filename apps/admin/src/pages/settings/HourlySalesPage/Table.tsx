import { InfoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { formatCurrency } from '@repo/util/string';
import type { IHourlySalesItem } from '@repo/api/types';
import { useAdminTranslation } from '@/config/i18n';
import * as S from './hourlySalesPage.style';

interface Props {
  rows: IHourlySalesItem[];
  isLoading?: boolean;
}

const COLUMN_LENGTH = 5;

export const HourlySalesTable = ({ rows, isLoading }: Props) => {
  const { t } = useAdminTranslation();

  const renderRows = () => {
    if (isLoading) {
      return (
        <S.EmptyRow>
          <td colSpan={COLUMN_LENGTH}>
            {t('시간별 매출 내역을 불러오는 중입니다.')}
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

    return rows.map((row) => (
      <tr key={row.hour}>
        <td>{row.hour}</td>
        <td>
          <S.Metric>
            <strong>{formatCurrency(row.actualSalesAmount ?? 0)}</strong>
            <span>{`${row.actualSalesCount ?? 0}건`}</span>
          </S.Metric>
        </td>
        <td>{`${row.customerCount ?? 0}명`}</td>
        <td>
          <S.Metric>
            <strong>{formatCurrency(row.pricePerCustomer ?? 0)}</strong>
          </S.Metric>
        </td>
        <td>{`${row.tableCount ?? 0}개`}</td>
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
              <InfoIcon width={18} height={18} color={theme.colors.grey[500]} />
            </S.HeaderLabel>
          </th>
          <th>{t('총 객수')}</th>
          <th>
            <S.HeaderLabel>
              {t('객단가')}
              <InfoIcon width={18} height={18} color={theme.colors.grey[500]} />
            </S.HeaderLabel>
          </th>
          <th>{t('총 테이블 수')}</th>
        </tr>
      </UIStyles.setting.Thead>
      <UIStyles.setting.Tbody>{renderRows()}</UIStyles.setting.Tbody>
    </UIStyles.setting.Table>
  );
};
