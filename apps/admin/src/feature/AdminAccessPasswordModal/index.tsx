import { useCallback, useMemo, useState } from 'react';
import { UnlockedIcon, ArrowBackIcon, CloseIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { Keypad } from '@repo/ui/components';
import { useAdminTranslation } from '@/config/i18n';
import * as S from './adminAccessPasswordModal.style';
import { toast } from '@repo/feature/utils';

const PASSWORD_MAX_LENGTH = 4;

export interface AdminAccessPasswordModalProps {
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  onSuccess?: () => void;
  passwordMaxLength?: number;
}

export const AdminAccessPasswordModal = (
  props: AdminAccessPasswordModalProps
) => {
  const [password, setPassword] = useState<string | null>(null);

  const {
    onClose,
    onSubmit,
    onSuccess,
    passwordMaxLength = PASSWORD_MAX_LENGTH,
  } = props;

  const { theme } = useThemeMode();
  const { t } = useAdminTranslation();
  const handlePasswordComplete = useCallback(
    async (completedPassword: string) => {
      try {
        await onSubmit(completedPassword);
        onSuccess?.();
      } catch (error) {
        const status = (error as { response?: { status?: number } })?.response
          ?.status;
        if (status === 401) {
          toast(t('인증에 실패했습니다. 비밀번호를 다시 입력해주세요.'));
        }
        setPassword(null);
      }
    },
    [onSubmit, onSuccess]
  );

  const handleNumberPress = useCallback(
    (number: number) => {
      setPassword((currentPassword) => {
        const currentPasswordLength = currentPassword?.length ?? 0;

        if (currentPasswordLength >= passwordMaxLength) {
          return currentPassword;
        }

        const nextPassword =
          currentPassword === null
            ? String(number)
            : currentPassword + String(number);

        if (nextPassword.length === passwordMaxLength) {
          void handlePasswordComplete(nextPassword);
        }

        return nextPassword;
      });
    },
    [handlePasswordComplete, passwordMaxLength]
  );

  const handleDeletePassword = useCallback(() => {
    setPassword((currentPassword) => {
      if (!currentPassword || currentPassword.length <= 1) {
        return null;
      }
      return currentPassword.slice(0, -1);
    });
  }, []);

  const filledDigits = useMemo(() => {
    const currentPasswordLength = password?.length ?? 0;
    return Array.from({ length: passwordMaxLength }, (_, digitIndex) => {
      return currentPasswordLength > digitIndex;
    });
  }, [password, passwordMaxLength]);

  return (
    <S.Container
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-title"
    >
      <S.CloseButton type="button" onClick={onClose} aria-label={t('닫기')}>
        <CloseIcon width={28} height={28} color={theme.mode.grey[50]} />
      </S.CloseButton>
      <S.Content>
        <UnlockedIcon
          width={80}
          height={80}
          color={theme.mode.grey[400]}
          aria-hidden="true"
        />
        <S.Title id="password-title">{t('비밀번호를 입력해 주세요')}</S.Title>
        <S.PasswordContainer
          role="status"
          aria-live="polite"
          aria-label={t('비밀번호')}
        >
          {filledDigits.map((isFilled, digitIndex) => (
            <li
              key={`${digitIndex + 1}`}
              aria-label={isFilled ? t('입력됨') : t('미입력')}
            >
              {isFilled && <span />}
            </li>
          ))}
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
