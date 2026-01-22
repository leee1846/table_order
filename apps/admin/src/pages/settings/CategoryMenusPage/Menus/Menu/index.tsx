import { useAdminTranslation } from '@/config/i18n';
import { useMemo, useState, useRef } from 'react';
import {
  BasicButton,
  ToggleButton,
  ModalBackground,
} from '@repo/ui/components';
import { toast, openDualActionDialog } from '@repo/feature/utils';
import * as S from '@/pages/settings/CategoryMenusPage/Menus/Menu/menu.style';
import { CloseIcon, PhotoIcon } from '@repo/ui/icons';
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
import { theme } from '@repo/ui';

interface Props {
  menu: IMenu;
  onEditMenu: (menu: IMenu) => void;
  isPosLinked: boolean;
  isDragging?: boolean;
}

export const Menu = ({ menu, onEditMenu, isPosLinked, isDragging = false }: Props) => {
  const { t, i18n } = useAdminTranslation();
  const [isMenuCopyModalOpen, setIsMenuCopyModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const queryClient = useQueryClient();
  const deleteMenuMutation = useDeleteMenu();
  const { mutateAsync: updateMenuHidden } = usePutUpdateMenuHidden();
  const { mutateAsync: updateMenuOutOfStock } = usePutUpdateMenuOutOfStock();
  const availableImages = useMemo(
    () =>
      (menu.menuImageList ?? [])
        .filter((image) => !image.isDeleted && image.imagePath)
        .sort((a, b) => (a.imageIndex ?? 0) - (b.imageIndex ?? 0)),
    [menu.menuImageList]
  );

  const mainImageIndex = useMemo(() => {
    const index = availableImages.findIndex((image) => image.isMainImage);
    return index >= 0 ? index : 0;
  }, [availableImages]);

  const handleDeleteMenu = () => {
    if (isPosLinked) {
      return;
    }

    openDualActionDialog({
      title: t('메뉴 삭제'),
      content: `"${menu.menuName}" 메뉴를 삭제하시겠습니까?`,
      primaryText: t('예'),
      secondaryText: t('아니요'),
      size: 'xsmall',
      onConfirm: () => {
        deleteMenuMutation.mutate(
          { menuSeq: menu.menuSeq },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: queryKeys.menu.list(menu.categorySeq),
              });
              toast(t('메뉴가 삭제되었습니다.'));
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
              ? t('메뉴가 표시되었습니다.')
              : t('메뉴가 숨김 처리되었습니다.')
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
              ? t('메뉴 품절이 해제되었습니다.')
              : t('메뉴가 품절 처리되었습니다.')
          );
        },
      }
    );
  };

  const handleOpenPreview = () => {
    if (availableImages.length === 0) {
      return;
    }
    setPreviewIndex(mainImageIndex);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const handleSelectPreview = (index: number) => {
    setPreviewIndex(index);
  };

  // 터치 시작 위치 저장
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? 0;
  };

  // 터치 이동 중 위치 업데이트
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0]?.clientX ?? 0;
  };

  // 터치 종료 시 스와이프 거리 계산하여 이미지 변경
  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;

    if (swipeDistance > 50) {
      // 왼쪽으로 스와이프 -> 다음 이미지
      setPreviewIndex((prev) =>
        prev < availableImages.length - 1 ? prev + 1 : 0
      );
    }

    if (swipeDistance < -50) {
      // 오른쪽으로 스와이프 -> 이전 이미지
      setPreviewIndex((prev) =>
        prev > 0 ? prev - 1 : availableImages.length - 1
      );
    }
  };

  return (
    <>
      <S.Container isDragging={isDragging}>
        <S.InfoContainer>
          <S.TitleContainer>
            <S.TitleContent>
              <span>{menu.localeMenuName?.[i18n.language?.toUpperCase()]}</span>
              {availableImages.length > 0 && (
                <S.PreviewButton type="button" onClick={handleOpenPreview}>
                  <S.IconContainer>
                    <PhotoIcon
                      width={15}
                      height={15}
                      color={theme.colors.grey[600]}
                    />
                  </S.IconContainer>
                  {t('미리보기')}
                </S.PreviewButton>
              )}
            </S.TitleContent>

            <S.ActionGroup>
              <BasicButton
                variant="Outline_Grey_M"
                onClick={handleDeleteMenu}
                disabled={isPosLinked}
                customStyle={S.DeleteButton}
              >
                {t('삭제')}
              </BasicButton>
              <BasicButton
                variant="Solid_Sky_Blue_M"
                onClick={() => onEditMenu(menu)}
                customStyle={S.EditButton}
              >
                {t('수정')}
              </BasicButton>
            </S.ActionGroup>
          </S.TitleContainer>
          <S.Price>{`₩${formatCurrency(menu.menuPrice)}`}</S.Price>
          <S.Description>
            {menu.localeMenuDescription?.[i18n.language?.toUpperCase()] ?? ''}
          </S.Description>

          <S.ToggleContainer>
            <div>
              <span>{t('숨기기')}</span>
              <ToggleButton
                size="S"
                isOn={menu.isHidden}
                onChange={handleToggleHidden}
              />
            </div>
            <div>
              <span>{t('품절처리')}</span>
              <ToggleButton
                size="S"
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

      {isPreviewOpen && availableImages[previewIndex] && (
        <ModalBackground onClick={handleClosePreview}>
          <S.PreviewModal>
            <S.CloseButton type="button" onClick={handleClosePreview}>
              <CloseIcon width={32} height={32} color={theme.colors.white} />
            </S.CloseButton>
            <S.PreviewImage
              src={availableImages[previewIndex].imagePath ?? undefined}
              alt={`${menu.menuName}-${previewIndex + 1}`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
            {availableImages.length > 1 && (
              <S.DotGroup>
                {availableImages.map((_, index) => (
                  <S.DotButton
                    key={availableImages[index]?.imageSeq ?? index}
                    type="button"
                    aria-label={t('이미지 미리보기')}
                    data-active={previewIndex === index}
                    onClick={() => handleSelectPreview(index)}
                  />
                ))}
              </S.DotGroup>
            )}
          </S.PreviewModal>
        </ModalBackground>
      )}
    </>
  );
};
