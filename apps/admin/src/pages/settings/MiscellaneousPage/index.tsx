import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { SettingsIcon } from '@repo/ui/icons';
import * as S from '@/pages/settings/MiscellaneousPage/MiscellaneousPage.style';
import { Account } from '@/pages/settings/MiscellaneousPage/Account';
import { Network } from '@/pages/settings/MiscellaneousPage/Network';
import { StoreEnvironment } from '@/pages/settings/MiscellaneousPage/StoreEnvironment';
import { MenuAppFeature } from '@/pages/settings/MiscellaneousPage/MenuAppFeature';

export const MiscellaneousPage = () => {
  return (
    <S.Container>
      <header>
        <div>
          <h1>설정</h1>
          <SettingsIcon color={theme.colors.grey[800]} width={40} height={40} />
        </div>
        <BasicButton variant="Solid_Navy_XL" onClick={() => {}}>
          저장하기
        </BasicButton>
      </header>

      <S.Sections>
        <Account />
        <Network />
        <StoreEnvironment />
        <MenuAppFeature />
      </S.Sections>
    </S.Container>
  );
};
