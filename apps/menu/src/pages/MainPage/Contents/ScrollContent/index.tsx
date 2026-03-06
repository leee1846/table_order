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
 * 스크롤 컨테이너 내에서 뷰포트 근처에 들어올 때 CategoryItem을 마운트하고,
 * 이후 절대 언마운트하지 않습니다.
 *
 * IntersectionObserver root를 실제 스크롤 컨테이너(overflow-y: auto 고정 div)로 지정하여
 * overflow 내부에서도 rootMargin이 정확하게 동작합니다.
 * 네비게이션 Observer가 관찰하는 상위 section div는 항상 DOM에 존재하므로
 * 카테고리 네비게이션 동작에 영향을 주지 않습니다.
 */
const LazyCategorySection = ({ category }: LazyCategorySectionProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMounted) {
      return;
    }

    const el = placeholderRef.current;
    if (!el) {
      return;
    }

    // 실제 스크롤 컨테이너를 root로 지정해야 overflow 내부에서 rootMargin이 정확히 동작함
    // null 폴백 시 viewport 기준으로 동작 (기능은 유지되나 preload margin이 줄어들 수 있음)
    const scrollContainer = document.getElementById(
      DOM_IDS.CONTENTS_SCROLL_MODE_CONTAINER
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsMounted(true);
          observer.disconnect();
        }
      },
      {
        root: scrollContainer,
        // 스크롤 컨테이너 기준으로 200px 앞에서 미리 마운트
        rootMargin: '200px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isMounted]);

  if (isMounted) {
    return <CategoryItem category={category} />;
  }

  // 마운트 전: 레이아웃 높이를 유지하는 placeholder
  return <div ref={placeholderRef} style={{ minHeight: '400px' }} />;
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
