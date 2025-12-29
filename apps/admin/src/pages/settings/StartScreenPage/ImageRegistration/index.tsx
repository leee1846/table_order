import { useState } from 'react';
import { BasicButton } from '@repo/ui/components';
import { PhotoIcon, AddCircleIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './imageRegistration.style';

interface ImageItem {
  id: number;
  description: string;
}

export const ImageRegistration = () => {
  const [items, setItems] = useState<ImageItem[]>([{ id: 1, description: '' }]);

  const handleAddItem = () => {
    const newId =
      items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
    setItems([...items, { id: newId, description: '' }]);
  };

  const handleDescriptionChange = (id: number, value: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, description: value } : item
      )
    );
  };

  return (
    <S.Container>
      <S.Header>
        <p>이미지 등록</p>
      </S.Header>
      {items.map((item) => (
        <S.ContentContainer key={item.id}>
          <S.ImageSection>
            <PhotoIcon width={36} height={36} color={theme.colors.grey[400]} />
            <p>
              고객이 메뉴판 화면에서 볼 수 있는 매장 로고를 설정할 수 있어요.
            </p>
            <span>(400*200px 가로형 이미지 권장)</span>
          </S.ImageSection>
          <S.DescriptionSection>
            <S.TextArea
              placeholder="매장 또는 메뉴에 대한 간략한 설명을 작성할 수 있어요. (최대 150자)"
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
          onClick={handleAddItem}
          icon={
            <AddCircleIcon
              width={18.33}
              height={18.33}
              color={theme.colors.grey[700]}
            />
          }
          customStyle={S.AddButtonStyle}
        >
          설명 페이지 추가
        </BasicButton>
      </S.AddButtonContainer>
    </S.Container>
  );
};
