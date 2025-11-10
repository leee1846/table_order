import { categories } from '@/constants/mock';
import { BasicButton, ToggleButton } from '@repo/ui/components';
import { css } from '@emotion/react';
import * as S from '@/pages/settings/CategoriesPage/Categories/Category/category.style';
import { ChevronForwardIcon, DeleteIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';

interface Props {
  category: (typeof categories)[number];
}

export const Category = ({ category }: Props) => {
  return (
    <S.Container>
      <S.Header>
        <div>
          <span>{category.name}</span>
          <button type="button" onClick={() => {}}>
            <ChevronForwardIcon
              width={30}
              height={30}
              color={theme.colors.grey[400]}
            />
          </button>
        </div>
        <button type="button" onClick={() => {}}>
          <DeleteIcon width={14} height={14} color={theme.colors.grey[600]} />
        </button>
      </S.Header>

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
          <ToggleButton size="S" isOn={category.isHidden} onChange={() => {}} />
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
    </S.Container>
  );
};
