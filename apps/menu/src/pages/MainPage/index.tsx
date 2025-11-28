import { useState, useEffect } from 'react';
import * as S from '@/pages/MainPage/mainPage.style';
import { Sidebar } from '@/pages/MainPage/Sidebar';
import { Header } from '@/pages/MainPage/Header';
import { CartButton } from '@/pages/MainPage/CartButton';
import { BreakTime } from '@/pages/MainPage/BreakTime';
import { CartReminder } from '@/pages/MainPage/CartReminder';
import { PickupAlarm } from '@/pages/MainPage/PickAlarm';
import { useGetCategoriesWithMenus } from '@repo/api/queries';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { globalTimerManager } from '@/utils/timerManager';
import { checkCategorySaleStatus } from '@/utils/category';
import { timerKeys } from '@/constants/keys';
import { Contents } from '@/pages/MainPage/Contents';

// TODO: api를 통해 반환받은 data로 추후 변경 예정정
const useScrollLayout = true;

export const MainPage = () => {
  // TODO: 실제 토큰에서 shopSeq를 가져와서 API 호출에 사용하도록 추후에 수정
  // const token = getAccessToken() as string;
  // const payload = decodeJwtToken<ITokenPayload>(token);
  // const shopSeq = payload?.shopSeq ?? 0;

  const {
    data: categoriesStoreData,
    setData: setCategoriesStoreData,
    loadFromStorage,
    getVisibleCategories,
  } = useCategoryStore();

  // 컴포넌트 마운트 시 세션 스토리지에서 데이터 로드
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // 세션 스토리지에 데이터가 없을 때만 API 호출
  const { data: categoriesData } = useGetCategoriesWithMenus(
    { shopCode: 'NEXA000001', tableNumber: 1 },
    { enabled: !categoriesStoreData }
  );

  // API 응답을 받으면 스토어에 저장 (세션 스토리지에도 자동 저장)
  useEffect(() => {
    if (categoriesData?.data) {
      setCategoriesStoreData(categoriesData.data);
    }
  }, [categoriesData, setCategoriesStoreData]);

  // 카테고리 노출 여부를 업데이트하는 함수
  const updateCategoryVisibility = () => {
    const currentCategoriesData = useCategoryStore.getState().data;
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

    // visibility 맵 업데이트
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
        <CartButton />
      </S.MainContent>
    </S.Container>
  );
};
