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
import { TableWithStatus } from '../TablesPageContainer';

const { colors } = theme;

interface Props {
  id: number;
  table: TableWithStatus;
  orderTime: string | null;
  onClick?: () => void;
  useTranslation: typeof useTranslation;
}

export const TableCard = ({
  onClick,
  id,
  orderTime,
  useTranslation,
  table,
}: Props) => {
  const { t } = useTranslation();

  const batteryIcon =
    table.batteryLevel > 51 ? (
      <FullBatteryIcon color={colors.grey[800]} />
    ) : table.batteryLevel <= 50 && table.batteryLevel > 20 ? (
      <HalfBatteryIcon color={colors.grey[800]} />
    ) : table.batteryLevel <= 20 && table.batteryLevel > 0 ? (
      <LowBatteryIcon color={colors.semantic[400]} />
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
        {/* TODO : 메뉴가 켜진 테블릿의 경우만 보이게 추후 수정 */}
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
