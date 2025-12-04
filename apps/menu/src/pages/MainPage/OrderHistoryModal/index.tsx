import { BasicButton } from '@repo/ui/components';
import * as S from '@/pages/MainPage/OrderHistoryModal/orderHistoryModal.style';
import { getTodayDateString } from '@repo/util/date';
import { useTranslation } from 'react-i18next';

const orderList = Array.from({ length: 4 });
const optionList = Array.from({ length: 4 });

export const OrderHistoryModal = () => {
  const { t } = useTranslation();

  return (
    <S.Background>
      <S.Container>
        <S.Header>
          <p>????테이블 주문내역</p>
          <p>{getTodayDateString()}</p>
        </S.Header>

        <S.OrderList>
          {orderList.map((_, index) => (
            <li key={`order-${index + 1}`}>
              <S.MenuInfo>
                <p>메뉴명명명??</p>
                <p>10000????</p>
                <p>10000????</p>
              </S.MenuInfo>

              <S.OptionList>
                {optionList.map((_, index) => (
                  <li key={`option-${index + 1}`}>
                    <div>
                      <span />
                      <p>옵션명명명??</p>
                    </div>

                    <div>
                      <p>10000????</p>
                      <p>10000????</p>
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
