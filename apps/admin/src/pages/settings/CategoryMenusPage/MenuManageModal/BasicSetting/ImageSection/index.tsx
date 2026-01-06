import { t } from '@/config/i18n';
import { useRef, useState } from 'react';
import { theme } from '@repo/ui';
import {
  AddIcon,
  CloseIcon,
  PhotoIcon,
  bestOnIcon,
  newOnIcon,
} from '@repo/ui/icons';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/BasicSetting/ImageSection/imageSection.style';
import { AddImageModal } from '../AddImageModal';
import {
  useMenuForm,
  useMenuImages,
  type MenuImageData,
} from '../../context/MenuManageModalContext';
import { BasicButton } from '@repo/ui/components';

type ImageModalMode = 'main' | 'additional';

const getImageUrl = (image: MenuImageData | null): string | null => {
  if (!image) return null;
  return image.file
    ? URL.createObjectURL(image.file)
    : (image.imagePath ?? null);
};

export const ImageSection = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ImageModalMode>('main');

  const { formValues } = useMenuForm();
  const {
    mainImage,
    additionalImages,
    setMainImage,
    removeMainImage,
    addAdditionalImages,
    removeAdditionalImage,
  } = useMenuImages();

  const mainImageUrl = getImageUrl(mainImage);

  const openModal = (mode: ImageModalMode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    if (modalMode === 'main') {
      setMainImage(files[0] as File);
    } else {
      addAdditionalImages(files);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectFromGallery = () => fileInputRef.current?.click();

  return (
    <S.Container>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={modalMode === 'additional'}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <S.Thumbnail onClick={() => !mainImage && openModal('main')}>
        <S.BadgesContainer>
          {formValues.isBest && (
            <img src={bestOnIcon} alt={t('베스트')} />
          )}
          {formValues.isNew && (
            <img src={newOnIcon} alt={t('신규')} />
          )}
        </S.BadgesContainer>

        {mainImage && mainImageUrl ? (
          <>
            <S.ThumbnailActionButtons onClick={(e) => e.stopPropagation()}>
              <BasicButton
                onClick={() => openModal('main')}
                customStyle={S.ThumbnailActionButton}
                variant="Outline_Grey_S"
              >
                {t('변경')}
              </BasicButton>
              <BasicButton
                css={S.ThumbnailActionButton}
                onClick={removeMainImage}
                variant="Solid_Sky_Blue_S"
              >
                {t('삭제')}
              </BasicButton>
            </S.ThumbnailActionButtons>
            <img
              src={mainImageUrl}
              alt={t('메인 사진')}
            />
          </>
        ) : (
          <>
            <PhotoIcon
              width={36}
              height={36}
              color={theme.colors.primary[400]}
            />

            <S.Text>
              {t(
                '메인 사진 (1장) 을 선택해 주세요'
              )}
            </S.Text>
            <S.SubText>{t('(700*500 px 권장)')}</S.SubText>
          </>
        )}
      </S.Thumbnail>

      {additionalImages.length > 0 ? (
        <S.ImagesContainer>
          <S.Gradient />
          <S.ScrollableContent>
            <S.ImageAddButton
              type="button"
              onClick={() => openModal('additional')}
            >
              <AddIcon width={20} height={20} color={theme.colors.grey[600]} />
            </S.ImageAddButton>
            <ul>
              {additionalImages.map((image) => (
                <li key={image.id}>
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(image.id)}
                  >
                    <CloseIcon
                      width={14}
                      height={14}
                      color={theme.colors.grey[200]}
                    />
                  </button>
                  <img
                    src={getImageUrl(image) ?? ''}
                    alt={t('추가 이미지')}
                  />
                </li>
              ))}
            </ul>
          </S.ScrollableContent>
        </S.ImagesContainer>
      ) : (
        <S.ImageAddButton type="button" onClick={() => openModal('additional')}>
          <AddIcon width={20} height={20} color={theme.colors.grey[600]} />
          <span>
            {t(
              '추가할 이미지가 있다면 선택해 주세요'
            )}
          </span>
        </S.ImageAddButton>
      )}

      <AddImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectFromGallery={handleSelectFromGallery}
      />
    </S.Container>
  );
};
