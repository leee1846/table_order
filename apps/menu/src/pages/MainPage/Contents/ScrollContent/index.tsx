import { SCROLL_CATEGORY_VISIBLE_EVENT_KEY } from '@/constants/keys';
import type { TGetCategoryListResponse } from '@repo/api/types';
import { useRef, useEffect } from 'react';
import * as S from '@/pages/MainPage/Contents/ScrollContent/scrollContent.style';
import { createDebounce } from '@repo/util/function';
import { getMinFromArray } from '@repo/util/array';
import { CategoryItem } from '@/pages/MainPage/Contents/CategoryItem';

interface Props {
  categories: TGetCategoryListResponse;
}

/**
 * Intersection Observer 설정
 * 화면에 보이는 카테고리 섹션을 감지하기 위한 옵션
 */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  root: null, // 뷰포트를 기준으로 감지
  rootMargin: '0px 0px -80% 0px', // 화면 상단 20%에서 감지 (스크롤 시 block: 'start'를 사용하므로)
  threshold: [0, 0.1, 0.5, 1.0], // 요소의 가시성 비율에 따라 여러 번 콜백 호출
};

export const ScrollContent = ({ categories }: Props) => {
  /**
   * IntersectionObserver 인스턴스 참조
   * 각 카테고리 섹션의 화면 내 가시성을 감지
   */
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  /**
   * 각 카테고리의 화면 내 가시성 상태를 저장
   * key: 카테고리 ID, value: 화면에 보이는지 여부 (true/false)
   */
  const categoryVisibilityMapRef = useRef<Map<number, boolean>>(new Map());

  /**
   * 마지막으로 이벤트를 발생시킨 카테고리 ID
   * 동일한 카테고리에 대해 중복 이벤트 발생을 방지
   */
  const lastEmittedCategorySeqRef = useRef<number | null>(null);

  useEffect(() => {
    /**
     * 현재 화면에 보이는 카테고리 중 가장 위쪽 카테고리의 이벤트를 발생시킴
     * Sidebar 컴포넌트에서 이 이벤트를 수신하여 활성 카테고리를 업데이트
     */
    const emitActiveCategoryEvent = () => {
      // 현재 화면에 보이는 모든 카테고리 ID를 추출
      const visibleCategorySeqs = Array.from(
        categoryVisibilityMapRef.current.entries()
      )
        .filter(([_, isVisible]) => isVisible)
        .map(([categorySeq]) => categorySeq);

      // 화면에 보이는 카테고리가 없으면 이벤트를 발생시키지 않음
      if (visibleCategorySeqs.length === 0) {
        return;
      }

      // 여러 카테고리가 보일 경우, 가장 작은 ID (가장 위쪽)를 선택
      const topVisibleCategorySeq = getMinFromArray(visibleCategorySeqs);

      // 이전에 발생시킨 이벤트와 동일한 카테고리면 중복 이벤트 발생 방지
      const shouldEmitEvent =
        topVisibleCategorySeq !== null &&
        lastEmittedCategorySeqRef.current !== topVisibleCategorySeq;

      if (shouldEmitEvent) {
        lastEmittedCategorySeqRef.current = topVisibleCategorySeq;

        // Sidebar 컴포넌트가 수신할 커스텀 이벤트 발생
        window.dispatchEvent(
          new CustomEvent(
            SCROLL_CATEGORY_VISIBLE_EVENT_KEY(topVisibleCategorySeq),
            {
              detail: { seq: topVisibleCategorySeq },
            }
          )
        );
      }
    };

    // 빠른 스크롤 시 과도한 이벤트 발생을 방지하기 위해 디바운스 적용
    const { debouncedFn: debouncedEmitEvent, cleanup: cleanupDebounce } =
      createDebounce(emitActiveCategoryEvent, 100);

    /**
     * IntersectionObserver 콜백 함수
     * 카테고리 섹션이 화면에 들어오거나 나갈 때 호출됨
     */
    const handleIntersectionChange = (entries: IntersectionObserverEntry[]) => {
      // 모든 변경된 카테고리의 가시성 상태를 Map에 업데이트
      entries.forEach((entry) => {
        const categorySeq = Number(entry.target.id.replace('category-', ''));
        categoryVisibilityMapRef.current.set(categorySeq, entry.isIntersecting);
      });

      // 디바운스된 이벤트 발생 함수 호출
      debouncedEmitEvent();
    };

    // IntersectionObserver 생성 및 설정
    intersectionObserverRef.current = new IntersectionObserver(
      handleIntersectionChange,
      OBSERVER_OPTIONS
    );

    // 모든 카테고리 섹션을 관찰 대상으로 등록
    categories.data.forEach((category) => {
      const sectionElement = document.getElementById(
        `category-${category.categorySeq}`
      );

      if (sectionElement && intersectionObserverRef.current) {
        intersectionObserverRef.current.observe(sectionElement);
      }
    });

    // Cleanup: 컴포넌트 언마운트 또는 의존성 변경 시 실행
    return () => {
      // IntersectionObserver 정리
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }

      // 디바운스 타이머 정리
      cleanupDebounce();
    };
  }, [categories]);

  return (
    <S.Container>
      {categories.data.map((category) => (
        <div key={category.categorySeq} id={`category-${category.categorySeq}`}>
          <CategoryItem category={category} />
        </div>
      ))}
    </S.Container>
  );
};
