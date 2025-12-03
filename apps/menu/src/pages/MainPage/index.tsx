import { useState, useEffect } from 'react';
import * as S from '@/pages/MainPage/mainPage.style';
import { Sidebar } from '@/pages/MainPage/Sidebar';
import { Header } from '@/pages/MainPage/Header';
import { CartButton } from '@/pages/MainPage/CartButton';
import { BreakTime } from '@/pages/MainPage/BreakTime';
import { CartReminder } from '@/pages/MainPage/CartReminder';
import { PickupAlarm } from '@/pages/MainPage/PickAlarm';
import { useGetCategoriesWithMenus, useGetShops } from '@repo/api/queries';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { globalTimerManager } from '@/utils/timerManager';
import { checkCategorySaleStatus } from '@/utils/category';
import { timerKeys, STORAGE_KEYS } from '@/constants/keys';
import { Contents } from '@/pages/MainPage/Contents';
import { useCartStore } from '@/stores/useCartStore';
import { mockCategories } from '@/mocks/mockCategories';
import storage from '@/utils/storage';
import type { ICategoryWithMenus } from '@repo/api/types';
import { useShopData } from '@/hooks/useShopData';

// TODO: api를 통해 반환받은 data로 추후 변경 예정
const useScrollLayout = true;
const tableNumber = 1;

export const MainPage = () => {
  const { shopData: shopDataaa } = useShopData();

  const { setCartOptions } = useCartStore();

  const {
    categories: categoriesStoreData,
    setCategories: setCategoriesStoreData,
    getVisibleCategories,
  } = useCategoryStore();

  // 스토리지에 데이터가 있는지 확인 (렌더링 전에 확인하여 API 호출 여부 결정)
  const hasStorageData = storage.load<ICategoryWithMenus[]>(
    STORAGE_KEYS.CATEGORIES
  );

  // 세션 스토리지에 데이터가 없고 스토어에도 데이터가 없을 때만 API 호출
  const { data: categoriesData } = useGetCategoriesWithMenus(
    { shopCode: shopDataaa?.shopCode ?? '', tableNumber },
    {
      enabled:
        !hasStorageData &&
        categoriesStoreData === null &&
        !!shopDataaa?.shopCode &&
        !!tableNumber,
    }
  );

  // API 응답을 받으면 스토어에 저장 (세션 스토리지에도 자동 저장)
  useEffect(() => {
    if (categoriesData?.data) {
      // TODO: mockData 삭제 예정 -> categoriesData.data를 넣어야함
      setCategoriesStoreData(mockCategories);
    }
  }, [categoriesData, setCategoriesStoreData]);

  // 카테고리 노출 여부를 업데이트하는 함수
  const updateCategoryVisibility = () => {
    const currentCategoriesData = useCategoryStore.getState().categories;
    const updateAllVisibility = useCategoryStore.getState().updateAllVisibility;
    const getVisibleCategories =
      useCategoryStore.getState().getVisibleCategories;

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

    // visibility 맵 업데이트
    updateAllVisibility(newVisibilityMap);

    // updateCategoryVisibility 완료 후 cart options 업데이트
    const visibleCategories = getVisibleCategories();
    const hasFirstOrderRequiredItems = visibleCategories.some(
      (category) => category.isFirstOrderRequired
    );
    setCartOptions({ hasFirstOrderRequiredItems });

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

  const [showCartReminder, setShowCartReminder] = useState(false);
  const showBreakTime = false;
  const [showPickupAlarm, setShowPickupAlarm] = useState(false);

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

  const visibleCategories = getVisibleCategories();

  return (
    <S.Container>
      <Header />
      <S.MainContent>
        <Sidebar
          categories={visibleCategories}
          useScrollLayout={useScrollLayout}
        />
        <Contents
          categories={visibleCategories}
          useScrollLayout={useScrollLayout}
        />
        <CartButton categories={visibleCategories} />
      </S.MainContent>
    </S.Container>
  );
};
