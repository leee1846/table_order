import { useAdminTranslation } from '@/config/i18n';
import { useMemo, useState } from 'react';
import { BasicButton, ToggleButton } from '@repo/ui/components';
import * as S from '@/pages/settings/CategoriesPage/Categories/Category/category.style';
import { ChevronForwardIcon, DeleteIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { CategoryManageModal } from '@/pages/settings/CategoriesPage/CategoryManageModal';
import { CategoryTableAssignModal } from '@/pages/settings/CategoriesPage/CategoryTableAssignModal';
import type { ICategory, TShopLanguage } from '@repo/api/types';
import {
  queryKeys,
  useDeleteCategory,
  usePutUpdateCategoryHidden,
  usePostSaveCategoryExceptTable,
  useGetCategoryExceptTableList,
} from '@repo/api/queries';
import { openDualActionDialog, toast } from '@repo/feature/utils';
import { getDays } from '@/constants/days';
import { formatTimeDisplay } from '@repo/util/time';
import { getCurrentShopLanguage } from '@repo/util/i18n';
import { useQueryClient } from '@repo/api/tanstack-query';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  category: ICategory;
  shopSeq: number;
}

export const Category = ({ category, shopSeq }: Props) => {
  const { t, i18n } = useAdminTranslation();
  const days = useMemo(() => getDays(t), [t]);
  const queryClient = useQueryClient();
  const { shopCode } = useAuth();
  const [isCategoryManageModalOpen, setIsCategoryManageModalOpen] =
    useState(false);
  const [isTableAssignModalOpen, setIsTableAssignModalOpen] = useState(false);
  const [assignedTableNumbers, setAssignedTableNumbers] = useState<string[]>(
    []
  );
  const deleteCategoryMutation = useDeleteCategory();
  const { mutateAsync: updateCategoryHidden } = usePutUpdateCategoryHidden();
  const { mutateAsync: saveCategoryExceptTable } =
    usePostSaveCategoryExceptTable();

  const {
    data: categoryExceptTableResponse,
    isLoading: isCategoryExceptTableLoading,
  } = useGetCategoryExceptTableList(
    {
      shopCode: shopCode ?? '',
      categorySeq: category.categorySeq,
    },
    {
      enabled: !!shopCode && isTableAssignModalOpen,
    }
  );

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
      return t('매일');
    }

    // 선택된 요일의 label들을 가져옴
    const dayLabels = category.saleDayOfWeek
      .map((dayValue) => days.find((d) => d.value === dayValue)?.label)
      .filter((label): label is string => label !== undefined);

    // 공휴일이 true면 "공휴일" 추가
    if (category.isSaleOnHoliday) {
      dayLabels.push(t('공휴일'));
    }

    return dayLabels.length > 0 ? dayLabels.join(', ') : null;
  };

  const handleDeleteCategory = (categorySeq: number) => {
    openDualActionDialog({
      title: t('카테고리를 삭제할까요?'),
      primaryText: t('삭제'),
      secondaryText: t('취소'),
      size: 'xsmall',
      onConfirm: () => {
        deleteCategoryMutation.mutate(
          { categorySeq },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: queryKeys.category.list(),
              });
              toast(t('카테고리가 삭제되었습니다.'));
            },
            onError: (error) => {
              toast(
                error.response?.data?.status?.userMessage ||
                  t('카테고리 삭제에 실패했습니다.')
              );
            },
          }
        );
      },
    });
  };

  const handleToggleHidden = () => {
    updateCategoryHidden(
      {
        categorySeq: category.categorySeq,
        isHidden: !category.isHidden,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.category.list(),
          });
          toast(
            category.isHidden
              ? t('카테고리가 표시되었습니다.')
              : t('카테고리가 숨김 처리되었습니다.')
          );
        },
        onError: (error) => {
          toast(
            error.response?.data?.status?.userMessage ||
              t('카테고리 숨김 상태 변경에 실패했습니다.')
          );
        },
      }
    );
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
    : t('상시');

  // 현재 언어 코드를 안전하게 가져오기
  const currentLanguage: TShopLanguage = useMemo(
    () => getCurrentShopLanguage(i18n),
    [i18n]
  );

  // 현재 언어에 맞는 카테고리 이름
  const displayCategoryName = useMemo(
    () => category.localeCategoryName?.[currentLanguage],
    [category.localeCategoryName, category.categoryName, currentLanguage]
  );

  const handleSaveTableAssign = async (tableNumbers: string[]) => {
    if (!shopCode) {
      toast(t('매장 정보를 불러오는 중입니다.'));
      throw new Error('shopCode is not available');
    }

    await saveCategoryExceptTable({
      shopCode,
      categorySeq: category.categorySeq,
      tableNumberList: tableNumbers,
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.category.exceptTable(shopCode, category.categorySeq),
    });
    setAssignedTableNumbers(tableNumbers);
    toast(t('카테고리 테이블 지정이 저장되었습니다.'));
  };

  return (
    <>
      <S.Container>
        <S.Header>
          <div>
            <span>{displayCategoryName}</span>
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
            <p>{t('판매시간')}</p>
            <p>{saleTimeDisplay}</p>
          </li>

          {saleDayDisplay && (
            <li>
              <p>{t('판매 요일')}</p>
              <p>{saleDayDisplay}</p>
            </li>
          )}

          {category.isQuantitySelectable && (
            <li>
              <p>{t('수량 선택')}</p>
              <p>{t('가능')}</p>
            </li>
          )}
          {category.useTwoColumnLayout && (
            <li>
              <p>{t('보기 옵션')}</p>
              <p>{t('2열')}</p>
            </li>
          )}
        </S.Badges>
        <S.Footer>
          <S.HiddenContainer>
            <p>{t('메뉴판에서 숨기기')}</p>
            <ToggleButton
              size="S"
              isOn={category.isHidden}
              onChange={handleToggleHidden}
            />
          </S.HiddenContainer>

          <S.ButtonContainer>
            <BasicButton
              variant="Solid_Navy_L"
              onClick={() => {
                setIsTableAssignModalOpen(true);
              }}
            >
              {t('테이블 지정')}
            </BasicButton>
            <BasicButton
              variant="Solid_Sky_Blue_L"
              onClick={() => setIsCategoryManageModalOpen(true)}
            >
              {t('수정하기')}
            </BasicButton>
          </S.ButtonContainer>
        </S.Footer>
      </S.Container>

      {isCategoryManageModalOpen && (
        <CategoryManageModal
          onClose={() => setIsCategoryManageModalOpen(false)}
          categoryData={category}
          shopSeq={shopSeq}
        />
      )}
      {isTableAssignModalOpen && (
        <CategoryTableAssignModal
          categorySeq={category.categorySeq}
          initialSelectedTableNumbers={assignedTableNumbers}
          onClose={() => setIsTableAssignModalOpen(false)}
          onSave={handleSaveTableAssign}
          categoryExceptTableResponse={categoryExceptTableResponse}
          isCategoryExceptTableLoading={isCategoryExceptTableLoading}
        />
      )}
    </>
  );
};
