import { CloseIcon, UnlockedIcon, ArrowBackIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { Keypad } from '@repo/ui/components';
import * as S from '@/pages/MainPage/AdminAccessPasswordModal/adminAccessPasswordModal.style';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { AppStorage } from '@repo/util/app';
import { STORAGE_KEYS } from '@/constants/keys';
import { usePostLoginMenuboardAdmin } from '@repo/api/queries';
import { useShopData } from '@/hooks/useShopData';
import { openConfirmDialog } from '@repo/feature/utils';
import { useDeviceData } from '@/hooks/useDeviceData';

interface Props {
  onClose: () => void;
}

export const AdminAccessPasswordModal = ({ onClose }: Props) => {
  const { theme } = useThemeMode();
  const navigate = useNavigate();
  const { t } = useAdminTranslation();
  const { shopData } = useShopData();
  const { data: deviceData } = useDeviceData();

  const [password, setPassword] = useState<string | null>(null);

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

  const handleNumberPress = (number: number) => {
    if (password && password.length > 3) {
      return;
    }

    const nextPassword =
      password === null ? String(number) : password + String(number);
    setPassword(nextPassword);

    const shopCode = shopData?.shopCode;
    if (!shopCode) {
      return;
    }

    if (nextPassword.length > 3) {
      loginMenuboardAdmin({
        shopCode,
        pw: nextPassword,
      }).then(() => {
        AppStorage.saveData({
          key: STORAGE_KEYS.ADMIN_PASSWORD_VERIFIED,
          value: true,
          isTemporary: true,
        });
        navigate(ROUTES.TABLES.generate());
      });
    }
  };

  const deletePassword = () => {
    setPassword((prev) => {
      if (prev === null || prev.length === 0) {
        return null;
      }
      if (prev.length === 1) {
        return null;
      }
      return prev.slice(0, -1);
    });
  };

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
          <li>{password && password.length > 0 && <span />}</li>
          <li>{password && password.length > 1 && <span />}</li>
          <li>{password && password.length > 2 && <span />}</li>
          <li>{password && password.length > 3 && <span />}</li>
        </S.PasswordContainer>
        <Keypad
          onNumberPress={handleNumberPress}
          bottomRightAction={deletePassword}
          bottomRightIcon={
            <ArrowBackIcon width={28} height={28} color={theme.mode.grey[50]} />
          }
          customStyle={S.KeypadCss(theme)}
        />
      </S.Content>
    </S.Container>
  );
};
