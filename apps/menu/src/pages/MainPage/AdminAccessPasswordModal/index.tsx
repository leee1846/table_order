import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloseIcon, ArrowBackIcon, PasswordIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { Keypad } from '@repo/ui/components';
import { AppStorage } from '@repo/util/app';
import { usePostLoginMenuboardAdmin } from '@repo/api/queries';
import { openConfirmDialog } from '@repo/feature/utils';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { ROUTES } from '@/constants/routes';
import { STORAGE_KEYS, TIMER_KEYS } from '@/constants/keys';
import { globalTimerManager } from '@/utils/timerManager';
import { useRequestAdminAccessModalStore } from '@/stores/useRequestAdminAccessModalStore';
import * as S from '@/pages/MainPage/AdminAccessPasswordModal/adminAccessPasswordModal.style';
import { useShopStore } from '@/stores/useShopStore';
import { useDeviceStore } from '@/stores/useDeviceStore';

const PASSWORD_MAX_LENGTH = 4;

interface Props {
  onClose: () => void;
}

export const AdminAccessPasswordModal = ({ onClose }: Props) => {
  const [password, setPassword] = useState<string | null>(null);

  const { theme } = useThemeMode();
  const navigate = useNavigate();
  const { t } = useAdminTranslation();
  const { data: shopData } = useShopStore();
  const deviceData = useDeviceStore((s) => s.data);
  const setShowAdminAccessModal = useRequestAdminAccessModalStore(
    (s) => s.setShow
  );

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
      },
    },
  });

  const handleLoginSuccess = () => {
    AppStorage.saveData({
      key: STORAGE_KEYS.ADMIN_PASSWORD_VERIFIED,
      value: true,
      isTemporary: true,
    });

    // 페이지가 이동되는 동안 모달이 닫혀 깜빡임이 생김
    // modal상태는 500ms 뒤에 닫히도록 설정
    globalTimerManager.setTimeout(
      TIMER_KEYS.ADMIN_ACCESS_MODAL_HIDE,
      () => {
        setShowAdminAccessModal(false);
      },
      500
    );

    navigate(ROUTES.TABLES.generate());
  };

  useEffect(() => {
    return () => {
      globalTimerManager.clear(TIMER_KEYS.ADMIN_ACCESS_MODAL_HIDE);
    };
  }, []);

  const handlePasswordComplete = async (completedPassword: string) => {
    const shopCode = shopData?.shopCode;
    if (!shopCode) {
      return;
    }

    await loginMenuboardAdmin({
      shopCode,
      pw: completedPassword,
    }).then(handleLoginSuccess);
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
