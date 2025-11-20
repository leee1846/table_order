import { SIDEBAR_CATEGORY_TAB_CLICK_EVENT_KEY } from '@/constants/keys';
import { categories } from '@/constants/mock';
import { useState, useEffect } from 'react';
import * as S from '@/pages/MainPage/Contents/ScrollContent/scrollContent.style';

interface Props {
  categories: typeof categories;
}

export const TabContent = ({ categories }: Props) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories?.[0]?.id || 0
  );

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId
  );

  /**
   * Sidebar 컴포넌트에서 발생시킨 카테고리 선택 이벤트를 받아서
   * 현재 선택된 카테고리를 업데이트
   */
  useEffect(() => {
    /** Sidebar에서 카테고리를 클릭했을 때 호출됨 */
    const handleCategoryChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: number }>;
      setSelectedCategoryId(customEvent.detail.id);
    };

    // 모든 카테고리에 대한 선택 이벤트 리스너 등록
    // 어떤 카테고리를 클릭해도 이벤트를 받을 수 있도록 모든 카테고리를 리스닝
    categories.forEach((category) => {
      window.addEventListener(
        SIDEBAR_CATEGORY_TAB_CLICK_EVENT_KEY(category.id),
        handleCategoryChange
      );
    });

    // Cleanup: 컴포넌트 언마운트 또는 의존성 변경 시 실행
    return () => {
      // 모든 이벤트 리스너 제거
      categories.forEach((category) => {
        window.removeEventListener(
          SIDEBAR_CATEGORY_TAB_CLICK_EVENT_KEY(category.id),
          handleCategoryChange
        );
      });
    };
  }, [categories]);

  return (
    <S.Container>
      {selectedCategory && (
        <div>
          <p>{selectedCategory.name}</p>
          <div>
            {selectedCategory.menus.map((menu) => (
              <div key={menu.id}>{menu.name}</div>
            ))}
          </div>
        </div>
      )}
    </S.Container>
  );
};
