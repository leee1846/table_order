import { useState } from 'react';
import * as S from '@/pages/MainPage/Contents/MenuItem/menuItem.style';
import { bestOnIcon, chiliOffIcon, chiliOnIcon } from '@repo/ui/icons';
import { MenuDetailModal } from '@/pages/MainPage/Contents/MenuDetailModal';

const hasOptions = true;

interface Props {
  layout: 1 | 2 | 3;
  imageUrl?: string;
}
export const MenuItem = ({
  layout,
  imageUrl = 'https://picsum.photos/400/300',
}: Props) => {
  const [isMenuDetailOpen, setIsMenuDetailOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(imageLoaded && !imageError && imageUrl);

  return (
    <>
      <S.Container
        layout={layout}
        type="button"
        onClick={() => setIsMenuDetailOpen(true)}
      >
        <S.ImageWrapper layout={layout} hasImage={hasImage}>
          {!imageError && imageUrl && (
            <img
              src={imageUrl}
              alt="메뉴 이미지"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
          )}
          <S.IconWrapper>
            <S.BestIcon src={bestOnIcon} width={64} height={43} />
            <S.ChiliIcons>
              <img src={chiliOnIcon} width={36} height={36} />
              <img src={chiliOffIcon} width={36} height={36} />
              <img src={chiliOnIcon} width={36} height={36} />
            </S.ChiliIcons>
          </S.IconWrapper>
        </S.ImageWrapper>
        <S.Content>
          <S.MenuName>메뉴 이름asdasdsadsadsaddsasd</S.MenuName>
          <S.MenuPrice>
            ₩<span>10000000000000000000000000000000000000</span>
          </S.MenuPrice>
          {layout === 1 && (
            <S.Description>
              메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴
              설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴
              설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴
              설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴
              설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴
              설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴 설명메뉴
              설명메뉴 설명메뉴 설명
            </S.Description>
          )}
        </S.Content>
      </S.Container>

      {isMenuDetailOpen && !hasOptions && (
        <MenuDetailModal onClose={() => setIsMenuDetailOpen(false)} />
      )}
    </>
  );
};
