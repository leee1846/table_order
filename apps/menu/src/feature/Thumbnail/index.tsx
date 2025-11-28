import {
  bestOnIcon,
  chiliOffIcon,
  chiliOnIcon,
  newOnIcon,
} from '@repo/ui/icons';
import * as S from '@/feature/Thumbnail/thumbnail.style';
import type { IMenu, IMenuImage } from '@repo/api/types';
import { useState } from 'react';

interface Props {
  menu: IMenu;
  image?: IMenuImage;
  width?: string;
}
export const Thumbnail = ({ menu, image, width = '100%' }: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(imageLoaded && !imageError && image?.imagePath);

  return (
    <S.ImageWrapper hasImage={hasImage} width={width}>
      {menu.isOutOfStock && (
        <S.OutOfStock>
          <p>Sold Out</p>
        </S.OutOfStock>
      )}
      {!imageError && image && image.imagePath && (
        <img
          src={image.imagePath}
          alt={image.imageName}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(false);
          }}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
      )}
      <S.IconWrapper>
        {(menu.isBest || menu.isNew) && (
          <S.LeftBadges>
            {menu.isBest && <img src={bestOnIcon} width={64} height={43} />}
            {menu.isNew && <img src={newOnIcon} width={64} height={43} />}
          </S.LeftBadges>
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
  );
};
