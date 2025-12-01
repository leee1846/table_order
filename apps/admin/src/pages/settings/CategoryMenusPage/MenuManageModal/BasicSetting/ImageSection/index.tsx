import { useMemo, useRef, useState } from 'react';
import { theme } from '@repo/ui';
import {
  AddIcon,
  CloseIcon,
  PhotoIcon,
  bestOnIcon,
  newOnIcon,
} from '@repo/ui/icons';
import * as S from './imageSection.style';
import type { IMenu } from '@repo/api/types';
import { AddImageModal } from '../AddImageModal';

interface ImageSectionProps {
  menu?: IMenu;
  isBest?: boolean;
  isNew?: boolean;
  onAddFiles?: (files: FileList | null) => void;
}

export const ImageSection = ({
  menu,
  isBest,
  isNew,
  onAddFiles,
}: ImageSectionProps) => {
  const mode = menu ? 'edit' : 'create';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);

  const handleClickThumbnail = () => {
    if (mode === 'create' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onAddFiles?.(files);
    }
    // 같은 파일을 다시 선택할 수 있도록 value 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectFromGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 수정 모드일 때 메뉴 이미지 목록 가져오기
  const menuImages = useMemo(() => {
    if (mode === 'edit' && menu?.menuImageList) {
      return menu.menuImageList.filter(
        (image) => !image.isDeleted && image.imagePath
      );
    }
    return [];
  }, [mode, menu]);

  // 메인 이미지 찾기
  const mainImage = useMemo(() => {
    if (menuImages.length === 0) {
      return null;
    }
    return menuImages.find((image) => image.isMainImage) ?? menuImages[0];
  }, [menuImages]);

  // 추가 이미지 목록 (메인 이미지 제외)
  const additionalImages = useMemo(() => {
    if (!mainImage) {
      return menuImages;
    }
    return menuImages.filter((image) => image.imageSeq !== mainImage.imageSeq);
  }, [menuImages, mainImage]);

  return (
    <S.Container>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <S.Thumbnail>
        <S.BadgesContainer>
          {isBest && <img src={bestOnIcon} alt="베스트" />}
          {isNew && <img src={newOnIcon} alt="신규" />}
        </S.BadgesContainer>

        {mode === 'edit' && mainImage ? (
          <>
            <S.ThumbnailActionButtons>
              <S.ThumbnailActionButton type="button">
                변경
              </S.ThumbnailActionButton>
              <S.ThumbnailActionButton type="button">
                삭제
              </S.ThumbnailActionButton>
            </S.ThumbnailActionButtons>
            <img src={mainImage.imagePath ?? ''} alt="메인 사진" />
          </>
        ) : (
          <>
            <PhotoIcon
              width={36}
              height={36}
              color={theme.colors.primary[400]}
            />
            <S.Text>메인 사진 (1장) 을 선택해 주세요</S.Text>
            <S.SubText>(700*500 px 권장)</S.SubText>
          </>
        )}
      </S.Thumbnail>
      {mode === 'edit' ? (
        additionalImages.length > 0 ? (
          <S.ImagesContainer>
            <S.Gradient />
            <S.ScrollableContent>
              <S.ImageAddButton
                type="button"
                onClick={() => setIsAddImageModalOpen(true)}
              >
                <AddIcon
                  width={20}
                  height={20}
                  color={theme.colors.grey[600]}
                />
              </S.ImageAddButton>
              <ul>
                {additionalImages.map((image) => (
                  <li key={image.imageSeq}>
                    <button type="button">
                      <CloseIcon
                        width={14}
                        height={14}
                        color={theme.colors.grey[200]}
                      />
                    </button>
                    <img src={image.imagePath ?? ''} alt="추가 이미지" />
                  </li>
                ))}
              </ul>
            </S.ScrollableContent>
          </S.ImagesContainer>
        ) : (
          <S.ImageAddButton
            type="button"
            onClick={() => setIsAddImageModalOpen(true)}
          >
            <AddIcon width={20} height={20} color={theme.colors.grey[600]} />
            <span>추가할 이미지가 있다면 선택해 주세요 </span>
          </S.ImageAddButton>
        )
      ) : (
        <S.ImageAddButton onClick={handleClickThumbnail}>
          <AddIcon width={20} height={20} color={theme.colors.grey[600]} />
          <span>추가할 이미지가 있다면 선택해 주세요 </span>
        </S.ImageAddButton>
      )}
      <AddImageModal
        isOpen={isAddImageModalOpen}
        onClose={() => setIsAddImageModalOpen(false)}
        onSelectFromGallery={handleSelectFromGallery}
      />
    </S.Container>
  );
};
