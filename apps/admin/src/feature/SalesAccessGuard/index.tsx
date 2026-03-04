import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePostLoginSales } from '@repo/api/queries';
import { CapacitorApp } from '@repo/util/app';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { AdminAccessPasswordModal } from '@/feature/AdminAccessPasswordModal';
import { useAdminTranslation } from '@/config/i18n';
import { openConfirmDialog } from '@repo/feature/utils';

interface SalesAccessGuardProps {
  children: ReactNode;
  /**
   * 재검증을 강제하기 위한 선택적 키 (예: 모달 열림 상태).
   * 이 값이 변경되면 접근 권한 재검증이 트리거됩니다.
   */
  revalidateKey?: boolean | null;
  /**
   * 비밀번호 모달을 닫을 때 호출되는 콜백 함수.
   * 부모 컴포넌트의 상태를 초기화하는데 사용됩니다.
   */
  onClose?: () => void;
}

export const SalesAccessGuard = ({
  children,
  revalidateKey = null,
  onClose,
}: SalesAccessGuardProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { shopCode } = useAuth();
  const { data: shopDetailData, refresh } = useShopDetailData();
  const { t } = useAdminTranslation();

  const { mutateAsync: loginSales } = usePostLoginSales({
    ignoreGlobalErrors: [401],
    options: {
      onError: (error) => {
        if (error.response?.status === 401) {
          openConfirmDialog({
            title: t('인증 실패'),
            content: t('인증에 실패했습니다. 비밀번호를 다시 입력해주세요.'),
          });
        }
      },
    },
  });

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prevPathnameRef = useRef(location.pathname);

  const hasContent = Boolean(children);
  const isNative = CapacitorApp.isNative();

  const currentShopSetting = shopDetailData?.shopSetting;

  const shouldRequireAuth = useMemo(
    () => isNative && currentShopSetting?.isSalesDetailLocked === true,
    [currentShopSetting?.isSalesDetailLocked, isNative]
  );

  useEffect(() => {
    // children이 없으면 초기화하고 종료
    if (!hasContent) {
      setIsUnlocked(false);
      setIsModalOpen(false);
      return;
    }

    // 컴포넌트 언마운트 시 비동기 작업 취소를 위한 플래그
    let isCancelled = false;

    /**
     * 접근 권한을 확인하는 비동기 함수
     * 네이티브 환경에서 매출 상세 잠금 설정이 활성화되어 있으면 비밀번호 인증 모달을 표시
     */
    const checkAccess = async () => {
      // 페이지가 변경되었는지 확인
      const isPageChanged = prevPathnameRef.current !== location.pathname;
      if (isPageChanged) {
        prevPathnameRef.current = location.pathname;
        // 페이지 이동 시마다 인증 상태 초기화 (보안)
        setIsUnlocked(false);
      }

      // 웹 환경이면 인증 없이 바로 접근 허용
      if (!isNative) {
        setIsUnlocked(true);
        setIsModalOpen(false);
        return;
      }

      // 네이티브 환경: 최신 매장 설정 데이터를 새로고침
      const refreshed = await refresh();
      const latestSetting = (refreshed ?? shopDetailData)?.shopSetting;

      // 컴포넌트가 언마운트되었으면 작업 중단
      if (isCancelled) {
        return;
      }

      // 매출 상세 잠금 설정이 활성화되어 있는지 확인
      const requireAuth =
        isNative && latestSetting?.isSalesDetailLocked === true;

      // 인증이 필요없으면 바로 잠금 해제
      if (!requireAuth) {
        setIsUnlocked(true);
        setIsModalOpen(false);
        return;
      }

      // 페이지가 변경되지 않았고 이미 인증되었으면 모달을 다시 띄우지 않음
      if (!isPageChanged && isUnlocked) {
        return;
      }

      // 인증이 필요하면 비밀번호 입력 모달 표시
      setIsModalOpen(true);
    };

    checkAccess();

    // cleanup: 컴포넌트 언마운트 시 비동기 작업 취소
    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasContent, isNative, location.pathname, revalidateKey]);

  const handleSalesAuthSubmit = useCallback(
    async (password: string) => {
      if (!shopCode) {
        return;
      }

      await loginSales({
        shopCode,
        pw: password,
      });
    },
    [loginSales, shopCode]
  );

  const handleSalesAuthSuccess = useCallback(() => {
    setIsUnlocked(true);
    setIsModalOpen(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setIsUnlocked(false);
    if (onClose) {
      onClose();
    } else if (!location.pathname.startsWith(ROUTES.TABLES.path)) {
      navigate(ROUTES.SETTINGS.NOTICES.generate());
    }
  }, [navigate, location.pathname, onClose]);

  if (!hasContent) {
    return null;
  }

  if (!isNative || !shouldRequireAuth) {
    return children;
  }

  const isShopSettingLoaded = shopDetailData !== null;
  if (isNative && !isShopSettingLoaded) {
    return null;
  }

  return (
    <>
      {isUnlocked && children}
      {isModalOpen && (
        <AdminAccessPasswordModal
          onClose={handleClose}
          onSubmit={handleSalesAuthSubmit}
          onSuccess={handleSalesAuthSuccess}
          type="sales"
        />
      )}
    </>
  );
};
