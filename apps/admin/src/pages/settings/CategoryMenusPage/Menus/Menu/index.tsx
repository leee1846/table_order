import { useMemo, useState } from 'react';
import { BasicButton, ToggleButton } from '@repo/ui/components';
import { toast, openDualActionDialog } from '@repo/feature/utils';
import * as S from '@/pages/settings/CategoryMenusPage/Menus/Menu/menu.style';
import {
  bestOnIcon,
  chiliOffIcon,
  chiliOnIcon,
  newOnIcon,
} from '@repo/ui/icons';
import { formatCurrency } from '@repo/util/string';
import { MenuCopyModal } from '@/pages/settings/CategoryMenusPage/MenuCopyModal';
import type { IMenu } from '@repo/api/types';
import {
  queryKeys,
  useDeleteMenu,
  usePutUpdateMenuHidden,
  usePutUpdateMenuOutOfStock,
} from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import { css } from '@emotion/react';

interface Props {
  menu: IMenu;
  onEditMenu: (menu: IMenu) => void;
}

export const Menu = ({ menu, onEditMenu }: Props) => {
  const [isMenuCopyModalOpen, setIsMenuCopyModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const deleteMenuMutation = useDeleteMenu();
  const { mutateAsync: updateMenuHidden } = usePutUpdateMenuHidden();
  const { mutateAsync: updateMenuOutOfStock } = usePutUpdateMenuOutOfStock();

  const thumbnailSrc = useMemo(() => {
    if (!menu.menuImageList || menu.menuImageList.length === 0) {
      return null;
    }

    const availableImages = menu.menuImageList.filter(
      (image) => !image.isDeleted && image.imagePath
    );

    if (availableImages.length === 0) {
      return null;
    }

    const mainImage =
      availableImages.find((image) => image.isMainImage) ?? availableImages[0];

    return mainImage?.imagePath ?? null;
  }, [menu.menuImageList]);

  const spiceLevel = menu.spiceLevel ?? 0;

  const handleDeleteMenu = () => {
    openDualActionDialog({
      title: '메뉴 삭제',
      content: `"${menu.menuName}" 메뉴를 삭제하시겠습니까?`,
      primaryText: '예',
      secondaryText: '아니요',
      size: 'xsmall',
      onConfirm: () => {
        deleteMenuMutation.mutate(
          { menuSeq: menu.menuSeq },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: queryKeys.menu.list(menu.categorySeq),
              });
              toast('메뉴가 삭제되었습니다.');
            },
            onError: (error) => {
              toast(
                error.response?.data?.status?.userMessage ||
                  '메뉴 삭제에 실패했습니다.'
              );
            },
          }
        );
      },
    });
  };

  const handleToggleHidden = () => {
    updateMenuHidden(
      {
        menuSeq: menu.menuSeq,
        isHidden: !menu.isHidden,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.menu.list(menu.categorySeq),
          });
          toast(
            menu.isHidden
              ? '메뉴가 표시되었습니다.'
              : '메뉴가 숨김 처리되었습니다.'
          );
        },
        onError: (error) => {
          toast(
            error.response?.data?.status?.userMessage ||
              '메뉴 숨김 상태 변경에 실패했습니다.'
          );
        },
      }
    );
  };

  const handleToggleOutOfStock = () => {
    updateMenuOutOfStock(
      {
        menuSeq: menu.menuSeq,
        isOutOfStock: !menu.isOutOfStock,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.menu.list(menu.categorySeq),
          });
          toast(
            menu.isOutOfStock
              ? '메뉴 품절이 해제되었습니다.'
              : '메뉴가 품절 처리되었습니다.'
          );
        },
        onError: (error) => {
          toast(
            error.response?.data?.status?.userMessage ||
              '메뉴 품절 상태 변경에 실패했습니다.'
          );
        },
      }
    );
  };

  return (
    <>
      <S.Container>
        <S.LeftContainer>
          <S.ThumbnailContainer>
            {thumbnailSrc && <img src={thumbnailSrc} alt={menu.menuName} />}
          </S.ThumbnailContainer>
          <S.ImagesContainer>
            {menu.isBest && <img src={bestOnIcon} alt="베스트" />}
            {menu.isNew && <img src={newOnIcon} alt="신규" />}
          </S.ImagesContainer>
          {spiceLevel > 0 && (
            <S.ChiliContainer>
              <img src={chiliOnIcon} alt="매운맛" />
              <img
                src={spiceLevel > 1 ? chiliOnIcon : chiliOffIcon}
                alt="매운맛"
              />
              <img
                src={spiceLevel > 2 ? chiliOnIcon : chiliOffIcon}
                alt="매운맛"
              />
            </S.ChiliContainer>
          )}
        </S.LeftContainer>

        <S.InfoContainer>
          <div>
            <S.TitleContainer>
              <span>{menu.menuName}</span>
              <div>
                <BasicButton
                  variant="Outline_Grey_L"
                  onClick={() => setIsMenuCopyModalOpen(true)}
                  customStyle={css`
                    display: none;
                  `}
                >
                  복사/이동
                </BasicButton>
                <BasicButton
                  variant="Outline_Grey_L"
                  onClick={handleDeleteMenu}
                >
                  삭제
                </BasicButton>
                <BasicButton
                  variant="Solid_Sky_Blue_L"
                  onClick={() => onEditMenu(menu)}
                >
                  수정
                </BasicButton>
              </div>
            </S.TitleContainer>

            <S.Price>{formatCurrency(menu.menuPrice)}</S.Price>
            <S.Description>{menu.menuDescription ?? ''}</S.Description>
          </div>

          <S.ToggleContainer>
            <div>
              <span>숨김</span>
              <ToggleButton
                size="M"
                isOn={menu.isHidden}
                onChange={handleToggleHidden}
              />
            </div>
            <div>
              <span>품절</span>
              <ToggleButton
                size="M"
                isOn={menu.isOutOfStock}
                onChange={handleToggleOutOfStock}
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
