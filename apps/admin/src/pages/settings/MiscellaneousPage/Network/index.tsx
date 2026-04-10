import { useAdminTranslation } from '@/config/i18n';
import { useEffect, useState } from 'react';
import { getLatestAppVersion } from '@repo/api/fetchers';
import { useGetLatestAppVersion } from '@repo/api/queries';
import type { IShopNetwork, TAppType, TNetworkType } from '@repo/api/types';
import { BasicButton, LoadingSpinner } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/Network/network.style';
import { NetworkIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { MiscellaneousChange } from '@/pages/settings/MiscellaneousPage/types';
import { CapacitorApp, AndroidInfo, Installer } from '@repo/util/app';
import { openConfirmDialog, toast } from '@repo/feature/utils';
import { css } from '@emotion/react';

interface NetworkProps {
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

export const Network = ({ shopNetwork, onChange }: NetworkProps) => {
  const { t } = useAdminTranslation();
  const appType: TAppType = 'POS_APP';

  const [networkSetting, setNetworkSetting] = useState<TNetworkType>('AUTO');
  const [ssid, setSsid] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [androidId, setAndroidId] = useState('');
  const [currentVersion, setCurrentVersion] = useState<string>('');
  const { data: latestAppVersionResponse } = useGetLatestAppVersion(appType);

  const latestAppVersionText = latestAppVersionResponse?.data?.version;

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

  const handleAppUpdate = async () => {
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
            {t('버전 및 네트워크')}
          </UIStyles.setting.Title>
        </S.TitleContentContainer>
        <S.Versions>
          <p>
            {t('WEB 버전')} <span>{__APP_VERSION__}</span>
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
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        {CapacitorApp.isNative() && (
          <UIStyles.setting.ContentLayout>
            <p>{t('앱 업데이트')}</p>
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
                t('업데이트')
              )}
            </BasicButton>
          </UIStyles.setting.ContentLayout>
        )}
        <UIStyles.setting.ContentLayout>
          <p>Android ID</p>
          <p>{androidId || '-'}</p>
        </UIStyles.setting.ContentLayout>

        <UIStyles.setting.ContentLayout>
          <p>IP</p>
          <p>{ipAddress || '-'}</p>
        </UIStyles.setting.ContentLayout>

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
    </UIStyles.setting.Container>
  );
};
