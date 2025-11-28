import { useMemo, useState } from 'react';
import { BasicButton, ToggleButton, toast } from '@repo/ui/components';
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
import { queryKeys, useDeleteMenu } from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import { openDualActionDialog } from '@repo/feature/utils';

interface Props {
  menu: IMenu;
}

export const Menu = ({ menu }: Props) => {
  const [isMenuCopyModalOpen, setIsMenuCopyModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const deleteMenuMutation = useDeleteMenu();

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
      title: '메뉴를 삭제할까요?',
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
              <img src={chiliOnIcon} alt="맵기" />
              <img
                src={spiceLevel > 1 ? chiliOnIcon : chiliOffIcon}
                alt="맵기"
              />
              <img
                src={spiceLevel > 2 ? chiliOnIcon : chiliOffIcon}
                alt="맵기"
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
                >
                  이동/복사
                </BasicButton>
                <BasicButton
                  variant="Outline_Grey_L"
                  onClick={handleDeleteMenu}
                >
                  삭제
                </BasicButton>
                <BasicButton variant="Solid_Sky_Blue_L">수정</BasicButton>
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
                onChange={() => {
                  // noop
                }}
              />
            </div>
            <div>
              <span>품절</span>
              <ToggleButton
                size="M"
                isOn={menu.isOutOfStock}
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
