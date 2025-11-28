import { useState } from 'react';
import { BasicButton, ToggleButton } from '@repo/ui/components';
import { toast } from '@repo/feature/utils';
import * as S from '@/pages/settings/CategoriesPage/Categories/Category/category.style';
import { ChevronForwardIcon, DeleteIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { CategoryManageModal } from '@/pages/settings/CategoriesPage/CategoryManageModal';
import type { ICategory } from '@repo/api/types';
import { queryKeys, useDeleteCategory } from '@repo/api/queries';
import { openDualActionDialog } from '@repo/feature/utils';
import { DAYS } from '@/constants/days';
import { formatTimeDisplay } from '@repo/util/time';
import { useQueryClient } from '@repo/api/tanstack-query';

interface Props {
  category: ICategory;
  shopSeq: number;
  categoryList: ICategory[];
}

export const Category = ({ category, shopSeq, categoryList }: Props) => {
  const queryClient = useQueryClient();
  const [isCategoryManageModalOpen, setIsCategoryManageModalOpen] =
    useState(false);
  const deleteCategoryMutation = useDeleteCategory();

  // 판매 요일 표시 텍스트 생성
  const getSaleDayDisplay = (): string | null => {
    if (!category.saleDayOfWeek || category.saleDayOfWeek.length === 0) {
      return null;
    }

    // 모든 요일(0-6)이 선택되어 있고 공휴일도 true면 "매일"
    const allDaysSelected =
      category.saleDayOfWeek.length === 7 &&
      [0, 1, 2, 3, 4, 5, 6].every((day) =>
        category.saleDayOfWeek?.includes(day)
      );
    if (allDaysSelected && category.isSaleOnHoliday) {
      return '매일';
    }

    // 선택된 요일의 label들을 가져옴
    const dayLabels = category.saleDayOfWeek
      .map((dayValue) => DAYS.find((d) => d.value === dayValue)?.label)
      .filter((label): label is string => label !== undefined);

    // 공휴일이 true면 "공휴일" 추가
    if (category.isSaleOnHoliday) {
      dayLabels.push('공휴일');
    }

    return dayLabels.length > 0 ? dayLabels.join(', ') : null;
  };

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
              queryClient.invalidateQueries({
                queryKey: queryKeys.category.list(),
              });
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

  const saleDayDisplay = getSaleDayDisplay();

  //판매시작, 종료 시간이 모두있는 지 확인
  const hasSaleTimeRange = !!category.saleStartTime && !!category.saleEndTime;

  //시간 범위가 00:00 ~ 00:00인지 확인
  const isZeroTimeRange =
    hasSaleTimeRange &&
    category.saleStartTime === '0000' &&
    category.saleEndTime === '0000';

  //조건 : useSaleTime + 시간 범위 존재 + 시간 범위가 00:00 ~ 00:00이 아닌 지 확인
  const shouldDisplayFormattedSaleTime =
    category.useSaleTime === true && hasSaleTimeRange && !isZeroTimeRange;

  const saleTimeDisplay = shouldDisplayFormattedSaleTime
    ? `${formatTimeDisplay(category.saleStartTime as string)} ~ ${formatTimeDisplay(category.saleEndTime as string)}`
    : '상시';

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
          <li>
            <p>판매시간</p>
            <p>{saleTimeDisplay}</p>
          </li>

          {saleDayDisplay && (
            <li>
              <p>판매 요일</p>
              <p>{saleDayDisplay}</p>
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
