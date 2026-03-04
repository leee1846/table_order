import {
  bestOnIcon,
  spicyLevel1Icon,
  spicyLevel2Icon,
  spicyLevel3Icon,
  EmptedImageIcon,
  newOnIcon,
} from '@repo/ui/icons';
import * as S from '@/feature/Thumbnail/thumbnail.style';
import type { IMenu, IMenuImage } from '@repo/api/types';
import { useMemo, useState } from 'react';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useThemeMode } from '@repo/ui';

interface Props {
  menu: IMenu;
  image?: IMenuImage;
  width?: string;
}

/**
 * 메뉴 썸네일 이미지 UI
 */
export const Thumbnail = ({ menu, image, width = '100%' }: Props) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(imageLoaded && !imageError && image?.imagePath);

  const spicyLevelIcon = useMemo(() => {
    switch (menu.spiceLevel) {
      case 1:
        return spicyLevel1Icon;
      case 2:
        return spicyLevel2Icon;
      case 3:
        return spicyLevel3Icon;
      default:
        return null;
    }
  }, [menu.spiceLevel]);

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

      {(!image || !image.imagePath || imageError) && (
        <S.NoImagePlaceholder>
          <EmptedImageIcon
            width={48}
            height={48}
            color={theme.mode.grey[300]}
          />
          <p>{t('곧 이미지를 추가할 예정이에요!')}</p>
        </S.NoImagePlaceholder>
      )}

      
        {(menu.isBest || menu.isNew) && (
          <S.LeftBadges>
            {menu.isNew && (
              <img src={newOnIcon} alt={t('신메뉴')} />
            )}
            {menu.isBest && (
              <img
                src={bestOnIcon}
                alt={t('베스트 메뉴')}
              />
            )}
          </S.LeftBadges>
        )}
      
        {menu.spiceLevel > 0 && (
          <S.ChiliIcons
            aria-label={t('매운맛 {{level}}단계', { level: menu.spiceLevel })}
          >
            <img
              src={spicyLevelIcon ?? ''}
              width={36}
              height={36}
              alt=""
              aria-hidden="true"
            />
          </S.ChiliIcons>
        )}
    </S.ImageWrapper>
  );
};
