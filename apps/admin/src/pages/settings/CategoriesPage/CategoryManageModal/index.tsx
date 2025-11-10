import {
  ModalBackground,
  Input,
  BasicButton,
  CheckButton,
} from '@repo/ui/components';
import * as S from '@/pages/settings/CategoriesPage/CategoryManageModal/categoryManageModal.style';
import { theme } from '@repo/ui';
import { CloseIcon } from '@repo/ui/icons';
import { useState } from 'react';
import { css } from '@emotion/react';
import { CategoryTimeRangeModal } from '@/pages/settings/CategoriesPage/CategoryTimeRangeModal';

const days = ['월', '화', '수', '목', '금', '토', '일'];
const checkButtonCss = css`
  & > div {
    width: 1.625rem;
    height: 1.625rem;
  }
`;

interface Props {
  onClose: () => void;
  /**
   * 카테고리 수정 시 타입 추가해야함
   */
  categoryData?: unknown;
}
export const CategoryManageModal = ({ onClose, categoryData }: Props) => {
  const isEdit = !!categoryData;

  const [isTimeRangeModalOpen, setIsTimeRangeModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const dayCss = (day: string) => css`
    width: 100%;
    height: 60px;
    border-color: ${selectedDays.includes(day)
      ? theme.colors.primary[400]
      : theme.colors.grey[400]};
  `;

  return (
    <>
      <ModalBackground onClick={onClose}>
        <S.Container>
          <S.CloseButton type="button" onClick={onClose}>
            <CloseIcon width={32} height={32} color={theme.colors.grey[600]} />
          </S.CloseButton>

          <S.Title>
            <p>카테고리 {isEdit ? '수정' : '추가'}</p>
          </S.Title>

          <S.Content>
            <div>
              <S.SubTitle>
                카테고리 이름 <span>*</span>
              </S.SubTitle>
              <Input placeholder="카테고리 이름을 입력해주세요." />
            </div>

            <Input placeholder="카테고리 설명을 입력해주세요." />

            <div>
              <S.SubTitle>판매 요일</S.SubTitle>
              <S.DayList>
                <li>
                  <BasicButton
                    variant="Outline_Grey_L"
                    customStyle={dayCss('매일')}
                  >
                    매일
                  </BasicButton>
                </li>
                {days.map((day) => (
                  <li key={day}>
                    <BasicButton
                      variant={
                        selectedDays.includes(day)
                          ? 'Solid_Sky_Blue_L'
                          : 'Outline_Grey_L'
                      }
                      key={day}
                      customStyle={dayCss(day)}
                      onClick={() => setSelectedDays([...selectedDays, day])}
                    >
                      {day}
                    </BasicButton>
                  </li>
                ))}
              </S.DayList>
            </div>

            <div>
              <S.SubTitle>추가 설정</S.SubTitle>
              <S.CheckButtonList>
                <CheckButton
                  id="count-selection"
                  checked={false}
                  onChange={() => {}}
                  customStyle={checkButtonCss}
                >
                  <p>수량선택 사용</p>
                </CheckButton>
                <CheckButton
                  id="staff-call"
                  checked={false}
                  onChange={() => {}}
                  customStyle={checkButtonCss}
                >
                  <p>직원호출 사용</p>
                </CheckButton>
                <CheckButton
                  id="two-column-layout"
                  checked={false}
                  onChange={() => {}}
                  customStyle={checkButtonCss}
                >
                  <p>2열 배치(가로 기본형)</p>
                </CheckButton>
                <CheckButton
                  id="time-range-setting"
                  checked={isTimeRangeModalOpen}
                  onChange={(checked) => setIsTimeRangeModalOpen(checked)}
                  customStyle={checkButtonCss}
                >
                  <p>판매 시간 설정</p>
                </CheckButton>
              </S.CheckButtonList>
            </div>

            <BasicButton variant="Solid_Navy_2XL">완료</BasicButton>
          </S.Content>
        </S.Container>
      </ModalBackground>

      {isTimeRangeModalOpen && (
        <CategoryTimeRangeModal
          onClose={() => setIsTimeRangeModalOpen(false)}
        />
      )}
    </>
  );
};
