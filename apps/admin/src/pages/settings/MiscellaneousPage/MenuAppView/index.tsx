import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { Dropdown, ToggleButton } from '@repo/ui/components';

export const MenuAppView = () => {
  return (
    <SectionWrapper title="메뉴판 화면 설정">
      <UIStyles.setting.ContentLayout>
        <p>다크모드 설정</p>
        <ToggleButton size="M" isOn={false} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>템플릿 설정</p>
        <Dropdown options={[]} value={''} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>메뉴판 3열 배치</p>
        <ToggleButton size="M" isOn={false} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
    </SectionWrapper>
  );
};
