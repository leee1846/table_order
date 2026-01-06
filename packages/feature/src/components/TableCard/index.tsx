'use client';

import {
  FullBatteryIcon,
  HalfBatteryIcon,
  LowBatteryIcon,
} from '@repo/ui/icons';
import * as S from './tableCard.styles';
import { theme } from '@repo/ui';
import { formatCurrency } from '@repo/util/string';
import type { i18n as I18nInstance } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TableWithStatus } from '../TablesPageContainer';

const { colors } = theme;

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
  const { t } = useTranslation('admin', { i18n: i18nInstance });

  const hasBatteryInfo =
    table.batteryLevel !== null && table.batteryLevel !== undefined;
  const batteryLevel = table.batteryLevel ?? 0;

  const batteryIcon = hasBatteryInfo ? (
    batteryLevel > 51 ? (
      <FullBatteryIcon color={colors.grey[800]} />
    ) : batteryLevel <= 50 && batteryLevel > 20 ? (
      <HalfBatteryIcon color={colors.grey[800]} />
    ) : batteryLevel <= 20 && batteryLevel > 0 ? (
      <LowBatteryIcon color={colors.semantic[400]} />
    ) : null
  ) : null;

  return (
    <S.CardContainer onClick={onClick}>
      <S.CardHeader>
        <S.TableNumber isEmpty={table.menuItems === null}>
          {table.tableName}
        </S.TableNumber>
        <S.OrderTime>{orderTime}</S.OrderTime>
      </S.CardHeader>

      <S.CardContent>
        {table.menuItems?.slice(0, 3).map((item, idx) => (
          <S.MenuItem key={`item-${table.tableName}-${id}-${idx + 1}`}>
            <S.MenuItemName>{item.name}</S.MenuItemName>
            <S.MenuItemQuantity>{item.quantity}</S.MenuItemQuantity>
          </S.MenuItem>
        ))}
      </S.CardContent>

      <S.CardFooter>
        {batteryIcon}
        {!table.menuItems ? (
          <S.StatusText>{t('빈 테이블')}</S.StatusText>
        ) : (
          <S.TotalAmount>
            {formatCurrency(table.totalAmount ?? 0)}
          </S.TotalAmount>
        )}
      </S.CardFooter>
    </S.CardContainer>
  );
};
