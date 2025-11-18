import { BasicButton, Dropdown } from '@repo/ui/components';
import { useState } from 'react';
import * as CommonStyles from '@/pages/settings/MiscellaneousPage/common/common.style';
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
    <CommonStyles.Container>
      <CommonStyles.Header>
        <CommonStyles.Title>버전 및 네트워크</CommonStyles.Title>
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
      </CommonStyles.Header>

      <CommonStyles.ContentsLayout>
        <CommonStyles.ContentLayout>
          <p>Android ID</p>
          <p>?????????</p>
        </CommonStyles.ContentLayout>
        <CommonStyles.ContentLayout>
          <p>네트워크 설정</p>
          <Dropdown
            options={networkSettings}
            value={networkSetting}
            onChange={(value) =>
              handleNetworkSettingChange(value as 'auto' | 'wired' | 'wifi')
            }
          />
        </CommonStyles.ContentLayout>
        <CommonStyles.ContentLayout>
          <p>네트워크 정보</p>
          {networkSetting === 'auto' && (
            <BasicButton variant="Solid_Sky_Blue_M" onClick={() => {}}>
              재설정
            </BasicButton>
          )}
        </CommonStyles.ContentLayout>
        <CommonStyles.ContentLayout>
          <p>SSID</p>
          <p>?????????</p>
        </CommonStyles.ContentLayout>
        <CommonStyles.ContentLayout>
          <p>IP</p>
          <p>?????????</p>
        </CommonStyles.ContentLayout>

        {networkSetting === 'wifi' && (
          <>
            <CommonStyles.ContentLayout>
              <p>SSID</p>
              <input type="text" />
            </CommonStyles.ContentLayout>
            <CommonStyles.ContentLayout>
              <p>암호</p>
              <input type="text" />
            </CommonStyles.ContentLayout>
          </>
        )}

        {networkSetting !== 'auto' && (
          <CommonStyles.ContentLayout>
            <p>IP Address</p>
            <input type="text" />
          </CommonStyles.ContentLayout>
        )}
      </CommonStyles.ContentsLayout>
    </CommonStyles.Container>
  );
};
