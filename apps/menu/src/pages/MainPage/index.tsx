import { useEffect, useState } from 'react';
import * as S from '@/pages/MainPage/mainPage.style';
import { StandbyAd } from '@/pages/MainPage/StandbyAd';
import { Sidebar } from '@/pages/MainPage/Sidebar';
import { Header } from '@/pages/MainPage/Header';
import { CartButton } from '@/pages/MainPage/CartButton';
import { Contents } from '@/pages/MainPage/Contents';
import { useShopData } from '@/hooks/useShopData';
import { useAdData } from '@/hooks/useAdData';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useCategoryNavigation } from '@/hooks/useCategoryNavigation';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useBreakTime } from '@/hooks/useBreakTime';
import { useShopClosure } from '@/hooks/useShopClosure';
import { usePickupAlarmStore } from '@/stores/usePickupAlarmStore';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useStandbyAdStore } from '@/stores/useStandbyAdStore';
import { useAdStore } from '@/stores/useAdStore';
import { useCartReminderStore } from '@/stores/useCartReminderStore';
import { useAppThemeSettings } from '@/hooks/useAppThemeSettings';
import { useCustomerLanguageSettings } from '@/hooks/useCustomerLanguageSettings';
import { useCustomerCountSettings } from '@/hooks/useCustomerCountSettings';
import { useAdminAccessControl } from '@/hooks/useAdminAccessControl';
import { useFirstOrderRequiredCheck } from '@/hooks/useFirstOrderRequiredCheck';
import { useBreakTimeCartClear } from '@/hooks/useBreakTimeCartClear';
import { useCategoryVisibilityManager } from '@/hooks/useCategoryVisibilityManager';
import { useShopThemePage } from '@/hooks/useShopThemePage';
import { ClosedPage } from '@/pages/MainPage/ClosedPage';
import { BreakTime } from '@/pages/MainPage/BreakTime';
import { InitialPage } from '@/pages/MainPage/InitialPage';
import { LanguageSelector } from '@/pages/MainPage/LanguageSelector';
import { CustomerCountSelector } from '@/pages/MainPage/CustomerCountSelector';
import { PickupAlarm } from '@/pages/MainPage/PickAlarm';
import { CartReminder } from '@/pages/MainPage/CartReminder';
import { LastOrder } from '@/pages/MainPage/LastOrder';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { CashPaymentInducement } from '@/feature/CashPaymentInducement';
import { useModalStore } from '@/stores/useModalStore';
import { OrderCompleteModalContainer } from '@/pages/MainPage/OrderCompleteModalContainer';
import { PosSyncOverlayModal } from '@/feature/PosSyncOverlayModal';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';

export const MainPage = () => {
  const { t } = useCustomerTranslation();

  useShopData();
  const { isMenuAdFilesLoading } = useAdData();
  useTableGroupData();
  const { data: shopDetailData, isLoading: isShopDetailLoading } =
    useShopDetailData();
  const deviceDataResult = useDeviceData();
  const {
    categories,
    visibleCategories,
    staffCallCategory,
    nonStaffCallCategories,
  } = useCategoriesData();
  const {
    data: tableOrderHistoriesData,
    isLoading: isTableOrderHistoriesLoading,
  } = useTableOrderHistoriesData();
  const { data: shopThemeData, isThemePageLoading } = useShopThemePage();
  const hasInitialPageDetailImages =
    (shopThemeData?.themePageData?.shopPageDetailList?.filter(
      (item) => item.pageDetailType === 'INIT_COMMON'
    )?.length ?? 0) > 0;

  const orderHistories =
    tableOrderHistoriesData && tableOrderHistoriesData !== 'isEmptyTable'
      ? tableOrderHistoriesData
      : null;

  const useSinglePageMenuboard =
    shopDetailData?.shopSetting?.useSinglePageMenuboard ?? false;
  const usePickupAlert = shopDetailData?.shopSetting?.usePickupAlert ?? false;

  useCategoryVisibilityManager(categories);

  const categoryNavigation = useCategoryNavigation({
    categories: nonStaffCallCategories,
    useSinglePageMenuboard,
  });

  const breakTimeState = useBreakTime();
  const closureState = useShopClosure();

  useAppThemeSettings(shopThemeData?.shopThemeData ?? null);
  const languageSettings = useCustomerLanguageSettings(shopDetailData);
  const customerCountSettings = useCustomerCountSettings(
    shopDetailData,
    tableOrderHistoriesData
  );
  const adminAccessControl = useAdminAccessControl(deviceDataResult);
  useFirstOrderRequiredCheck();
  useBreakTimeCartClear(breakTimeState);

  const { data: initialPageData } = useInitialPageStore();
  const { data: standbyAdData } = useStandbyAdStore();
  const { data: adData } = useAdStore();
  const { data: pickUpAlarmData } = usePickupAlarmStore();
  const { data: cartReminderData } = useCartReminderStore();
  const { data: modalData } = useModalStore();

  const breakTimeLastOrderState = {
    show:
      breakTimeState.isBreakTimeLastOrderAlert &&
      breakTimeState.showLastOrderAlertModal,
    message: breakTimeState.breakTimeLastOrderMessage ?? '',
    lastOrderTime: breakTimeState.lastOrderTime ?? '',
    onClose: breakTimeState.closeLastOrderAlertModal,
  };

  const closureLastOrderState = {
    show:
      closureState.isClosureLastOrderAlert &&
      closureState.showLastOrderAlertModal,
    message: closureState.closureLastOrderMessage ?? '',
    lastOrderTime: closureState.lastOrderTime ?? '',
    onClose: closureState.closeLastOrderAlertModal,
  };

  const pageStates = {
    shopClosure: {
      show: closureState.showClosed,
      message: closureState.closureMessage ?? '',
      startTime: closureState.closureStartTime ?? '',
      endTime: closureState.closureEndTime ?? '',
    },
    breakTime: {
      show: breakTimeState.showBreakTime,
      message: breakTimeState.breakTimeMessage ?? '',
      startTime: breakTimeState.breakTimeStartTime ?? '',
      endTime: breakTimeState.breakTimeEndTime ?? '',
    },
    breakTimeLastOrder: breakTimeLastOrderState,
    closureLastOrder: closureLastOrderState,
    standbyAd: {
      // API·영상 다운로드 로딩 중에는 노출하지 않음
      // 로딩 완료 후 파일이 없으면 즉시 해제, 있으면 광고 노출
      show:
        standbyAdData.isStandbyAdVisible &&
        !isMenuAdFilesLoading &&
        !adData.isAdDataLoading &&
        adData.standbyFiles.length > 0,
    },
    initialPage: {
      show: initialPageData.showInitialPage && hasInitialPageDetailImages,
    },
    languageSelector: {
      show: languageSettings.showLanguageSelector,
    },
    customerCount: {
      show: customerCountSettings.showCustomerCountSelector,
    },
    pickupAlarm: {
      show: usePickupAlert && pickUpAlarmData.showPickupAlarm,
    },
    cartReminder: {
      show: cartReminderData.showCartReminder,
    },
    // 주문내역 로드 전/비어있을 때는 미표시 → AppStorage 복원 후 API 응답 대기 시 깜빡임 방지
    cashPaymentInducement: {
      show:
        modalData.isCashPaymentInducementModalOpened &&
        (orderHistories?.orderDetailMenuList?.length ?? 0) >= 1,
    },
  };

  const handleOpenAdminAccessPasswordModal = () => {
    adminAccessControl.setShowAdminAccessPasswordModal(true);
  };

  // root 페이지 첫 진입 시 화면을 그리는데 필요한 데이터가 모두 로드됐는지 판단
  // 초기 화면 노출 여부 / 언어 선택 노출 여부 / 고객 수 선택 노출 여부
  const isFirstPaintReady =
    (shopDetailData !== null || !isShopDetailLoading) &&
    (shopThemeData?.themePageData !== null || !isThemePageLoading) &&
    (tableOrderHistoriesData !== null || !isTableOrderHistoriesLoading);

  // isFirstPaintReady를 구성하면서 깜빡임이 발생 가능하여 최소 노출을 하기 위한 상태
  const [isMinVisibleElapsed, setIsMinVisibleElapsed] = useState(false);
  // loading UI가 제거되지 않는 경우를 고려하여 강제 해제하기 위한 상태
  const [isForceHidden, setIsForceHidden] = useState(false);

  useEffect(() => {
    const FIRST_PAINT_MIN_VISIBLE_MS = 1000;
    const FIRST_PAINT_MAX_VISIBLE_MS = 3000;

    // 최소 노출 시간 경과 여부를 설정
    const minTimer = setTimeout(
      () => setIsMinVisibleElapsed(true),
      FIRST_PAINT_MIN_VISIBLE_MS
    );
    // 최대 노출 시간 경과 여부를 설정
    const maxTimer = setTimeout(
      () => setIsForceHidden(true),
      FIRST_PAINT_MAX_VISIBLE_MS
    );
    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  // 강제 해제 전이면서 (최소 노출 시간 미경과 또는 아직 미정착)일 때 로딩 화면으로 대체
  const showFirstPaintLoading =
    !isForceHidden && (!isMinVisibleElapsed || !isFirstPaintReady);

  if (showFirstPaintLoading) {
    return <PosSyncOverlayModal message={t('화면을 준비하는 중')} />;
  }

  /** 휴무 페이지 */
  if (pageStates.shopClosure.show) {
    return (
      <ClosedPage
        message={pageStates.shopClosure.message}
        startTime={pageStates.shopClosure.startTime}
        endTime={pageStates.shopClosure.endTime}
      />
    );
  }

  /** 브레이크타임 화면 노출 */
  if (pageStates.breakTime.show) {
    return (
      <BreakTime
        message={pageStates.breakTime.message}
        startTime={pageStates.breakTime.startTime}
        endTime={pageStates.breakTime.endTime}
      />
    );
  }

  /** 라스트오더 페이지 */
  if (pageStates.breakTimeLastOrder.show) {
    return (
      <LastOrder
        message={pageStates.breakTimeLastOrder.message}
        lastOrderTime={pageStates.breakTimeLastOrder.lastOrderTime}
        onClose={pageStates.breakTimeLastOrder.onClose}
      />
    );
  }

  /** 영업마감 라스트오더 페이지 */
  if (pageStates.closureLastOrder.show) {
    return (
      <LastOrder
        message={pageStates.closureLastOrder.message}
        lastOrderTime={pageStates.closureLastOrder.lastOrderTime}
        onClose={pageStates.closureLastOrder.onClose}
      />
    );
  }

  /** 현금 결제 유도 모달 표시 */
  if (pageStates.cashPaymentInducement.show) {
    return <CashPaymentInducement />;
  }

  /** 초기 화면 / 언어 선택 / 객수 선택: 전체화면 페이지 위에 주문 완료 모달 노출 */
  if (
    pageStates.standbyAd.show ||
    pageStates.initialPage.show ||
    pageStates.languageSelector.show ||
    pageStates.customerCount.show
  ) {
    return (
      <>
        {pageStates.initialPage.show && <InitialPage />}
        {pageStates.customerCount.show && <CustomerCountSelector />}
        {pageStates.languageSelector.show && <LanguageSelector />}
        {pageStates.standbyAd.show && <StandbyAd />}
        {modalData.isOrderCompleteModalOpened && (
          <OrderCompleteModalContainer />
        )}
        {/* 초기화면이 노출된 상태에서 픽업 알림 노출 */}
        {pageStates.pickupAlarm.show && (
          <S.PickupAlarmOverlay>
            <PickupAlarm />
          </S.PickupAlarmOverlay>
        )}
      </>
    );
  }

  return (
    <S.Container>
      <Header
        orderHistories={orderHistories}
        openAdminAccessPasswordModal={handleOpenAdminAccessPasswordModal}
        breakTimeState={breakTimeState}
        closureState={closureState}
      />

      <S.MainContent>
        <Sidebar
          categories={nonStaffCallCategories}
          staffCallCategory={staffCallCategory}
          selectedCategorySeq={categoryNavigation.selectedCategorySeq}
          handleCategoryClick={categoryNavigation.handleCategoryClick}
        />

        <Contents
          categories={nonStaffCallCategories}
          useSinglePageMenuboard={useSinglePageMenuboard}
          categoryNavigation={categoryNavigation}
        />

        <CartButton categories={visibleCategories} />
      </S.MainContent>

      {/* 장바구니 메뉴 주문 리마인더 표시 */}
      {/* Sidebar/Contents 상태(선택 카테고리, 스크롤) 유지하기 위하여 현재 위치에 표시 */}
      {pageStates.cartReminder.show && <CartReminder />}

      {/* 픽업 알림: 메인 컨텐츠 위에 덮어씌움. 장바구니/결제 등 모달은 zIndex.modalBackdrop(400) 이상으로 이 위에 노출됨 */}
      {pageStates.pickupAlarm.show && (
        <S.PickupAlarmOverlay>
          <PickupAlarm />
        </S.PickupAlarmOverlay>
      )}

      {modalData.isOrderCompleteModalOpened && <OrderCompleteModalContainer />}
    </S.Container>
  );
};
