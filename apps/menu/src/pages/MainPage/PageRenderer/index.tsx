import type { ReactNode } from 'react';
import { AdminAccessPasswordModal } from '@/pages/MainPage/AdminAccessPasswordModal';
import { ClosedPage } from '@/pages/MainPage/ClosedPage';
import { BreakTime } from '@/pages/MainPage/BreakTime';
import { InitialPage } from '@/pages/MainPage/InitialPage';
import { LanguageSelector } from '@/pages/MainPage/LanguageSelector';
import { CustomerCountSelector } from '@/pages/MainPage/CustomerCountSelector';
import { PickupAlarm } from '@/pages/MainPage/PickAlarm';
import { CartReminder } from '@/pages/MainPage/CartReminder';
import { LastOrder } from '../LastOrder';

interface PageRendererState {
  // 관리자 접근 제어
  adminAccess: {
    show: boolean;
    onClose: () => void;
  };
  // 휴무 상태
  shopClosure: {
    show: boolean;
    message: string;
    startTime: string;
    endTime: string;
  };
  // 브레이크타임
  breakTime: {
    show: boolean;
    message: string;
    startTime: string;
    endTime: string;
  };
  // 초기 화면
  initialPage: {
    show: boolean;
  };
  // 언어 선택
  languageSelector: {
    show: boolean;
  };
  // 객수 선택
  customerCount: {
    show: boolean;
  };
  // 픽업 알림
  pickupAlarm: {
    show: boolean;
  };
  // 장바구니 리마인더
  cartReminder: {
    show: boolean;
  };
}

interface PageRendererProps {
  states: PageRendererState;
  mainContent: ReactNode;
}

/**
 * 우선순위에 따라 적절한 페이지/모달을 렌더링함
 * 각 조건을 순서대로 체크하여 가장 높은 우선순위 페이지를 렌더링함
 */
export const PageRenderer = ({ states, mainContent }: PageRendererProps) => {
  /** 관리자 접근 비밀번호 모달 노출 */
  if (states.adminAccess.show) {
    return <AdminAccessPasswordModal onClose={states.adminAccess.onClose} />;
  }

  /** 휴무 페이지 */
  if (states.shopClosure.show) {
    return (
      <ClosedPage
        message={states.shopClosure.message}
        startTime={states.shopClosure.startTime}
        endTime={states.shopClosure.endTime}
      />
    );
  }

  /** 브레이크타임 화면 노출 */
  if (states.breakTime.show) {
    return (
      <BreakTime
        message={states.breakTime.message}
        startTime={states.breakTime.startTime}
        endTime={states.breakTime.endTime}
      />
    );
  }

  const lastOrder = true;
  /** 라스트오더 페이지 */
  if (lastOrder) {
    return <LastOrder />;
  }

  /** 초기 화면 노출 */
  if (states.initialPage.show) {
    return <InitialPage />;
  }

  /** 고객 메뉴판 언어 선택 */
  if (states.languageSelector.show) {
    return <LanguageSelector />;
  }

  /** 고객 객수 선택 */
  if (states.customerCount.show) {
    return <CustomerCountSelector />;
  }

  /** 픽업 알림 표시 */
  if (states.pickupAlarm.show) {
    return <PickupAlarm />;
  }

  /** 장바구니 메뉴 주문 리마인더 표시 */
  if (states.cartReminder.show) {
    return <CartReminder />;
  }

  /** 기본 메인 컨텐츠 */
  return <>{mainContent}</>;
};
