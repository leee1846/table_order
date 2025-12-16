import * as S from '@/pages/MainPage/mainPage.style';
import { Sidebar } from '@/pages/MainPage/Sidebar';
import { Header } from '@/pages/MainPage/Header';
import { CartButton } from '@/pages/MainPage/CartButton';
import { Contents } from '@/pages/MainPage/Contents';
import { PageRenderer } from '@/pages/MainPage/components/PageRenderer';
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

export const MainPage = () => {
  // ========================================
  // 초기 데이터 로드
  // ========================================
  /** 상점 데이터 로드 */
  useShopData();
  /** 상점 상세 데이터 로드 */
  const { data: shopDetailData } = useShopDetailData();
  /** 테이블 데이터 로드 */
  const deviceDataResult = useDeviceData();
  /** 카테고리 데이터 로드 및 선택자 */
  const {
    categories,
    visibleCategories,
    staffCallCategory,
    nonStaffCallCategories,
  } = useCategoriesData();
  /** 테이블 주문 내역 데이터 로드 */
  const { data: tableOrderHistoriesData } = useTableOrderHistoriesData();

  // ========================================
  // 비즈니스 로직 훅
  // ========================================
  /** 카테고리 노출/비노출 상태 관리 (판매 시간/요일) */
  useCategoryVisibilityManager(categories);

  /** 카테고리 네비게이션 (스크롤/탭 모드) */
  const categoryNavigation = useCategoryNavigation({
    categories: nonStaffCallCategories,
    useSinglePageMenuboard:
      shopDetailData?.shopSetting?.useSinglePageMenuboard ?? false,
  });

  /** 브레이크타임 상태 관리 */
  const breakTimeState = useBreakTime();

  /** 영업마감 상태 관리 */
  const closureState = useShopClosure();

  // ========================================
  // 앱 설정 및 초기화
  // ========================================
  /** 다크모드 설정 */
  useAppThemeSettings(shopDetailData);

  /** 고객 언어 설정 */
  const languageSettings = useCustomerLanguageSettings(shopDetailData);

  /** 객수 선택 설정 */
  const customerCountSettings = useCustomerCountSettings(shopDetailData);

  /** 관리자 접근 제어 */
  const adminAccessControl = useAdminAccessControl(deviceDataResult);

  /** 첫 주문 필수 항목 체크 */
  useFirstOrderRequiredCheck();

  /** 브레이크타임 시 장바구니 클리어 */
  useBreakTimeCartClear(breakTimeState);

  // ========================================
  // 화면 노출 상태
  // ========================================
  /** 초기 화면 페이지 노출 여부 */
  const { data: initialPageData } = useInitialPageStore();

  /** 픽업 알림 노출 여부 */
  const { data: showPickupAlarm } = usePickupAlarmStore();

  /** 장바구니 메뉴 주문 리마인더 노출 여부 */
  const { data: cartReminderData } = useCartReminderStore();

  // ========================================
  // 브레이크타임 메시지 계산
  // ========================================
  const BTLastOrderMessage =
    (breakTimeState.isBreakTimeLastOrder ||
      breakTimeState.isBreakTimeLastOrderAlert) &&
    breakTimeState.breakTimeLastOrderMessage
      ? breakTimeState.breakTimeLastOrderMessage
      : '';

  // ========================================
  // 영업마감 메시지 계산
  // ========================================
  const closureLastOrderMessage =
    (closureState.isClosureLastOrder || closureState.isClosureLastOrderAlert) &&
    closureState.closureLastOrderMessage
      ? closureState.closureLastOrderMessage
      : '';

  return (
    <PageRenderer
      states={{
        adminAccess: {
          show: adminAccessControl.showAdminAccessPasswordModal,
          onClose: () =>
            adminAccessControl.setShowAdminAccessPasswordModal(false),
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
          show:
            (shopDetailData?.shopSetting?.usePickupAlert ?? false) &&
            showPickupAlarm,
        },
        cartReminder: {
          show: cartReminderData.showCartReminder,
        },
      }}
      mainContent={
        <S.Container>
          <Header
            orderHistories={tableOrderHistoriesData}
            openAdminAccessPasswordModal={() =>
              adminAccessControl.setShowAdminAccessPasswordModal(true)
            }
            breakTimeLastOrderMessage={`${BTLastOrderMessage} ${closureLastOrderMessage}`}
            isLastOrder={
              breakTimeState.isBreakTimeLastOrder ||
              closureState.isClosureLastOrder
            }
          />

          <S.MainContent>
            <Sidebar
              categories={nonStaffCallCategories}
              staffCallCategory={staffCallCategory}
              selectedCategorySeq={categoryNavigation.selectedCategorySeq}
              handleCategoryClick={categoryNavigation.handleCategoryClick}
              isLastOrder={
                breakTimeState.isBreakTimeLastOrder ||
                closureState.isClosureLastOrder
              }
            />

            <Contents
              categories={nonStaffCallCategories}
              useSinglePageMenuboard={
                shopDetailData?.shopSetting?.useSinglePageMenuboard ?? false
              }
              selectedCategory={categoryNavigation.selectedCategory}
              isLastOrder={
                breakTimeState.isBreakTimeLastOrder ||
                closureState.isClosureLastOrder
              }
            />

            <CartButton
              categories={visibleCategories}
              isLastOrder={
                breakTimeState.isBreakTimeLastOrder ||
                closureState.isClosureLastOrder
              }
            />
          </S.MainContent>
        </S.Container>
      }
    />
  );
};
