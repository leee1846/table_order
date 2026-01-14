import { Input } from '@repo/ui/components';
import { allowOnlyNumbers } from '@repo/util/string';
import * as S from '../StoreInfoTab/storeInfoTab.style';
import type { ICreateAdminMemberRequest } from '@repo/api/types';

interface Props {
  formData: ICreateAdminMemberRequest;
  updateFormData: (updates: Partial<ICreateAdminMemberRequest>) => void;
}

export const MemberInfoTab = ({ formData, updateFormData }: Props) => {
  const hasMember = !!formData.memberId;

  return (
    <S.Container>
      {!hasMember && (
        <S.Section>
          <S.MessageText>
            계정이 존재하지 않습니다. 계정을 생성하세요
          </S.MessageText>
        </S.Section>
      )}

      <S.Section>
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
      </S.Section>

      <S.Section>
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
            />
          </S.FieldGroup>
        </S.HorizontalLayout>
      </S.Section>
    </S.Container>
  );
};
