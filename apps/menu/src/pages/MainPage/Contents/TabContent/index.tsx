import { SIDEBAR_CATEGORY_TAB_CLICK_EVENT_KEY } from '@/constants/keys';
import type { TGetCategoryListResponse } from '@repo/api/types';
import { useState, useEffect } from 'react';
import * as S from '@/pages/MainPage/Contents/ScrollContent/scrollContent.style';
import { CategoryItem } from '../CategoryItem';

interface Props {
  categories: TGetCategoryListResponse;
}

export const TabContent = ({ categories }: Props) => {
  const [selectedCategorySeq, setSelectedCategorySeq] = useState(
    categories.data[0]?.categorySeq || 0
  );

  const selectedCategory = categories.data.find(
    (category) => category.categorySeq === selectedCategorySeq
  );

  /**
   * Sidebar 컴포넌트에서 발생시킨 카테고리 선택 이벤트를 받아서
   * 현재 선택된 카테고리를 업데이트
   */
  useEffect(() => {
    /** Sidebar에서 카테고리를 클릭했을 때 호출됨 */
    const handleCategoryChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ seq: number }>;
      setSelectedCategorySeq(customEvent.detail.seq);
    };

    // 모든 카테고리에 대한 선택 이벤트 리스너 등록
    // 어떤 카테고리를 클릭해도 이벤트를 받을 수 있도록 모든 카테고리를 리스닝
    categories.data.forEach((category) => {
      window.addEventListener(
        SIDEBAR_CATEGORY_TAB_CLICK_EVENT_KEY(category.categorySeq),
        handleCategoryChange
      );
    });

    // Cleanup: 컴포넌트 언마운트 또는 의존성 변경 시 실행
    return () => {
      // 모든 이벤트 리스너 제거
      categories.data.forEach((category) => {
        window.removeEventListener(
          SIDEBAR_CATEGORY_TAB_CLICK_EVENT_KEY(category.categorySeq),
          handleCategoryChange
        );
      });
    };
  }, [categories]);

  return (
    <S.Container>
      {selectedCategory && (
        <div>
          <CategoryItem category={selectedCategory} />
        </div>
      )}
    </S.Container>
  );
};
