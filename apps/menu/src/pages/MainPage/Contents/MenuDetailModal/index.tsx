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
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useState } from 'react';
import { toast } from '@repo/feature/utils';
import { useCartStore } from '@/stores/useCartStore';
import { MENU_MAX_QUANTITY } from '@/constants/common';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { IdleTimerMessage } from '@/feature/IdleTimerMessage';

interface Props {
  onClose: () => void;
  menu: IMenu;
}

export const MenuDetailModal = ({ onClose, menu }: Props) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();
  const { data: languageData } = useCustomerLanguageStore();

  const [currentCount, setCurrentCount] = useState(1);

  const { addToCart } = useCartStore();

  const shopDetailData = useShopDetailStore((s) => s.data);

  const { remainingSeconds } = useIdleTimeout(onClose);

  const disabledOrderable = !shopDetailData?.shopSetting?.isMenuboardOrderable;

  const images =
    menu.menuImageList
      ?.filter((img) => img.imagePath)
      ?.sort((a, b) => a.imageIndex - b.imageIndex) || [];

  // 메뉴 수량 변경 핸들러
  const handleCountChange = (newQuantity: number) => {
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
    if (currentCount < 1) {
      toast(t('수량을 {{count}}개 이상 입력해주세요.', { count: 1 }), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    if (menu.minQuantity > currentCount) {
      toast(
        t('최소 주문 수량은 {{minQuantity}}개 입니다.', {
          minQuantity: menu.minQuantity,
        }),
        { position: 'center-center', duration: 1500 }
      );
      return;
    }

    addToCart({
      categorySeq: menu.categorySeq,
      menuSeq: menu.menuSeq,
      menuName:
        menu.localeMenuName?.[languageData.currentLanguage] ?? menu.menuName,
      menuPrice: menu.menuPrice,
      quantity: currentCount,
      selectedOptions: [],
      localeMenuName: menu.localeMenuName,
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
        <S.RightHeader>
          <IdleTimerMessage remainingSeconds={remainingSeconds} />
          <S.CloseButton
            type="button"
            onClick={onClose}
            aria-label={t('모달 닫기')}
          >
            <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
          </S.CloseButton>
        </S.RightHeader>
        {images.length > 0 ? (
          <S.SwiperContainer role="region" aria-label={t('메뉴 이미지')}>
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              loop={images.length >= 2}
              modules={[Pagination]}
              pagination={{ clickable: true }}
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
        <S.Price>₩{formatCurrency(menu.menuPrice)}</S.Price>
        <S.Description>
          {menu.localeMenuDescription?.[languageData.currentLanguage] ??
            menu.menuDescription}
        </S.Description>
        <NumberInput
          variant="square"
          value={currentCount}
          onChange={handleCountChange}
          size="L"
          min={0}
          customStyle={css`
            width: 100%;
          `}
          aria-label={t('수량제한')}
          disabled={disabledOrderable}
        />
        <S.TotalContainer role="status" aria-live="polite">
          <h3>{t('합계')}</h3>
          <p>₩{formatCurrency(menu.menuPrice * currentCount)}</p>
        </S.TotalContainer>
        <BasicButton
          variant="Solid_Blue_2XL"
          onClick={onClickAdd}
          customStyle={css`
            width: 100%;
          `}
          aria-label={t('추가하기')}
          disabled={disabledOrderable}
        >
          {t('추가하기')}
        </BasicButton>
      </S.Container>
    </ModalBackground>,
    document.body
  );
};
