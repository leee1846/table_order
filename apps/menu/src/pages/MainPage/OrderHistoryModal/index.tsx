import { BasicButton } from '@repo/ui/components';
import * as S from '@/pages/MainPage/OrderHistoryModal/orderHistoryModal.style';
import { getTodayDateString } from '@repo/util/date';
import { useTranslation } from 'react-i18next';
import type { IOrderHistory } from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';
import { NoContent } from '@/feature/NoContent';

interface Props {
  orderHistories?: IOrderHistory[] | null;
  onClose: () => void;
}
export const OrderHistoryModal = ({ orderHistories, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <S.Background onClick={onClose}>
      <S.Container>
        <S.Header>
          <p>{t('주문내역')}</p>
          <p>{getTodayDateString()}</p>
        </S.Header>

        {!orderHistories ||
          (orderHistories && orderHistories?.length < 1 && (
            <NoContent paddingTop="0">
              <p>{t('주문내역이 없습니다.')}</p>
            </NoContent>
          ))}

        <S.OrderList>
          {orderHistories?.map((orderHistory) => (
            <li key={orderHistory.orderGroupUuid}>
              <S.MenuInfo>
                <p>{orderHistory.menuName}</p>
                <p>{formatCurrency(orderHistory.menuQuantity)}</p>
                <p>{formatCurrency(orderHistory.menuPrice)}</p>
              </S.MenuInfo>

              <S.OptionList>
                {orderHistory.optionList.map((option) => (
                  <li key={option.orderDetailOptionSeq}>
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
          <div>
            <p>{t('합계')}</p>
            <p>10000????</p>
          </div>
          <BasicButton variant="Solid_Blue_2XL">{t('닫기')}</BasicButton>
        </S.TotalContainer>
      </S.Container>
    </S.Background>
  );
};
