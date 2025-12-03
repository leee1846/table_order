import { BasicButton, ModalBackground } from '@repo/ui/components';
import { apronIcon } from '@repo/ui/icons';
import { useTranslation } from 'react-i18next';
import { getTodayDateString } from '@repo/util/date';
import * as S from '@/pages/MainPage/OrderCompleteModal/OrderCompleteModal.style';
import type { IOrder } from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';

interface Props {
  orderData: IOrder[];
  totalPrice: number;
  onClose: () => void;
}

export const OrderCompleteModal = ({
  orderData,
  totalPrice,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  return (
    <ModalBackground position="center" onClick={onClose}>
      <S.Container>
        <S.LeftContainer>
          <img src={apronIcon} alt="order complete" />
          <p>{t('주문 완료!')}</p>
          <p>{t('조리가 완료되면 저희가 알려드릴게요.')}</p>
          <p>{t('조금만 기다려주세요.')}</p>
        </S.LeftContainer>

        <S.RightContainer>
          <S.Title>{t('주문내역')}</S.Title>
          <S.Date>{getTodayDateString()}</S.Date>
          <S.OrderList>
            {orderData.map((order) => (
              <li key={order.menuSeq}>
                <S.MenuInfo>
                  <p>{order.menuName}</p>
                  <p>{formatCurrency(order.quantity)}</p>
                  <p>{formatCurrency(order.menuPrice)}</p>
                </S.MenuInfo>

                <S.OptionList>
                  {order.selectedOptions.map((option) => (
                    <li key={option.optionSeq}>
                      <div>
                        <span />
                        <p>{option.optionName}</p>
                      </div>

                      <div>
                        <p>{formatCurrency(option.quantity)}</p>
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
              <p>{formatCurrency(totalPrice)}</p>
            </div>
            <BasicButton variant="Solid_Blue_2XL" onClick={onClose}>
              {t('메뉴판 보러가기')}
            </BasicButton>
          </S.TotalContainer>
        </S.RightContainer>
      </S.Container>
    </ModalBackground>
  );
};
