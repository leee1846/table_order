import { BasicButton, Dropdown } from '@repo/ui/components';
import { useState } from 'react';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/Network/network.style';

const networkSettings = [
  { value: 'auto', label: '자동' },
  { value: 'wired', label: '유선' },
  { value: 'wifi', label: '무선' },
];

export const Network = () => {
  const [networkSetting, setNetworkSetting] = useState<
    'auto' | 'wired' | 'wifi'
  >('auto');

  const handleNetworkSettingChange = (value: 'auto' | 'wired' | 'wifi') => {
    setNetworkSetting(value);
  };

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <UIStyles.setting.Title>버전 및 네트워크</UIStyles.setting.Title>
        <S.Versions>
          <p>
            현재 버전 <span>2.??.??</span>
          </p>
          <div />
          <p>
            최신 버전 <span>2.??.??</span>
          </p>
          <div />
          <p>
            Add On 버전 <span>2.??</span>
          </p>
        </S.Versions>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <p>Android ID</p>
          <p>?????????</p>
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>네트워크 설정</p>
          <Dropdown
            options={networkSettings}
            value={networkSetting}
            onChange={(value) =>
              handleNetworkSettingChange(value as 'auto' | 'wired' | 'wifi')
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
          <p>?????????</p>
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>IP</p>
          <p>?????????</p>
        </UIStyles.setting.ContentLayout>

        {networkSetting === 'wifi' && (
          <>
            <UIStyles.setting.ContentLayout>
              <p>SSID</p>
              <input type="text" />
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
            <input type="text" />
          </UIStyles.setting.ContentLayout>
        )}
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};
