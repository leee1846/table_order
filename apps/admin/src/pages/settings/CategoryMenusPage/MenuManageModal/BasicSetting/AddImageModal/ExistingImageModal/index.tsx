import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from '@/config/i18n';
import type { IExistingMenuImage } from '@repo/api/types';
import { BasicButton, ModalBackground } from '@repo/ui/components';
import { CloseIcon, PhotoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { toast } from '@repo/feature/utils';
import * as S from './existingImageModal.style';

interface ExistingImageModalProps {
  isOpen: boolean;
  images: IExistingMenuImage[];
  onClose: () => void;
  onConfirm: (images: IExistingMenuImage[]) => void;
}

export const ExistingImageModal = ({
  isOpen,
  images,
  onClose,
  onConfirm,
}: ExistingImageModalProps) => {
  const [selectionOrder, setSelectionOrder] = useState<number[]>([]);
  const selectedSet = useMemo(
    () => new Set(selectionOrder),
    [selectionOrder]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    // 모달 오픈 시 이전 선택 초기화
    setSelectionOrder([]);
  }, [images, isOpen]);

  const selectedImages = useMemo(
    () =>
      selectionOrder
        .map((id) => images.find((image) => image.imageSeq === id))
        .filter((image): image is IExistingMenuImage => image !== undefined),
    [images, selectionOrder]
  );

  const toggleSelect = useCallback((imageSeq: number) => {
    setSelectionOrder((prev) =>
      prev.includes(imageSeq)
        ? prev.filter((id) => id !== imageSeq)
        : [...prev, imageSeq]
    );
  }, []);

  const selectionOrderMap = useMemo(() => {
    const map = new Map<number, number>();
    selectionOrder.forEach((seq, index) => {
      map.set(seq, index + 1);
    });
    return map;
  }, [selectionOrder]);

  const handleConfirm = useCallback(() => {
    if (selectedImages.length === 0) {
      toast(t('이미지를 선택해주세요.'));
      return;
    }
    onConfirm(selectedImages);
  }, [onConfirm, selectedImages]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground onClick={onClose}>
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose} type="button">
          <CloseIcon width={32} height={32} color={theme.colors.grey[600]} />
        </S.CloseButton>
        <S.ModalHeader>
          <S.ModalTitle>{t('기존 이미지')}</S.ModalTitle>
        </S.ModalHeader>
        <S.ModalBody>
          {images.length === 0 ? (
            <S.EmptyState>
              <PhotoIcon
                width={36}
                height={36}
                color={theme.colors.grey[400]}
              />
              <span>{t('등록된 이미지가 없습니다.')}</span>
            </S.EmptyState>
          ) : (
            <S.ImageGrid>
              {images
                .filter((image) => !!image.imagePath)
                .map((image) => {
                  const isSelected = selectedSet.has(image.imageSeq);
                  const selectionNumber = selectionOrderMap.get(
                    image.imageSeq
                  );

                  return (
                    <li key={image.imageSeq}>
                      <S.ImageButton
                        type="button"
                        selected={isSelected}
                        aria-pressed={isSelected}
                        onClick={() => toggleSelect(image.imageSeq)}
                      >
                        <S.Image
                          src={image.imagePath ?? ''}
                          alt={t('기존 이미지')}
                        />
                        <S.SelectionOverlay selected={isSelected} />
                        {selectionNumber !== undefined && (
                          <S.SelectionIndicator selected={isSelected}>
                            {selectionNumber}
                          </S.SelectionIndicator>
                        )}
                      </S.ImageButton>
                    </li>
                  );
                })}
            </S.ImageGrid>
          )}
          <S.ButtonContainer>
            <BasicButton
              variant="Solid_Navy_2XL"
              fullWidth
              onClick={handleConfirm}
              disabled={selectedImages.length === 0}
            >
              {`${selectedImages.length} ${t('개 선택')}`}
            </BasicButton>
          </S.ButtonContainer>
        </S.ModalBody>
      </S.ModalContainer>
    </ModalBackground>
  );
};
