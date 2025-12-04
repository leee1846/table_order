import { BasicButton } from '@repo/ui/components';
import * as S from '@/pages/MainPage/OrderHistoryModal/orderHistoryModal.style';
import { getTodayDateString } from '@repo/util/date';
import { useTranslation } from 'react-i18next';
import type { ITableOrderHistoriesData } from '@/stores/useTableOrderHistoriesStore';
import { formatCurrency } from '@repo/util/string';
import { NoContent } from '@/feature/NoContent';
import { calculateMenuTotalPrice } from '@/utils/calculation';

interface Props {
  orderHistories?: ITableOrderHistoriesData | null;
  onClose: () => void;
}
export const OrderHistoryModal = ({ orderHistories, onClose }: Props) => {
  const { t } = useTranslation();
  const histories = orderHistories?.orderDetailMenuList;

  const calculateTotalPrice = () => {
    if (!histories) {
      return 0;
    }

    const totalPrice =
      histories.reduce((total, orderHistory) => {
        return (
          total +
          calculateMenuTotalPrice(
            orderHistory.menuPrice,
            orderHistory.menuQuantity,
            orderHistory.optionList.map((option) => ({
              optionPrice: option.optionPrice,
              quantity: option.optionQuantity,
            }))
          )
        );
      }, 0) ?? 0;

    // 2) 할인율 정규화 (소수점 없애고 정수만 사용)
    let rawRate = orderHistories?.discountRate ?? 0;

    // 0.x 형태면 %로 환산
    if (rawRate < 1) {
      rawRate = rawRate * 100;
    }

    // 소수점 제거 (버림)
    const discountRate = Math.floor(rawRate);

    // 3) 할인 적용
    const discountedTotal = Math.floor(totalPrice * (1 - discountRate / 100));

    return discountedTotal;
  };

  return (
    <S.Background onClick={onClose}>
      <S.Container>
        <S.Header>
          <p>{t('주문내역')}</p>
          <p>{getTodayDateString()}</p>
        </S.Header>

        {!orderHistories ||
          (histories && histories?.length < 1 && (
            <NoContent paddingTop="0">
              <p>{t('주문내역이 없습니다.')}</p>
            </NoContent>
          ))}

        <S.OrderList>
          {histories?.map((orderHistory) => (
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
            <p>{formatCurrency(calculateTotalPrice())}</p>
          </div>
          <BasicButton variant="Solid_Blue_2XL">{t('닫기')}</BasicButton>
        </S.TotalContainer>
      </S.Container>
    </S.Background>
  );
};
