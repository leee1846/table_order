import { createPortal } from 'react-dom';
import { BasicButton, ModalBackground, NumberInput } from '@repo/ui/components';
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
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { CURRENCY_SYMBOL } from '@/constants/common';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';

interface Props {
  onClose: () => void;
  menu: IMenu;
}
export const MenuDetailModal = ({ onClose, menu }: Props) => {
  const { t } = useCustomerTranslation();
  const { data: currentLanguage } = useLanguageStore();

  const [currentCount, setCurrentCount] = useState(1);

  const { addToCart, data: cartData } = useCartStore();

  const { data: shopDetailData } = useShopDetailData();
  const currencySymbol =
    CURRENCY_SYMBOL[shopDetailData?.shopSetting?.currencySetting ?? 'KRW'];

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

    const prevCartData = cartData.menus.find(
      (item) => item.menuSeq === menu.menuSeq
    );

    addToCart({
      categorySeq: menu.categorySeq,
      menuSeq: menu.menuSeq,
      menuName: menu.localeMenuName?.[currentLanguage ?? 'ko'] ?? menu.menuName,
      menuPrice: menu.menuPrice,
      quantity: prevCartData?.quantity ?? 0 + currentCount,
      selectedOptions: [],
    });

    toast(t('메뉴가 담겼습니다.'), {
      position: 'center-center',
      duration: 1000,
    });

    onClose();
  };

  return createPortal(
    <ModalBackground onClick={onClose}>
      <S.Container>
        {images.length > 0 ? (
          <S.SwiperContainer>
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              loop={images.length >= 2}
            >
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
        <S.Name>
          {menu.localeMenuName?.[currentLanguage ?? 'ko'] ?? menu.menuName}
        </S.Name>
        <S.Price>
          {currencySymbol}
          {formatCurrency(menu.menuPrice)}
        </S.Price>
        <S.Description>
          {menu.localeMenuDescription?.[currentLanguage ?? 'ko'] ??
            menu.menuDescription}
        </S.Description>
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
          <p>
            {currencySymbol}
            {formatCurrency(menu.menuPrice * currentCount)}
          </p>
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
