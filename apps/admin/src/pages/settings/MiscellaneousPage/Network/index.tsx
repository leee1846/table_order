import { BasicButton, Dropdown } from '@repo/ui/components';
import { useEffect, useState } from 'react';
import type { IShopNetwork, TNetworkType } from '@repo/api/types';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/Network/network.style';
import { NetworkIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';

const networkSettings = [
  { value: 'AUTO' as TNetworkType, label: '자동' },
  { value: 'LAN' as TNetworkType, label: '유선' },
  { value: 'WIFI' as TNetworkType, label: '무선' },
];

interface NetworkProps {
  shopNetwork?: IShopNetwork;
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

export const Network = ({ shopNetwork }: NetworkProps) => {
  const [networkSetting, setNetworkSetting] = useState<TNetworkType>('AUTO');
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
              handleNetworkSettingChange(value as TNetworkType)
            }
          />
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>네트워크 정보</p>
          {networkSetting === 'AUTO' && (
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
              <p>암호</p>
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
