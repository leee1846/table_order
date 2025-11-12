import { useState } from 'react';
import { menus } from '@/constants/mock';
import { BasicButton, ToggleButton } from '@repo/ui/components';
import * as S from '@/pages/settings/CategoryMenusPage/Menus/Menu/menu.style';
import {
  bestOnIcon,
  chiliOffIcon,
  chiliOnIcon,
  newOnIcon,
} from '@repo/ui/icons';
import { formatCurrency } from '@repo/util';
import { MenuCopyModal } from '@/pages/settings/CategoryMenusPage/MenuCopyModal';

interface Props {
  menu: (typeof menus)[number];
}

export const Menu = ({ menu }: Props) => {
  const [isMenuCopyModalOpen, setIsMenuCopyModalOpen] = useState(false);

  return (
    <>
      <S.Container>
        <S.LeftContainer>
          <S.ThumbnailContainer>
            {menu.image && <img src={menu.image} alt={menu.name} />}
          </S.ThumbnailContainer>
          <S.ImagesContainer>
            {menu.isBest && <img src={bestOnIcon} alt="베스트" />}
            {menu.isNew && <img src={newOnIcon} alt="신규" />}
          </S.ImagesContainer>
          {menu.spicyLevel > 0 && (
            <S.ChiliContainer>
              <img src={chiliOnIcon} alt="맵기" />
              <img
                src={menu.spicyLevel > 1 ? chiliOnIcon : chiliOffIcon}
                alt="맵기"
              />
              <img
                src={menu.spicyLevel > 2 ? chiliOnIcon : chiliOffIcon}
                alt="맵기"
              />
            </S.ChiliContainer>
          )}
        </S.LeftContainer>

        <S.InfoContainer>
          <div>
            <S.TitleContainer>
              <span>{menu.name}</span>
              <div>
                <BasicButton
                  variant="Outline_Grey_L"
                  onClick={() => setIsMenuCopyModalOpen(true)}
                >
                  이동/복사
                </BasicButton>
                <BasicButton variant="Outline_Grey_L">삭제</BasicButton>
                <BasicButton variant="Solid_Sky_Blue_L">수정</BasicButton>
              </div>
            </S.TitleContainer>

            <S.Price>₩{formatCurrency(menu.price)}</S.Price>
            <S.Description>{menu.description}</S.Description>
          </div>

          <S.ToggleContainer>
            <div>
              <span>숨김</span>
              <ToggleButton
                size="M"
                isOn={menu.isHidden}
                onChange={() => {
                  // noop
                }}
              />
            </div>
            <div>
              <span>품절</span>
              <ToggleButton
                size="M"
                isOn={menu.isSoldOut}
                onChange={() => {
                  // noop
                }}
              />
            </div>
          </S.ToggleContainer>
        </S.InfoContainer>
      </S.Container>

      {isMenuCopyModalOpen && (
        <MenuCopyModal onClose={() => setIsMenuCopyModalOpen(false)} />
      )}
    </>
  );
};
