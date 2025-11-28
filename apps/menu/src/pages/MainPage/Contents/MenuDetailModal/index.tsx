import { createPortal } from 'react-dom';
import { BasicButton, ModalBackground, NumberInput } from '@repo/ui/components';
import { useTranslation } from 'react-i18next';
import * as S from '@/pages/MainPage/Contents/MenuDetailModal/menuDetailModal.style';
import { css } from '@emotion/react';
import type { IMenu } from '@repo/api/types';
import { Thumbnail } from '@/feature/Thumbnail';
import { formatCurrency } from '@repo/util/string';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useState } from 'react';
import { toast } from '@repo/feature/utils';
import { useCartStore } from '@/stores/useCartStore';

interface Props {
  onClose: () => void;
  menu: IMenu;
}
export const MenuDetailModal = ({ onClose, menu }: Props) => {
  const { t } = useTranslation();

  const [currentCount, setCurrentCount] = useState(1);

  const { addToCart } = useCartStore();

  const images = menu.menuImageList?.filter((img) => img.imagePath) || [];

  const onClickAdd = () => {
    if (menu.minQuantity > currentCount) {
      toast(
        t('최소 주문 수량은 {{minQuantity}}개 입니다.', {
          minQuantity: menu.minQuantity,
        })
      );
      return;
    }

    Array.from({ length: currentCount }).forEach(() => {
      addToCart(menu);
    });
    toast(t('메뉴가 담겼습니다.'), {
      position: 'top-center',
      duration: 1000,
    });
    onClose();
  };

  return createPortal(
    <ModalBackground onClick={onClose}>
      <S.Container>
        {images.length > 0 ? (
          <S.SwiperContainer>
            <Swiper spaceBetween={0} slidesPerView={1} loop>
              {images.map((image) => (
                <SwiperSlide key={image.imageSeq}>
                  <Thumbnail menu={menu} image={image} width="100%" />
                </SwiperSlide>
              ))}
            </Swiper>
          </S.SwiperContainer>
        ) : (
          <Thumbnail menu={menu} image={undefined} width="100%" />
        )}
        <S.Name>{menu.menuName}</S.Name>
        {/* TODO 화폐단위 추후 적용 */}
        <S.Price>₩{formatCurrency(menu.menuPrice)}</S.Price>
        <S.Description>{menu.menuDescription}</S.Description>
        <NumberInput
          variant="square"
          value={currentCount}
          onChange={setCurrentCount}
          size="L"
          min={1}
          customStyle={css`
            width: 100%;
          `}
        />
        <S.TotalContainer>
          <p>{t('합계')}</p>
          <p>{formatCurrency(menu.menuPrice * currentCount)}</p>
        </S.TotalContainer>
        <BasicButton
          variant="Solid_Blue_2XL"
          onClick={onClickAdd}
          customStyle={css`
            width: 100%;
          `}
        >
          {t('추가하기')}
        </BasicButton>
      </S.Container>
    </ModalBackground>,
    document.body
  );
};
