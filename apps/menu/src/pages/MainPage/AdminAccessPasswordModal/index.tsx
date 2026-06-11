import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CloseIcon, ArrowBackIcon, PasswordIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { Keypad } from '@repo/ui/components';
import { usePostLoginMenuboardAdmin } from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import { openConfirmDialog } from '@repo/feature/utils';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { ROUTES } from '@/constants/routes';
import { TIMER_KEYS } from '@/constants/keys';
import { globalTimerManager } from '@/utils/timerManager';
import { useRequestAdminAccessModalStore } from '@/stores/useRequestAdminAccessModalStore';
import * as S from '@/pages/MainPage/AdminAccessPasswordModal/adminAccessPasswordModal.style';
import { useShopStore } from '@/stores/useShopStore';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { setMenuboardToken } from '@/feature/MenuboardAuth';

const PASSWORD_MAX_LENGTH = 4;

export const AdminAccessPasswordModal = () => {
  const [password, setPassword] = useState<string | null>(null);

  const { theme } = useThemeMode();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const isMainPage = pathname === ROUTES.ROOT.path;
  const { t } = useAdminTranslation();
  const { data: shopData } = useShopStore();
  const deviceData = useDeviceStore((s) => s.data);
  const setShowAdminAccessModal = useRequestAdminAccessModalStore(
    (s) => s.setShow
  );

  const onClose = () => {
    if (isMainPage) {
      setShowAdminAccessModal(false);
      return;
    }

    navigate(ROUTES.ROOT.generate());
  };

  const { mutateAsync: loginMenuboardAdmin } = usePostLoginMenuboardAdmin({
    ignoreGlobalErrors: [401],
    options: {
      onError: (error) => {
        if (error.response?.status === 401) {
          openConfirmDialog({
            title: t('인증 실패'),
            content: t('인증에 실패했습니다. 비밀번호를 다시 입력해주세요.'),
          });
          setPassword(null);
        }
        if (error.response?.status === 400) {
          setPassword(null);
          // 다수 비밀번호 입력 실패 시 비밀번호 잠금 상태
          if (error.response?.data?.status?.code === -104) {
            // 메인페이지일경우 주문 화면으로 이동
            // 관리자모드 페이지일경우 그대로 비밀번호 입력 화면 유지
            // 관리자페이지에서 비밀번호 다시 설정해야 입력 가능
            if (deviceData?.tableNumber && isMainPage) {
              setShowAdminAccessModal(false);
            }
          }
        }
      },
    },
  });

  const handleLoginSuccess = async (menuboardToken: string) => {
    setMenuboardToken(menuboardToken);

    if (isMainPage) {
      navigate(ROUTES.TABLES.generate());
    } else {
      await queryClient.refetchQueries({ type: 'active' });
    }

    // 페이지가 이동되는 동안 모달이 닫혀 깜빡임이 생김
    // modal상태는 500ms 뒤에 닫히도록 설정
    globalTimerManager.setTimeout(
      TIMER_KEYS.ADMIN_ACCESS_MODAL_HIDE,
      () => {
        setShowAdminAccessModal(false);
      },
      500
    );
  };

  const handlePasswordComplete = async (completedPassword: string) => {
    const shopCode = shopData?.shopCode;
    if (!shopCode) {
      return;
    }

    const response = await loginMenuboardAdmin({
      shopCode,
      pw: completedPassword,
    });

    if (response.status.code === 0) {
      const menuboardToken = response.data?.menuboardToken;
      // 응답 코드는 성공이지만 토큰이 없는 경우 인증 실패 처리
      if (!menuboardToken) {
        openConfirmDialog({
          title: t('인증 실패'),
          content: t('인증에 실패했습니다. 비밀번호를 다시 입력해주세요.'),
        });
        setPassword(null);
        return;
      }
      await handleLoginSuccess(menuboardToken);
      return;
    }

    openConfirmDialog({
      title: t('인증 실패'),
      content: t('인증에 실패했습니다. 비밀번호를 다시 입력해주세요.'),
    });
    setPassword(null);
  };

  const handleNumberPress = (number: number) => {
    const currentPasswordLength = password?.length ?? 0;

    if (currentPasswordLength >= PASSWORD_MAX_LENGTH) {
      return;
    }

    const nextPassword =
      password === null ? String(number) : password + String(number);
    setPassword(nextPassword);

    if (nextPassword.length === PASSWORD_MAX_LENGTH) {
      handlePasswordComplete(nextPassword);
    }
  };

  const handleDeletePassword = () => {
    setPassword((currentPassword) => {
      if (!currentPassword || currentPassword.length <= 1) {
        return null;
      }
      return currentPassword.slice(0, -1);
    });
  };

  const currentPasswordLength = password?.length ?? 0;
  const isPasswordDigitFilled = (digitIndex: number) =>
    currentPasswordLength > digitIndex;

  return (
    <S.Container
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-title"
    >
      {deviceData?.tableNumber && (
        <S.CloseButton type="button" onClick={onClose} aria-label={t('닫기')}>
          <CloseIcon width={42} height={42} color={theme.mode.grey[400]} />
        </S.CloseButton>
      )}
      <S.InnerContainer>
        <S.Header>
          <S.Title id="password-title">
            {t('관리자 비밀번호 4자리를 입력해 주세요')}
          </S.Title>
        </S.Header>

        <S.Content>
          <S.PasswordContainer
            role="status"
            aria-live="polite"
            aria-label={t('비밀번호')}
          >
            <S.PasswordItem
              isFilled={isPasswordDigitFilled(0)}
              aria-label={isPasswordDigitFilled(0) ? t('입력됨') : t('미입력')}
              key={`${0}`}
            >
              {isPasswordDigitFilled(0) && (
                <PasswordIcon
                  width={18}
                  height={18}
                  color={theme.mode.grey[50]}
                />
              )}
            </S.PasswordItem>
            <S.PasswordItem
              isFilled={isPasswordDigitFilled(1)}
              aria-label={isPasswordDigitFilled(1) ? t('입력됨') : t('미입력')}
              key={`${1}`}
            >
              {isPasswordDigitFilled(1) && (
                <PasswordIcon
                  width={18}
                  height={18}
                  color={theme.mode.grey[50]}
                />
              )}
            </S.PasswordItem>
            <S.PasswordItem
              isFilled={isPasswordDigitFilled(2)}
              aria-label={isPasswordDigitFilled(2) ? t('입력됨') : t('미입력')}
              key={`${2}`}
            >
              {isPasswordDigitFilled(2) && (
                <PasswordIcon
                  width={18}
                  height={18}
                  color={theme.mode.grey[50]}
                />
              )}
            </S.PasswordItem>
            <S.PasswordItem
              isFilled={isPasswordDigitFilled(3)}
              aria-label={isPasswordDigitFilled(3) ? t('입력됨') : t('미입력')}
              key={`${3}`}
            >
              {isPasswordDigitFilled(3) && (
                <PasswordIcon
                  width={18}
                  height={18}
                  color={theme.mode.grey[50]}
                />
              )}
            </S.PasswordItem>
          </S.PasswordContainer>
          <Keypad
            onNumberPress={handleNumberPress}
            bottomRightAction={handleDeletePassword}
            bottomRightIcon={
              <ArrowBackIcon
                width={28}
                height={28}
                color={theme.mode.grey[50]}
              />
            }
            customStyle={S.KeypadCss(theme)}
          />
        </S.Content>
      </S.InnerContainer>
    </S.Container>
  );
};
