import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from '@/config/i18n';
import type {
  ISampleMenuImage,
  ISampleMenuImageListResponse,
} from '@repo/api/types';
import { BasicButton, ModalBackground } from '@repo/ui/components';
import { CloseIcon, PhotoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { toast } from '@repo/feature/utils';
import * as S from './recommendedImageModal.style';

interface RecommendedImageModalProps {
  isOpen: boolean;
  images: ISampleMenuImageListResponse[];
  onClose: () => void;
  onConfirm: (images: ISampleMenuImage[]) => void;
}

const CATEGORY_NAMES: Record<string, string> = {
  KOREAN: '한식',
  CHINESE: '중식',
  JAPANESE: '일식',
  WESTERN: '양식',
};

export const RecommendedImageModal = ({
  isOpen,
  images,
  onClose,
  onConfirm,
}: RecommendedImageModalProps) => {
  const [selectionOrder, setSelectionOrder] = useState<string[]>([]);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<
    string | null
  >(null);
  const categoryCodes = useMemo(
    () => images.map((category) => category.categoryCode),
    [images]
  );
  const selectedIds = useMemo(
    () => new Set(selectionOrder),
    [selectionOrder]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    // 모달 오픈 시 선택 초기화 + 유효한 카테고리 지정
    setSelectionOrder([]);
    setSelectedCategoryCode((prev) => {
      if (prev && categoryCodes.includes(prev)) {
        return prev;
      }
      return categoryCodes[0] ?? null;
    });
  }, [categoryCodes, isOpen]);

  const selectedImages = useMemo(() => {
    const imageMap = new Map<string, ISampleMenuImage>();
    images.forEach((response) =>
      response.imageList?.forEach((image) =>
        imageMap.set(image.menuImageSampleSeq, image)
      )
    );

    return selectionOrder
      .map((seq) => imageMap.get(seq))
      .filter((image): image is ISampleMenuImage => Boolean(image));
  }, [images, selectionOrder]);

  const currentCategoryImages = useMemo(() => {
    if (!selectedCategoryCode) {
      return [];
    }
    const category = images.find(
      (response) => response.categoryCode === selectedCategoryCode
    );
    return category?.imageList ?? [];
  }, [images, selectedCategoryCode]);

  const toggleSelect = useCallback((menuImageSampleSeq: string) => {
    setSelectionOrder((prev) =>
      prev.includes(menuImageSampleSeq)
        ? prev.filter((seq) => seq !== menuImageSampleSeq)
        : [...prev, menuImageSampleSeq]
    );
  }, []);

  const selectionOrderMap = useMemo(() => {
    const map = new Map<string, number>();
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
          <S.ModalTitle>{t('추천 이미지')}</S.ModalTitle>
        </S.ModalHeader>
        <S.ModalBody>
          <>
            <S.CategoryTabs>
              {categoryCodes.map((category, index) => (
                <S.CategoryTab
                  key={category || `category-${index}`}
                  type="button"
                  selected={selectedCategoryCode === category}
                  onClick={() => setSelectedCategoryCode(category)}
                >
                  {CATEGORY_NAMES[category] || category}
                </S.CategoryTab>
              ))}
            </S.CategoryTabs>
            {currentCategoryImages.length === 0 ? (
              <S.EmptyState>
                <PhotoIcon
                  width={36}
                  height={36}
                  color={theme.colors.grey[400]}
                />
                <span>{t('이 카테고리에 이미지가 없습니다.')}</span>
              </S.EmptyState>
            ) : (
              <S.ImageGrid>
                {currentCategoryImages.map((image, index) => {
                  const isSelected = selectedIds.has(image.menuImageSampleSeq);
                  const showFallback = !image.imagePath;
                  const selectionNumber = selectionOrderMap.get(
                    image.menuImageSampleSeq
                  );

                  return (
                    <S.ImageButton
                      key={`image-${image.menuImageSampleSeq}-${index.toString()}`}
                      type="button"
                      selected={isSelected}
                      aria-pressed={isSelected}
                      onClick={() => toggleSelect(image.menuImageSampleSeq)}
                    >
                      {showFallback ? (
                        <S.ImageFallback>
                          <PhotoIcon
                            width={24}
                            height={24}
                            color={theme.colors.grey[400]}
                          />
                          <span>{t('이미지를 불러올 수 없습니다.')}</span>
                        </S.ImageFallback>
                      ) : (
                        <S.Image
                          src={image.imagePath ?? ''}
                          alt={t('추천 이미지')}
                        />
                      )}
                      {image.imageName && (
                        <S.ImageLabel>{image.imageName}</S.ImageLabel>
                      )}
                      <S.SelectionOverlay selected={isSelected} />
                      <S.SelectionIndicator selected={isSelected}>
                        {selectionNumber}
                      </S.SelectionIndicator>
                    </S.ImageButton>
                  );
                })}
              </S.ImageGrid>
            )}
          </>

          <S.Footer>
            <S.ButtonContainer>
              <BasicButton
                variant="Solid_Navy_2XL"
                fullWidth
                onClick={handleConfirm}
                disabled={selectedImages.length === 0}
              >
                {`${selectedImages.length}개 ${t('선택 완료')}`}
              </BasicButton>
            </S.ButtonContainer>
          </S.Footer>
        </S.ModalBody>
      </S.ModalContainer>
    </ModalBackground>
  );
};
