import * as S from '@/pages/settings/CategoriesPage/Categories/categories.style';
import { NoContent } from '@/components/NoContent';
import { BasicButton, ToggleButton } from '@repo/ui/components';
import { css } from '@emotion/react';

const categories = [
  {
    id: 1,
    name: '카테고리 1',
    startTime: '16:00',
    endTime: '18:00',
    days: ['월', '화', '수', '목', '금', '토', '일'],
    countable: true,
    layout: true,
    isHidden: false,
  },
  {
    id: 2,
    name: '카테고리 2',
    startTime: '03:00',
    endTime: '18:00',
    days: ['월', '화', '토', '일'],
    countable: false,
    layout: false,
    isHidden: true,
  },
  {
    id: 3,
    name: '카테고리 3',
    days: ['월', '화', '수', '목', '금', '토', '일'],
    countable: false,
    layout: true,
    isHidden: false,
  },
  {
    id: 4,
    name: '카테고리 4',
    startTime: '16:00',
    endTime: '18:00',
    days: [],
    countable: true,
    layout: false,
    isHidden: true,
  },
];

export const Categories = () => {
  if (categories.length === 0) {
    return <NoContent>카테고리가 없습니다.</NoContent>;
  }

  return (
    <S.CategoriesContainer>
      {categories.map((category) => (
        <li key={category.id}>
          <div>
            <div>
              <span>{category.name}</span>
            </div>
            <button type="button">삭제</button>
          </div>

          <ul>
            {category.startTime && category.endTime && (
              <li>
                <p>판매시간</p>
                <p>
                  {category.startTime} ~ {category.endTime}
                </p>
              </li>
            )}
            {category.days.length > 0 && (
              <li>
                <p>판매 요일</p>
                <p>{category.days.join(', ')}</p>
              </li>
            )}
            {category.countable && (
              <li>
                <p>수량 선택</p>
                <p>가능</p>
              </li>
            )}
            {category.layout && (
              <li>
                <p>보기 옵션</p>
                <p>2열</p>
              </li>
            )}
          </ul>

          <div>
            <div>
              <p>메뉴판에서 숨기기</p>
              <ToggleButton
                size="S"
                isOn={category.isHidden}
                onChange={() => {}}
              />
            </div>

            <div>
              <BasicButton
                variant="Solid_Navy_L"
                onClick={() => {}}
                customStyle={css`
                  width: 7.53125rem;
                `}
              >
                테이블 지정
              </BasicButton>
              <BasicButton
                variant="Solid_Sky_Blue_L"
                onClick={() => {}}
                customStyle={css`
                  width: 7.53125rem;
                `}
              >
                수정하기
              </BasicButton>
            </div>
          </div>
        </li>
      ))}
    </S.CategoriesContainer>
  );
};
