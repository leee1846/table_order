import { t } from '@/config/i18n';
import { BasicButton } from '@repo/ui/components';
import { formatCurrency, formatPaymentMethodLabel } from '@repo/util/string';
import { formatDateTime } from '@repo/util/date';
import type { IOrderHistoryItem } from '@repo/api/types';
import * as S from './orderSection.style';

interface Props {
  order: IOrderHistoryItem;
}

export const OrderSection = ({ order }: Props) => {
  const orderLog = order.orderLog;
  const menus =
    orderLog?.orderInfoList?.flatMap((info) => info.orderDetailMenuList) ?? [];

  const totalQuantity = menus.reduce(
    (sum, menu) => sum + (menu.menuQuantity ?? 0),
    0
  );
  const totalAmount = menus.reduce((sum, menu) => {
    const unitPrice = menu.finalPrice ?? menu.menuPrice ?? 0;
    return sum + unitPrice * (menu.menuQuantity ?? 0);
  }, 0);

  const paymentLabel = formatPaymentMethodLabel(
    order.paymentMethod || order.paymentList?.[0]?.paymentType
  );

  return (
    <div>
      <S.TitleContainer>
        <p>
          {t('테이블 번호:')}
          {order.tableNumber ?? orderLog?.tableNumber ?? '-'}
        </p>
        <div>
          <BasicButton variant="Outline_Navy_M" onClick={() => {}}>
            {t('재결제')}
          </BasicButton>
          <BasicButton variant="Outline_Navy_M" onClick={() => {}}>
            {t('재판매')}
          </BasicButton>
        </div>
      </S.TitleContainer>

      <S.OrderInfoContainer>
        <div>
          <p>
            {t('멤버십')}
            <span>-</span>
          </p>
          <p>
            {t('결제 수단')}
            <span>{paymentLabel ?? '-'}</span>
          </p>
          <p />
        </div>
        <div>
          <p>
            {t('주문번호')}
            <span>{order.orderNumber ?? '-'}</span>
          </p>
          <p>
            {t('주문 일시')}

            <span>
              {formatDateTime(
                order.orderClearedDate ?? orderLog?.createDate ?? ''
              ) || '-'}
            </span>
          </p>
          <p>
            {t('객수')}
            <span>{order.customerCount ?? orderLog?.customerCount ?? '-'}</span>
          </p>
        </div>
      </S.OrderInfoContainer>

      <S.OrderList>
        <ul>
          {menus.length === 0 && (
            <li>
              {t(
                '주문 내역이 없습니다.'
              )}
            </li>
          )}
          {menus.map((menu) => {
            const options = menu.orderDetailOptionList ?? [];
            const menuTotal =
              (menu.finalPrice ?? menu.menuPrice ?? 0) *
              (menu.menuQuantity ?? 0);

            return (
              <li key={menu.orderDetailMenuSeq}>
                <S.MenuItem>
                  <p>{menu.menuName}</p>
                  <p>{menu.menuQuantity ?? 0}</p>
                  <p>{formatCurrency(menuTotal)}</p>
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
        <p>{formatCurrency(totalAmount)}</p>
      </S.Total>
    </div>
  );
};
