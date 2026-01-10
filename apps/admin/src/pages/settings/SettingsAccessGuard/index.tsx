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
import { openConfirmDialog } from '@repo/feature/utils';
import { useAdminTranslation } from '@/config/i18n';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { AdminAccessPasswordModal } from '@/feature/AdminAccessPasswordModal';

interface SettingsAccessGuardProps {
  children: ReactNode;
}

export const SettingsAccessGuard = ({ children }: SettingsAccessGuardProps) => {
  const navigate = useNavigate();
  const { t } = useAdminTranslation();
  const { shopCode } = useAuth();
  const { data: shopDetailData, refresh: refreshShopDetailData } =
    useShopDetailData();
  const { shopSetting } = shopDetailData ?? {};

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
  }, [refreshShopDetailData]);

  useEffect(() => {
    if (!requireAuth) {
      setIsUnlocked(true);
      return;
    }
    setIsModalOpen(true);
  }, [requireAuth]);

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

  const handleAdminAuthError = useCallback(
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
          onSubmitError={handleAdminAuthError}
          onSuccess={handleAdminAuthSuccess}
        />
      )}
    </>
  );
};
