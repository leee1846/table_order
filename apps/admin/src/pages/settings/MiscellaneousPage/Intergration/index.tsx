import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as CommonStyles from '@/pages/settings/MiscellaneousPage/common/common.style';
import { Dropdown } from '@repo/ui/components';

export const Intergration = () => {
  return (
    <SectionWrapper title="연동 관리">
      <CommonStyles.ContentLayout>
        <p>POS 연동</p>
        <Dropdown options={[]} value={''} onChange={() => {}} />
      </CommonStyles.ContentLayout>
    </SectionWrapper>
  );
};
