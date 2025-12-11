import { CloseIcon, UnlockedIcon, ArrowBackIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { Keypad } from '@repo/ui/components';
import * as S from '@/pages/MainPage/PasswordModal/passwordModal.style';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { storage } from '@repo/util/function';
import { STORAGE_KEYS } from '@/constants/keys';

interface Props {
  onClose: () => void;
}

export const PasswordModal = ({ onClose }: Props) => {
  const { theme } = useThemeMode();
  const navigate = useNavigate();
  const { t } = useAdminTranslation();

  const [password, setPassword] = useState<string | null>(null);

  const handleNumberPress = (number: number) => {
    setPassword((prev) => {
      if (prev && prev.length > 3) {
        return prev;
      }

      if (prev === null) {
        return String(number);
      }
      return prev + String(number);
    });
  };

  useEffect(() => {
    // TODO: 비밀번호 검증 로직 추후 추가
    if (password && password.length > 3) {
      storage.session.save(STORAGE_KEYS.ADMIN_PASSWORD_VERIFIED, true);
      navigate(ROUTES.TABLES.generate());
    }
  }, [password, navigate]);

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
      <S.CloseButton type="button" onClick={onClose}>
        <CloseIcon width={42} height={42} color={theme.mode.grey[400]} />
      </S.CloseButton>

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
