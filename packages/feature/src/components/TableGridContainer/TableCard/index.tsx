'use client';

import {
  FullBatteryIcon,
  HalfBatteryIcon,
  LowBatteryIcon,
} from '@repo/ui/icons';
import * as S from './tableCard.styles';
import { theme } from '@repo/ui';
import { formatCurrency, isEmpty } from '@repo/util';

const { colors } = theme;

interface Props {
  id: number;
  tableNumber: number;
  orderTime?: string;
  menuItems?: Array<{ name: string; quantity: number }>;
  batteryLevel: number;
  totalAmount?: number;
  onClick?: () => void;
}

export const TableCard = ({
  tableNumber,
  onClick,
  id,
  orderTime,
  menuItems = [],
  batteryLevel,
  totalAmount,
}: Props) => {
  const batteryIcon =
    batteryLevel > 51 ? (
      <FullBatteryIcon color={colors.grey[800]} />
    ) : batteryLevel <= 50 && batteryLevel > 20 ? (
      <HalfBatteryIcon color={colors.grey[800]} />
    ) : batteryLevel <= 20 && batteryLevel > 0 ? (
      <LowBatteryIcon color={colors.semantic[400]} />
    ) : null;

  return (
    <S.CardContainer onClick={onClick}>
      <S.CardHeader>
        <S.TableNumber isEmpty={menuItems.length === 0}>
          {tableNumber}
        </S.TableNumber>
        <S.OrderTime>{orderTime}</S.OrderTime>
      </S.CardHeader>

      <S.CardContent>
        {menuItems.map((item, idx) => (
          <S.MenuItem key={`item-${tableNumber}-${id}-${idx}`}>
            <S.MenuItemName>{item.name}</S.MenuItemName>
            <S.MenuItemQuantity>{item.quantity}</S.MenuItemQuantity>
          </S.MenuItem>
        ))}
      </S.CardContent>

      <S.CardFooter>
        {batteryIcon}

        {menuItems.length === 0 ? (
          <S.StatusText>빈 테이블</S.StatusText>
        ) : (
          <S.TotalAmount>{formatCurrency(totalAmount ?? 0)}</S.TotalAmount>
        )}
      </S.CardFooter>
    </S.CardContainer>
  );
};
