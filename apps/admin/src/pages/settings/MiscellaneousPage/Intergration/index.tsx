import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { Dropdown } from '@repo/ui/components';

export const Intergration = () => {
  return (
    <SectionWrapper title="연동 관리">
      <UIStyles.setting.ContentLayout>
        <p>POS 연동</p>
        <Dropdown options={[]} value={''} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
    </SectionWrapper>
  );
};
