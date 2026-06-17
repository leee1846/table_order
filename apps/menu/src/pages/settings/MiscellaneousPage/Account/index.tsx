import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { getLatestAppVersion } from '@repo/api/fetchers';
import { useGetLatestAppVersion, usePostDeviceLogout } from '@repo/api/queries';
import type { ITokenPayload, TAppType } from '@repo/api/types';
import { getAccessToken } from '@repo/api/auth';
import { BasicButton, LoadingSpinner } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import { theme } from '@repo/ui';
import {
  openConfirmDialog,
  openDualActionDialog,
  toast,
} from '@repo/feature/utils';
import { decodeJwtToken } from '@repo/util/function';
import { CapacitorApp, Installer } from '@repo/util/app';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { ROUTES } from '@/constants/routes';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { clearAuthData } from '@/utils/auth';
import * as S from '@/pages/settings/MiscellaneousPage/Account/account.style';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { axios } from '@repo/api/axios';
import { isMenuboardTokenExpiredError } from '@/feature/MenuboardAuth/menuboardAuthError';

const APP_TYPE: TAppType = 'MENU';

export const Account = () => {
  const versionEnv = import.meta.env.VITE_APP_VERSION_ENV;
  const { t } = useAdminTranslation();

  const currentAccessToken = getAccessToken();
  const tokenPayload = decodeJwtToken<ITokenPayload>(currentAccessToken ?? '');
  const username = tokenPayload?.sub;

  const { data: currentShopDetail } = useShopDetailData();
  const shopCode = currentShopDetail?.shopCode;
  const shopName = currentShopDetail?.shopName;

  const deviceData = useDeviceStore((s) => s.data);
  const { data: latestVersionData } = useGetLatestAppVersion(APP_TYPE);

  const latestAppVersionText = latestVersionData?.data?.version;
  const [currentVersion, setCurrentVersion] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!CapacitorApp.isNative()) {
      return;
    }

    const getAppInfo = async () => {
      const appInfo = await CapacitorApp.getInfo();
      setCurrentVersion(appInfo?.version ?? '');
    };

    void getAppInfo();
  }, []);

  const executeAppUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await getLatestAppVersion(APP_TYPE);
      const { downloadPath, checksum } = response?.data ?? {};

      if (!downloadPath || !checksum) {
        toast(t('업데이트 정보를 가져올 수 없습니다.'), {
          position: 'center-center',
          duration: 1000,
        });
        setIsUpdating(false);
        return;
      }

      toast(t('업데이트를 시작합니다. 잠시만 기다려주세요.'), {
        position: 'center-center',
        duration: 1500,
      });
      await Installer.startUpdate(downloadPath, checksum);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('업데이트에 실패했습니다.');
      openConfirmDialog({
        title: t('업데이트 실패'),
        content: message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAppUpdate = () => {
    if (
      latestAppVersionText &&
      currentVersion &&
      currentVersion === latestAppVersionText
    ) {
      toast(t('이미 최신 버전입니다.'), {
        position: 'center-center',
        duration: 1000,
      });
      return;
    }

    openDualActionDialog({
      title: t('앱 업데이트'),
      content: t('앱을 업데이트하시겠습니까?'),
      primaryText: t('예'),
      secondaryText: t('아니오'),
      onConfirm: () => {
        void executeAppUpdate();
      },
    });
  };

  // 예측 불가능한 로그아웃 api 에러 시, api요청 실패 상태에서 로그아웃 처리
  // 400, 404, 409, 500, 502 에러 코드는 예측 불가능한 에러 코드로 간주
  const { mutateAsync: postDeviceLogout } = usePostDeviceLogout({
    ignoreGlobalErrors: [400, 404, 409, 500, 502],
  });
  const handleLogout = () => {
    const proceedLogout = () => {
      clearAuthData();
      window.location.href = ROUTES.LOGIN.generate();
    };

    openDualActionDialog({
      title: t('로그아웃'),
      content: t('로그아웃하시겠습니까?'),
      primaryText: t('예'),
      secondaryText: t('아니오'),
      onConfirm: () => {
        if (!shopCode) {
          proceedLogout();
          return;
        }

        postDeviceLogout(shopCode)
          .then(proceedLogout)
          .catch((error) => {
            // 로그인 인증 토큰 만료(401) 시, interceptor에서 처리되므로 여기서는 처리하지 않음
            // 메뉴보드 토큰 만료(403, -107) 시, interceptor에서 처리되므로 여기서는 처리하지 않음
            if (
              axios.isCancel(error) ||
              error?.response?.status === 401 ||
              isMenuboardTokenExpiredError(error)
            ) {
              return;
            }

            // 예측 불가능한 로그아웃 api 에러 시, api요청 실패 상태에서 로그아웃 처리
            proceedLogout();
          });
      },
    });
  };

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <UIStyles.setting.Title>
          {t('시스템 버전 및 네트워크 정보')}
        </UIStyles.setting.Title>
        <div style={{ display: 'flex', gap: 12 }}>
          {CapacitorApp.isNative() && (
            <BasicButton
              variant="Outline_Grey_M"
              onClick={handleAppUpdate}
              disabled={isUpdating}
              customStyle={css`
                &:disabled {
                  background-color: ${theme.colors.grey[50]};
                }
              `}
            >
              {isUpdating ? (
                <S.ButtonLoadingContent>
                  <LoadingSpinner size={48.5} />
                </S.ButtonLoadingContent>
              ) : (
                t('앱 업데이트')
              )}
            </BasicButton>
          )}
          <BasicButton variant="Outline_Grey_M" onClick={handleLogout}>
            {t('로그아웃')}
          </BasicButton>
        </div>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <p>{t('버전 정보')}</p>

          <S.Versions>
            <p>
              {t('WEB 버전')}
              <span>
                {versionEnv
                  ? `${__APP_VERSION__}-${versionEnv}`
                  : __APP_VERSION__}
              </span>
            </p>
            <div />
            {CapacitorApp.isNative() && (
              <>
                <p>
                  {t('APP 버전')}{' '}
                  <span>{currentVersion || deviceData?.version || '-'}</span>
                </p>
                <div />
              </>
            )}
            <p>
              {t('APP 최신 버전')} <span>{latestAppVersionText ?? '-'}</span>
            </p>
          </S.Versions>
        </UIStyles.setting.ContentLayout>

        <UIStyles.setting.ContentLayout>
          <p>{t('매장명')}</p>
          <p>{shopName}</p>
        </UIStyles.setting.ContentLayout>

        <UIStyles.setting.ContentLayout>
          <p>{t('매장 아이디')}</p>
          <p>{shopCode}</p>
        </UIStyles.setting.ContentLayout>

        <UIStyles.setting.ContentLayout>
          <p>{t('계정 아이디')}</p>
          <p>{username}</p>
        </UIStyles.setting.ContentLayout>
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};
