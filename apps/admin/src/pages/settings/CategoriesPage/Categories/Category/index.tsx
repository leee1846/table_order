import { useState } from 'react';
import { BasicButton, ToggleButton, toast } from '@repo/ui/components';
import * as S from '@/pages/settings/CategoriesPage/Categories/Category/category.style';
import { ChevronForwardIcon, DeleteIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { CategoryManageModal } from '@/pages/settings/CategoriesPage/CategoryManageModal';
import type { ICategory } from '@repo/api/types';
import { useDeleteCategory } from '@repo/api/queries';
import { openDualActionDialog } from '@repo/feature/utils';

interface Props {
  category: ICategory;
  shopSeq: number;
  categoryList: ICategory[];
}

export const Category = ({ category, shopSeq, categoryList }: Props) => {
  const [isCategoryManageModalOpen, setIsCategoryManageModalOpen] =
    useState(false);
  const deleteCategoryMutation = useDeleteCategory();

  const handleDeleteCategory = (categorySeq: number) => {
    openDualActionDialog({
      title: '카테고리를 삭제할까요?',
      primaryText: '삭제',
      secondaryText: '취소',
      size: 'xsmall',
      onConfirm: () => {
        deleteCategoryMutation.mutate(
          { categorySeq },
          {
            onSuccess: () => {
              toast('카테고리가 삭제되었습니다.');
            },
            onError: (error) => {
              toast(
                error.response?.data?.status?.userMessage ||
                  '카테고리 삭제에 실패했습니다.'
              );
            },
          }
        );
      },
    });
  };

  return (
    <>
      <S.Container>
        <S.Header>
          <div>
            <span>{category.categoryName}</span>
            <button type="button" onClick={() => {}}>
              <ChevronForwardIcon
                width={30}
                height={30}
                color={theme.colors.grey[400]}
              />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              handleDeleteCategory(category.categorySeq);
            }}
          >
            <DeleteIcon width={14} height={14} color={theme.colors.grey[600]} />
          </button>
        </S.Header>

        <S.Badges>
          {category.saleStartTime && category.saleEndTime && (
            <li>
              <p>판매시간</p>
              <p>
                {category.saleStartTime} ~ {category.saleEndTime}
                {/* TODO: 상시 표시 추가해야함 (24시간 표시) */}
              </p>
            </li>
          )}

          {category.saleDayOfWeek && category.saleDayOfWeek.length > 0 && (
            <li>
              <p>판매 요일</p>
              <p>{category.saleDayOfWeek?.toString()}</p>
            </li>
          )}
          {category.saleDayOfWeek && category.saleDayOfWeek.length === 7 && (
            <li>
              <p>판매 요일</p>
              <p>매일</p>
            </li>
          )}

          {category.isQuantitySelectable && (
            <li>
              <p>수량 선택</p>
              <p>가능</p>
            </li>
          )}
          {category.useTwoColumnLayout && (
            <li>
              <p>보기 옵션</p>
              <p>2열</p>
            </li>
          )}
        </S.Badges>

        <S.Footer>
          <S.HiddenContainer>
            <p>메뉴판에서 숨기기</p>
            <ToggleButton
              size="S"
              isOn={category.isHidden}
              onChange={() => {
                // noop
              }}
            />
          </S.HiddenContainer>

          <S.ButtonContainer>
            <BasicButton
              variant="Solid_Navy_L"
              onClick={() => {
                // noop
              }}
            >
              테이블 지정
            </BasicButton>
            <BasicButton
              variant="Solid_Sky_Blue_L"
              onClick={() => setIsCategoryManageModalOpen(true)}
            >
              수정하기
            </BasicButton>
          </S.ButtonContainer>
        </S.Footer>
      </S.Container>

      {isCategoryManageModalOpen && (
        <CategoryManageModal
          onClose={() => setIsCategoryManageModalOpen(false)}
          categoryData={category}
          shopSeq={shopSeq}
          categoryList={categoryList}
        />
      )}
    </>
  );
};
