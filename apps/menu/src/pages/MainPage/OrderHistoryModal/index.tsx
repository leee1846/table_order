import { BasicButton } from '@repo/ui/components';
import * as S from '@/pages/MainPage/OrderHistoryModal/orderHistoryModal.style';
import { getTodayDateString } from '@repo/util/date';
import type { ITableOrderHistoriesData } from '@/stores/useTableOrderHistoriesStore';
import { formatCurrency } from '@repo/util/string';
import { NoContent } from '@/feature/NoContent';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { IdleTimerMessage } from '@/feature/IdleTimerMessage';

const formatKrw = (amount: number) =>
  amount < 0
    ? `-₩${formatCurrency(Math.abs(amount))}`
    : `₩${formatCurrency(amount)}`;

interface Props {
  orderHistories?: ITableOrderHistoriesData | null;
  onClose: () => void;
}
export const OrderHistoryModal = ({ orderHistories, onClose }: Props) => {
  const { t } = useCustomerTranslation();
  const shopDetailData = useShopDetailStore((s) => s.data);
  const currentLanguage = useCustomerLanguageStore(
    (s) => s.data.currentLanguage
  );

  const { remainingSeconds } = useIdleTimeout(onClose);

  return (
    <S.Background onClick={onClose}>
      <S.Container
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-history-title"
        onClick={(e) => e.stopPropagation()}
      >
        <S.Header>
          <S.TitleWrapper>
            <h2 id="order-history-title">{t('주문내역')}</h2>
            <IdleTimerMessage remainingSeconds={remainingSeconds} />
          </S.TitleWrapper>
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
                <p>
                  {orderHistory.localeMenuName?.[currentLanguage] ??
                    orderHistory.menuName}
                </p>
                <p>{formatCurrency(orderHistory.menuQuantity)}</p>
                <p>
                  {formatKrw(
                    orderHistory.menuPrice * orderHistory.menuQuantity
                  )}
                </p>
              </S.MenuInfo>

              <S.OptionList role="list">
                {orderHistory.optionList.map((option) => (
                  <li key={option.orderDetailOptionSeq} role="listitem">
                    <div>
                      <span />
                      <p>
                        {option.localeOptionName?.[currentLanguage] ??
                          option.optionName}
                      </p>
                    </div>

                    <div>
                      <p>{formatCurrency(option.optionQuantity)}</p>
                      <p>
                        {formatKrw(option.optionPrice * option.optionQuantity)}
                      </p>
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
              <p>{formatKrw(orderHistories?.totalAmount ?? 0)}</p>
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
