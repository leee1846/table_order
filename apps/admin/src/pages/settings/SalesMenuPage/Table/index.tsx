import * as UIStyles from '@repo/ui/styles';
import { formatCurrency } from '@repo/util/string';
import * as S from './table.style';
import type { IMenuSalesSummaryItem, TShopLanguage } from '@repo/api/types';
import { useAdminTranslation } from '@/config/i18n';

interface Props {
  items: IMenuSalesSummaryItem[];
  currentLanguage: TShopLanguage;
}

export const Table = ({ items, currentLanguage }: Props) => {
  const { t } = useAdminTranslation();
  const renderRows = () => {
    if (!items || items.length === 0) {
      return (
        <S.EmptyRow>
          <td colSpan={6}>{t('메뉴 판매 내역이 없습니다.')}</td>
        </S.EmptyRow>
      );
    }

    return items.flatMap((item, itemIndex) => {
      const options = item.optionList ?? [];
      const menuKey = `menu-${itemIndex}-${item.menuName}`;

      const menuRow = (
        <S.MenuRow key={menuKey} hasOptions={options.length > 0}>
          <td>
            <S.MenuName>
              {item.localeMenuName?.[currentLanguage] ?? item.menuName}
            </S.MenuName>
          </td>
          <td>{formatCurrency(item.unitPrice)}</td>
          <td>{formatCurrency(item.quantity)}</td>
          <td>{formatCurrency(item.totalPrice)}</td>
          <td>{formatCurrency(item.discountAmount)}</td>
          <td>{formatCurrency(item.actualSalesAmount)}</td>
        </S.MenuRow>
      );

      const optionRows = options.map((option, optIndex) => (
        <S.OptionRow
          key={`${menuKey}-opt-${optIndex + 1}-${option.menuName}`}
          isLast={optIndex === options.length - 1}
        >
          <td>
            <S.OptionMenuName>
              {option.localeMenuName?.[currentLanguage] ?? option.menuName}
            </S.OptionMenuName>
          </td>
          <td>{formatCurrency(option.unitPrice)}</td>
          <td>{formatCurrency(option.quantity)}</td>
          <td>{formatCurrency(option.totalPrice)}</td>
          <td>{formatCurrency(option.discountAmount)}</td>
          <td>{formatCurrency(option.actualSalesAmount)}</td>
        </S.OptionRow>
      ));

      return [menuRow, ...optionRows];
    });
  };

  return (
    <S.StyledTable>
      <UIStyles.setting.Thead>
        <tr>
          <th>{t('메뉴이름')}</th>
          <th>{t('단위가격')}</th>
          <th>{t('수량')}</th>
          <th>{t('총 매출액')}</th>
          <th>{t('총 할인액')}</th>
          <th>{t('실 매출액')}</th>
        </tr>
      </UIStyles.setting.Thead>
      <S.Tbody>{renderRows()}</S.Tbody>
    </S.StyledTable>
  );
};
