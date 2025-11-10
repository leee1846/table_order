import { useState } from 'react';
import { categories } from '@/constants/mock';
import { BasicButton, ToggleButton } from '@repo/ui/components';
import * as S from '@/pages/settings/CategoriesPage/Categories/Category/category.style';
import { ChevronForwardIcon, DeleteIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { CategoryManageModal } from '@/pages/settings/CategoriesPage/CategoryManageModal';

interface Props {
  category: (typeof categories)[number];
}

export const Category = ({ category }: Props) => {
  const [isCategoryManageModalOpen, setIsCategoryManageModalOpen] =
    useState(false);

  return (
    <>
      <S.Container>
        <S.Header>
          <div>
            <span>{category.name}</span>
            <button
              type="button"
              onClick={() => {
                // noop
              }}
            >
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
              // noop
            }}
          >
            <DeleteIcon width={14} height={14} color={theme.colors.grey[600]} />
          </button>
        </S.Header>

        <S.Badges>
          {category.startTime && category.endTime && (
            <li>
              <p>판매시간</p>
              <p>
                {category.startTime} ~ {category.endTime}
                {/* TODO: 상시 표시 추가해야함 (24시간 표시) */}
              </p>
            </li>
          )}
          {category.days.length > 0 && (
            <li>
              <p>판매 요일</p>
              <p>{category.days.join(', ')}</p>
              {/* TODO: 매일 표시 추가해야함 (매일 표시) */}
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
        />
      )}
    </>
  );
};
