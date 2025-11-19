import { BasicButton, Input } from '@repo/ui/components';
import { useState } from 'react';
import * as S from '@/pages/LoginPage/loginPage.style';
import { VisibilityIcon, VisibilityOffIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';

export const LoginPage = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [idErrorMessage, setIdErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const [passwordInputType, setPasswordInputType] = useState<
    'password' | 'text'
  >('password');

  const handleIdChange = (value: string) => {
    setId(value);
    setIdErrorMessage(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordErrorMessage(value);
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
          <S.InputTitle>아이디</S.InputTitle>
          <Input
            placeholder="아이디를 입력해주세요."
            onChange={handleIdChange}
            value={id}
            errorMessage={idErrorMessage}
          />
        </div>
        <div>
          <S.InputTitle>비밀번호</S.InputTitle>
          <Input
            type={passwordInputType}
            placeholder="비밀번호를 입력해주세요."
            onChange={handlePasswordChange}
            value={password}
            rightComponent={passwordInputTextVisibilityComponent()}
            errorMessage={passwordErrorMessage}
          />
        </div>
        <BasicButton variant="Solid_Navy_XL" customStyle={S.buttonCss}>
          로그인
        </BasicButton>
      </S.LoginContainer>
    </S.Container>
  );
};
