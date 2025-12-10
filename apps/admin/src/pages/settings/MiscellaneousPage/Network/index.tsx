import { BasicButton, Dropdown } from '@repo/ui/components';
import { useEffect, useState } from 'react';
import type { IShopNetwork, TNetworkType } from '@repo/api/types';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/Network/network.style';
import { NetworkIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';

type NetworkSettingOption = 'auto' | 'wired' | 'wifi';

const networkSettings = [
  { value: 'auto' as NetworkSettingOption, label: '자동' },
  { value: 'wired' as NetworkSettingOption, label: '유선' },
  { value: 'wifi' as NetworkSettingOption, label: '무선' },
];

interface NetworkProps {
  shopNetwork?: IShopNetwork;
}

const toNetworkSettingOption = (
  networkType?: TNetworkType
): NetworkSettingOption => {
  switch (networkType) {
    case 'LAN':
      return 'wired';
    case 'WIFI':
      return 'wifi';
    default:
      return 'auto';
  }
};

export const Network = ({ shopNetwork }: NetworkProps) => {
  const [networkSetting, setNetworkSetting] =
    useState<NetworkSettingOption>('auto');
  const [ssid, setSsid] = useState('');
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    if (!shopNetwork) {
      return;
    }

    setNetworkSetting(toNetworkSettingOption(shopNetwork.networkType));
    setSsid(shopNetwork.ssid ?? '');
    setIpAddress(shopNetwork.ipAddress ?? '');
  }, [shopNetwork]);

  const handleNetworkSettingChange = (value: NetworkSettingOption) => {
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
          <UIStyles.setting.Title>버전 및 네트워크</UIStyles.setting.Title>
        </S.TitleContentContainer>
        <S.Versions>
          <p>
            현재 버전 <span>2.??.??</span>
          </p>
          <div />
          <p>
            최신 버전 <span>2.??.??</span>
          </p>
        </S.Versions>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <p>Android ID</p>
          <p>-</p>
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>네트워크 설정</p>
          <Dropdown
            options={networkSettings}
            value={networkSetting}
            onChange={(value) =>
              handleNetworkSettingChange(value as NetworkSettingOption)
            }
          />
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>네트워크 정보</p>
          {networkSetting === 'auto' && (
            <BasicButton variant="Solid_Sky_Blue_M" onClick={() => {}}>
              재설정
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

        {networkSetting === 'wifi' && (
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
              <p>암호</p>
              <input type="text" />
            </UIStyles.setting.ContentLayout>
          </>
        )}

        {networkSetting !== 'auto' && (
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
