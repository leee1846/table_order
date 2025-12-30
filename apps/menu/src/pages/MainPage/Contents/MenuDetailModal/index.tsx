import { createPortal } from 'react-dom';
import { BasicButton, ModalBackground, NumberInput } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
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
import { CURRENCY_SYMBOL, MENU_MAX_QUANTITY } from '@/constants/common';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';

interface Props {
  onClose: () => void;
  menu: IMenu;
}

export const MenuDetailModal = ({ onClose, menu }: Props) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();
  const { data: languageData } = useCustomerLanguageStore();

  const [currentCount, setCurrentCount] = useState(1);

  const { addToCart, data: cartData } = useCartStore();

  const { data: shopDetailData } = useShopDetailData();
  const currencySymbol =
    CURRENCY_SYMBOL[shopDetailData?.shopSetting?.currencySetting ?? 'KRW'];

  const images = menu.menuImageList?.filter((img) => img.imagePath) || [];

  // 메뉴 수량 변경 핸들러
  const handleCountChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }

    if (newQuantity > MENU_MAX_QUANTITY) {
      toast(
        t('최대 {{maxQuantity}}개까지 선택 가능합니다.', {
          maxQuantity: MENU_MAX_QUANTITY,
        }),
        { position: 'center-center', duration: 1500 }
      );
      return;
    }

    setCurrentCount(newQuantity);
  };

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
      menuName:
        menu.localeMenuName?.[languageData.currentLanguage] ?? menu.menuName,
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

  const menuName =
    menu.localeMenuName?.[languageData.currentLanguage] ?? menu.menuName;

  return createPortal(
    <ModalBackground onClick={onClose}>
      <S.Container
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-detail-title"
      >
        <S.CloseButton
          type="button"
          onClick={onClose}
          aria-label={t('모달 닫기')}
        >
          <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
        </S.CloseButton>

        {images.length > 0 ? (
          <S.SwiperContainer role="region" aria-label={t('메뉴 이미지')}>
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
        <S.Name id="menu-detail-title">{menuName}</S.Name>
        <S.Price>
          {currencySymbol}
          {formatCurrency(menu.menuPrice)}
        </S.Price>
        <S.Description>
          {menu.localeMenuDescription?.[languageData.currentLanguage] ??
            menu.menuDescription}
        </S.Description>
        <NumberInput
          variant="square"
          value={currentCount}
          onChange={handleCountChange}
          size="L"
          min={1}
          customStyle={css`
            width: 100%;
          `}
          aria-label={t('수량제한')}
        />
        <S.TotalContainer role="status" aria-live="polite">
          <h3>{t('합계')}</h3>
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
          aria-label={t('추가하기')}
        >
          {t('추가하기')}
        </BasicButton>
      </S.Container>
    </ModalBackground>,
    document.body
  );
};
