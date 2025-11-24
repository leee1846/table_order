import { useTranslation } from 'react-i18next';
import * as S from '@/pages/MainPage/CartButton/cartButton.style';
import { useState } from 'react';
import { CartList } from '@/pages/MainPage/CartList';

export const CartButton = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <S.Container type="button" onClick={() => setIsOpen(true)}>
        <p>{t('장바구니')}</p>
        <p>99</p>
      </S.Container>

      {isOpen && <CartList onClose={() => setIsOpen(false)} />}
    </>
  );
};
