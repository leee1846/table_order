import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostLoginMenuboardAdmin } from '@repo/api/queries';
import { CapacitorApp } from '@repo/util/app';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { AdminAccessPasswordModal } from '@/feature/AdminAccessPasswordModal';

interface SettingsAccessGuardProps {
  children: ReactNode;
}

export const SettingsAccessGuard = ({ children }: SettingsAccessGuardProps) => {
  const navigate = useNavigate();
  const { shopCode } = useAuth();
  const { data: shopDetailData, refresh: refreshShopDetailData } =
    useShopDetailData();
  const { shopSetting } = shopDetailData ?? {};

  // 관리자 인증 완료 여부 (인증 성공 시 true로 설정되어 페이지 접근 허용)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutateAsync: loginMenuboardAdmin } = usePostLoginMenuboardAdmin({
    ignoreGlobalErrors: [401],
  });

  const isNative = CapacitorApp.isNative();
  const isShopSettingLoaded = shopDetailData !== null;
  const requireAuth = useMemo(
    () => isNative && !!shopSetting?.isAdminLocked,
    [isNative, shopSetting?.isAdminLocked]
  );

  useEffect(() => {
    refreshShopDetailData();
  }, []); // 초기 마운트 시 한 번만 실행

  useEffect(() => {
    if (!requireAuth) {
      setIsUnlocked(true);
      return;
    }

    // 이미 인증 완료된 경우 모달을 다시 띄우지 않음
    if (isUnlocked) {
      return;
    }

    setIsModalOpen(true);
  }, [requireAuth, isUnlocked]);

  const handleAdminAuthSubmit = useCallback(
    async (password: string) => {
      if (!shopCode) {
        return;
      }

      await loginMenuboardAdmin({
        shopCode,
        pw: password,
      });
    },
    [loginMenuboardAdmin, shopCode]
  );

  const handleAdminAuthSuccess = useCallback(() => {
    setIsUnlocked(true);
    setIsModalOpen(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setIsUnlocked(false);
    navigate(ROUTES.TABLES.generate());
  }, [navigate]);

  if (!requireAuth) {
    return children;
  }

  if (isNative && !isShopSettingLoaded) {
    return null;
  }

  return (
    <>
      {isUnlocked && children}
      {isModalOpen && (
        <AdminAccessPasswordModal
          onClose={handleClose}
          onSubmit={handleAdminAuthSubmit}
          onSuccess={handleAdminAuthSuccess}
        />
      )}
    </>
  );
};
