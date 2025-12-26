import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloseIcon, UnlockedIcon, ArrowBackIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { Keypad } from '@repo/ui/components';
import { AppStorage } from '@repo/util/app';
import { usePostLoginMenuboardAdmin } from '@repo/api/queries';
import { openConfirmDialog } from '@repo/feature/utils';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { useShopData } from '@/hooks/useShopData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { ROUTES } from '@/constants/routes';
import { STORAGE_KEYS } from '@/constants/keys';
import * as S from '@/pages/MainPage/AdminAccessPasswordModal/adminAccessPasswordModal.style';

const PASSWORD_MAX_LENGTH = 4;

interface Props {
  onClose: () => void;
}

export const AdminAccessPasswordModal = ({ onClose }: Props) => {
  const [password, setPassword] = useState<string | null>(null);

  const { theme } = useThemeMode();
  const navigate = useNavigate();
  const { t } = useAdminTranslation();
  const { shopData } = useShopData();
  const { data: deviceData } = useDeviceData();

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
    navigate(ROUTES.TABLES.generate());
  };

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
    <S.Container>
      {deviceData?.tableNumber && (
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={42} height={42} color={theme.mode.grey[400]} />
        </S.CloseButton>
      )}

      <S.Content>
        <UnlockedIcon width={80} height={80} color={theme.mode.grey[400]} />
        <S.Title>{t('비밀번호를 입력해 주세요')}</S.Title>
        <S.PasswordContainer>
          <li>{isPasswordDigitFilled(0) && <span />}</li>
          <li>{isPasswordDigitFilled(1) && <span />}</li>
          <li>{isPasswordDigitFilled(2) && <span />}</li>
          <li>{isPasswordDigitFilled(3) && <span />}</li>
        </S.PasswordContainer>
        <Keypad
          onNumberPress={handleNumberPress}
          bottomRightAction={handleDeletePassword}
          bottomRightIcon={
            <ArrowBackIcon width={28} height={28} color={theme.mode.grey[50]} />
          }
          customStyle={S.KeypadCss(theme)}
        />
      </S.Content>
    </S.Container>
  );
};
