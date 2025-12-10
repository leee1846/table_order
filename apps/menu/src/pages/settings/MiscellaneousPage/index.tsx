import { theme } from '@repo/ui';
import { SettingsIcon } from '@repo/ui/icons';
import { BasicButton } from '@repo/ui/components';
import { Account } from '@/pages/settings/MiscellaneousPage/Account';
import { Detail } from '@/pages/settings/MiscellaneousPage/Detail';
import * as S from '@/pages/settings/MiscellaneousPage/MiscellaneousPage.style';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';

export const MiscellaneousPage = () => {
  const { t } = useAdminTranslation();

  return (
    <S.Container>
      <header>
        <div>
          <h1>{t('설정')}</h1>
          <SettingsIcon color={theme.colors.grey[800]} width={40} height={40} />
        </div>
        <BasicButton variant="Solid_Navy_XL" onClick={() => {}}>
          저장하기
        </BasicButton>
      </header>

      <S.Sections>
        <Account />
        <Detail />
      </S.Sections>
    </S.Container>
  );
};
