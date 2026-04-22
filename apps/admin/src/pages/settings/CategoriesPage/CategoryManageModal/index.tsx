import { useAdminTranslation } from '@/config/i18n';
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
import { useState, useEffect, useMemo } from 'react';
import { CategoryTimeRangeModal } from '@/pages/settings/CategoriesPage/CategoryTimeRangeModal';
import type {
  ICategory,
  IUpdateCategoryRequest,
  TShopLanguage,
} from '@repo/api/types';
import {
  queryKeys,
  usePostCreateCategory,
  usePutUpdateCategory,
} from '@repo/api/queries';
import { getDays } from '@/constants/days';
import { formatTimeDisplay } from '@repo/util/time';
import { useQueryClient } from '@repo/api/tanstack-query';
import { toast } from '@repo/feature/utils';
import { MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH } from '@repo/util/constants';

/** GET 응답에만 의미 있는 로케일 맵은 PUT 바디에 넣지 않는다(스프레드 시 함께 나가면 서버가 맵을 우선할 수 있음). */
function stripCategoryLocaleFieldsForPut(category: ICategory) {
  const {
    localeCategoryName: _nameByLocale,
    localeCategoryDescription: _descriptionByLocale,
    ...putBase
  } = category;
  return putBase;
}

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
  const { t, i18n } = useAdminTranslation();
  const days = useMemo(() => getDays(t), [t]);
  const isEdit = !!categoryData;
  const queryClient = useQueryClient();
  const createCategoryMutation = usePostCreateCategory();
  const updateCategoryMutation = usePutUpdateCategory();
  // 현재 언어 코드를 안전하게 가져오기
  const currentLanguage: TShopLanguage = useMemo(
    () => (i18n.language?.toUpperCase() || 'KO') as TShopLanguage,
    [i18n]
  );

  // 언어 선택 상태 초기값 계산
  const initialLanguageCode: TShopLanguage = useMemo(() => {
    if (isEdit && categoryData?.selectedLanguageCode) {
      return categoryData.selectedLanguageCode;
    }
    return currentLanguage;
  }, [isEdit, categoryData?.selectedLanguageCode, currentLanguage]);

  // 카테고리 이름 상태 관리
  const [categoryName, setCategoryName] = useState<string>(
    isEdit && categoryData?.localeCategoryName?.['KO']
      ? categoryData.localeCategoryName['KO']
      : (categoryData as ICategory)?.categoryName || ''
  );

  // 카테고리 설명 상태 관리
  const [categoryDescription, setCategoryDescription] = useState<string>(
    isEdit && categoryData?.localeCategoryDescription?.['KO']
      ? categoryData.localeCategoryDescription['KO']
      : (categoryData as ICategory)?.categoryDescription || ''
  );

  //판매 시간 설정 모달
  const [isTimeRangeModalOpen, setIsTimeRangeModalOpen] = useState(false);

  //판매 요일 선택 (일반 요일만 관리) - day.label로 저장
  const [selectedDays, setSelectedDays] = useState<number[]>(
    isEdit ? [] : days.map((day) => day.value) // 생성 시 모든 요일 선택
  );

  //공휴일 판매 여부
  const [isSaleOnHoliday, setIsSaleOnHoliday] = useState<boolean>(
    (categoryData as ICategory)?.isSaleOnHoliday ?? true
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
  const [selectedLanguageCode, setSelectedLanguageCode] =
    useState<TShopLanguage>(initialLanguageCode);

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
      setSelectedDays(existingDays);
      // 판매 시간 설정 초기화
      setUseSaleTime(category.useSaleTime ?? false);
      // 초기 언어 코드 설정
      if (category.selectedLanguageCode) {
        setSelectedLanguageCode(category.selectedLanguageCode);
      }
    }
  }, [categoryData, isEdit]);

  // 선택된 언어가 변경될 때 해당 언어의 카테고리 이름으로 업데이트
  useEffect(() => {
    if (isEdit && categoryData?.localeCategoryName && selectedLanguageCode) {
      const categoryNameForLanguage =
        categoryData.localeCategoryName[selectedLanguageCode] ?? '';
      setCategoryName(categoryNameForLanguage);
    }
  }, [selectedLanguageCode, isEdit, categoryData]);

  // 선택된 언어가 변경될 때 해당 언어의 카테고리 설명으로 업데이트
  useEffect(() => {
    if (
      isEdit &&
      categoryData?.localeCategoryDescription &&
      selectedLanguageCode
    ) {
      const categoryDescriptionForLanguage =
        categoryData.localeCategoryDescription[selectedLanguageCode] ?? '';
      setCategoryDescription(categoryDescriptionForLanguage);
    }
  }, [selectedLanguageCode, isEdit, categoryData]);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  // 직원호출 체크 시 검증 함수
  const handleStaffCallChange = (checked: boolean) => {
    if (checked) {
      // 체크를 활성화하려고 할 때만 검증
      const categoryListData = queryClient.getQueryData(
        queryKeys.category.list()
      ) as { data: ICategory[] };

      if (categoryListData?.data) {
        // 현재 편집 중인 카테고리를 제외한 다른 카테고리 중 isStaffCall이 true인 것이 있는지 확인
        const hasStaffCallCategory = categoryListData.data.some(
          (category) =>
            category.categorySeq !== categoryData?.categorySeq &&
            category.isStaffCall === true
        );

        if (hasStaffCallCategory) {
          toast(t('이미 직원 호출 카테고리가 있습니다'));
          return; // 체크 안 함
        }
      }
    }
    setIsStaffCall(checked);
  };

  // 완료 버튼 핸들러
  const handleSubmit = async () => {
    if (categoryName === '') {
      toast(t('카테고리 이름을 입력해주세요.'));
      return;
    }

    if (useSaleTime && (!saleStartTime || !saleEndTime)) {
      toast(t('판매 시간을 입력해주세요'));
      return;
    }

    if (
      useSaleTime &&
      saleStartTime &&
      saleEndTime &&
      saleStartTime === saleEndTime
    ) {
      toast(t('판매 시간의 시작 시간과 종료 시간을 다르게 입력해주세요'));
      return;
    }

    const saleDayOfWeekNumbers = [...selectedDays].sort((a, b) => a - b);

    // 모든 요일이 선택되어 있고 공휴일 판매가 true면 useSaleDay는 false, 그 외에는 true
    const allDaysSelected = selectedDays.length === days.length;
    const useSaleDay = !(allDaysSelected && isSaleOnHoliday);

    if (isEdit) {
      // 수정 모드
      const category = categoryData as ICategory;
      const updateData: IUpdateCategoryRequest = {
        ...stripCategoryLocaleFieldsForPut(category),
        categoryName: categoryName || category.categoryName,
        saleDayOfWeek: saleDayOfWeekNumbers,
        saleStartTime,
        saleEndTime,
        isSaleOnHoliday,
        useTwoColumnLayout,
        isQuantitySelectable,
        isStaffCall,
        categoryDescription: categoryDescription || null,
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
          saleDayOfWeekNumbers.length > 0 ? saleDayOfWeekNumbers : [],
        saleStartTime: saleStartTime || null,
        saleEndTime: saleEndTime || null,
        isSaleOnHoliday,
        useTwoColumnLayout,
        isQuantitySelectable,
        isStaffCall,
        categoryDescription: categoryDescription || null,
        isFirstOrderRequired: false,
        selectedLanguageCode,
        useSaleDay,
        useSaleTime,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.category.list() });
    }
    onClose();
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
                  { value: 'KO', label: t('한국어') },
                  { value: 'JP', label: t('일본어') },
                  { value: 'CH', label: t('중국어') },
                  { value: 'EN', label: t('영어') },
                  {
                    value: 'RU',
                    label: t('러시아어'),
                  },
                ]}
                value={selectedLanguageCode}
                onChange={(value) =>
                  setSelectedLanguageCode(value as TShopLanguage)
                }
              />
            </S.DropdownContainer>
          )}

          <S.Title>
            <p>
              {t('카테고리')} {isEdit ? t('수정') : t('추가')}
            </p>
          </S.Title>

          <S.Content>
            <div>
              <S.SubTitle>
                {t('카테고리 이름')}
                <span>*</span>
              </S.SubTitle>

              <Input
                placeholder={t('카테고리 이름을 입력해주세요.')}
                value={categoryName}
                onChange={(value) => {
                  if (value.length <= MAX_NAME_LENGTH) {
                    setCategoryName(value);
                  }
                }}
              />
            </div>

            <Input
              placeholder={t('카테고리 설명을 입력해주세요.')}
              value={categoryDescription}
              onChange={(value) => {
                if (value.length <= MAX_DESCRIPTION_LENGTH) {
                  setCategoryDescription(value);
                }
              }}
            />

            <div>
              <S.SubTitle>{t('판매 요일')}</S.SubTitle>
              <S.DayList>
                {days.map((day) => (
                  <li key={day.value}>
                    <BasicButton
                      variant={
                        selectedDays.includes(day.value)
                          ? 'Solid_Sky_Blue_L'
                          : 'Outline_Grey_L'
                      }
                      customStyle={S.dayCss}
                      onClick={() => toggleDay(day.value)}
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
                    {t('공휴일')}
                  </BasicButton>
                </li>
              </S.DayList>
            </div>

            <div>
              <S.SubTitle>{t('추가 설정')}</S.SubTitle>
              <S.CheckButtonList>
                <CheckButton
                  checked={isQuantitySelectable}
                  onChange={(checked) => setIsQuantitySelectable(checked)}
                  customStyle={S.checkButtonCss}
                >
                  <p>{t('수량선택 사용')}</p>
                </CheckButton>

                <CheckButton
                  checked={isStaffCall}
                  onChange={handleStaffCallChange}
                  customStyle={S.checkButtonCss}
                >
                  <p>{t('직원호출 사용')}</p>
                </CheckButton>

                <CheckButton
                  checked={useTwoColumnLayout}
                  onChange={(checked) => setUseTwoColumnLayout(checked)}
                  customStyle={S.checkButtonCss}
                >
                  <p>{t('2열 배치(가로 기본형)')}</p>
                </CheckButton>
                <S.TimeRangeWrapper>
                  <CheckButton
                    checked={useSaleTime}
                    onChange={(checked) => setUseSaleTime(checked)}
                    customStyle={S.checkButtonCss}
                  >
                    <p>{t('판매 시간 설정')}</p>
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
                ? t('처리 중...')
                : t('완료')}
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
