import { createPortal } from 'react-dom';
import { useState } from 'react';
import { BasicButton, ModalBackground, NumberInput } from '@repo/ui/components';
import { bestOnIcon, chiliOffIcon, chiliOnIcon } from '@repo/ui/icons';
import { useTranslation } from 'react-i18next';
import * as S from '@/pages/MainPage/Contents/MenuDetailModal/menuDetailModal.style';
import { css } from '@emotion/react';

interface Props {
  onClose: () => void;
}
export const MenuDetailModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = 'https://picsum.photos/400/300';
  const hasImage = Boolean(imageLoaded && !imageError && imageUrl);

  return createPortal(
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.ImageWrapper hasImage={hasImage}>
          {!imageError && imageUrl && (
            <S.Image
              src={imageUrl}
              alt="메뉴 이미지"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
            />
          )}
          <S.BestIcon src={bestOnIcon} alt="" />
          <S.ChiliIcons>
            <img src={chiliOnIcon} width={36} height={36} alt="" />
            <img src={chiliOffIcon} width={36} height={36} alt="" />
            <img src={chiliOnIcon} width={36} height={36} alt="" />
          </S.ChiliIcons>
        </S.ImageWrapper>
        <S.Name>메뉴 이름???</S.Name>
        <S.Price>10000????</S.Price>
        <S.Description>메뉴 설명??????????????</S.Description>
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
