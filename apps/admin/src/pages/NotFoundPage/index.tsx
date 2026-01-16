import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { BasicButton } from '@repo/ui/components';
import { capsSmartOrderBlueGreyLogo } from '@repo/ui/icons';
import * as S from './notFoundPage.style';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <S.Container>
      <S.LogoContainer>
        <S.Logo src={capsSmartOrderBlueGreyLogo} alt="logo" />
      </S.LogoContainer>
      <S.Content>
        <S.ErrorCode>404</S.ErrorCode>
        <S.Title>페이지를 찾을 수 없습니다</S.Title>
        <S.Description>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          주소를 확인하시거나 홈으로 돌아가시기 바랍니다.
        </S.Description>
        <S.ButtonContainer>
          <BasicButton
            variant="Solid_Navy_XL"
            onClick={() => navigate(ROUTES.ROOT.generate())}
          >
            홈으로 가기
          </BasicButton>
        </S.ButtonContainer>
      </S.Content>
    </S.Container>
  );
};
