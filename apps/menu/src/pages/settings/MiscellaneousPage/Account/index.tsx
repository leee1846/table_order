import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import { openDualActionDialog } from '@repo/feature/utils';
import { getAccessToken } from '@repo/api/auth';
import type { ITokenPayload } from '@repo/api/types';
import { decodeJwtToken } from '@repo/util/function';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { ROUTES } from '@/constants/routes';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { clearAuthData } from '@/utils/auth';
import * as S from '@/pages/settings/MiscellaneousPage/Account/account.style';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useGetLatestAppVersion } from '@repo/api/queries';

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
  const { data: latestVersionData } = useGetLatestAppVersion('MENU');

  const handleLogout = () => {
    openDualActionDialog({
      title: t('로그아웃'),
      content: t('로그아웃하시겠습니까?'),
      primaryText: t('예'),
      secondaryText: t('아니오'),
      onConfirm: () => {
        clearAuthData();
        window.location.href = ROUTES.LOGIN.generate();
      },
    });
  };

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <UIStyles.setting.Title>
          {t('시스템 버전 및 네트워크 정보')}
        </UIStyles.setting.Title>
        <BasicButton variant="Outline_Grey_M" onClick={handleLogout}>
          {t('로그아웃')}
        </BasicButton>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <p>{t('버전 정보')}</p>

          <S.Versions>
            <p>
              {t('WEB 버전')}
              <span>
                {versionEnv
                  ? `${__APP_VERSION__} (${versionEnv})`
                  : __APP_VERSION__}
              </span>
            </p>
            <div />
            <p>
              {t('APP 버전')} <span>{deviceData?.version}</span>
            </p>
            <div />
            <p>
              {t('APP 최신 버전')}{' '}
              <span>{latestVersionData?.data?.version ?? '-'}</span>
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
