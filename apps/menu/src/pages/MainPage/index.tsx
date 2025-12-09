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
import { useTableData } from '@/hooks/useTableData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { LanguageSelector } from './LanguageSelector';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { CustomerCountSelector } from '@/pages/MainPage/CustomerCountSelector';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useThemeMode } from '@repo/ui';
import { usePickupAlarmStore } from '@/stores/usePickupAlarmStore';
import { InitialPage } from '@/pages/MainPage/InitialPage';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useCartReminderStore } from '@/stores/useCartReminderStore';

// TODO: breakTime 추후 변경 예정
const showBreakTime = false;

export const MainPage = () => {
  /** ======== 초기 data 로드 START ================================== */
  /** 상점 데이터 로드 */
  useShopData();
  /** 상점 상세 데이터 로드 */
  const { data: shopDetailData } = useShopDetailData();
  /** 테이블 데이터 로드 */
  useTableData();
  /** 카테고리 데이터 로드 */
  const { data: categoriesStoreData, visibleCategories } = useCategoriesData();
  /** 테이블 주문 내역 데이터 로드 */
  const { data: tableOrderHistoriesData } = useTableOrderHistoriesData();
  /** ======== 초기 data 로드 END ================================== */

  const { data: showPickupAlarm } = usePickupAlarmStore();

  // 카테고리 데이터가 로드되면 visibility 업데이트 시작
  useEffect(() => {
    if (!categoriesStoreData) {
      return;
    }

    /** 카테고리 노출 여부를 업데이트하는 함수 */
    const updateCategoryVisibility = () => {
      const currentCategoriesData = useCategoryStore.getState().categories;
      const updateAllVisibility =
        useCategoryStore.getState().updateAllVisibility;

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

    // 초기 visibility 업데이트
    updateCategoryVisibility();

    // cleanup: 데이터 변경 또는 언마운트 시 타이머 정리
    return () => {
      globalTimerManager.clear(timerKeys.CATEGORY_VISIBILITY_UPDATE);
    };
  }, [categoriesStoreData]);

  const staffCallCategory = visibleCategories.find((c) => c.isStaffCall);
  const nonStaffCallCategories = visibleCategories.filter(
    (c) => !c.isStaffCall
  );

  /**========= 카테고리 사이드바 이벤트 관리 START ==================================== */
  const categoryNavigation = useCategoryNavigation({
    categories: nonStaffCallCategories,
    useSinglePageMenuboard:
      shopDetailData?.shopSetting?.useSinglePageMenuboard ?? false,
  });
  /** ======== 카테고리 사이드바 이벤트 관리 END ===================================== */

  /**========= 노출되는 카테고리 중, 첫 주문 필수 항목이 있는지 여부 확인 START =========== */
  const { setCartOptions } = useCartStore();
  useEffect(() => {
    const hasFirstOrderRequiredItems = visibleCategories.some(
      (category) => category.isFirstOrderRequired
    );

    // 메뉴 장바구니에 담을 때 사용하는 옵션 업데이트
    setCartOptions({ hasFirstOrderRequiredItems });
  }, [visibleCategories, setCartOptions]);
  /**========= 노출되는 카테고리 중, 첫 주문 필수 항목이 있는지 여부 확인 END ============= */

  /**========= 다크모드 사용 여부 확인 START ======================================== */
  const { setMode } = useThemeMode();
  useEffect(() => {
    if (!shopDetailData?.shopSetting) {
      setMode('light');
      return;
    }

    if (shopDetailData.shopSetting.useDarkTheme) {
      setMode('dark');
      return;
    }

    setMode('light');
  }, [shopDetailData?.shopSetting, setMode]);
  /** ======== 다크모드 사용 여부 확인 END =========================================== */

  /**========= 고객 메뉴판 언어 선택 START ========================================== */
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const { data: currentLanguage } = useLanguageStore();

  useEffect(() => {
    if (!shopDetailData?.useLocale) {
      setShowLanguageSelector(false);
      return;
    }

    if (currentLanguage) {
      setShowLanguageSelector(false);
      return;
    }

    setShowLanguageSelector(true);
  }, [shopDetailData?.useLocale, currentLanguage]);
  /** ======== 고객 메뉴판 언어 선택 END ========================================== */

  /**========= 객수 선택 START ================================================== */
  const [showCustomerCountSelector, setShowCustomerCountSelector] =
    useState(false);
  const { data: customerCountData } = useCustomerCountStore();

  useEffect(() => {
    if (
      !shopDetailData?.shopSetting?.useCustomerCount &&
      !shopDetailData?.shopSetting?.useKidsCustomerCount
    ) {
      setShowCustomerCountSelector(false);
      return;
    }

    if (customerCountData) {
      setShowCustomerCountSelector(false);
      return;
    }

    setShowCustomerCountSelector(true);
  }, [shopDetailData?.shopSetting, customerCountData]);
  /** ======== 객수 선택 END ================================================== */

  /** ======== 초기 화면 페이지 노출 여부 ======================================= */
  const { data: initialPageData } = useInitialPageStore();

  /** ======== 장바구니 메뉴 주문 리마인더 노출 여부 ============================== */
  const { data: cartReminderData } = useCartReminderStore();

  /** 초기 화면 노출 */
  if (initialPageData.showInitialPage) {
    return <InitialPage />;
  }

  /** 고객 메뉴판 언어 선택 */
  if (showLanguageSelector) {
    return <LanguageSelector />;
  }

  /** 고객 객수 선택 */
  if (showCustomerCountSelector) {
    return <CustomerCountSelector />;
  }

  // TODO: SSE 연결 처리 추후 예정
  /** 픽업 알림 표시 */
  if (shopDetailData?.shopSetting?.usePickupAlert && showPickupAlarm) {
    return <PickupAlarm />;
  }

  /** 장바구니 메뉴 주문 리마인더 표시 */
  if (cartReminderData.showCartReminder) {
    return <CartReminder />;
  }

  if (showBreakTime) {
    return <BreakTime />;
  }

  return (
    <S.Container>
      <Header orderHistories={tableOrderHistoriesData} />

      <S.MainContent>
        <Sidebar
          categories={nonStaffCallCategories}
          staffCallCategory={staffCallCategory}
          selectedCategorySeq={categoryNavigation.selectedCategorySeq}
          handleCategoryClick={categoryNavigation.handleCategoryClick}
        />

        <Contents
          categories={nonStaffCallCategories}
          useSinglePageMenuboard={
            shopDetailData?.shopSetting?.useSinglePageMenuboard ?? false
          }
          selectedCategory={categoryNavigation.selectedCategory}
        />

        <CartButton categories={visibleCategories} />
      </S.MainContent>
    </S.Container>
  );
};
