import { Input } from '@repo/ui/components';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/AdditionalSetting/additionalSetting.style';

export const AdditionalSetting = () => {
  return (
    <S.Container>
      <S.SetionContainer>
        <p>포스연동 메뉴코드</p>
        <Input disabled={true} />
      </S.SetionContainer>
      <S.SetionContainer>
        <p>최소 주문 수량</p>
        <Input />
      </S.SetionContainer>
      <S.SetionContainer>
        <p>터치키 색상</p>
        <S.ColorChips>
          <S.ColorChip color="#FF909D" />
          <S.ColorChip color="#FFF47C" />
          <S.ColorChip color="#7CFFB1" />
          <S.ColorChip color="#FFCFF1" />
          <S.ColorChip color="#7CC6FF" />
        </S.ColorChips>
      </S.SetionContainer>
    </S.Container>
  );
};
