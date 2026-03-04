import { useAdminTranslation } from '@/config/i18n';
import { useMemo, useState } from 'react';
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
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface Props {
  menu: IMenu;
  onEditMenu: (menu: IMenu) => void;
  isPosLinked: boolean;
  isDragging?: boolean;
}

export const Menu = ({
  menu,
  onEditMenu,
  isPosLinked,
  isDragging = false,
}: Props) => {
  const { t, i18n } = useAdminTranslation();
  const [isMenuCopyModalOpen, setIsMenuCopyModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
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
        <ModalBackground>
          <S.PreviewModal>
            <S.CloseButton type="button" onClick={handleClosePreview}>
              <CloseIcon width={32} height={32} color={theme.colors.white} />
            </S.CloseButton>
            <Swiper
              modules={[Pagination]}
              initialSlide={previewIndex}
              spaceBetween={0}
              slidesPerView={1}
              loop={availableImages.length > 1}
              onSlideChange={(swiper) => handleSelectPreview(swiper.realIndex)}
              pagination={{
                clickable: true,
                renderBullet: (_idx, className) => {
                  return `<button type="button" class="${className}" aria-label="${t('이미지 미리보기')}"></button>`;
                },
              }}
              style={{ width: '100%', height: '100%' }}
            >
              {availableImages.map((image, index) => (
                <SwiperSlide key={image.imageSeq ?? index}>
                  <S.PreviewImage
                    src={image.imagePath ?? undefined}
                    alt={`${menu.menuName}-${index + 1}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </S.PreviewModal>
        </ModalBackground>
      )}
    </>
  );
};
