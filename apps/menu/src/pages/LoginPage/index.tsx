import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BasicButton, Input } from '@repo/ui/components';
import { VisibilityIcon, VisibilityOffIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { usePostDeviceDetail, usePostLogin } from '@repo/api/queries';
import { openConfirmDialog } from '@repo/feature/utils';
import { setAccessToken, setRefreshToken } from '@repo/api/auth';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { ROUTES } from '@/constants/routes';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopData } from '@/hooks/useShopData';
import { initializeSseConnection } from '@/utils/sseConnection';
import * as S from '@/pages/LoginPage/loginPage.style';
import { AndroidInfo, CapacitorApp } from '@repo/util/app';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useAdminTranslation();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [idErrorMessage, setIdErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // API hooks
  const { mutateAsync: login } = usePostLogin();
  const { mutateAsync: postDeviceDetail } = usePostDeviceDetail();
  const { refresh: refreshShopData } = useShopData({
    skipInitialRequest: true,
  });
  const {
    data: deviceStoreData,
    setDataAsync: setDeviceData,
    refetchDeviceDetail,
  } = useDeviceData({
    skipInitialRequest: true,
  });

  // Input handlers
  const handleIdChange = (value: string) => {
    setId(value);
    setIdErrorMessage(value.length > 0 ? '' : t('아이디를 입력해주세요.'));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordErrorMessage(
      value.length > 0 ? '' : t('비밀번호를 입력해주세요.')
    );
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // Login handler
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

    const loginResponse = await login({
      id,
      pw: password,
    });

    // api는 성공 처리됨.
    if (!loginResponse.data.loginResult) {
      openConfirmDialog({
        title: t('로그인 실패'),
        content: loginResponse.status.userMessage,
      });
      return;
    }

    setAccessToken(loginResponse.data.accessToken);
    setRefreshToken(loginResponse.data.refreshToken);

    let ipAddress: string | null = null;
    let androidId: string | null = null;
    let appInfo: Awaited<ReturnType<typeof CapacitorApp.getInfo>> | null = null;

    // 모두 성공할 때까지 반복
    while (!ipAddress || !androidId || !appInfo) {
      // 3개 모두 요청
      [ipAddress, androidId, appInfo] = await Promise.all([
        AndroidInfo.getIp(),
        AndroidInfo.getId(),
        CapacitorApp.getInfo(),
      ]);

      // 1개라도 실패하면 다이얼로그 표시
      if (!ipAddress || !androidId || !appInfo) {
        await new Promise<void>((resolve) => {
          openConfirmDialog({
            title: t('오류'),
            content: t(
              '디바이스 정보를 가져오는데 실패했습니다. 다시 시도해주세요.'
            ),
            confirmText: t('확인'),
            onConfirm: resolve,
          });
        });
      }
    }

    await setDeviceData({
      ...deviceStoreData,
      ipAddress: ipAddress ?? '',
      androidId: androidId ?? '',
      version: appInfo?.version ?? '',
      buildNumber: appInfo?.build ?? '',
    });
    const shopDataResponse = await refreshShopData();

    if (!shopDataResponse) {
      return;
    }

    const deviceDataResponse = await refetchDeviceDetail();

    const deviceData = {
      // App.tsx에서 app plugin을 통해 초기화한 디바이스 데이터
      wifiSignal: deviceStoreData?.wifiSignal ?? '',
      battery: deviceStoreData?.battery ?? 0,
      ipAddress: ipAddress ?? deviceStoreData?.ipAddress ?? '',
      androidId: androidId ?? deviceStoreData?.androidId ?? '',
      version: appInfo?.version ?? deviceStoreData?.version ?? '',
      buildNumber: appInfo?.build ?? deviceStoreData?.buildNumber ?? '',

      // 새로 api를 통해 조회한 디바이스 데이터
      deviceType: deviceDataResponse?.data?.data?.deviceType ?? 'MENU',
      orderPosNumber: deviceDataResponse?.data?.data?.orderPosNumber ?? null,
      tableNumber: deviceDataResponse?.data?.data?.tableNumber ?? null,
    };

    await setDeviceData(deviceData);
    initializeSseConnection();
    navigate(ROUTES.ROOT.generate());
  };

  // Render helpers
  const renderPasswordVisibilityToggle = () => {
    const iconProps = {
      color: theme.colors.grey[500],
      width: 20,
      height: 20,
    };

    return (
      <button
        type="button"
        onClick={togglePasswordVisibility}
        aria-label={
          isPasswordVisible ? t('비밀번호 숨기기') : t('비밀번호 보기')
        }
      >
        {isPasswordVisible ? (
          <VisibilityOffIcon {...iconProps} />
        ) : (
          <VisibilityIcon {...iconProps} />
        )}
      </button>
    );
  };

  return (
    <S.Container>
      <div>쉴더스 로고 이미지 영역</div>

      <S.LoginContainer role="main">
        <h1
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          {t('로그인')}
        </h1>
        <div>
          <label htmlFor="login-id">
            <S.InputTitle>{t('아이디')}</S.InputTitle>
          </label>
          <Input
            name="login-id"
            placeholder={t('아이디를 입력해주세요.')}
            onChange={handleIdChange}
            value={id}
            errorMessage={idErrorMessage}
          />
        </div>
        <div>
          <label htmlFor="login-password">
            <S.InputTitle>{t('비밀번호')}</S.InputTitle>
          </label>
          <Input
            name="login-password"
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder={t('비밀번호를 입력해주세요.')}
            onChange={handlePasswordChange}
            value={password}
            rightComponent={renderPasswordVisibilityToggle()}
            errorMessage={passwordErrorMessage}
          />
        </div>
        <BasicButton
          variant="Solid_Navy_XL"
          customStyle={S.buttonCss}
          onClick={handleLogin}
          aria-label={t('로그인')}
        >
          {t('로그인')}
        </BasicButton>
      </S.LoginContainer>
    </S.Container>
  );
};
