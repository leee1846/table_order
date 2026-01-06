import { t } from '@/config/i18n';
import { BasicButton, Input } from '@repo/ui/components';
import { useState } from 'react';
import * as S from '@/pages/LoginPage/loginPage.style';
import { VisibilityIcon, VisibilityOffIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { usePostLogin } from '@repo/api/queries';
import { openConfirmDialog } from '@repo/feature/utils';
import { setAccessToken, setRefreshToken } from '@repo/api/auth';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

export const LoginPage = () => {
  const navigate = useNavigate();

  // 상태 관리: 입력값 및 에러 메시지
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [idErrorMessage, setIdErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  // 비밀번호 표시/숨김 상태
  const [passwordInputType, setPasswordInputType] = useState<
    'password' | 'text'
  >('password');

  // 아이디 입력 핸들러: 실시간 유효성 검사
  const handleIdChange = (value: string) => {
    setId(value);

    if (value.length > 0) {
      setIdErrorMessage('');
    } else {
      setIdErrorMessage(
        t(
          '아이디를 입력해주세요.'
        )
      );
    }
  };

  // 비밀번호 입력 핸들러: 실시간 유효성 검사
  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (value.length > 0) {
      setPasswordErrorMessage('');
    } else {
      setPasswordErrorMessage(
        t(
          '비밀번호를 입력해주세요.'
        )
      );
    }
  };

  // 로그인 API 훅
  const { mutateAsync: login } = usePostLogin();

  // 로그인 처리 함수
  const handleLogin = async () => {
    // 1단계: 클라이언트 측 유효성 검사
    if (!id) {
      setIdErrorMessage(
        t(
          '아이디를 입력해주세요.'
        )
      );
      return;
    }
    if (!password) {
      setPasswordErrorMessage(
        t(
          '비밀번호를 입력해주세요.'
        )
      );
      return;
    }

    // 2단계: 에러 메시지 초기화
    setIdErrorMessage('');
    setPasswordErrorMessage('');

    // 3단계: 로그인 API 호출
    const response = await login({
      id,
      pw: password,
    });

    // 4단계: 로그인 결과 확인
    // api는 성공 처리됨.
    if (!response.data.loginResult) {
      // 로그인 실패: 에러 다이얼로그 표시
      openConfirmDialog({
        title: t('로그인 실패'),
        content: response.status.userMessage,
      });
      return;
    }

    // 5단계: 로그인 성공 - 토큰 저장 및 페이지 이동
    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);
    // Store 업데이트
    useAuthStore.getState().refreshTokenInfo();
    navigate(ROUTES.ROOT.generate()); // 루트 경로로 이동 (router에서 /tables로 리디렉트됨)
  };

  // 비밀번호 표시/숨김 토글 컴포넌트
  const passwordInputTextVisibilityComponent = () => {
    const iconProps = {
      color: theme.colors.grey[500],
      width: 20,
      height: 20,
    };

    return (
      <button
        type="button"
        onClick={() =>
          setPasswordInputType(
            passwordInputType === 'password' ? 'text' : 'password'
          )
        }
      >
        {passwordInputType === 'password' ? (
          <VisibilityIcon {...iconProps} />
        ) : (
          <VisibilityOffIcon {...iconProps} />
        )}
      </button>
    );
  };

  return (
    <S.Container>
      <div>{t('로고 이미지 영역')}</div>

      <S.LoginContainer>
        <div>
          <S.InputTitle>{t('아이디')}</S.InputTitle>
          <Input
            placeholder={t(
              '아이디를 입력해주세요.'
            )}
            onChange={handleIdChange}
            value={id}
            errorMessage={idErrorMessage}
          />
        </div>
        <div>
          <S.InputTitle>{t('비밀번호')}</S.InputTitle>
          <Input
            type={passwordInputType}
            placeholder={t(
              '비밀번호를 입력해주세요.'
            )}
            onChange={handlePasswordChange}
            value={password}
            rightComponent={passwordInputTextVisibilityComponent()}
            errorMessage={passwordErrorMessage}
          />
        </div>
        <BasicButton
          variant="Solid_Navy_XL"
          customStyle={S.buttonCss}
          onClick={handleLogin}
        >
          {t('로그인')}
        </BasicButton>
      </S.LoginContainer>
    </S.Container>
  );
};
