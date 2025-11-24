import {
  SIDEBAR_CATEGORY_TAB_CLICK_EVENT_KEY,
  SCROLL_CATEGORY_VISIBLE_EVENT_KEY,
} from '@/constants/keys';
import { categories } from '@/constants/mock';
import { useState, useEffect, useRef } from 'react';
import * as S from '@/pages/MainPage/Sidebar/sidebar.style';
import { CallBellIcon } from '@repo/ui/icons';
import { baseTheme } from '@repo/ui';

interface Props {
  categories: typeof categories;
  useScrollLayout: boolean;
}

export const Sidebar = ({ categories, useScrollLayout }: Props) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories?.[0]?.id || 0
  );

  /**
   * Intersection Observer의 이벤트를 일시적으로 무시할지 여부
   * 사용자가 직접 카테고리를 클릭했을 때, 스크롤 중 발생하는 observer 이벤트를 무시하기 위해 사용
   */
  const shouldIgnoreScrollObserverRef = useRef(false);

  /**
   * 스크롤 애니메이션 타이머 참조
   * 스크롤 완료 후 observer 이벤트를 다시 활성화하기 위한 타이머
   */
  const scrollAnimationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  /**
   * 스크롤 모드: 해당 카테고리 섹션으로 부드럽게 스크롤
   * @param categoryId - 스크롤할 카테고리 ID
   */
  const scrollToCategorySection = (categoryId: number) => {
    const sectionElement = document.getElementById(`category-${categoryId}`);

    if (sectionElement) {
      // 화면 상단에 배치하여 Intersection Observer의 관찰 영역에 확실히 들어가도록 함
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * Intersection Observer 이벤트를 일시적으로 비활성화
   * 사용자가 직접 클릭하여 스크롤할 때, 스크롤 중 발생하는 observer 이벤트로 인한
   * 의도하지 않은 카테고리 변경을 방지
   */
  const temporarilyDisableScrollObserver = () => {
    shouldIgnoreScrollObserverRef.current = true;

    // 이전 타이머가 있다면 제거 (연속 클릭 대응)
    if (scrollAnimationTimerRef.current) {
      clearTimeout(scrollAnimationTimerRef.current);
    }

    // 스크롤 애니메이션이 완료될 시간 후 observer 이벤트를 다시 활성화
    scrollAnimationTimerRef.current = setTimeout(() => {
      shouldIgnoreScrollObserverRef.current = false;
      scrollAnimationTimerRef.current = null;
    }, 800);
  };

  /**
   * 탭 모드: 선택된 카테고리를 변경하고 커스텀 이벤트를 발생시킴
   * @param categoryId - 선택할 카테고리 ID
   */
  const switchCategoryTab = (categoryId: number) => {
    setSelectedCategoryId(categoryId);

    // MenuContent 컴포넌트에서 수신할 커스텀 이벤트 발생
    window.dispatchEvent(
      new CustomEvent(SIDEBAR_CATEGORY_TAB_CLICK_EVENT_KEY(categoryId), {
        detail: { id: categoryId },
      })
    );
  };

  /**
   * 카테고리 버튼 클릭 핸들러
   * 현재 레이아웃 모드(스크롤/탭)에 따라 다르게 동작
   */
  const handleCategoryClick = (category: (typeof categories)[number]) => {
    if (useScrollLayout) {
      // 스크롤 모드: 해당 카테고리 섹션으로 스크롤
      setSelectedCategoryId(category.id);
      scrollToCategorySection(category.id);
      temporarilyDisableScrollObserver();
    } else {
      // 탭 모드: 카테고리 탭 전환
      switchCategoryTab(category.id);
    }
  };

  /**
   * 스크롤 모드일 때만 실행되는 Effect
   * Intersection Observer가 발생시키는 이벤트를 수신하여
   * 현재 화면에 보이는 카테고리에 따라 사이드바의 활성 카테고리를 자동으로 업데이트
   */
  useEffect(() => {
    // 탭 모드에서는 실행하지 않음
    if (!useScrollLayout) {
      return;
    }

    /**
     * Intersection Observer 이벤트 핸들러
     * 스크롤 중 화면에 보이는 카테고리가 변경될 때 호출됨
     */
    const handleIntersectionEvent = (event: Event) => {
      // 사용자가 카테고리를 직접 클릭하여 스크롤 중이면 이벤트 무시
      if (shouldIgnoreScrollObserverRef.current) {
        return;
      }

      const customEvent = event as CustomEvent<{ id: number }>;
      const newCategoryId = customEvent.detail.id;

      // 이전 카테고리 ID와 다를 때만 상태 업데이트 (불필요한 리렌더링 방지)
      setSelectedCategoryId((prevCategoryId) => {
        return prevCategoryId === newCategoryId
          ? prevCategoryId
          : newCategoryId;
      });
    };

    // 모든 카테고리에 대한 intersection 이벤트 리스너 등록
    categories.forEach((category) => {
      window.addEventListener(
        SCROLL_CATEGORY_VISIBLE_EVENT_KEY(category.id),
        handleIntersectionEvent
      );
    });

    // Cleanup: 컴포넌트 언마운트 또는 의존성 변경 시 실행
    return () => {
      // 진행 중인 타이머 정리 (탭 모드로 전환되어도 실행되어야 함)
      if (scrollAnimationTimerRef.current) {
        clearTimeout(scrollAnimationTimerRef.current);
      }

      // 모든 이벤트 리스너 제거
      categories.forEach((category) => {
        window.removeEventListener(
          SCROLL_CATEGORY_VISIBLE_EVENT_KEY(category.id),
          handleIntersectionEvent
        );
      });
    };
  }, [useScrollLayout, categories]);

  return (
    <S.Container>
      {categories.map((category) => (
        <S.CategoryButton
          isActive={selectedCategoryId === category.id}
          key={category.id}
          type="button"
          onClick={() => handleCategoryClick(category)}
        >
          {category.name}
        </S.CategoryButton>
      ))}

      <S.StaffCall>
        <button type="button">
          <CallBellIcon color={baseTheme.colors.white} width={30} height={30} />
          직원 호출
        </button>
      </S.StaffCall>
    </S.Container>
  );
};
