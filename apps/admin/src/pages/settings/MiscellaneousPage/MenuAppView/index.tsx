import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as CommonStyles from '@/pages/settings/MiscellaneousPage/common/common.style';
import { Dropdown, ToggleButton } from '@repo/ui/components';

export const MenuAppView = () => {
  return (
    <SectionWrapper title="메뉴판 화면 설정">
      <CommonStyles.ContentLayout>
        <p>다크모드 설정</p>
        <ToggleButton size="M" isOn={false} onChange={() => {}} />
      </CommonStyles.ContentLayout>
      <CommonStyles.ContentLayout>
        <p>템플릿 설정</p>
        <Dropdown options={[]} value={''} onChange={() => {}} />
      </CommonStyles.ContentLayout>
      <CommonStyles.ContentLayout>
        <p>메뉴판 3열 배치</p>
        <ToggleButton size="M" isOn={false} onChange={() => {}} />
      </CommonStyles.ContentLayout>
    </SectionWrapper>
  );
};
