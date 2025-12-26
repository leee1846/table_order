import { BasicButton } from '@repo/ui/components';
import * as S from '@/pages/settings/MenuScreenPage/Logo/logo.style';

export const Logo = () => {
  return (
    <S.Container>
      <p>로고 설정</p>
      <S.ImageSection>
        <S.UploadArea>
          <S.UploadIcon>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 15V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </S.UploadIcon>
          <S.UploadText>
            메뉴판 상단에 보이는 로고를 추가할 수 있어요.
            <br />
            (400*144 px 이상의 가로가 긴 로고 권장)
          </S.UploadText>
        </S.UploadArea>
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

