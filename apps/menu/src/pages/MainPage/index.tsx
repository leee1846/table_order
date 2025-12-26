import * as S from '@/pages/MainPage/mainPage.style';
import { Sidebar } from '@/pages/MainPage/Sidebar';
import { Header } from '@/pages/MainPage/Header';
import { CartButton } from '@/pages/MainPage/CartButton';
import { Contents } from '@/pages/MainPage/Contents';
import { PageRenderer } from '@/pages/MainPage/PageRenderer';
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
import { useCartReminderStore } from '@/stores/useCartReminderStore';
import { useAppThemeSettings } from '@/pages/MainPage/hooks/useAppThemeSettings';
import { useCustomerLanguageSettings } from '@/pages/MainPage/hooks/useCustomerLanguageSettings';
import { useCustomerCountSettings } from '@/pages/MainPage/hooks/useCustomerCountSettings';
import { useAdminAccessControl } from '@/pages/MainPage/hooks/useAdminAccessControl';
import { useFirstOrderRequiredCheck } from '@/pages/MainPage/hooks/useFirstOrderRequiredCheck';
import { useBreakTimeCartClear } from '@/pages/MainPage/hooks/useBreakTimeCartClear';
import { useCategoryVisibilityManager } from '@/hooks/useCategoryVisibilityManager';
import { useShopPageSettingData } from '@/hooks/useShopPageSettingData';

export const MainPage = () => {
  useShopData();
  const { data: shopDetailData } = useShopDetailData();
  const deviceDataResult = useDeviceData();
  const {
    categories,
    visibleCategories,
    staffCallCategory,
    nonStaffCallCategories,
  } = useCategoriesData();
  const { data: tableOrderHistoriesData } = useTableOrderHistoriesData();
  useShopPageSettingData();

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

  useAppThemeSettings(shopDetailData);
  const languageSettings = useCustomerLanguageSettings(shopDetailData);
  const customerCountSettings = useCustomerCountSettings(
    shopDetailData,
    tableOrderHistoriesData
  );
  const adminAccessControl = useAdminAccessControl(deviceDataResult);
  useFirstOrderRequiredCheck();
  useBreakTimeCartClear(breakTimeState);

  const { data: initialPageData } = useInitialPageStore();
  const { data: pickUpAlarmData } = usePickupAlarmStore();
  const { data: cartReminderData } = useCartReminderStore();

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
    initialPage: {
      show: initialPageData.showInitialPage,
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
  };

  const handleOpenAdminAccessPasswordModal = () => {
    adminAccessControl.setShowAdminAccessPasswordModal(true);
  };

  const mainContent = (
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
          selectedCategory={categoryNavigation.selectedCategory}
        />

        <CartButton categories={visibleCategories} />
      </S.MainContent>
    </S.Container>
  );

  return <PageRenderer states={pageStates} mainContent={mainContent} />;
};
