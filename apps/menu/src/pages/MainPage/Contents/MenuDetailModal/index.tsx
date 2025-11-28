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

interface Props {
  onClose: () => void;
  menu: IMenu;
}
export const MenuDetailModal = ({ onClose, menu }: Props) => {
  const { t } = useTranslation();

  const images = menu.menuImageList?.filter((img) => img.imagePath) || [];

  return createPortal(
    <ModalBackground onClick={onClose}>
      <S.Container>
        {images.length > 0 ? (
          <S.SwiperContainer>
            <Swiper spaceBetween={0} slidesPerView={1} loop>
              {images.map((image) => (
                <SwiperSlide key={image.imageSeq || image.imagePath}>
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
          value={1}
          onChange={() => {}}
          size="L"
          min={1}
          customStyle={css`
            width: 100%;
          `}
        />
        <S.TotalContainer>
          <p>{t('합계')}</p>
          <p>10000????</p>
        </S.TotalContainer>
        <BasicButton
          variant="Solid_Blue_2XL"
          onClick={() => {}}
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
