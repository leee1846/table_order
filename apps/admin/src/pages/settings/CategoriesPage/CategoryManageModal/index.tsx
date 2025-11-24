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
import { useId, useState } from 'react';
import { CategoryTimeRangeModal } from '@/pages/settings/CategoriesPage/CategoryTimeRangeModal';
import type { ICategory } from '@repo/api/types';
import { usePutUpdateCategory } from '@repo/api/queries';

const days = [
  { value: 0, label: '월' },
  { value: 1, label: '화' },
  { value: 2, label: '수' },
  { value: 3, label: '목' },
  { value: 4, label: '금' },
  { value: 5, label: '토' },
  { value: 6, label: '일' },
];

interface Props {
  onClose: () => void;
  /**
   * 카테고리 수정 시 타입 추가해야함
   */
  categoryData?: unknown;
}
export const CategoryManageModal = ({ onClose, categoryData }: Props) => {
  const COUNT_SELECTION_ID = `count-selection-${useId()}`;
  const STAFF_CALL_ID = `staff-call-${useId()}`;
  const TWO_COLUMN_LAYOUT_ID = `two-column-layout-${useId()}`;
  const TIME_RANGE_SETTING_ID = `time-range-setting-${useId()}`;

  const isEdit = !!categoryData;
  const updateCategoryMutation = usePutUpdateCategory();

  // 카테고리 이름 상태 관리
  const [categoryName, setCategoryName] = useState<string>(
    (categoryData as ICategory)?.categoryName
  );

  // 카테고리 설명 상태 관리
  const [categoryDescription, setCategoryDescription] = useState<string>(
    (categoryData as ICategory)?.categoryDescription || ''
  );

  //판매 시간 설정 모달
  const [isTimeRangeModalOpen, setIsTimeRangeModalOpen] = useState(false);

  //판매 요일 선택 (일반 요일만 관리) - day.label로 저장
  //TODO : 카테고리 생성할 때 모든 값을 선택하게 하고, useSaleDay 값을 false로 설정
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  //공휴일 판매 여부
  //TODO : 카테고리 생성할 때 공휴일 무조건 true로 생성
  const [isSaleOnHoliday, setIsSaleOnHoliday] = useState<boolean>(
    (categoryData as ICategory)?.isSaleOnHoliday
  );

  // 추가 설정 상태 관리

  //수량 선택 사용
  const [isQuantitySelectable, setIsQuantitySelectable] = useState<boolean>(
    (categoryData as ICategory)?.isQuantitySelectable
  );

  //직원호출 사용
  const [isStaffCall, setIsStaffCall] = useState<boolean>(
    (categoryData as ICategory)?.isStaffCall
  );

  //2열 배치(가로 기본형)
  const [useTwoColumnLayout, setUseTwoColumnLayout] = useState<boolean>(
    (categoryData as ICategory)?.useTwoColumnLayout
  );

  // 언어 선택 상태
  const [selectedLanguageCode, setSelectedLanguageCode] =
    useState<string>('KO');

  // 판매 시간 설정 TODO useSaleTime 값 추가
  const [saleStartTime, setSaleStartTime] = useState<string>(
    (categoryData as ICategory)?.saleStartTime
  );
  const [saleEndTime, setSaleEndTime] = useState<string>(
    (categoryData as ICategory)?.saleEndTime
  );

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // 완료 버튼 핸들러
  const handleSubmit = async () => {
    if (!categoryData) {
      // 추가 모드는 아직 구현되지 않음
      return;
    }

    const category = categoryData as ICategory;

    //TODO :  useSaleDay, useSaleTime 값 추가
    try {
      await updateCategoryMutation.mutateAsync({
        categorySeq: category.categorySeq,
        shopSeq: category.shopSeq,
        categoryName: categoryName || category.categoryName,
        index: category.index, //TODO : 위치 바꾸면 수정되게
        mappedCategoryCode: category.mappedCategoryCode,
        isHidden: category.isHidden,
        saleDayOfWeek: selectedDays,
        saleStartTime,
        saleEndTime,
        isSaleOnHoliday,
        useTwoColumnLayout,
        isQuantitySelectable,
        isStaffCall,
        categoryDescription,
        isFirstOrderRequired: category.isFirstOrderRequired,
        menuInfoList: category.menuInfoList,
        selectedLanguageCode,
      });
      onClose();
    } catch (_error) {
      // 에러는 interceptor에서 처리됨
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
                  { value: 'JA', label: '일본어' },
                  { value: 'ZH', label: '중국어' },
                  { value: 'EN', label: '영어' },
                ]}
                value={selectedLanguageCode}
                onChange={(value) => setSelectedLanguageCode(String(value))}
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
                {days.map((day) => (
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
                  id={COUNT_SELECTION_ID}
                  checked={isQuantitySelectable}
                  onChange={(checked) => setIsQuantitySelectable(checked)}
                  customStyle={S.checkButtonCss}
                >
                  <p>수량선택 사용</p>
                </CheckButton>
                <CheckButton
                  id={STAFF_CALL_ID}
                  checked={isStaffCall}
                  onChange={(checked) => setIsStaffCall(checked)}
                  customStyle={S.checkButtonCss}
                >
                  <p>직원호출 사용</p>
                </CheckButton>
                <CheckButton
                  id={TWO_COLUMN_LAYOUT_ID}
                  checked={useTwoColumnLayout}
                  onChange={(checked) => setUseTwoColumnLayout(checked)}
                  customStyle={S.checkButtonCss}
                >
                  <p>2열 배치(가로 기본형)</p>
                </CheckButton>
                <CheckButton
                  id={TIME_RANGE_SETTING_ID}
                  checked={isTimeRangeModalOpen}
                  onChange={(checked) => setIsTimeRangeModalOpen(checked)}
                  customStyle={S.checkButtonCss}
                >
                  <p>판매 시간 설정</p>
                </CheckButton>
              </S.CheckButtonList>
            </div>

            <BasicButton
              variant="Solid_Navy_2XL"
              onClick={handleSubmit}
              disabled={updateCategoryMutation.isPending || !categoryName}
            >
              {updateCategoryMutation.isPending ? '처리 중...' : '완료'}
            </BasicButton>
          </S.Content>
        </S.Container>
      </ModalBackground>

      {isTimeRangeModalOpen && (
        <CategoryTimeRangeModal
          onClose={() => setIsTimeRangeModalOpen(false)}
          categoryData={{
            ...(categoryData as ICategory),
            saleStartTime,
            saleEndTime,
          }}
          onTimeChange={(startTime, endTime) => {
            setSaleStartTime(startTime);
            setSaleEndTime(endTime);
          }}
        />
      )}
    </>
  );
};
