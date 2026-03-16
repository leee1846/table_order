import { formatCurrency, formatPaymentMethodLabel } from '@repo/util/string';
import { formatDateTime } from '@repo/util/date';
import { useAdminTranslation } from '@/config/i18n';
import type { IOrderHistoryItem } from '@repo/api/types';
import * as S from './orderSection.style';

interface Props {
  order: IOrderHistoryItem;
}

export const OrderSection = ({ order }: Props) => {
  const { t } = useAdminTranslation();
  const orderLog = order.orderLog;
  const menus =
    orderLog?.orderInfoList?.flatMap((info) => info.orderDetailMenuList) ?? [];

  const totalQuantity = menus.reduce(
    (sum, menu) => sum + (menu.menuQuantity ?? 0),
    0
  );

  const paymentLabel = t(formatPaymentMethodLabel(order.paymentMethod));

  return (
    <S.Container>
      <S.OrderInfoContainer>
        <div>
          <p>{t('멤버십')}</p>
          <span>{t('비회원')}</span>
        </div>

        <div>
          <p>{t('주문번호')}</p>
          <span>{order.orderNumber ?? '-'}</span>
        </div>

        <div>
          <p>{t('결제 수단')}</p>
          <span>{paymentLabel ?? '-'}</span>
        </div>

        <div>
          <p>{t('주문 일시')}</p>
          <span>
            {formatDateTime(
              order.orderClearedDate ?? orderLog?.createDate ?? ''
            ) || '-'}
          </span>
        </div>

        <div>
          <p>{t('객수')}</p>
          <span>{order.customerCount > 0 ? order.customerCount : '-'}</span>
        </div>
      </S.OrderInfoContainer>

      <S.OrderList>
        <ul>
          {menus.length === 0 && <li>{t('주문 내역이 없습니다.')}</li>}
          {menus.map((menu) => {
            const options = menu.orderDetailOptionList ?? [];

            return (
              <li key={menu.orderDetailMenuSeq}>
                <S.MenuItem>
                  <p>{menu.menuName}</p>
                  <p>{menu.menuQuantity ?? 0}</p>
                  <p>{formatCurrency(menu.finalPrice)}</p>
                </S.MenuItem>
                {options.length > 0 && (
                  <ul>
                    {options.map((option) => (
                      <S.OptionItem key={option.orderDetailOptionSeq}>
                        <p>
                          <span /> {option.optionName}
                        </p>
                        <p>{option.optionQuantity ?? 0}</p>
                        <p>{formatCurrency(option.optionPrice ?? 0)}</p>
                      </S.OptionItem>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </S.OrderList>

      <S.Total>
        <p>{t('합계 금액')}</p>
        <p>{totalQuantity}</p>
        <p>{formatCurrency(order.paidAmount)}</p>
      </S.Total>
    </S.Container>
  );
};
