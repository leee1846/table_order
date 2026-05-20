import { useAdminTranslation } from '@/config/i18n';
import { useEffect, useState } from 'react';
import { getLatestAppVersion } from '@repo/api/fetchers';
import { useGetLatestAppVersion } from '@repo/api/queries';
import type {
  IShopNetwork,
  ITokenPayload,
  TAppType,
  TNetworkType,
} from '@repo/api/types';
import { BasicButton, LoadingSpinner } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/SystemInfo/systemInfo.style';
import { NetworkIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { MiscellaneousChange } from '@/pages/settings/MiscellaneousPage/types';
import { CapacitorApp, AndroidInfo, Installer } from '@repo/util/app';
import {
  openConfirmDialog,
  openDualActionDialog,
  toast,
} from '@repo/feature/utils';
import { css } from '@emotion/react';
import { decodeJwtToken } from '@repo/util/function';
import { getAccessToken } from '@repo/api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { disconnectSse } from '@/utils/sseConnection';
import { ROUTES } from '@/constants/routes';
import { QRCodeModal } from './QRCodeModal';

interface SystemInfoProps {
  shopName?: string;
  shopCode?: string;
  userId?: string;
  shopNetwork?: IShopNetwork;
  onChange?: (value: MiscellaneousChange) => void;
}

const toNetworkSettingOption = (networkType?: TNetworkType): TNetworkType => {
  switch (networkType) {
    case 'LAN':
      return 'LAN';
    case 'WIFI':
      return 'WIFI';
    default:
      return 'AUTO';
  }
};

export const SystemInfo = ({
  shopName,
  shopCode,
  userId,
  shopNetwork,
  onChange,
}: SystemInfoProps) => {
  const { t } = useAdminTranslation();
  const appType: TAppType = 'POS_APP';

  const navigate = useNavigate();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const [networkSetting, setNetworkSetting] = useState<TNetworkType>('AUTO');
  const [ssid, setSsid] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [androidId, setAndroidId] = useState('');
  const [currentVersion, setCurrentVersion] = useState<string>('');
  const { data: latestAppVersionResponse } = useGetLatestAppVersion(appType);

  const latestAppVersionText = latestAppVersionResponse?.data?.version;
  const versionEnv = import.meta.env.VITE_APP_VERSION_ENV;

  useEffect(() => {
    if (CapacitorApp.isNative()) {
      const getAppInfo = async () => {
        const appInfo = await CapacitorApp.getInfo();
        const version = appInfo?.version ?? '';
        setCurrentVersion(version);
      };

      const getAndroidInfo = async () => {
        const ip = await AndroidInfo.getIp();
        const id = await AndroidInfo.getId();
        if (ip) {
          setIpAddress(ip);
        }
        if (id) {
          setAndroidId(id);
        }
      };

      getAppInfo();

      getAndroidInfo();
    }
  }, []);

  useEffect(() => {
    if (!shopNetwork) {
      return;
    }

    setNetworkSetting(toNetworkSettingOption(shopNetwork.networkType));
    setSsid(shopNetwork.ssid ?? '');
  }, [shopNetwork]);

  useEffect(() => {
    if (!onChange) {
      return;
    }

    onChange({
      shopNetwork: {
        shopSeq: shopNetwork?.shopSeq ?? 0,
        networkType: networkSetting,
        ssid,
        ipAddress,
      },
    });
  }, [ipAddress, networkSetting, onChange, shopNetwork?.shopSeq, ssid]);

  const [isUpdating, setIsUpdating] = useState(false);

  const executeAppUpdate = async () => {
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

    setIsUpdating(true);
    try {
      const response = await getLatestAppVersion(appType);
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

  const { clearAuth } = useAuthStore();
  const executeLogout = () => {
    // sse 연결 끊기
    disconnectSse();

    // store 비우기
    clearAuth();

    // 로그인 페이지로 이동
    window.location.replace(ROUTES.LOGIN.generate());
  };

  const handleLogout = () => {
    openDualActionDialog({
      title: t('로그아웃'),
      content: t('로그아웃하시겠습니까?'),
      primaryText: t('예'),
      secondaryText: t('아니오'),
      onConfirm: executeLogout,
    });
  };

  const handleQRCodeClick = () => {
    setIsQRModalOpen(true);
  };

  const handleCloseQRModal = () => {
    setIsQRModalOpen(false);
  };

  const token = getAccessToken();
  const payload = decodeJwtToken<ITokenPayload>(token ?? '');

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <S.TitleContentContainer>
          <NetworkIcon
            width={32}
            height={32}
            color={theme.colors.primary[500]}
          />

          <UIStyles.setting.Title>
            {t('시스템 버전 및 네트워크 정보')}
          </UIStyles.setting.Title>
        </S.TitleContentContainer>
        <UIStyles.setting.ContentLayout>
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

            <BasicButton variant="Outline_Grey_M" onClick={handleQRCodeClick}>
              {t('로그인 QR 생성')}
            </BasicButton>

            {payload && payload.role === 'SHOP' && !CapacitorApp.isNative() && (
              <BasicButton
                variant="Outline_Grey_M"
                onClick={() => navigate(ROUTES.SETTINGS.MYPAGE.generate())}
              >
                {t('내 정보')}
              </BasicButton>
            )}

            <BasicButton variant="Outline_Grey_M" onClick={handleLogout}>
              {t('로그아웃')}
            </BasicButton>
          </div>
        </UIStyles.setting.ContentLayout>
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
            {CapacitorApp.isNative() && (
              <>
                <p>
                  {t('APP 버전')} <span>{currentVersion}</span>
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
          <p>{userId}</p>
        </UIStyles.setting.ContentLayout>

        {CapacitorApp.isNative() && (
          <>
            <UIStyles.setting.ContentLayout>
              <p>{t('안드로이드 기기식별 정보(ID)')}</p>
              <p>{androidId || '-'}</p>
            </UIStyles.setting.ContentLayout>
            <UIStyles.setting.ContentLayout>
              <p>{t('네트워크 주소(IP)')}</p>
              <p>{ipAddress || '-'}</p>
            </UIStyles.setting.ContentLayout>
          </>
        )}

        {networkSetting === 'WIFI' && (
          <>
            <UIStyles.setting.ContentLayout>
              <p>SSID</p>
              <input
                type="text"
                value={ssid}
                onChange={(event) => setSsid(event.target.value)}
              />
            </UIStyles.setting.ContentLayout>
            <UIStyles.setting.ContentLayout>
              <p>{t('암호')}</p>
              <input type="text" />
            </UIStyles.setting.ContentLayout>
          </>
        )}

        {networkSetting !== 'AUTO' && (
          <UIStyles.setting.ContentLayout>
            <p>IP Address</p>
            <input
              inputMode="numeric"
              type="text"
              value={ipAddress}
              onChange={(event) => setIpAddress(event.target.value)}
            />
          </UIStyles.setting.ContentLayout>
        )}
      </UIStyles.setting.ContentsLayout>

      {isQRModalOpen && <QRCodeModal onClose={handleCloseQRModal} />}
    </UIStyles.setting.Container>
  );
};
