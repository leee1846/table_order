import { t } from '@/config/i18n';
import React from 'react';
import { BasicButton } from '@repo/ui/components';
import { PhotoIcon, AddCircleIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './imageRegistration.style';

interface ImageItem {
  id: number;
  description: string;
  imageUrl: string | null;
  pageDetailImageSeq?: number;
}

interface ImageRegistrationProps {
  items: ImageItem[];
  onAddItem: () => void;
  onChangeDescription: (id: number, value: string) => void;
  onChangeImage: (id: number, file: File | null) => void;
  onRemoveImage: (id: number) => void;
}

export const ImageRegistration = ({
  items,
  onAddItem,
  onChangeDescription,
  onChangeImage,
  onRemoveImage,
}: ImageRegistrationProps) => {
  const handleDescriptionChange = (id: number, value: string) => {
    onChangeDescription(id, value);
  };

  const handleImageChange = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    onChangeImage(id, file);
    event.target.value = '';
  };

  const sortedItems = [...items].sort(
    (a, b) => (a.pageDetailImageSeq ?? 0) - (b.pageDetailImageSeq ?? 0)
  );

  return (
    <S.Container>
      {sortedItems.map((item) => (
        <S.ContentContainer key={item.id}>
          <input
            id={`init-common-${item.id}`}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleImageChange(item.id, e)}
          />

          <S.ImageSection
            onClick={() =>
              document.getElementById(`init-common-${item.id}`)?.click()
            }
          >
            {item.imageUrl ? (
              <>
                <S.ImageButtonContainer
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <BasicButton
                    variant="Outline_Grey_L"
                    onClick={() =>
                      document.getElementById(`init-common-${item.id}`)?.click()
                    }
                  >
                    {t('변경')}
                  </BasicButton>
                  <BasicButton
                    variant="Solid_Sky_Blue_L"
                    onClick={() => onRemoveImage(item.id)}
                  >
                    {t('삭제')}
                  </BasicButton>
                </S.ImageButtonContainer>
                <S.ImagePreview
                  src={item.imageUrl}
                  alt={t('설명 페이지 이미지')}
                />
              </>
            ) : (
              <>
                <PhotoIcon
                  width={36}
                  height={36}
                  color={theme.colors.grey[400]}
                />

                <p>
                  {t(
                    '고객이 메뉴판 화면에서 볼 수 있는 매장 로고를 설정할 수 있어요.'
                  )}
                </p>
                <span>{t('(400*200px 가로형 이미지 권장)')}</span>
              </>
            )}
          </S.ImageSection>
          <S.DescriptionSection>
            <S.TextArea
              placeholder={t(
                '매장 또는 메뉴에 대한 간략한 설명을 작성할 수 있어요. (최대 150자)'
              )}
              value={item.description}
              onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
              maxLength={150}
            />
          </S.DescriptionSection>
        </S.ContentContainer>
      ))}
      <S.AddButtonContainer>
        <BasicButton
          variant="Outline_Grey_L"
          onClick={onAddItem}
          icon={
            <AddCircleIcon
              width={18.33}
              height={18.33}
              color={theme.colors.grey[700]}
            />
          }
          customStyle={S.AddButtonStyle}
        >
          {t('설명 페이지 추가')}
        </BasicButton>
      </S.AddButtonContainer>
    </S.Container>
  );
};
