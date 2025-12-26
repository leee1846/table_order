import { BasicButton } from '@repo/ui/components';
import * as S from '@/pages/settings/StartScreenPage/Logo/logo.style';

export const Logo = () => {
  return (
    <S.Container>
      <p>매장 로고 설정</p>
      <S.ImageSection>
        <S.ButtonContainer>
          <BasicButton variant="Outline_Grey_L" onClick={() => {}}>
            변경
          </BasicButton>
          <BasicButton variant="Solid_Sky_Blue_L" onClick={() => {}}>
            삭제
          </BasicButton>
        </S.ButtonContainer>
      </S.ImageSection>
    </S.Container>
  );
};

