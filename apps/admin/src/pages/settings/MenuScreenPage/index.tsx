import { BasicButton } from '@repo/ui/components';
import { ScreenMode } from '@/pages/settings/MenuScreenPage/ScreenMode';
import { Logo } from '@/pages/settings/MenuScreenPage/Logo';
import { Template } from '@/pages/settings/MenuScreenPage/Template';
import * as S from './menuScreenPage.style';

export const MenuScreenPage = () => {
  return (
    <S.Container>
      <S.Header>
        <S.Title>
          <h1>테마설정</h1>
          <div />
          <span>메뉴 화면</span>
        </S.Title>
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
