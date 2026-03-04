import { t } from '@/config/i18n';
import * as UIStyles from '@repo/ui/styles';
import { formatCurrency } from '@repo/util/string';
import * as S from './table.style';
import type { IMenuSalesSummaryItem } from '@repo/api/types';

interface Props {
  items: IMenuSalesSummaryItem[];
}

export const Table = ({ items }: Props) => {
  const renderRows = () => {
    if (!items || items.length === 0) {
      return (
        <tr
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <td colSpan={4}>{t('메뉴 판매 내역이 없습니다.')}</td>
        </tr>
      );
    }

    return items.map((item, index) => (
      <S.MenuRow key={`${item.menuName}-${index.toString()}`}>
        <td>{item.menuName}</td>
        <td>{formatCurrency(item.unitPrice)}</td>
        <td>{formatCurrency(item.quantity)}</td>
        <td>{formatCurrency(item.totalPrice)}</td>
        <td>{formatCurrency(item.discountAmount)}</td>
        <td>{formatCurrency(item.actualSalesAmount)}</td>
      </S.MenuRow>
    ));
  };

  return (
    <UIStyles.setting.Table>
      <UIStyles.setting.Thead>
        <tr>
          <th>{t('메뉴이름')}</th>
          <th>{t('단위가격')}</th>
          <th>{t('수량')}</th>
          <th>{t('총가격')}</th>
          <th>{t('총 할인액')}</th>
          <th>{t('실 매출액')}</th>
        </tr>
      </UIStyles.setting.Thead>
      <S.Tbody>{renderRows()}</S.Tbody>
    </UIStyles.setting.Table>
  );
};
