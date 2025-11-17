import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { SettingsIcon } from '@repo/ui/icons';
import { Theme } from '@/pages/settings/StylePage/Theme';
import { Logo } from '@/pages/settings/StylePage/Logo';
import * as S from './stylePage.style';

export const StylePage = () => {
  return (
    <S.Container>
      <S.Header>
        <h1>
          페이지 설정
          <SettingsIcon color={theme.colors.grey[800]} width={40} height={40} />
        </h1>

        <BasicButton variant="Solid_Navy_XL" onClick={() => {}}>
          저장하기
        </BasicButton>
      </S.Header>

      <Theme />
      <Logo />
    </S.Container>
  );
};
