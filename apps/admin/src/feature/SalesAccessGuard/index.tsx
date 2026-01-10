import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { openConfirmDialog } from '@repo/feature/utils';
import { usePostLoginSales } from '@repo/api/queries';
import { CapacitorApp } from '@repo/util/app';
import { useAdminTranslation } from '@/config/i18n';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { AdminAccessPasswordModal } from '@/feature/AdminAccessPasswordModal';

interface SalesAccessGuardProps {
  children: ReactNode;
  /**
   * 재검증을 강제하기 위한 선택적 키 (예: 모달 열림 상태).
   * 이 값이 변경되면 접근 권한 재검증이 트리거됩니다.
   */
  revalidateKey?: boolean | null;
}

export const SalesAccessGuard = ({
  children,
  revalidateKey = null,
}: SalesAccessGuardProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useAdminTranslation();
  const { shopCode } = useAuth();
  const { data: shopDetailData, refresh } = useShopDetailData();
  const { mutateAsync: loginSales } = usePostLoginSales({
    ignoreGlobalErrors: [401],
  });

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      // 보안을 위해 먼저 잠금 상태로 설정
      setIsUnlocked(false);

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

      // 인증이 필요하면 비밀번호 입력 모달 표시
      setIsModalOpen(true);
    };

    checkAccess();

    // cleanup: 컴포넌트 언마운트 시 비동기 작업 취소
    return () => {
      isCancelled = true;
    };
  }, [
    hasContent,
    isNative,
    refresh,
    shopDetailData,
    location.pathname,
    revalidateKey,
  ]);

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

  const handleSalesAuthError = useCallback(
    (error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 401) {
        openConfirmDialog({
          title: t('인증 실패'),
          content: t('인증에 실패했습니다. 비밀번호를 다시 입력해주세요.'),
        });
      }
    },
    [t]
  );

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setIsUnlocked(false);
    if (!location.pathname.startsWith(ROUTES.TABLES.path)) {
      navigate(-1);
    }
  }, [navigate, location.pathname]);

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
          onSubmitError={handleSalesAuthError}
          onSuccess={handleSalesAuthSuccess}
        />
      )}
    </>
  );
};
