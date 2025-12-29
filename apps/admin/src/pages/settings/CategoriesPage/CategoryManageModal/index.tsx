import {
  ModalBackground,
  Input,
  BasicButton,
  CheckButton,
  Dropdown,
} from '@repo/ui/components';
import * as S from '@/pages/settings/CategoriesPage/CategoryManageModal/categoryManageModal.style';
import { theme } from '@repo/ui';
import { CloseIcon } from '@repo/ui/icons';
import { useState, useEffect } from 'react';
import { CategoryTimeRangeModal } from '@/pages/settings/CategoriesPage/CategoryTimeRangeModal';
import type { ICategory, IUpdateCategoryRequest } from '@repo/api/types';
import {
  queryKeys,
  usePostCreateCategory,
  usePutUpdateCategory,
} from '@repo/api/queries';
import { DAYS } from '@/constants/days';
import { formatTimeDisplay } from '@repo/util/time';
import { useQueryClient } from '@repo/api/tanstack-query';
import { toast } from '@repo/feature/utils';

interface Props {
  onClose: () => void;
  categoryData?: ICategory;
  shopSeq: number;
}
export const CategoryManageModal = ({
  onClose,
  categoryData,
  shopSeq,
}: Props) => {
  const isEdit = !!categoryData;
  const queryClient = useQueryClient();
  const createCategoryMutation = usePostCreateCategory();
  const updateCategoryMutation = usePutUpdateCategory();

  // 카테고리 이름 상태 관리
  const [categoryName, setCategoryName] = useState<string>(
    isEdit && categoryData?.localeCategoryName?.['KO']
      ? categoryData.localeCategoryName['KO']
      : (categoryData as ICategory)?.categoryName || ''
  );

  // 카테고리 설명 상태 관리
  const [categoryDescription, setCategoryDescription] = useState<string>(
    (categoryData as ICategory)?.categoryDescription || ''
  );

  //판매 시간 설정 모달
  const [isTimeRangeModalOpen, setIsTimeRangeModalOpen] = useState(false);

  //판매 요일 선택 (일반 요일만 관리) - day.label로 저장
  const [selectedDays, setSelectedDays] = useState<string[]>(
    isEdit ? [] : DAYS.map((day) => day.label) // 생성 시 모든 요일 선택
  );

  //공휴일 판매 여부
  //TODO : 카테고리 생성할 때 공휴일 무조건 true로 생성
  const [isSaleOnHoliday, setIsSaleOnHoliday] = useState<boolean>(
    (categoryData as ICategory)?.isSaleOnHoliday ?? true // 생성 시 기본값 true
  );

  // 추가 설정 상태 관리

  //수량 선택 사용
  const [isQuantitySelectable, setIsQuantitySelectable] = useState<boolean>(
    (categoryData as ICategory)?.isQuantitySelectable ?? false
  );

  //직원호출 사용
  const [isStaffCall, setIsStaffCall] = useState<boolean>(
    (categoryData as ICategory)?.isStaffCall ?? false
  );

  //2열 배치(가로 기본형)
  const [useTwoColumnLayout, setUseTwoColumnLayout] = useState<boolean>(
    (categoryData as ICategory)?.useTwoColumnLayout ?? false
  );

  // 언어 선택 상태
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<
    'KO' | 'JP' | 'CH' | 'EN' | 'RU'
  >('KO');

  // 판매 시간 설정
  const [useSaleTime, setUseSaleTime] = useState<boolean>(
    (categoryData as ICategory)?.useSaleTime ?? false
  );
  // 수정 모드: 초기값 "0000", 생성 모드: 빈 문자열
  const [saleStartTime, setSaleStartTime] = useState<string>(
    isEdit ? ((categoryData as ICategory)?.saleStartTime ?? '') : ''
  );
  const [saleEndTime, setSaleEndTime] = useState<string>(
    isEdit ? ((categoryData as ICategory)?.saleEndTime ?? '') : ''
  );

  // 표시할 시간 값 계산
  const getDisplayTime = (): string => {
    // 생성 모드: 값이 있으면 표시, 없으면 placeholder "00 : 00 - 00 : 00"
    // 수정 모드: 값이 있으면 표시, 없으면 "00 : 00 - 00 : 00"
    if (saleStartTime && saleEndTime) {
      return `${formatTimeDisplay(saleStartTime, ' : ')} - ${formatTimeDisplay(saleEndTime, ' : ')}`;
    }
    return '00 : 00 - 00 : 00';
  };

  // 수정 모드일 때 기존 데이터로 초기화
  useEffect(() => {
    if (isEdit && categoryData) {
      const category = categoryData as ICategory;
      // 판매 요일 초기화 (null이나 undefined일 경우 빈 배열로 처리)
      const existingDays = category.saleDayOfWeek ?? [];
      const dayLabels = existingDays
        .map((dayValue) => DAYS.find((d) => d.value === dayValue)?.label)
        .filter((label): label is string => label !== undefined);
      setSelectedDays(dayLabels);
      // 판매 시간 설정 초기화
      setUseSaleTime(category.useSaleTime ?? false);
      // 초기 언어 코드 설정
      if (category.selectedLanguageCode) {
        setSelectedLanguageCode(category.selectedLanguageCode);
      }
    }
  }, [isEdit, categoryData]);

  // 선택된 언어가 변경될 때 해당 언어의 카테고리 이름으로 업데이트
  useEffect(() => {
    if (isEdit && categoryData?.localeCategoryName && selectedLanguageCode) {
      const categoryNameForLanguage =
        categoryData.localeCategoryName[selectedLanguageCode] || '';
      if (categoryNameForLanguage) {
        setCategoryName(categoryNameForLanguage);
      }
    }
  }, [selectedLanguageCode, isEdit, categoryData]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // 완료 버튼 핸들러
  const handleSubmit = async () => {
    if (categoryName === '') {
      toast('카테고리 이름을 입력해주세요.');
      return;
    }

    // Convert selectedDays (string labels) to numbers
    const saleDayOfWeekNumbers = selectedDays
      .map((label) => DAYS.find((day) => day.label === label)?.value ?? -1)
      .filter((value) => value !== -1);

    // 모든 요일이 선택되어 있고 공휴일 판매가 true면 useSaleDay는 false, 그 외에는 true
    const allDaysSelected = selectedDays.length === DAYS.length;
    const useSaleDay = !(allDaysSelected && isSaleOnHoliday);

    try {
      if (isEdit) {
        // 수정 모드
        const category = categoryData as ICategory;
        const updateData: IUpdateCategoryRequest = {
          ...category,
          categoryName: categoryName || category.categoryName,
          saleDayOfWeek: saleDayOfWeekNumbers,
          saleStartTime,
          saleEndTime,
          isSaleOnHoliday,
          useTwoColumnLayout,
          isQuantitySelectable,
          isStaffCall,
          categoryDescription,
          selectedLanguageCode,
          useSaleDay,
          useSaleTime,
        };
        await updateCategoryMutation.mutateAsync(updateData);
        queryClient.invalidateQueries({ queryKey: queryKeys.category.list() });
      } else {
        await createCategoryMutation.mutateAsync({
          shopSeq,
          categoryName,
          saleDayOfWeek:
            saleDayOfWeekNumbers.length > 0 ? saleDayOfWeekNumbers : null,
          saleStartTime: saleStartTime || null,
          saleEndTime: saleEndTime || null,
          isSaleOnHoliday,
          useTwoColumnLayout,
          isQuantitySelectable,
          isStaffCall,
          categoryDescription: categoryDescription || null,
          isFirstOrderRequired: false,
          selectedLanguageCode: selectedLanguageCode,
          useSaleDay,
          useSaleTime,
        });
        queryClient.invalidateQueries({ queryKey: queryKeys.category.list() });
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ModalBackground onClick={onClose}>
        <S.Container>
          <S.CloseButton type="button" onClick={onClose}>
            <CloseIcon width={32} height={32} color={theme.colors.grey[600]} />
          </S.CloseButton>

          {/* 수정일때만 언어 선택 드롭다운 노출 */}
          {isEdit && (
            <S.DropdownContainer>
              <Dropdown
                options={[
                  { value: 'KO', label: '한국어' },
                  { value: 'JP', label: '일본어' },
                  { value: 'CH', label: '중국어' },
                  { value: 'EN', label: '영어' },
                  { value: 'RU', label: '러시아어' },
                ]}
                value={selectedLanguageCode}
                onChange={(value) =>
                  setSelectedLanguageCode(
                    value as 'KO' | 'JP' | 'CH' | 'EN' | 'RU'
                  )
                }
              />
            </S.DropdownContainer>
          )}

          <S.Title>
            <p>카테고리 {isEdit ? '수정' : '추가'}</p>
          </S.Title>

          <S.Content>
            <div>
              <S.SubTitle>
                카테고리 이름 <span>*</span>
              </S.SubTitle>
              <Input
                placeholder="카테고리 이름을 입력해주세요."
                value={categoryName}
                onChange={(value) => setCategoryName(value)}
              />
            </div>

            <Input
              placeholder="카테고리 설명을 입력해주세요."
              value={categoryDescription}
              onChange={(value) => setCategoryDescription(value)}
            />

            <div>
              <S.SubTitle>판매 요일</S.SubTitle>
              <S.DayList>
                {DAYS.map((day) => (
                  <li key={day.value}>
                    <BasicButton
                      variant={
                        selectedDays.includes(day.label)
                          ? 'Solid_Sky_Blue_L'
                          : 'Outline_Grey_L'
                      }
                      key={day.value}
                      customStyle={S.dayCss}
                      onClick={() => toggleDay(day.label)}
                    >
                      {day.label}
                    </BasicButton>
                  </li>
                ))}
                <li>
                  <BasicButton
                    variant={
                      isSaleOnHoliday ? 'Solid_Sky_Blue_L' : 'Outline_Grey_L'
                    }
                    customStyle={S.dayCss}
                    onClick={() => setIsSaleOnHoliday((prev) => !prev)}
                  >
                    공휴일
                  </BasicButton>
                </li>
              </S.DayList>
            </div>

            <div>
              <S.SubTitle>추가 설정</S.SubTitle>
              <S.CheckButtonList>
                <CheckButton
                  checked={isQuantitySelectable}
                  onChange={(checked) => setIsQuantitySelectable(checked)}
                  customStyle={S.checkButtonCss}
                >
                  <p>수량선택 사용</p>
                </CheckButton>
                <CheckButton
                  checked={isStaffCall}
                  onChange={(checked) => setIsStaffCall(checked)}
                  customStyle={S.checkButtonCss}
                >
                  <p>직원호출 사용</p>
                </CheckButton>
                <CheckButton
                  checked={useTwoColumnLayout}
                  onChange={(checked) => setUseTwoColumnLayout(checked)}
                  customStyle={S.checkButtonCss}
                >
                  <p>2열 배치(가로 기본형)</p>
                </CheckButton>
                <S.TimeRangeWrapper>
                  <CheckButton
                    checked={useSaleTime}
                    onChange={(checked) => setUseSaleTime(checked)}
                    customStyle={S.checkButtonCss}
                  >
                    <p>판매 시간 설정</p>
                  </CheckButton>
                  <S.TimeRangeContainer>
                    <S.TimeRangeDisplay
                      hasValue={!!(saleStartTime && saleEndTime)}
                      onClick={() => setIsTimeRangeModalOpen(true)}
                    >
                      {getDisplayTime()}
                    </S.TimeRangeDisplay>
                  </S.TimeRangeContainer>
                </S.TimeRangeWrapper>
              </S.CheckButtonList>
            </div>

            <BasicButton variant="Solid_Navy_2XL" onClick={handleSubmit}>
              {createCategoryMutation.isPending ||
              updateCategoryMutation.isPending
                ? '처리 중...'
                : '완료'}
            </BasicButton>
          </S.Content>
        </S.Container>
      </ModalBackground>

      {isTimeRangeModalOpen && (
        <CategoryTimeRangeModal
          onClose={() => setIsTimeRangeModalOpen(false)}
          categoryData={
            categoryData
              ? {
                  ...(categoryData as ICategory),
                  saleStartTime,
                  saleEndTime,
                }
              : ({
                  saleStartTime,
                  saleEndTime,
                } as ICategory)
          }
          onTimeChange={(startTime, endTime) => {
            setSaleStartTime(startTime);
            setSaleEndTime(endTime);
          }}
        />
      )}
    </>
  );
};
