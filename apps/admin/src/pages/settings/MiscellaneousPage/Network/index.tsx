import { useAdminTranslation } from '@/config/i18n';
import { BasicButton, Dropdown } from '@repo/ui/components';
import { useEffect, useMemo, useState } from 'react';
import { useGetLatestAppVersion } from '@repo/api/queries';
import type { IShopNetwork, TAppType, TNetworkType } from '@repo/api/types';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/Network/network.style';
import { NetworkIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { MiscellaneousChange } from '../types';

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
  const networkSettings = useMemo(
    () => [
      { value: 'AUTO' as TNetworkType, label: t('자동') },
      { value: 'LAN' as TNetworkType, label: t('유선') },
      { value: 'WIFI' as TNetworkType, label: t('무선') },
    ],
    [t]
  );
  const [networkSetting, setNetworkSetting] = useState<TNetworkType>('AUTO');
  const [ssid, setSsid] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const { data: latestAppVersionResponse } = useGetLatestAppVersion(appType);

  const latestAppVersionText = latestAppVersionResponse?.data?.version;

  useEffect(() => {
    if (!shopNetwork) {
      return;
    }

    setNetworkSetting(toNetworkSettingOption(shopNetwork.networkType));
    setSsid(shopNetwork.ssid ?? '');
    setIpAddress(shopNetwork.ipAddress ?? '');
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

  const handleNetworkSettingChange = (value: TNetworkType) => {
    setNetworkSetting(value);
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
          {/* TODO 앱에서 받아와야 함 */}
          <p>
            {t('현재 버전')}
            <span>2.??.??</span>
          </p>
          <div />
          <p>
            {t('최신 버전')}
            <span>{latestAppVersionText}</span>
          </p>
        </S.Versions>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <p>Android ID</p>
          <p>-</p>
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>{t('네트워크 설정')}</p>
          <Dropdown
            options={networkSettings}
            value={networkSetting}
            onChange={(value) =>
              handleNetworkSettingChange(value as TNetworkType)
            }
          />
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>{t('네트워크 정보')}</p>
          {networkSetting === 'AUTO' && (
            <BasicButton variant="Solid_Sky_Blue_M" onClick={() => {}}>
              {t('재설정')}
            </BasicButton>
          )}
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>SSID</p>
          <p>{ssid || '-'}</p>
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
