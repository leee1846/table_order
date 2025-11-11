import { Menu } from '@/pages/settings/CategoryMenusPage/Menus/Menu';
import { menus } from '@/constants/mock';
import * as S from '@/pages/settings/CategoryMenusPage/Menus/menus.style';

export const Menus = () => {
  return (
    <S.Container>
      {menus.map((menu) => (
        <Menu key={menu.id} menu={menu} />
      ))}
    </S.Container>
  );
};
