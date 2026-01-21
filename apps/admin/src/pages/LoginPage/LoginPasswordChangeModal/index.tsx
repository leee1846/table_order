import { useState } from 'react';
import { BasicButton, Input, ModalBackground } from '@repo/ui/components';
import { VisibilityIcon, VisibilityOffIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './loginPasswordChangeModal.styles';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newPassword: string) => Promise<void>;
  existingPassword: string;
}

export const LoginPasswordChangeModal = ({
  isOpen,
  onConfirm,
  existingPassword,
}: Props) => {
  // 비밀번호 입력 상태
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 비밀번호 표시/숨김 상태
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // 에러 메시지 상태
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

  // 새 비밀번호 변경 핸들러
  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (value.length > 0) {
      if (value === existingPassword) {
        setNewPasswordError('이전 비밀번호와 다른 비밀번호를 입력해주세요.');
      } else {
        setNewPasswordError('');
      }
      // 새 비밀번호 확인과 일치하는지 확인
      if (confirmPassword && value !== confirmPassword) {
        setConfirmPasswordError('새 비밀번호와 일치하지 않습니다.');
      } else if (confirmPassword && value === confirmPassword) {
        setConfirmPasswordError('');
      }
    } else {
      setNewPasswordError('새 비밀번호를 입력해주세요.');
    }
  };

  // 새 비밀번호 확인 변경 핸들러
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value.length > 0) {
      if (value !== newPassword) {
        setConfirmPasswordError('새 비밀번호와 일치하지 않습니다.');
      } else {
        setConfirmPasswordError('');
      }
    } else {
      setConfirmPasswordError('새 비밀번호 확인을 입력해주세요.');
    }
  };

  // 비밀번호 변경 핸들러
  const handleChangePassword = async () => {
    // 유효성 검사
    if (!newPassword) {
      setNewPasswordError('새 비밀번호를 입력해주세요.');
      return;
    }
    if (!confirmPassword) {
      setConfirmPasswordError('새 비밀번호 확인을 입력해주세요.');
      return;
    }
    if (newPassword === existingPassword) {
      setNewPasswordError('이전 비밀번호와 다른 비밀번호를 입력해주세요.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('새 비밀번호와 일치하지 않습니다.');
      return;
    }

    await onConfirm(newPassword);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground position="center">
      <S.DialogContainer onClick={(e) => e.stopPropagation()}>
        <S.Container>
          <S.Header>
            <S.Title>비밀번호 변경</S.Title>
            <S.Description>보안을 위해 비밀번호를 변경해주세요.</S.Description>
          </S.Header>

          <S.Content>
            <S.InputWrapper>
              <S.Label>새 비밀번호</S.Label>
              <Input
                type={newPasswordVisible ? 'text' : 'password'}
                placeholder="새 비밀번호를 입력해주세요"
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
              <S.Label>새 비밀번호 확인</S.Label>
              <Input
                type={confirmPasswordVisible ? 'text' : 'password'}
                placeholder="새 비밀번호를 다시 입력해주세요"
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
                onClick={handleChangePassword}
              >
                비밀번호 변경
              </BasicButton>
            </S.ButtonWrapper>
          </S.Content>
        </S.Container>
      </S.DialogContainer>
    </ModalBackground>
  );
};
