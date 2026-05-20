import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as S from '@/pages/MainPage/Contents/ScrollContent/scrollContent.style';
import { CategoryItem } from '@/pages/MainPage/Contents/CategoryItem';
import { DOM_IDS } from '@/constants/keys';
import type { ICategoryWithMenus } from '@repo/api/types';

const LAZY_MOUNT_VIEWPORT_MARGIN_PX = 2000;

// 섹션이 스크롤 영역 ±margin 안에 있는지 판별 (menuboard 갱신 후 재마운트 판정용)
const isSectionNearScrollViewport = (
  scrollContainer: HTMLElement,
  sectionElement: HTMLElement,
  marginPx: number
): boolean => {
  const containerRect = scrollContainer.getBoundingClientRect();
  const sectionRect = sectionElement.getBoundingClientRect();
  return (
    sectionRect.bottom >= containerRect.top - marginPx &&
    sectionRect.top <= containerRect.bottom + marginPx
  );
};

// 카테고리 순서·목록 변경 감지용 fingerprint (예: "1,2,3")
const buildCategoryListOrderKey = (categories: ICategoryWithMenus[]): string =>
  categories.map((c) => c.categorySeq).join(',');

interface Props {
  categories: ICategoryWithMenus[];
  eagerMountCategorySeq: number | null;
}

interface LazyCategorySectionProps {
  category: ICategoryWithMenus;
  categoriesOrderKey: string;
  eagerMountCategorySeq: number | null;
}

/**
 * 뷰포트 기준 2000px 이내일 때 CategoryItem을 마운트하고,
 * 벗어나면 언마운트하여 이미지 비트맵 메모리를 해제합니다.
 * 사이드바로 멀리 점프할 때는 eagerMountCategorySeq로 해당 섹션만 먼저 마운트합니다.
 *
 * containerRef div는 항상 DOM에 유지되므로 useCategoryNavigation의
 * IntersectionObserver(바깥 section div 관찰)에 영향을 주지 않습니다.
 */
const LazyCategorySection = ({
  category,
  categoriesOrderKey,
  eagerMountCategorySeq,
}: LazyCategorySectionProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const measuredHeightRef = useRef(600);
  const isMountedRef = useRef(false);

  // IO 지연 마운트 또는 사이드바 eager 대상이면 CategoryItem 표시
  const show = isMounted || eagerMountCategorySeq === category.categorySeq;

  // 지연 마운트 전용 IntersectionObserver (바깥 section id는 네비게이션 훅이 관찰)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const scrollContainer = document.getElementById(
      DOM_IDS.CONTENTS_SCROLL_MODE_CONTAINER
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          isMountedRef.current = true;
          setIsMounted(true);
        } else {
          if (isMountedRef.current) {
            const h = el.getBoundingClientRect().height;
            if (h > 0) {
              measuredHeightRef.current = h;
            }
          }
          isMountedRef.current = false;
          setIsMounted(false);
        }
      },
      {
        root: scrollContainer,
        rootMargin: `${LAZY_MOUNT_VIEWPORT_MARGIN_PX}px 0px`,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // menuboard/SSE 갱신·순서 변경 후, 화면 근처 섹션만 CategoryItem 재마운트 (언마운트는 위 IO가 담당)
  useLayoutEffect(() => {
    const sectionElement = containerRef.current;
    if (!sectionElement) {
      return;
    }

    const scrollContainer = document.getElementById(
      DOM_IDS.CONTENTS_SCROLL_MODE_CONTAINER
    );
    if (!scrollContainer) {
      return;
    }

    if (
      !isSectionNearScrollViewport(
        scrollContainer,
        sectionElement,
        LAZY_MOUNT_VIEWPORT_MARGIN_PX
      )
    ) {
      return;
    }

    isMountedRef.current = true;
    setIsMounted(true);
  }, [category, categoriesOrderKey]);

  return (
    <div
      ref={containerRef}
      style={
        !show ? { minHeight: `${measuredHeightRef.current}px` } : undefined
      }
    >
      {show && <CategoryItem category={category} />}
    </div>
  );
};

export const ScrollContent = ({ categories, eagerMountCategorySeq }: Props) => {
  // 자식 LazyCategorySection의 menuboard 재판정 트리거
  const categoriesOrderKey = buildCategoryListOrderKey(categories);

  return (
    <S.Container>
      {categories.map((category) => (
        <div
          key={category.categorySeq}
          id={DOM_IDS.getCategorySectionId(category.categorySeq)}
        >
          <LazyCategorySection
            category={category}
            categoriesOrderKey={categoriesOrderKey}
            eagerMountCategorySeq={eagerMountCategorySeq}
          />
        </div>
      ))}
    </S.Container>
  );
};
