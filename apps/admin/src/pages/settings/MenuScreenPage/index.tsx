import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { SettingsIcon } from '@repo/ui/icons';
import { ScreenMode } from '@/pages/settings/MenuScreenPage/ScreenMode';
import { Logo } from '@/pages/settings/MenuScreenPage/Logo';
import { Template } from '@/pages/settings/MenuScreenPage/Template';
import * as S from './menuScreenPage.style';

export const MenuScreenPage = () => {
  return (
    <S.Container>
      <S.Header>
        <h1>
          테마 설정 | 메뉴판
          <SettingsIcon color={theme.colors.grey[800]} width={40} height={40} />
        </h1>

        <BasicButton variant="Solid_Navy_XL" onClick={() => {}}>
          저장하기
        </BasicButton>
      </S.Header>

      <ScreenMode />
      <Logo />
      <Template />
    </S.Container>
  );
};

