import { CheckButton, ModalBackground } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { ICategory } from '@repo/api/types';
import * as S from './categoryModal.style';

interface CategoryModalProps {
  isOpen: boolean;
  categories: ICategory[];
  selectedCategorySeqs: number[];
  isLoading: boolean;
  onClose: () => void;
  onCheck: (categorySeq: number) => void;
}

export const CategoryModal = ({
  isOpen,
  categories,
  selectedCategorySeqs,
  isLoading,
  onClose,
  onCheck,
}: CategoryModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.Header>
          <h3>첫주문 필수 카테고리</h3>
          <button type="button" aria-label="닫기" onClick={onClose}>
            <CloseIcon width={28} height={28} color={theme.colors.grey[600]} />
          </button>
        </S.Header>

        {isLoading ? (
          <S.LoadingText>카테고리를 불러오는 중입니다.</S.LoadingText>
        ) : categories.length > 0 ? (
          <S.CategoryList>
            {categories.map((category) => {
              const isChecked = selectedCategorySeqs.includes(
                category.categorySeq
              );

              return (
                <S.CategoryItem key={category.categorySeq}>
                  <CheckButton
                    checked={isChecked}
                    onChange={() => onCheck(category.categorySeq)}
                    customStyle={S.CheckButtonCustomStyle}
                  >
                    {category.categoryName}
                  </CheckButton>
                </S.CategoryItem>
              );
            })}
          </S.CategoryList>
        ) : (
          <S.EmptyState>등록된 카테고리가 없습니다.</S.EmptyState>
        )}
      </S.Container>
    </ModalBackground>
  );
};
