import * as UIStyles from '@repo/ui/styles';
import { formatCurrency } from '@repo/util/string';
import * as S from './table.style';
import type { IMenuSalesSummaryItem } from '@repo/api/types';

interface Props {
  items: IMenuSalesSummaryItem[];
  isLoading?: boolean;
}

export const Table = ({ items, isLoading }: Props) => {
  const renderRows = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={4}>메뉴 판매 내역을 불러오는 중입니다.</td>
        </tr>
      );
    }

    if (!items || items.length === 0) {
      return (
        <tr>
          <td colSpan={4}>메뉴 판매 내역이 없습니다.</td>
        </tr>
      );
    }

    return items.map((item, index) => (
      <S.MenuRow key={`${item.menuName}-${index}`}>
        <td>{item.menuName}</td>
        <td>{formatCurrency(item.unitPrice)}</td>
        <td>{formatCurrency(item.quantity)}</td>
        <td>{formatCurrency(item.totalPrice)}</td>
      </S.MenuRow>
    ));
  };

  return (
    <UIStyles.setting.Table>
      <UIStyles.setting.Thead>
        <tr>
          <th>메뉴이름</th>
          <th>단위가격</th>
          <th>수량</th>
          <th>총가격</th>
        </tr>
      </UIStyles.setting.Thead>
      <UIStyles.setting.Tbody>
        {renderRows()}
      </UIStyles.setting.Tbody>
    </UIStyles.setting.Table>
  );
};
