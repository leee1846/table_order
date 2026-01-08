import { useCallback, useMemo } from 'react';
import { t } from '@/config/i18n';
import { ModalBackground, BasicButton } from '@repo/ui/components';
import { CloseIcon, PhotoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { AlbumPhoto } from '@repo/util/app';
import * as S from './galleryModal.style';
import { FullscreenLoadingSpinner } from '@repo/ui/components';

interface GalleryModalProps {
  isOpen: boolean;
  items: AlbumPhoto[];
  selected: Set<string>;
  isLoading: boolean;
  isUploading: boolean;
  hasMore: boolean;
  onClose: () => void;
  onLoadMore: () => void;
  onToggleSelect: (originalUri: string) => void;
  onConfirm: () => void;
}

export const GalleryModal = ({
  isOpen,
  items,
  selected,
  isLoading,
  isUploading,
  hasMore,
  onClose,
  onLoadMore,
  onToggleSelect,
  onConfirm,
}: GalleryModalProps) => {
  const selectedList = useMemo(() => Array.from(selected), [selected]);
  const selectionOrderMap = useMemo(() => {
    const map = new Map<string, number>();
    selectedList.forEach((uri, index) => {
      map.set(uri, index + 1);
    });
    return map;
  }, [selectedList]);

  const getSelectionOrder = useCallback(
    (originalUri: string) => {
      return selectionOrderMap.get(originalUri) ?? null;
    },
    [selectionOrderMap]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground onClick={onClose}>
      {isLoading && <FullscreenLoadingSpinner />}
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose} type="button">
          <CloseIcon width={32} height={32} color={theme.colors.grey[600]} />
        </S.CloseButton>
        <S.ModalHeader>
          <S.ModalTitle>{t('갤러리에서 가져오기')}</S.ModalTitle>
        </S.ModalHeader>
        <S.ModalBody>
          {items.length === 0 && !isLoading ? (
            <S.EmptyState>
              <PhotoIcon
                width={36}
                height={36}
                color={theme.colors.grey[400]}
              />
              <span>{t('가져올 이미지가 없습니다.')}</span>
            </S.EmptyState>
          ) : (
            <S.ImageGrid>
              {items.map((item) => {
                const isSelected = selected.has(item.originalUri);
                const order = getSelectionOrder(item.originalUri);

                return (
                  <S.ImageButton
                    type="button"
                    selected={isSelected}
                    aria-pressed={isSelected}
                    key={item.originalUri}
                    onClick={() => onToggleSelect(item.originalUri)}
                  >
                    <S.Image src={item.thumbUrl} alt={t('갤러리 이미지')} />
                    <S.SelectionOverlay selected={isSelected} />
                    {order !== null && (
                      <S.SelectionIndicator selected={isSelected}>
                        {order}
                      </S.SelectionIndicator>
                    )}
                  </S.ImageButton>
                );
              })}
              {/* {isLoading && (
                <S.StatusText>
                  {t('이미지를 불러오는 중입니다...')}
                </S.StatusText>
              )}
              {!hasMore && items.length > 0 && (
                <S.StatusText>
                  {t('더 이상 불러올 이미지가 없습니다.')}
                </S.StatusText>
              )} */}
            </S.ImageGrid>
          )}

          <S.Footer>
            <BasicButton
              variant="Solid_Navy_2XL"
              fullWidth
              onClick={onConfirm}
              disabled={selected.size === 0 || isUploading}
            >
              {`${selected.size} ${t('선택 완료')}`}
            </BasicButton>
          </S.Footer>
        </S.ModalBody>
      </S.ModalContainer>
    </ModalBackground>
  );
};
