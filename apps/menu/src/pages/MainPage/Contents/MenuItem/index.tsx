import { useState } from 'react';
import * as S from '@/pages/MainPage/Contents/MenuItem/menuItem.style';
import { bestOnIcon, chiliOffIcon, chiliOnIcon } from '@repo/ui/icons';
import { MenuDetailModal } from '@/pages/MainPage/Contents/MenuDetailModal';
import { MenuDetailWithOptionsModal } from '@/pages/MainPage/Contents/MenuDetailWithOptionsModal';
import type { IMenu } from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';

const hasOptions = true;

interface Props {
  layout: 1 | 2 | 3;
  menu: IMenu;
}
export const MenuItem = ({ layout, menu }: Props) => {
  const [isMenuDetailOpen, setIsMenuDetailOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const firstImage = menu.menuImageList?.[0];

  const hasImage = Boolean(
    imageLoaded && !imageError && (firstImage?.imagePath || false)
  );

  return (
    <>
      <S.Container
        layout={layout}
        type="button"
        onClick={() => setIsMenuDetailOpen(true)}
      >
        <S.ImageWrapper layout={layout} hasImage={hasImage}>
          {!imageError && firstImage && firstImage.imagePath && (
            <img
              src={firstImage.imagePath}
              alt={firstImage.imageName}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
          )}
          <S.IconWrapper>
            {menu.isBest && (
              <S.BestIcon src={bestOnIcon} width={64} height={43} />
            )}
            {menu.spiceLevel > 0 && (
              <S.ChiliIcons>
                <img
                  src={menu.spiceLevel > 0 ? chiliOnIcon : chiliOffIcon}
                  width={36}
                  height={36}
                />
                <img
                  src={menu.spiceLevel > 1 ? chiliOnIcon : chiliOffIcon}
                  width={36}
                  height={36}
                />
                <img
                  src={menu.spiceLevel > 2 ? chiliOnIcon : chiliOffIcon}
                  width={36}
                  height={36}
                />
              </S.ChiliIcons>
            )}
          </S.IconWrapper>
        </S.ImageWrapper>
        <S.Content>
          <S.MenuName>{menu.menuName}</S.MenuName>
          <S.MenuPrice>
            {/* TODO 통화설정 추후 적용 */}
            <span>{formatCurrency(menu.menuPrice)}</span>
          </S.MenuPrice>
          {layout === 1 && (
            <S.Description>{menu.menuDescription}</S.Description>
          )}
        </S.Content>
      </S.Container>

      {isMenuDetailOpen && !hasOptions && (
        <MenuDetailModal onClose={() => setIsMenuDetailOpen(false)} />
      )}

      {isMenuDetailOpen && hasOptions && (
        <MenuDetailWithOptionsModal
          onClose={() => setIsMenuDetailOpen(false)}
        />
      )}
    </>
  );
};
