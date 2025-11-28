import { Menu } from '@/pages/settings/CategoryMenusPage/Menus/Menu';
import * as S from '@/pages/settings/CategoryMenusPage/Menus/menus.style';
import type { IMenu } from '@repo/api/types';
import { NoContent } from '@/feature/NoContent';

interface MenusProps {
  menus: IMenu[] | undefined;
  isLoading: boolean;
  hasCategory: boolean;
}

export const Menus = ({ menus, isLoading, hasCategory }: MenusProps) => {
  if (!hasCategory) {
    return <NoContent>카테고리가 선택되지 않았습니다.</NoContent>;
  }

  if (isLoading) {
    return <NoContent>로딩 중입니다...</NoContent>;
  }

  if (!menus || menus.length === 0) {
    return <NoContent>메뉴가 없습니다.</NoContent>;
  }

  return (
    <S.Container>
      {menus.map((menu) => (
        <Menu key={menu.menuSeq} menu={menu} />
      ))}
    </S.Container>
  );
};
