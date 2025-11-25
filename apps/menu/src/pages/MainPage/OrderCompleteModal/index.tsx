import { BasicButton, ModalBackground } from '@repo/ui/components';
import { apronIcon } from '@repo/ui/icons';
import { useTranslation } from 'react-i18next';
import * as S from '@/pages/MainPage/OrderCompleteModal/OrderCompleteModal.style';

interface Props {
  onClose: () => void;
}

export const OrderCompleteModal = ({ onClose }: Props) => {
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
          <S.Date>2025??11?11</S.Date>
          <S.OrderList>
            <li>
              <S.MenuInfo>
                <p>메뉴명명명</p>
                <p>10000????</p>
                <p>10000????</p>
              </S.MenuInfo>

              <S.OptionList>
                <li>
                  <div>
                    <span />
                    <p>옵션명명명</p>
                  </div>

                  <div>
                    <p>10000????</p>
                    <p>10000????</p>
                  </div>
                </li>
                <li>
                  <div>
                    <span />
                    <p>옵션명명명</p>
                  </div>

                  <div>
                    <p>10000????</p>
                    <p>10000????</p>
                  </div>
                </li>
                <li>
                  <div>
                    <span />
                    <p>옵션명명명</p>
                  </div>

                  <div>
                    <p>10000????</p>
                    <p>10000????</p>
                  </div>
                </li>
              </S.OptionList>
            </li>
          </S.OrderList>

          <S.TotalContainer>
            <div>
              <p>{t('합계')}</p>
              <p>10000????</p>
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
