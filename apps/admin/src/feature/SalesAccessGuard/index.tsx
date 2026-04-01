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
            confirmText: t('확인'),
          });
        }
      },
    },
  });

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prevPathnameRef = useRef(location.pathname);
  const prevRevalidateKeyRef = useRef(revalidateKey);
  const shopDetailDataRef = useRef(shopDetailData);

  useEffect(() => {
    shopDetailDataRef.current = shopDetailData;
  }, [shopDetailData]);

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
      prevRevalidateKeyRef.current = revalidateKey;
      setIsUnlocked(false);
      setIsModalOpen(false);
      return;
    }

    // 컴포넌트 언마운트 시 비동기 작업 취소를 위한 플래그
    let isCancelled = false;

    /**
     * 접근 권한을 확인하는 비동기 함수
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
        prevRevalidateKeyRef.current = revalidateKey;
        setIsUnlocked(true);
        setIsModalOpen(false);
        return;
      }

      // 네이티브: 모달 열림(revalidateKey false→true) 또는 경로 변경 시에만 네트워크 새로고침.
      // (매번 refresh하면 useQuery 초기 fetch와 중복되고, Strict Mode에서 호출이 더 늘어남)
      const revalidateEdge =
        revalidateKey === true && prevRevalidateKeyRef.current !== true;
      prevRevalidateKeyRef.current = revalidateKey;

      const shouldNetworkRefresh =
        isPageChanged ||
        revalidateEdge ||
        (shopDetailData === null && isNative);

      let refreshed: Awaited<ReturnType<typeof refresh>> = null;
      if (shouldNetworkRefresh) {
        refreshed = await refresh();
      }

      const latestSetting = (refreshed ?? shopDetailDataRef.current)
        ?.shopSetting;

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

      // 인증이 필요하면 상태 리셋 후 모달 표시
      setIsUnlocked(false);
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
    location.pathname,
    revalidateKey,
    refresh,
    shopDetailData,
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
