import { useCallback, useMemo, useState, useRef } from 'react';
import { ArrowBackIcon, CloseIcon, PasswordIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { Keypad } from '@repo/ui/components';
import { useAdminTranslation } from '@/config/i18n';
import * as S from './adminAccessPasswordModal.style';

const PASSWORD_MAX_LENGTH = 4;

export interface AdminAccessPasswordModalProps {
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  onSuccess?: () => void;
  passwordMaxLength?: number;
  type: 'sales' | 'settings';
}

export const AdminAccessPasswordModal = (
  props: AdminAccessPasswordModalProps
) => {
  const [password, setPassword] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  const {
    onClose,
    onSubmit,
    onSuccess,
    passwordMaxLength = PASSWORD_MAX_LENGTH,
    type,
  } = props;

  const { theme } = useThemeMode();
  const { t } = useAdminTranslation();
  const handlePasswordComplete = useCallback(
    async (completedPassword: string) => {
      // 이미 제출 중이면 중복 실행 방지
      if (isSubmittingRef.current) {
        return;
      }

      isSubmittingRef.current = true;

      try {
        await onSubmit(completedPassword);
        onSuccess?.();
        setPassword(null);
      } catch (_error) {
        // 에러 발생 시 비밀번호만 리셋하고 에러는 상위로 전달하지 않음
        // (react-query의 onError에서 이미 처리됨)
        setPassword(null);
      } finally {
        isSubmittingRef.current = false;
      }
    },
    [onSubmit, onSuccess]
  );

  const handleNumberPress = useCallback(
    (number: number) => {
      // 현재 비밀번호 길이 체크
      const currentLen = password?.length ?? 0;

      if (currentLen >= passwordMaxLength) {
        return;
      }

      // 비밀번호 업데이트
      const nextPassword =
        password === null ? String(number) : password + String(number);
      setPassword(nextPassword);

      // 4자리가 되면 API 호출 (setState 밖에서!)
      if (nextPassword.length === passwordMaxLength) {
        handlePasswordComplete(nextPassword);
      }
    },
    [password, passwordMaxLength, handlePasswordComplete]
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
        <CloseIcon width={42} height={42} color={theme.mode.grey[50]} />
      </S.CloseButton>
      <S.InnerContainer>
        <S.Header>
          <S.Title>
            {t(
              type === 'sales'
                ? '매출 비밀번호 4자리를 입력해 주세요'
                : '관리자 비밀번호 4자리를 입력해 주세요'
            )}
          </S.Title>
        </S.Header>
        <S.Content>
          <S.PasswordContainer
            role="status"
            aria-live="polite"
            aria-label={t('비밀번호')}
          >
            {filledDigits.map((isFilled, digitIndex) => (
              <S.PasswordItem
                key={`${digitIndex + 1}`}
                aria-label={isFilled ? t('입력됨') : t('미입력')}
                isFilled={isFilled}
              >
                {isFilled && (
                  <PasswordIcon
                    width={18}
                    height={18}
                    color={theme.mode.grey[50]}
                  />
                )}
              </S.PasswordItem>
            ))}
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
