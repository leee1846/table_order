import { BasicButton } from '@repo/ui/components';
import * as S from '@/pages/MainPage/OrderHistoryModal/orderHistoryModal.style';
import { getTodayDateString } from '@repo/util/date';
import type { ITableOrderHistoriesData } from '@/stores/useTableOrderHistoriesStore';
import { formatCurrency } from '@repo/util/string';
import { NoContent } from '@/feature/NoContent';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { CURRENCY_SYMBOL } from '@/constants/common';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';

interface Props {
  orderHistories?: ITableOrderHistoriesData | null;
  onClose: () => void;
}
export const OrderHistoryModal = ({ orderHistories, onClose }: Props) => {
  const { t } = useCustomerTranslation();

  const { data: shopDetailData } = useShopDetailData();
  const currencySymbol =
    CURRENCY_SYMBOL[shopDetailData?.shopSetting?.currencySetting ?? 'KRW'];

  return (
    <S.Background onClick={onClose}>
      <S.Container
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-history-title"
        onClick={(e) => e.stopPropagation()}
      >
        <S.Header>
          <h2 id="order-history-title">{t('주문내역')}</h2>
          <p>{getTodayDateString()}</p>
        </S.Header>

        {(!orderHistories ||
          orderHistories?.orderDetailMenuList?.length < 1) && (
          <NoContent paddingTop="0">
            <p>{t('주문내역이 없습니다.')}</p>
          </NoContent>
        )}

        <S.OrderList role="list" aria-label={t('주문내역')}>
          {orderHistories?.orderDetailMenuList?.map((orderHistory) => (
            <li key={orderHistory.orderGroupUuid} role="listitem">
              <S.MenuInfo>
                <p>{orderHistory.menuName}</p>
                <p>{formatCurrency(orderHistory.menuQuantity)}</p>
                <p>{formatCurrency(orderHistory.menuPrice)}</p>
              </S.MenuInfo>

              <S.OptionList role="list">
                {orderHistory.optionList.map((option) => (
                  <li key={option.orderDetailOptionSeq} role="listitem">
                    <div>
                      <span />
                      <p>{option.optionName}</p>
                    </div>

                    <div>
                      <p>{formatCurrency(option.optionQuantity)}</p>
                      <p>{formatCurrency(option.optionPrice)}</p>
                    </div>
                  </li>
                ))}
              </S.OptionList>
            </li>
          ))}
        </S.OrderList>

        <S.TotalContainer>
          {shopDetailData?.shopSetting?.isOrderSheetTotalVisible && (
            <div>
              <h3>{t('합계')}</h3>
              <p>
                {currencySymbol}
                {formatCurrency(orderHistories?.totalAmount ?? 0)}
              </p>
            </div>
          )}
          <BasicButton
            variant="Solid_Blue_2XL"
            aria-label={t('모달 닫기')}
            onClick={onClose}
          >
            {t('닫기')}
          </BasicButton>
        </S.TotalContainer>
      </S.Container>
    </S.Background>
  );
};
