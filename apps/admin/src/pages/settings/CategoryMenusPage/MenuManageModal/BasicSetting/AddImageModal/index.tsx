import { ModalBackground } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './addImageModal.style';

interface AddImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFromGallery: () => void;
  onTakePhoto?: () => void;
  onUseExistingImage?: () => void;
  onUseRecommendedImage?: () => void;
}

export const AddImageModal = ({
  isOpen,
  onClose,
  onSelectFromGallery,
  onTakePhoto,
  onUseExistingImage,
  onUseRecommendedImage,
}: AddImageModalProps) => {
  if (!isOpen) {
    return null;
  }

  const handleSelectFromGallery = () => {
    onSelectFromGallery();
    onClose();
  };

  return (
    <ModalBackground onClick={onClose}>
      <S.ModalContainer>
        <S.CloseButton onClick={onClose} type="button">
          <CloseIcon width={32} height={32} color={theme.colors.grey[600]} />
        </S.CloseButton>
        <S.ModalHeader>
          <S.ModalTitle>사진 추가</S.ModalTitle>
        </S.ModalHeader>
        <S.ModalBody>
          <S.OptionButton type="button" onClick={handleSelectFromGallery}>
            갤러리에서 불러오기
          </S.OptionButton>
          <S.OptionButton
            type="button"
            onClick={() => {
              onTakePhoto?.();
              onClose();
            }}
          >
            사진 촬영하기
          </S.OptionButton>
          <S.OptionButton
            type="button"
            onClick={() => {
              onUseExistingImage?.();
              onClose();
            }}
          >
            기존 이미지 사용하기
          </S.OptionButton>
          <S.OptionButton
            type="button"
            onClick={() => {
              onUseRecommendedImage?.();
              onClose();
            }}
          >
            추천 이미지 사용하기
          </S.OptionButton>
          <S.DescriptionText>다양한 종류의 추천 이미지 제공</S.DescriptionText>
        </S.ModalBody>
      </S.ModalContainer>
    </ModalBackground>
  );
};
