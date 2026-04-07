import { allowOnlyNumbers } from '@repo/util/string';
import { usePostAdminMemberPWReset } from '@repo/api/queries';
import { toast, openDualActionDialog } from '@repo/feature/utils';
import * as S from '@/feature/backoffice/Stores/StoreInfoTab/storeInfoTab.style';
import type { ICreateAdminMemberRequest } from '@repo/api/types';
import { Input, Button } from '@/feature/backoffice/components';

interface Props {
  formData: ICreateAdminMemberRequest;
  updateFormData: (updates: Partial<ICreateAdminMemberRequest>) => void;
  isMemberLocked?: boolean;
}

export const MemberInfoTab = ({
  formData,
  updateFormData,
  isMemberLocked = false,
}: Props) => {
  const hasMember = !!formData.memberId;
  const resetPasswordMutation = usePostAdminMemberPWReset();

  const handleResetPassword = async () => {
    if (!formData.memberId) {
      toast('관리자 ID가 없습니다.');
      return;
    }

    openDualActionDialog({
      title: '비밀번호 초기화',
      content: '비밀번호를 초기화하시겠습니까?',
      primaryText: '확인',
      secondaryText: '취소',
      onConfirm: async () => {
        await resetPasswordMutation.mutateAsync({
          memberId: formData.memberId!,
        });
        toast('비밀번호가 초기화되었습니다.');
      },
    });
  };

  return (
    <S.Container>
      {isMemberLocked && (
        <S.WarningMessage>계정이 잠겨 있습니다</S.WarningMessage>
      )}
      <S.Section>
        <S.FormContent>
          {!hasMember && (
            <S.MessageText>
              계정이 존재하지 않습니다. 계정을 생성하세요
            </S.MessageText>
          )}

          <S.FieldGroup>
            <S.Label>
              아이디 <span>*</span>
            </S.Label>
            <Input
              placeholder="아이디"
              value={formData.memberId ?? ''}
              onChange={() => {
                // readOnly
              }}
              disabled
            />
          </S.FieldGroup>

          <S.HorizontalLayout>
            <S.FieldGroup>
              <S.Label>
                회원 이름 <span>*</span>
              </S.Label>
              <Input
                placeholder="회원 이름을 입력하세요"
                value={formData.memberName || ''}
                onChange={(value) => updateFormData({ memberName: value })}
              />
            </S.FieldGroup>
            <S.FieldGroup>
              <S.Label>
                회원 전화번호 <span>*</span>
              </S.Label>
              <Input
                placeholder="회원 전화번호를 입력하세요"
                value={formData.memberTel || ''}
                onChange={(value) =>
                  updateFormData({ memberTel: allowOnlyNumbers(value) })
                }
                type="tel"
                inputMode="numeric"
              />
            </S.FieldGroup>
          </S.HorizontalLayout>

          {hasMember && (
            <S.ButtonContainer>
              <Button variant="outline" onClick={handleResetPassword}>
                비밀번호 초기화
              </Button>
            </S.ButtonContainer>
          )}
        </S.FormContent>
      </S.Section>
    </S.Container>
  );
};
