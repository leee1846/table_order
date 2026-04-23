import * as S from '@/pages/MainPage/mainPage.style';
import { InitialAd } from '@/pages/MainPage/InitialAd';
import { Sidebar } from '@/pages/MainPage/Sidebar';
import { Header } from '@/pages/MainPage/Header';
import { CartButton } from '@/pages/MainPage/CartButton';
import { Contents } from '@/pages/MainPage/Contents';
import { useShopData } from '@/hooks/useShopData';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useCategoryNavigation } from '@/hooks/useCategoryNavigation';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useBreakTime } from '@/hooks/useBreakTime';
import { useShopClosure } from '@/hooks/useShopClosure';
import { usePickupAlarmStore } from '@/stores/usePickupAlarmStore';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useInitialAdStore } from '@/stores/useInitialAdStore';
import { useCartReminderStore } from '@/stores/useCartReminderStore';
import { useAppThemeSettings } from '@/hooks/useAppThemeSettings';
import { useCustomerLanguageSettings } from '@/hooks/useCustomerLanguageSettings';
import { useCustomerCountSettings } from '@/hooks/useCustomerCountSettings';
import { useAdminAccessControl } from '@/hooks/useAdminAccessControl';
import { useFirstOrderRequiredCheck } from '@/hooks/useFirstOrderRequiredCheck';
import { useBreakTimeCartClear } from '@/hooks/useBreakTimeCartClear';
import { useCategoryVisibilityManager } from '@/hooks/useCategoryVisibilityManager';
import { useShopThemePage } from '@/hooks/useShopThemePage';
import { AdminAccessPasswordModal } from '@/pages/MainPage/AdminAccessPasswordModal';
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

export const MainPage = () => {
  useShopData();
  useTableGroupData();
  const { data: shopDetailData } = useShopDetailData();
  const deviceDataResult = useDeviceData();
  const {
    categories,
    visibleCategories,
    staffCallCategory,
    nonStaffCallCategories,
  } = useCategoriesData();
  const { data: tableOrderHistoriesData } = useTableOrderHistoriesData();
  const { data: shopThemeData } = useShopThemePage();
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
  const { data: initialAdData } = useInitialAdStore();
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
    adminAccess: {
      show: adminAccessControl.showAdminAccessPasswordModal,
      onClose: () => adminAccessControl.setShowAdminAccessPasswordModal(false),
    },
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
    initialAd: {
      show: initialAdData.isInitialAdVisible,
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

  /** 관리자 접근 비밀번호 모달 노출 */
  if (pageStates.adminAccess.show) {
    return (
      <AdminAccessPasswordModal onClose={pageStates.adminAccess.onClose} />
    );
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
    pageStates.initialAd.show ||
    pageStates.initialPage.show ||
    pageStates.languageSelector.show ||
    pageStates.customerCount.show
  ) {
    return (
      <>
        {pageStates.customerCount.show && <CustomerCountSelector />}
        {pageStates.languageSelector.show && <LanguageSelector />}
        {pageStates.initialPage.show && <InitialPage />}
        {pageStates.initialAd.show && <InitialAd />}
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
