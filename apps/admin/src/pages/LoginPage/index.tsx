import { t } from '@/config/i18n';
import { BasicButton, Input } from '@repo/ui/components';
import { useRef, useState } from 'react';
import * as S from '@/pages/LoginPage/loginPage.style';
import {
  capsSmartOrderBlueGreyLogo,
  VisibilityIcon,
  VisibilityOffIcon,
} from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { usePostLogin } from '@repo/api/queries';
import { openConfirmDialog, toast } from '@repo/feature/utils';
import { setAccessToken, setRefreshToken } from '@repo/api/auth';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { CapacitorApp } from '@repo/util/app';
import { LoginPasswordChangeModal } from './LoginPasswordChangeModal';
import { rawApi } from '@/config/rawApi';
import type { IApiError } from '@repo/api/types';
import type { AxiosError } from '@repo/api/axios';
import { useRemoteSupport } from '@repo/feature/hooks';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  // 상태 관리: 입력값 및 에러 메시지
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [idErrorMessage, setIdErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const { isRemoteSupportVisible, openRemoteSupport } = useRemoteSupport(t);

  // 비밀번호 표시/숨김 상태
  const [passwordInputType, setPasswordInputType] = useState<
    'password' | 'text'
  >('password');

  // 비밀번호 변경 모달 상태
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);
  const [loginUserId, setLoginUserId] = useState('');
  const [loginUserPassword, setLoginUserPassword] = useState('');

  const tempAccessToken = useRef<string>('');

  // 아이디 입력 핸들러: 실시간 유효성 검사
  const handleIdChange = (value: string) => {
    setId(value);

    if (value.length > 0) {
      setIdErrorMessage('');
    } else {
      setIdErrorMessage(t('아이디를 입력해주세요.'));
    }
  };

  // 비밀번호 입력 핸들러: 실시간 유효성 검사
  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (value.length > 0) {
      setPasswordErrorMessage('');
    } else {
      setPasswordErrorMessage(t('비밀번호를 입력해주세요.'));
    }
  };

  // 로그인 API 훅
  const { mutateAsync: login } = usePostLogin();

  // 로그인 처리 함수
  const handleLogin = async () => {
    const trimmedId = id.trim();
    const trimmedPassword = password.trim();

    // 1단계: 클라이언트 측 유효성 검사
    if (!trimmedId) {
      setIdErrorMessage(t('아이디를 입력해주세요.'));
      return;
    }
    if (!trimmedPassword) {
      setPasswordErrorMessage(t('비밀번호를 입력해주세요.'));
      return;
    }

    // 2단계: 에러 메시지 초기화
    setIdErrorMessage('');
    setPasswordErrorMessage('');

    // 3단계: 로그인 API 호출
    const response = await login({
      id: trimmedId,
      pw: trimmedPassword,
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

    if (response.data.isPasswordChangeRequired && !CapacitorApp.isNative()) {
      tempAccessToken.current = response.data.accessToken;
      useAuthStore.getState().refreshTokenInfo();
      toast('비밀번호를 변경해주세요.');
      setLoginUserId(trimmedId);
      setLoginUserPassword(trimmedPassword);
      setIsPasswordChangeModalOpen(true);
      return;
    }

    // 5단계: 로그인 성공 - 토큰 저장 및 페이지 이동
    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);
    // Store 업데이트
    useAuthStore.getState().refreshTokenInfo();
    // SSE 연결은 App.tsx의 useSSEHandler에서 자동으로 처리됨
    navigate(ROUTES.ROOT.generate()); // 루트 경로로 이동 (router에서 리디렉트됨)
  };

  // 비밀번호 변경 처리
  const handlePasswordChangeSubmit = async (newPassword: string) => {
    try {
      await rawApi({
        method: 'PUT',
        url: '/member/password',
        headers: {
          Authorization: `Bearer ${tempAccessToken.current}`,
        },
        data: {
          memberId: loginUserId,
          memberPassword: newPassword,
          existingMemberPassword: loginUserPassword,
        },
      });
    } catch (error: unknown) {
      openConfirmDialog({
        title: '비밀번호 변경 실패',
        content:
          (error as AxiosError<IApiError>).response?.data?.status
            ?.userMessage || '비밀번호 변경 실패',
      });
      clearAuth();
      setIsPasswordChangeModalOpen(false);
      return;
    }

    // 변경된 비밀번호로 재로그인
    const response = await login({
      id: loginUserId,
      pw: newPassword,
    });

    if (!response.data.loginResult) {
      openConfirmDialog({
        title: t('로그인 실패'),
        content: response.status.userMessage,
      });
      clearAuth();
      setIsPasswordChangeModalOpen(false);
      return;
    }

    // 로그인 성공 처리
    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);
    useAuthStore.getState().refreshTokenInfo();
    // SSE 연결은 App.tsx의 useSSEHandler에서 자동으로 처리됨

    // 모달 닫기
    setIsPasswordChangeModalOpen(false);

    toast('비밀번호가 변경되었습니다.');
    // 페이지 이동
    navigate(ROUTES.ROOT.generate());
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
    <>
      <S.Container>
        <img
          src={capsSmartOrderBlueGreyLogo}
          alt="logo"
          style={{ width: '200px' }}
        />

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
          <S.ButtonContainer>
            <BasicButton
              variant="Solid_Navy_XL"
              customStyle={S.buttonCss}
              onClick={handleLogin}
            >
              {t('로그인')}
            </BasicButton>
            {isRemoteSupportVisible && (
              <BasicButton
                variant="Solid_Navy_XL"
                customStyle={S.buttonCss}
                onClick={() => void openRemoteSupport()}
              >
                {t('원격지원')}
              </BasicButton>
            )}
          </S.ButtonContainer>
        </S.LoginContainer>
      </S.Container>

      {isPasswordChangeModalOpen && (
        <LoginPasswordChangeModal
          isOpen={isPasswordChangeModalOpen}
          onConfirm={handlePasswordChangeSubmit}
          existingPassword={loginUserPassword}
        />
      )}
    </>
  );
};
