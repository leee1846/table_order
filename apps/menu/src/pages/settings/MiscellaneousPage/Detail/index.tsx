import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/Detail/detail.style';
import { Dropdown, ToggleButton } from '@repo/ui/components';
import { useState } from 'react';

export const Detail = () => {
  const [isTestOn, setIsTestOn] = useState(false);

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <UIStyles.setting.Title>버전 및 네트워크</UIStyles.setting.Title>
        <S.Versions>
          <p>
            메뉴판 현재 버전 <span>2.??.??</span>
          </p>
          <div />
          <p>
            현재 버전 <span>2.??.??</span>
          </p>
          <div />
          <p>
            Add On 버전 <span>2.??</span>
          </p>
        </S.Versions>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <p>오더포스 모드 사용</p>
          <ToggleButton
            size="M"
            isOn={isTestOn}
            onChange={() => setIsTestOn(!isTestOn)}
          />
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>카드 단말기</p>
          <Dropdown options={[]} value={''} onChange={() => {}} />
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>KDS 모드 사용</p>
          <ToggleButton
            size="M"
            isOn={isTestOn}
            onChange={() => setIsTestOn(!isTestOn)}
          />
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>웨이팅 모드 사용</p>
          <ToggleButton
            size="M"
            disabled={true}
            isOn={false}
            onChange={() => {
              // noop
            }}
          />
        </UIStyles.setting.ContentLayout>
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};
