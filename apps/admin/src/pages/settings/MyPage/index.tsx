import { useState } from 'react';
import { Input, BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from './myPage.style';
import { VisibilityIcon, VisibilityOffIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROUTES } from '@/constants/routes';
import { openDualActionDialog, toast } from '@repo/feature/utils';
import { useAdminTranslation } from '@/config/i18n';
import { usePutMemberPassword } from '@repo/api/queries';

export const MyPage = () => {
  const { t } = useAdminTranslation();
  const { clearAuth, tokenPayload } = useAuthStore();
  const { mutateAsync: putMemberPassword, isPending } = usePutMemberPassword();
  const memberId = tokenPayload?.sub ?? '';

  const performLogout = () => {
    clearAuth();
    window.location.replace(ROUTES.LOGIN.generate());
  };

  // 비밀번호 입력 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 비밀번호 표시/숨김 상태
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // 에러 메시지 상태
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // 비밀번호 표시/숨김 토글 컴포넌트
  const renderPasswordVisibilityToggle = (
    isVisible: boolean,
    onToggle: () => void
  ) => {
    const iconProps = {
      color: theme.colors.grey[500],
      width: 20,
      height: 20,
    };

    return (
      <button type="button" onClick={onToggle}>
        {isVisible ? (
          <VisibilityOffIcon {...iconProps} />
        ) : (
          <VisibilityIcon {...iconProps} />
        )}
      </button>
    );
  };

  // 기존 비밀번호 변경 핸들러
  const handleCurrentPasswordChange = (value: string) => {
    setCurrentPassword(value);
    if (value.length > 0) {
      setCurrentPasswordError('');
    } else {
      setCurrentPasswordError(t('기존 비밀번호를 입력해주세요.'));
    }
  };

  // 새 비밀번호 변경 핸들러
  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (value.length > 0) {
      setNewPasswordError('');
      // 새 비밀번호 확인과 일치하는지 확인
      if (confirmPassword && value !== confirmPassword) {
        setConfirmPasswordError(t('새 비밀번호와 일치하지 않습니다.'));
      } else if (confirmPassword && value === confirmPassword) {
        setConfirmPasswordError('');
      }
    } else {
      setNewPasswordError(t('새 비밀번호를 입력해주세요.'));
    }
  };

  // 새 비밀번호 확인 변경 핸들러
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value.length > 0) {
      if (value !== newPassword) {
        setConfirmPasswordError(t('새 비밀번호와 일치하지 않습니다.'));
      } else {
        setConfirmPasswordError('');
      }
    } else {
      setConfirmPasswordError(t('새 비밀번호 확인을 입력해주세요.'));
    }
  };

  // 비밀번호 변경 핸들러
  const handleChangePassword = async () => {
    // 유효성 검사
    if (!currentPassword) {
      setCurrentPasswordError(t('기존 비밀번호를 입력해주세요.'));
      return;
    }
    if (!newPassword) {
      setNewPasswordError(t('새 비밀번호를 입력해주세요.'));
      return;
    }
    if (!confirmPassword) {
      setConfirmPasswordError(t('새 비밀번호 확인을 입력해주세요.'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(t('새 비밀번호와 일치하지 않습니다.'));
      return;
    }

    if (!memberId) {
      toast(t('회원 정보가 유효하지 않습니다. 다시 로그인 후 시도해주세요.'));
      return;
    }

    await putMemberPassword({
      memberId,
      memberPassword: newPassword,
      existingMemberPassword: currentPassword,
    });

    toast(t('비밀번호가 변경되었습니다.'));
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    performLogout();
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    openDualActionDialog({
      title: t('로그아웃'),
      content: t('로그아웃 하시겠습니까?'),
      primaryText: t('확인'),
      secondaryText: t('취소'),
      onConfirm: () => {
        performLogout();
      },
    });
  };

  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.TitleContainer>
          <S.Title>
            {t('내 정보')}
            <div />
            <span>{t('계정 관리')}</span>
          </S.Title>
          <BasicButton variant="Outline_Grey_M" onClick={handleLogout}>
            {t('로그아웃')}
          </BasicButton>
        </S.TitleContainer>

        <S.Section>
          <S.SectionTitle>{t('비밀번호 변경')}</S.SectionTitle>
          <S.PasswordForm>
            <S.InputWrapper>
              <S.Label>{t('기존 비밀번호')}</S.Label>
              <Input
                type={currentPasswordVisible ? 'text' : 'password'}
                placeholder={t('기존 비밀번호를 입력해주세요')}
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
                rightComponent={renderPasswordVisibilityToggle(
                  currentPasswordVisible,
                  () => setCurrentPasswordVisible(!currentPasswordVisible)
                )}
                errorMessage={currentPasswordError}
              />
            </S.InputWrapper>

            <S.InputWrapper>
              <S.Label>{t('새 비밀번호')}</S.Label>
              <Input
                type={newPasswordVisible ? 'text' : 'password'}
                placeholder={t('새 비밀번호를 입력해주세요')}
                value={newPassword}
                onChange={handleNewPasswordChange}
                rightComponent={renderPasswordVisibilityToggle(
                  newPasswordVisible,
                  () => setNewPasswordVisible(!newPasswordVisible)
                )}
                errorMessage={newPasswordError}
              />
            </S.InputWrapper>

            <S.InputWrapper>
              <S.Label>{t('새 비밀번호 확인')}</S.Label>
              <Input
                type={confirmPasswordVisible ? 'text' : 'password'}
                placeholder={t('새 비밀번호를 다시 입력해주세요')}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                rightComponent={renderPasswordVisibilityToggle(
                  confirmPasswordVisible,
                  () => setConfirmPasswordVisible(!confirmPasswordVisible)
                )}
                errorMessage={confirmPasswordError}
              />
            </S.InputWrapper>

            <S.ButtonWrapper>
              <BasicButton
                variant="Solid_Navy_M"
                disabled={isPending}
                onClick={handleChangePassword}
              >
                {t('비밀번호 변경')}
              </BasicButton>
            </S.ButtonWrapper>
          </S.PasswordForm>
        </S.Section>
      </S.Container>
    </UIStyles.setting.TablePageContainer>
  );
};
