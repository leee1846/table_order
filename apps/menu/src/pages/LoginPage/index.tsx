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
import { useAdminTranslation } from '@/config/i18n/admin.i18n';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useAdminTranslation();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [idErrorMessage, setIdErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const [passwordInputType, setPasswordInputType] = useState<
    'password' | 'text'
  >('password');

  const handleIdChange = (value: string) => {
    setId(value);

    if (value.length > 0) {
      setIdErrorMessage('');
    } else {
      setIdErrorMessage(t('아이디를 입력해주세요.'));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (value.length > 0) {
      setPasswordErrorMessage('');
    } else {
      setPasswordErrorMessage(t('비밀번호를 입력해주세요.'));
    }
  };

  const { mutateAsync: login } = usePostLogin();
  const handleLogin = async () => {
    if (!id) {
      setIdErrorMessage(t('아이디를 입력해주세요.'));
      return;
    }
    if (!password) {
      setPasswordErrorMessage(t('비밀번호를 입력해주세요.'));
      return;
    }

    setIdErrorMessage('');
    setPasswordErrorMessage('');
    const response = await login({
      id,
      pw: password,
    });

    // api는 성공 처리됨.
    if (!response.data.loginResult) {
      openConfirmDialog({
        title: t('로그인 실패'),
        content: response.status.userMessage,
      });
      return;
    }

    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);
    navigate(ROUTES.ROOT.generate());
  };

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
      <div>로고 이미지 영역</div>

      <S.LoginContainer>
        <div>
          <S.InputTitle>{t('아이디')}</S.InputTitle>
          <Input
            placeholder={t('아이디를 입력해주세요.')}
            onChange={handleIdChange}
            value={id}
            errorMessage={idErrorMessage}
          />
        </div>
        <div>
          <S.InputTitle>{t('비밀번호')}</S.InputTitle>
          <Input
            type={passwordInputType}
            placeholder={t('비밀번호를 입력해주세요.')}
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
