import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import { createDebounce } from '@repo/util/function';
import { DOM_IDS } from '@/constants/keys';
import type { ICategoryWithMenus } from '@repo/api/types';

// IntersectionObserver 설정: 화면 상단 20% 영역에서 카테고리 섹션 가시성 감지
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px 0px -80% 0px',
  threshold: [0, 0.1, 0.5, 1.0],
};

/** 프로그램 스크롤 후 스파이가 다시 켜지기까지 */
const SCROLL_SPY_SUPPRESS_MS = 800;

interface IParams {
  categories: ICategoryWithMenus[];
  useSinglePageMenuboard: boolean;
}

interface IReturn {
  selectedCategorySeq: number;
  handleCategoryClick: (category: ICategoryWithMenus) => void;
  selectedCategory: ICategoryWithMenus | undefined;
  /** 스크롤 모드: 사이드바로 멀리 이동 시 해당 섹션만 Lazy 우회 마운트 */
  eagerMountCategorySeq: number | null;
  activate: () => void;
  deactivate: () => void;
}

/**
 * 카테고리 네비게이션을 통합 관리하는 커스텀 훅
 *
 * @description
 * - Sidebar, ScrollContent, TabContent 간 상태를 동기화합니다
 * - 스크롤 모드: IntersectionObserver로 스크롤에 맞춰 활성 카테고리 갱신(실제 판별은 스크롤 컨테이너 기준 기하)
 * - 탭 모드: 카테고리 클릭 시 스크롤 컨테이너를 상단으로 이동합니다
 * - 사용자 클릭 시 IntersectionObserver를 일시적으로 비활성화하여 의도하지 않은 카테고리 변경을 방지합니다
 *
 * @param categories - 카테고리 목록
 * @param useSinglePageMenuboard - 단일 페이지 메뉴판 사용 여부 (탭 모드)
 * @returns 선택된 카테고리 정보 및 핸들러 함수
 */
export function useCategoryNavigation({
  categories,
  useSinglePageMenuboard,
}: IParams): IReturn {
  // 현재 선택된 카테고리 ID (Sidebar와 TabContent에서 공유)
  const [selectedCategorySeq, setSelectedCategorySeq] = useState(
    categories[0]?.categorySeq || 0
  );

  // 활성화 상태 관리 (useEffect가 변경을 감지하도록 state 사용)
  const [isActivated, setIsActivated] = useState(false);

  // 스크롤 모드: 사이드바로 멀리 점프할 때 Lazy 우회용 (ScrollContent에 전달)
  const [eagerMountCategorySeq, setEagerMountCategorySeq] = useState<
    number | null
  >(null);
  const eagerMountClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // IntersectionObserver 관련 refs
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const lastEmittedCategorySeqRef = useRef<number | null>(null);
  const observedCategorySeqsRef = useRef<Set<number>>(new Set());

  // 스크롤 스파이 일시 비활성화·타이머
  const shouldIgnoreScrollObserverRef = useRef(false);
  const scrollAnimationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // 디바운스 cleanup ref
  const debounceCleanupRef = useRef<(() => void) | null>(null);

  // 최신 값 참조를 위한 refs (함수 안정성을 위해)
  const useSinglePageMenuboardRef = useRef(useSinglePageMenuboard);
  const categoriesRef = useRef(categories);

  // useScrollLayout 최신 값 유지
  useEffect(() => {
    useSinglePageMenuboardRef.current = useSinglePageMenuboard;
  }, [useSinglePageMenuboard]);

  // categories 최신 값 유지
  useEffect(() => {
    categoriesRef.current = categories;
  }, [categories]);

  // 사용자 클릭으로 프로그램 스크롤 중에는 스크롤 스파이(활성 카테고리 자동 갱신)를 일시 비활성화
  const temporarilyDisableScrollObserver = useRef(() => {
    shouldIgnoreScrollObserverRef.current = true;

    // 이전 타이머 정리 (연속 클릭 대응)
    if (scrollAnimationTimerRef.current) {
      clearTimeout(scrollAnimationTimerRef.current);
    }

    // SCROLL_SPY_SUPPRESS_MS 경과 후 스파이 재개
    scrollAnimationTimerRef.current = setTimeout(() => {
      shouldIgnoreScrollObserverRef.current = false;
      scrollAnimationTimerRef.current = null;
    }, SCROLL_SPY_SUPPRESS_MS);
  });

  // 탭/스크롤 모드 공통: 컨테이너 최상단으로 스크롤
  const scrollContentsContainerToTop = useRef(() => {
    requestAnimationFrame(() => {
      const containerId = useSinglePageMenuboardRef.current
        ? DOM_IDS.CONTENTS_SCROLL_CONTAINER
        : DOM_IDS.CONTENTS_SCROLL_MODE_CONTAINER;
      const container = document.getElementById(containerId);
      container?.scrollTo({ top: 0 });
    });
  });

  // 카테고리 클릭 핸들러: 레이아웃 모드에 따라 스크롤 또는 탭 전환
  const handleCategoryClick = useRef((category: ICategoryWithMenus) => {
    const currentCategories = categoriesRef.current;

    // categories가 로드되지 않았거나 빈 배열이면 무시 (로딩 중 클릭 방지)
    if (currentCategories.length === 0) {
      return;
    }

    // 클릭한 카테고리가 현재 categories에 존재하는지 확인 (유효성 검증)
    const categoryExists = currentCategories.some(
      (c) => c.categorySeq === category.categorySeq
    );
    if (!categoryExists) {
      return;
    }

    // 선택된 카테고리 상태 업데이트
    setSelectedCategorySeq(category.categorySeq);

    if (useSinglePageMenuboardRef.current) {
      // 탭 모드: 스크롤 컨테이너를 상단으로 이동
      scrollContentsContainerToTop.current();
    } else {
      // 스크롤 모드: 첫 번째 카테고리면 컨테이너 최상단(BannerAd 포함)으로, 그 외는 eager 마운트 → useLayoutEffect에서 스크롤
      const isFirstCategory =
        currentCategories[0]?.categorySeq === category.categorySeq;
      lastEmittedCategorySeqRef.current = category.categorySeq;
      temporarilyDisableScrollObserver.current();
      if (isFirstCategory) {
        scrollContentsContainerToTop.current();
      } else {
        setEagerMountCategorySeq(category.categorySeq);
      }
    }
  }).current;

  // 스크롤 모드: eager 마운트 직후 레이아웃에서 스크롤 컨테이너 기준으로 스크롤
  useLayoutEffect(() => {
    if (eagerMountCategorySeq === null) {
      return;
    }

    const container = document.getElementById(
      DOM_IDS.CONTENTS_SCROLL_MODE_CONTAINER
    );
    const section = document.getElementById(
      DOM_IDS.getCategorySectionId(eagerMountCategorySeq)
    );

    if (!container || !section) {
      setEagerMountCategorySeq(null);
      return;
    }

    const cr = container.getBoundingClientRect();
    const sr = section.getBoundingClientRect();
    const nextTop = container.scrollTop + (sr.top - cr.top);
    // scrollIntoView(smooth) 대신 즉시 이동 — WebView·lazy 조합에서 스파이가 상단으로 덮는 이슈 완화
    container.scrollTo({ top: nextTop, behavior: 'auto' });

    if (eagerMountClearTimerRef.current) {
      clearTimeout(eagerMountClearTimerRef.current);
    }
    eagerMountClearTimerRef.current = setTimeout(() => {
      setEagerMountCategorySeq(null);
      eagerMountClearTimerRef.current = null;
    }, 900);
  }, [eagerMountCategorySeq]);

  // categories 변경 시 selectedCategorySeq 동기화 (로딩 완료 후 유효성 검증)
  useEffect(() => {
    if (categories.length > 0) {
      const firstCategorySeq = categories[0]?.categorySeq || 0;
      setSelectedCategorySeq((prevSeq) => {
        // 현재 선택된 카테고리가 유효하면 유지, 아니면 첫 번째로 변경
        // 로딩 중 잘못된 값이 설정되었을 경우 자동으로 수정
        const isValid = categories.some((c) => c.categorySeq === prevSeq);
        return isValid ? prevSeq : firstCategorySeq;
      });
    } else {
      // categories가 비어있으면 초기화 (로딩 중 상태)
      setSelectedCategorySeq(0);
    }
  }, [categories]);

  // IntersectionObserver 설정 및 관리 (스크롤 모드일 때만)
  useEffect(() => {
    // cleanup에서 사용할 ref 값 복사 (린터 경고 방지)
    const observedSeqs = observedCategorySeqsRef.current;

    // activate가 호출되지 않았거나 탭 모드에서는 observer 불필요
    if (!isActivated || useSinglePageMenuboard) {
      return;
    }

    const handleScrollVisibilityChange = () => {
      // 사용자가 사이드바로 프로그램 스크롤 중이면 무시
      if (shouldIgnoreScrollObserverRef.current) {
        return;
      }

      const cats = categoriesRef.current;
      const first = cats[0];
      if (!first) {
        return;
      }

      const container = document.getElementById(
        DOM_IDS.CONTENTS_SCROLL_MODE_CONTAINER
      );
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      // 스크롤 컨테이너 상단에서 약 20% 아래 기준선 — 이 선을 지난 마지막 섹션을 활성으로 둠 (DOM 순서)
      const lineY = rect.top + rect.height * 0.2;

      let topSeq = first.categorySeq;
      for (const c of cats) {
        const el = document.getElementById(
          DOM_IDS.getCategorySectionId(c.categorySeq)
        );
        if (!el) {
          continue;
        }
        if (el.getBoundingClientRect().top <= lineY) {
          topSeq = c.categorySeq;
        }
      }

      // 중복 업데이트 방지: 이전과 동일한 카테고리면 스킵
      if (lastEmittedCategorySeqRef.current === topSeq) {
        return;
      }
      lastEmittedCategorySeqRef.current = topSeq;
      setSelectedCategorySeq((prev) => (prev === topSeq ? prev : topSeq));
    };

    // 디바운스 적용: 빠른 스크롤 시 과도한 업데이트 방지 (100ms)
    const { debouncedFn: debouncedHandleVisibilityChange, cleanup } =
      createDebounce(handleScrollVisibilityChange, 100);
    debounceCleanupRef.current = cleanup;

    // IO는 트리거만 — 실제 활성 카테고리는 handleScrollVisibilityChange에서 기하로 계산
    const handleIntersectionChange = () => {
      debouncedHandleVisibilityChange();
    };

    // IntersectionObserver 생성
    intersectionObserverRef.current = new IntersectionObserver(
      handleIntersectionChange,
      OBSERVER_OPTIONS
    );

    // Cleanup: observer·디바운스 정리
    return () => {
      const observer = intersectionObserverRef.current;
      if (observer) {
        observer.disconnect();
        intersectionObserverRef.current = null;
      }

      const debounceCleanup = debounceCleanupRef.current;
      if (debounceCleanup) {
        debounceCleanup();
        debounceCleanupRef.current = null;
      }

      lastEmittedCategorySeqRef.current = null;
      observedSeqs.clear();
    };
  }, [useSinglePageMenuboard, isActivated]);

  // useSinglePageMenuboard 변경 시 스크롤·eager 타이머 정리
  useEffect(() => {
    return () => {
      if (scrollAnimationTimerRef.current) {
        clearTimeout(scrollAnimationTimerRef.current);
        scrollAnimationTimerRef.current = null;
      }
      if (eagerMountClearTimerRef.current) {
        clearTimeout(eagerMountClearTimerRef.current);
        eagerMountClearTimerRef.current = null;
      }
    };
  }, [useSinglePageMenuboard]);

  // 카테고리 섹션을 IntersectionObserver에 등록 (스크롤 모드일 때만)
  useEffect(() => {
    const observer = intersectionObserverRef.current;
    const observedSeqs = observedCategorySeqsRef.current;

    // activate 전·탭 모드·observer 없으면 observe 해제 후 종료
    if (!isActivated || useSinglePageMenuboard || !observer) {
      if (observer) {
        observedSeqs.forEach((categorySeq) => {
          const element = document.getElementById(
            DOM_IDS.getCategorySectionId(categorySeq)
          );
          if (element) {
            observer.unobserve(element);
          }
        });
        observedSeqs.clear();
      }
      return;
    }

    // DOM 렌더링 완료 후 섹션 등록 (requestAnimationFrame 사용)
    const rafId = requestAnimationFrame(() => {
      const currentObserver = intersectionObserverRef.current;
      if (!currentObserver) {
        return;
      }

      // 이전에 등록된 섹션 중 현재 categories에 없는 것 제거
      const currentCategorySeqs = new Set(categories.map((c) => c.categorySeq));
      const currentObservedSeqs = observedCategorySeqsRef.current;

      currentObservedSeqs.forEach((categorySeq) => {
        if (!currentCategorySeqs.has(categorySeq)) {
          const element = document.getElementById(
            DOM_IDS.getCategorySectionId(categorySeq)
          );
          if (element) {
            currentObserver.unobserve(element);
          }
          currentObservedSeqs.delete(categorySeq);
        }
      });

      // 새로운 카테고리 섹션 등록
      categories.forEach((category) => {
        // 이미 등록된 섹션은 스킵
        if (currentObservedSeqs.has(category.categorySeq)) {
          return;
        }

        const sectionElement = document.getElementById(
          DOM_IDS.getCategorySectionId(category.categorySeq)
        );

        if (sectionElement && currentObserver) {
          currentObserver.observe(sectionElement);
          currentObservedSeqs.add(category.categorySeq);
        }
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [categories, useSinglePageMenuboard, isActivated]);

  // TabContent에서 사용할 선택된 카테고리 객체
  // 로딩 중이거나 유효하지 않은 selectedCategorySeq면 undefined 반환 (스타일 깨짐 방지)
  const selectedCategory =
    categories.length > 0 && selectedCategorySeq > 0
      ? categories.find(
          (category) => category.categorySeq === selectedCategorySeq
        ) || undefined // find가 undefined를 반환할 수 있으므로 명시적으로 처리
      : undefined;

  // 활성화 함수: Sidebar/Contents가 렌더링될 때 호출
  const activate = useCallback(() => {
    // 이미 활성화되었으면 중복 호출 방지 (무한 렌더링 방지)
    if (isActivated) {
      return;
    }
    setIsActivated(true);
  }, [isActivated]);

  // 비활성화 함수: 다른 화면으로 전환될 때 호출
  const deactivate = useCallback(() => {
    if (!isActivated) {
      return;
    }
    if (eagerMountClearTimerRef.current) {
      clearTimeout(eagerMountClearTimerRef.current);
      eagerMountClearTimerRef.current = null;
    }
    setEagerMountCategorySeq(null);
    setIsActivated(false);
    setSelectedCategorySeq(categoriesRef.current[0]?.categorySeq || 0);
  }, [isActivated]);

  return {
    selectedCategorySeq,
    handleCategoryClick,
    selectedCategory,
    eagerMountCategorySeq,
    activate,
    deactivate,
  };
}
