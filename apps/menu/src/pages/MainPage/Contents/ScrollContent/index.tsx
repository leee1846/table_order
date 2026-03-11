import { useEffect, useRef, useState } from 'react';
import * as S from '@/pages/MainPage/Contents/ScrollContent/scrollContent.style';
import { CategoryItem } from '@/pages/MainPage/Contents/CategoryItem';
import { DOM_IDS } from '@/constants/keys';
import type { ICategoryWithMenus } from '@repo/api/types';

interface Props {
  categories: ICategoryWithMenus[];
}

interface LazyCategorySectionProps {
  category: ICategoryWithMenus;
}

/**
 * 뷰포트 기준 2000px 이내일 때 CategoryItem을 마운트하고,
 * 벗어나면 언마운트하여 이미지 비트맵 메모리를 해제합니다.
 *
 * containerRef div는 항상 DOM에 유지되므로 useCategoryNavigation의
 * IntersectionObserver(바깥 section div 관찰)에 영향을 주지 않습니다.
 */
const LazyCategorySection = ({ category }: LazyCategorySectionProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const measuredHeightRef = useRef(600);
  const isMountedRef = useRef(false);

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
        rootMargin: '2000px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={
        !isMounted ? { minHeight: `${measuredHeightRef.current}px` } : undefined
      }
    >
      {isMounted && <CategoryItem category={category} />}
    </div>
  );
};

export const ScrollContent = ({ categories }: Props) => {
  return (
    <S.Container>
      {categories.map((category) => (
        <div
          key={category.categorySeq}
          id={DOM_IDS.getCategorySectionId(category.categorySeq)}
        >
          <LazyCategorySection category={category} />
        </div>
      ))}
    </S.Container>
  );
};
