import { BasicButton, ModalBackground } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/splitPaymentModal.style';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuSelector } from './MenuSelector';

interface Props {
  onClose: () => void;
}
export const SplitPaymentModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const [isMenuSplit, setIsMenuSplit] = useState(true);
  const orderList = Array.from({ length: 4 });
  const optionList = Array.from({ length: 4 });

  return (
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.LeftContainer>
          <p>{t('분할 결제 방식을 선택하세요')}</p>
          <S.ToggleButtonContainer>
            <S.ToggleButton
              isActive={isMenuSplit}
              onClick={() => setIsMenuSplit(true)}
            >
              {t('메뉴별로 나누기')}
            </S.ToggleButton>
            <S.ToggleButton
              isActive={!isMenuSplit}
              onClick={() => setIsMenuSplit(false)}
            >
              {t('인원 수로 나누기')}
            </S.ToggleButton>
          </S.ToggleButtonContainer>

          {isMenuSplit && <MenuSelector />}
        </S.LeftContainer>

        <S.RightContainer>
          <p>
            {t('테이블')} ??(테이블번호) {t('주문내역')}
          </p>

          <S.OrderList>
            {orderList.map((order) => (
              <li key={`order-${order}`}>
                <S.MenuInfo>
                  <p>메뉴명명명??</p>
                  <p>10000????</p>
                  <p>10000????</p>
                </S.MenuInfo>

                <S.OptionList>
                  {optionList.map((option) => (
                    <li key={`option-${option}`}>
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
            <BasicButton variant="Solid_Blue_2XL" onClick={onClose}>
              {t('{{amount}}원 카드 결제', { amount: 0 })}
            </BasicButton>
          </S.TotalContainer>
        </S.RightContainer>
      </S.Container>
    </ModalBackground>
  );
};
