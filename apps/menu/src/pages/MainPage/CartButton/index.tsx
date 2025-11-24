import { useTranslation } from 'react-i18next';
import * as S from '@/pages/MainPage/CartButton/cartButton.style';

export const CartButton = () => {
  const { t } = useTranslation();
  return (
    <S.Container type="button">
      <p>{t('장바구니')}</p>
      <p>99</p>
    </S.Container>
  );
};
