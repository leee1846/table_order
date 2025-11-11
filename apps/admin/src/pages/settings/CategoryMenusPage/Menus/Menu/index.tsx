import { menus } from '@/constants/mock';
import { BasicButton, ToggleButton } from '@repo/ui/components';
import * as S from '@/pages/settings/CategoryMenusPage/Menus/Menu/menu.style';
import {
  bestOnIcon,
  chiliOffIcon,
  chiliOnIcon,
  newOnIcon,
} from '@repo/ui/icons';

interface Props {
  menu: (typeof menus)[number];
}

export const Menu = ({ menu }: Props) => {
  return (
    <S.Container>
      <S.LeftContainer>
        <S.ThumbnailContainer>
          {menu.image && <img src={menu.image} alt={menu.name} />}
        </S.ThumbnailContainer>
        <S.ImageContainer>
          {menu.isBest && <img src={bestOnIcon} alt="베스트" />}
          {menu.isNew && <img src={newOnIcon} alt="신규" />}
        </S.ImageContainer>
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

      <div>
        <S.TitleContainer>
          <span>{menu.name}</span>
          <div>
            <BasicButton variant="Outline_Grey_L">이동/복사</BasicButton>
            <BasicButton variant="Outline_Grey_L">삭제</BasicButton>
            <BasicButton variant="Solid_Sky_Blue_L">수정</BasicButton>
          </div>
        </S.TitleContainer>

        <span>{menu.price}</span>
        <span>{menu.description}</span>

        <div>
          <div>
            <span>숨김</span>
            <ToggleButton size="S" isOn={menu.isHidden} onChange={() => {}} />
          </div>
          <div>
            <span>품절</span>
            <ToggleButton size="S" isOn={menu.isSoldOut} onChange={() => {}} />
          </div>
        </div>
      </div>
    </S.Container>
  );
};
