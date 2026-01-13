import { t } from '@/config/i18n';
import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from './table.style';
import { formatCurrency, formatPaymentMethodLabel } from '@repo/util/string';
import { formatDateTime } from '@repo/util/date';
import type { IOrderHistoryItem } from '@repo/api/types';

interface Props {
  orders: IOrderHistoryItem[];
  isLoading?: boolean;
  onSelectOrder: (order: IOrderHistoryItem) => void;
}

export const Table = ({ orders, isLoading, onSelectOrder }: Props) => {
  const getTextColor = (isCancel: boolean, isPayment?: boolean) => {
    if (isPayment) {
      return isCancel ? theme.colors.semantic[400] : theme.colors.primary[500];
    }

    return isCancel ? theme.colors.semantic[400] : theme.colors.grey[700];
  };

  const renderPaymentMethod = (item: IOrderHistoryItem) => {
    return formatPaymentMethodLabel(
      item.paymentMethod || item.paymentList?.[0]?.paymentType
    );
  };

  const isCanceledOrder = (item: IOrderHistoryItem) => {
    const isCanceledByStatus =
      item.paymentMethod === 'CANCELED_ALL' ||
      item.orderLog?.status?.orderGroupStatus === 'CANCELED_ALL';
    const isCanceledByPayment =
      item.paymentList && item.paymentList.length > 0
        ? item.paymentList.every((payment) => payment.isCanceled)
        : false;

    return isCanceledByStatus || isCanceledByPayment;
  };

  const renderRows = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={7}>{t('주문 내역을 불러오는 중입니다.')}</td>
        </tr>
      );
    }

    if (!orders || orders.length === 0) {
      return (
        <tr>
          <td colSpan={7}>{t('주문 내역이 없습니다.')}</td>
        </tr>
      );
    }

    return orders.map((item) => {
      const isCanceled = isCanceledOrder(item);
      const clearedAt = formatDateTime(item.orderClearedDate);
      const paymentLabel = renderPaymentMethod(item);

      return (
        <tr key={item.orderNumber}>
          <S.ColorTd color={getTextColor(isCanceled)}>
            {item.orderNumber ?? '-'}
          </S.ColorTd>
          <S.ColorTd color={getTextColor(isCanceled)}>
            {clearedAt || '-'}
          </S.ColorTd>
          <S.ColorTd color={getTextColor(isCanceled)}>
            {item.tableNumber ?? '-'}
          </S.ColorTd>
          <S.ColorTd color={getTextColor(isCanceled)}>
            {formatCurrency(item.paidAmount ?? 0)}
          </S.ColorTd>
          <S.ColorTd color={getTextColor(isCanceled, true)}>
            {paymentLabel}
          </S.ColorTd>
          <td>{item.customerCount ?? item.orderLog?.customerCount ?? '-'}</td>
          <td>
            <BasicButton
              variant="Outline_Navy_S"
              onClick={() => onSelectOrder(item)}
            >
              {t('보기')}
            </BasicButton>
          </td>
        </tr>
      );
    });
  };

  return (
    <UIStyles.setting.Table>
      <UIStyles.setting.Thead>
        <tr>
          <th>{t('주문번호')}</th>
          <th>{t('거래일자')}</th>
          <th>{t('테이블 번호')}</th>
          <th>{t('거래금액')}</th>
          <th>{t('결제수단')}</th>
          <th>{t('객수')}</th>
          <th>{t('상세 내역')}</th>
        </tr>
      </UIStyles.setting.Thead>
      <S.Tbody>{renderRows()}</S.Tbody>
    </UIStyles.setting.Table>
  );
};
