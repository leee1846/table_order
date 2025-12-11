'use client';

import {
  FullBatteryIcon,
  HalfBatteryIcon,
  LowBatteryIcon,
} from '@repo/ui/icons';
import * as S from './tableCard.styles';
import { theme } from '@repo/ui';
import { formatCurrency } from '@repo/util/string';
import { useTranslation } from 'react-i18next';

const { colors } = theme;

interface Props {
  id: number;
  tableNumber: number;
  orderTime: string | null;
  menuItems: Array<{ name: string; quantity: number }> | null;
  batteryLevel: number;
  totalAmount: number | null;
  onClick?: () => void;
  useTranslation: typeof useTranslation;
}

export const TableCard = ({
  tableNumber,
  onClick,
  id,
  orderTime,
  menuItems = [],
  batteryLevel,
  totalAmount,
  useTranslation,
}: Props) => {
  const { t } = useTranslation();

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
        <S.TableNumber isEmpty={menuItems?.length === 0}>
          {tableNumber}
        </S.TableNumber>
        <S.OrderTime>{orderTime}</S.OrderTime>
      </S.CardHeader>

      <S.CardContent>
        {menuItems?.slice(0, 3).map((item, idx) => (
          <S.MenuItem key={`item-${tableNumber}-${id}-${idx + 1}`}>
            <S.MenuItemName>{item.name}</S.MenuItemName>
            <S.MenuItemQuantity>{item.quantity}</S.MenuItemQuantity>
          </S.MenuItem>
        ))}
      </S.CardContent>

      <S.CardFooter>
        {batteryIcon}

        {menuItems?.length === 0 ? (
          <S.StatusText>{t('빈 테이블')}</S.StatusText>
        ) : (
          <S.TotalAmount>{formatCurrency(totalAmount ?? 0)}</S.TotalAmount>
        )}
      </S.CardFooter>
    </S.CardContainer>
  );
};
