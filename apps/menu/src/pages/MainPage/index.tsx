import { useState, useEffect } from 'react';
import * as S from '@/pages/MainPage/mainPage.style';
import { Sidebar } from '@/pages/MainPage/Sidebar';
import { Header } from '@/pages/MainPage/Header';
import { CartButton } from '@/pages/MainPage/CartButton';
import { BreakTime } from '@/pages/MainPage/BreakTime';
import { CartReminder } from '@/pages/MainPage/CartReminder';
import { PickupAlarm } from '@/pages/MainPage/PickAlarm';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { globalTimerManager } from '@/utils/timerManager';
import { checkCategorySaleStatus } from '@/utils/category';
import { timerKeys } from '@/constants/keys';
import { Contents } from '@/pages/MainPage/Contents';
import { useCartStore } from '@/stores/useCartStore';
import { useShopData } from '@/hooks/useShopData';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useCategoryNavigation } from '@/hooks/useCategoryNavigation';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';

// TODO: api를 통해 반환받은 data로 추후 변경 예정
const useScrollLayout = false;
// TODO: tableNumber 추후 변경 예정
const tableNumber = 1;
// TODO: breakTime 추후 변경 예정
const showBreakTime = false;

export const MainPage = () => {
  /** 상점 데이터 로드 */
  const { shopData } = useShopData();

  /** 카테고리 데이터 로드 */
  const { data: categoriesStoreData, visibleCategories } = useCategoriesData({
    shopData,
    tableNumber,
  });

  /** 테이블 주문 내역 데이터 로드 */
  const { data: tableOrderHistoriesData } = useTableOrderHistoriesData({
    shopData,
    tableNumber,
  });

  const { setCartOptions } = useCartStore();

  /** 카테고리 노출 여부를 업데이트하는 함수 */
  const updateCategoryVisibility = () => {
    const currentCategoriesData = useCategoryStore.getState().categories;
    const updateAllVisibility = useCategoryStore.getState().updateAllVisibility;

    if (!currentCategoriesData) {
      return;
    }

    const newVisibilityMap: Record<number, boolean> = {};

    // 가장 빠른 다음 상태 변경 시간
    let earliestNextChangeMs: number | null = null;

    // 모든 카테고리의 판매 가능 여부 확인
    currentCategoriesData.forEach((category) => {
      const saleStatus = checkCategorySaleStatus({
        useSaleDay: category.useSaleDay,
        saleDayOfWeek: category.saleDayOfWeek,
        useSaleTime: category.useSaleTime,
        saleStartTime: category.saleStartTime,
        saleEndTime: category.saleEndTime,
        isSaleOnHoliday: category.isSaleOnHoliday,
      });

      // visibility 맵 업데이트
      newVisibilityMap[category.categorySeq] = saleStatus.isAvailable;

      // 가장 빠른 다음 상태 변경 시간 추적
      if (saleStatus.nextChangeMs !== null) {
        if (
          earliestNextChangeMs === null ||
          saleStatus.nextChangeMs < earliestNextChangeMs
        ) {
          earliestNextChangeMs = saleStatus.nextChangeMs;
        }
      }
    });

    // visibility 맵 업데이트 (visibleCategories는 자동으로 계산됨)
    updateAllVisibility(newVisibilityMap);

    // 다음 상태 변경을 위한 타이머 설정
    if (earliestNextChangeMs !== null) {
      globalTimerManager.setTimeout(
        timerKeys.CATEGORY_VISIBILITY_UPDATE,
        () => {
          updateCategoryVisibility();
        },
        earliestNextChangeMs
      );
    }
  };

  // 카테고리 데이터가 로드되면 visibility 업데이트 시작
  useEffect(() => {
    if (!categoriesStoreData) {
      return;
    }

    // 초기 visibility 업데이트
    updateCategoryVisibility();

    // cleanup: 데이터 변경 또는 언마운트 시 타이머 정리
    return () => {
      globalTimerManager.clear(timerKeys.CATEGORY_VISIBILITY_UPDATE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesStoreData]);

  // visibleCategories 변경 시 cart options 업데이트
  useEffect(() => {
    const hasFirstOrderRequiredItems = visibleCategories.some(
      (category) => category.isFirstOrderRequired
    );

    // 메뉴 장바구니에 담을 때 첫 주문 필수 항목이 있는지 여부
    setCartOptions({ hasFirstOrderRequiredItems });
  }, [visibleCategories, setCartOptions]);

  const [showCartReminder, setShowCartReminder] = useState(false);
  const [showPickupAlarm, setShowPickupAlarm] = useState(false);

  const nonStaffCallCategories = visibleCategories.filter(
    (c) => !c.isStaffCall
  );
  const staffCallCategory = visibleCategories.find((c) => c.isStaffCall);

  // 카테고리 네비게이션 훅 호출
  const categoryNavigation = useCategoryNavigation({
    categories: nonStaffCallCategories,
    useScrollLayout,
  });

  if (showPickupAlarm) {
    return <PickupAlarm onClose={() => setShowPickupAlarm(false)} />;
  }

  if (showBreakTime) {
    return <BreakTime />;
  }

  if (showCartReminder) {
    return (
      <CartReminder
        closePage={() => setShowCartReminder(false)}
        resetCart={() => {
          // TODO: Implement cart reset logic
        }}
      />
    );
  }

  return (
    <S.Container>
      <Header orderHistories={tableOrderHistoriesData} />
      <S.MainContent>
        <Sidebar
          categories={nonStaffCallCategories}
          staffCallCategory={staffCallCategory}
          useScrollLayout={useScrollLayout}
          selectedCategorySeq={categoryNavigation.selectedCategorySeq}
          handleCategoryClick={categoryNavigation.handleCategoryClick}
        />
        <Contents
          categories={nonStaffCallCategories}
          useScrollLayout={useScrollLayout}
          selectedCategory={categoryNavigation.selectedCategory}
        />
        <CartButton categories={visibleCategories} />
      </S.MainContent>
    </S.Container>
  );
};
