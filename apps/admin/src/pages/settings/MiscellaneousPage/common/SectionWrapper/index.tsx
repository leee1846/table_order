import { KeyboardArrowDownIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as CommonStyles from '@/pages/settings/MiscellaneousPage/common/common.style';
import * as S from '@/pages/settings/MiscellaneousPage/common/SectionWrapper/sectionWrapper.style';
import { useState } from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}
export const SectionWrapper = ({ title, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CommonStyles.Container>
      <S.HeaderButton type="button" onClick={() => setIsOpen(!isOpen)}>
        <S.Header isOpen={isOpen}>
          <CommonStyles.Title>{title}</CommonStyles.Title>
          <KeyboardArrowDownIcon
            width={40}
            height={40}
            color={theme.colors.grey[700]}
          />
        </S.Header>
        {isOpen && <S.Divider />}
      </S.HeaderButton>

      {isOpen && (
        <CommonStyles.ContentsLayout>{children}</CommonStyles.ContentsLayout>
      )}
    </CommonStyles.Container>
  );
};
