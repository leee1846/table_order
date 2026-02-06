'use client';

import * as S from './tableCard.styles';
import { formatCurrency } from '@repo/util/string';
import type { i18n as I18nInstance } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TableWithStatus } from '../TablesPageContainer';

interface Props {
  id: number;
  table: TableWithStatus;
  tableNumber: string;
  orderTime: string | null;
  onClick?: () => void;
  i18nInstance?: I18nInstance;
}

export const TableCard = ({
  onClick,
  id,
  orderTime,
  i18nInstance,
  table,
}: Props) => {
  const { t, i18n } = useTranslation('admin', { i18n: i18nInstance });
  const currentLanguage = (i18n?.language || 'KO').toUpperCase();

  const displayAmount = table.remainingAmount ?? table.totalAmount;

  return (
    <S.CardContainer onClick={onClick}>
      <S.CardHeader>
        <S.TableNumber isEmpty={table.menuItems === null}>
          {table.tableName}
        </S.TableNumber>
        <div>
          <S.OrderTime>{orderTime}</S.OrderTime>
          {table.wifiSignal && (
            <S.WifiSignal>{<p>{t('이용 중')}</p>}</S.WifiSignal>
          )}
        </div>
      </S.CardHeader>

      <S.CardContent>
        {table.menuItems?.slice(0, 3).map((item, idx) => (
          <S.MenuItem key={`item-${table.tableName}-${id}-${idx + 1}`}>
            <S.MenuItemName>
              {item.localeMenuName?.[currentLanguage] ?? item.name}
            </S.MenuItemName>
            <S.MenuItemQuantity>{item.quantity}</S.MenuItemQuantity>
          </S.MenuItem>
        ))}
      </S.CardContent>

      <S.CardFooter>
        <div></div>
        {!table.menuItems ? (
          <S.StatusText>{t('빈 테이블')}</S.StatusText>
        ) : (
          <S.TotalAmount>{formatCurrency(displayAmount ?? 0)}</S.TotalAmount>
        )}
      </S.CardFooter>
    </S.CardContainer>
  );
};
