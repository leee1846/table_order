import { useState } from 'react';
import * as S from '@/pages/MainPage/Contents/MenuItem/menuItem.style';
import { MenuDetailModal } from '@/pages/MainPage/Contents/MenuDetailModal';
import { MenuDetailWithOptionsModal } from '@/pages/MainPage/Contents/MenuDetailWithOptionsModal';
import type { IMenu } from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';
import { Thumbnail } from '@/feature/Thumbnail';

const IMAGE_SIZE = {
  1: {
    width: '20.9375rem',
  },
  2: {
    width: '22.5rem',
  },
  3: {
    width: '17.25rem',
  },
};

interface Props {
  layout: 1 | 2 | 3;
  menu: IMenu;
}
export const MenuItem = ({ layout, menu }: Props) => {
  const firstImage = menu.menuImageList?.[0];

  const [isMenuDetailOpen, setIsMenuDetailOpen] = useState(false);

  const onClickMenu = () => {
    if (menu.isOutOfStock) {
      return;
    }

    setIsMenuDetailOpen(true);
  };

  return (
    <>
      <S.Container layout={layout} type="button" onClick={onClickMenu}>
        <Thumbnail
          menu={menu}
          image={firstImage}
          width={IMAGE_SIZE[layout].width}
        />
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

      {isMenuDetailOpen && menu.optionGroupList.length < 1 && (
        <MenuDetailModal
          onClose={() => setIsMenuDetailOpen(false)}
          menu={menu}
        />
      )}

      {isMenuDetailOpen && menu.optionGroupList.length > 0 && (
        <MenuDetailWithOptionsModal
          onClose={() => setIsMenuDetailOpen(false)}
        />
      )}
    </>
  );
};
