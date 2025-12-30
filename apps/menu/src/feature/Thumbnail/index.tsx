import {
  bestOnIcon,
  chiliOffIcon,
  chiliOnIcon,
  newOnIcon,
} from '@repo/ui/icons';
import * as S from '@/feature/Thumbnail/thumbnail.style';
import type { IMenu, IMenuImage } from '@repo/api/types';
import { useState } from 'react';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';

interface Props {
  menu: IMenu;
  image?: IMenuImage;
  width?: string;
}
export const Thumbnail = ({ menu, image, width = '100%' }: Props) => {
  const { t } = useCustomerTranslation();

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
          src={image.imagePath ?? ''}
          alt={image.imageName || t('메뉴 이미지')}
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
            {menu.isBest && (
              <img
                src={bestOnIcon}
                width={64}
                height={43}
                alt={t('베스트 메뉴')}
              />
            )}
            {menu.isNew && (
              <img src={newOnIcon} width={64} height={43} alt={t('신메뉴')} />
            )}
          </S.LeftBadges>
        )}
        {menu.spiceLevel > 0 && (
          <S.ChiliIcons
            aria-label={t('매운맛 {{level}}단계', { level: menu.spiceLevel })}
          >
            <img
              src={menu.spiceLevel > 0 ? chiliOnIcon : chiliOffIcon}
              width={36}
              height={36}
              alt=""
              aria-hidden="true"
            />
            <img
              src={menu.spiceLevel > 1 ? chiliOnIcon : chiliOffIcon}
              width={36}
              height={36}
              alt=""
              aria-hidden="true"
            />
            <img
              src={menu.spiceLevel > 2 ? chiliOnIcon : chiliOffIcon}
              width={36}
              height={36}
              alt=""
              aria-hidden="true"
            />
          </S.ChiliIcons>
        )}
      </S.IconWrapper>
    </S.ImageWrapper>
  );
};
