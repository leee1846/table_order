import { t } from '@/config/i18n';
import { useState, useEffect } from 'react';
import { Menu } from '@/pages/settings/CategoryMenusPage/Menus/Menu';
import type { IMenu } from '@repo/api/types';
import { SortableList } from '@repo/feature/components';
import { usePutUpdateMenuIndex, queryKeys } from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import { toast } from '@repo/feature/utils';

interface MenusProps {
  menus: IMenu[] | undefined;
  hasCategory: boolean;
  onClickEditMenu: (menu: IMenu) => void;
  isPosLinked: boolean;
}

export const Menus = ({ menus, onClickEditMenu, isPosLinked }: MenusProps) => {
  const queryClient = useQueryClient();
  const [localMenus, setLocalMenus] = useState<IMenu[]>([]);
  const { mutateAsync: updateMenuIndex } = usePutUpdateMenuIndex();

  // menus가 변경될 때 localMenus 업데이트
  useEffect(() => {
    if (menus) {
      setLocalMenus(menus);
    }
  }, [menus]);

  const handleReorder = async (
    newOrder: IMenu[],
    draggedMenuSeq: string | number
  ) => {
    // 로컬 상태 즉시 업데이트
    setLocalMenus(newOrder);

    // 드래그한 메뉴 찾기
    const draggedMenu = newOrder.find(
      (menu) => menu.menuSeq === draggedMenuSeq
    );
    if (!draggedMenu) {
      return;
    }

    const arrayIndex = newOrder.findIndex((m) => m.menuSeq === draggedMenuSeq);
    const newIndex = arrayIndex;

    // API 요청 데이터 생성 (변경된 메뉴 하나만 전송)
    const updateData = {
      menuSeq: draggedMenu.menuSeq,
      index: newIndex,
    };

    try {
      await updateMenuIndex(updateData);
      // 성공 시 서버 데이터 갱신
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.list(draggedMenu.categorySeq),
      });
      toast(t('메뉴 순서가 변경되었습니다.'));
    } catch (error) {
      // 실패 시 원래 순서로 롤백
      if (menus) {
        setLocalMenus(menus);
      }
      toast(t('메뉴 순서 변경에 실패했습니다.'));
    }
  };

  // 실제 표시할 메뉴 (로컬 상태가 있으면 사용, 없으면 원본 사용)
  const displayMenus =
    localMenus.length > 0 && localMenus.length === menus?.length
      ? localMenus
      : menus;

  return (
    <SortableList
      items={displayMenus ?? []}
      onReorder={handleReorder}
      getId={(menu) => menu.menuSeq}
      renderItem={(menu) => (
        <Menu
          menu={menu}
          onEditMenu={onClickEditMenu}
          isPosLinked={isPosLinked}
        />
      )}
    />
  );
};
