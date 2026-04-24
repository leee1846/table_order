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
import { useAdminTranslation } from '@/config/i18n';
import { openConfirmDialog } from '@repo/feature/utils';

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
  const { t } = useAdminTranslation();

  const { mutateAsync: loginMenuboardAdmin } = usePostLoginMenuboardAdmin({
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

        if (error.response?.status === 400) {
          if (error.response?.data?.status?.code === -104) {
            handleClose();
          }
        }
      },
    },
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
    // requireAuth가 변경되면 인증 상태 리셋
    if (!requireAuth) {
      setIsUnlocked(true);
      setIsModalOpen(false);
      return;
    }

    // 인증이 필요하면 모달 표시
    setIsUnlocked(false);
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
          type="settings"
        />
      )}
    </>
  );
};
