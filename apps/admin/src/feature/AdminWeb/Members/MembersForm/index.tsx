import { Input, Dropdown } from '@repo/ui/components';
import { allowOnlyNumbers } from '@repo/util/string';
import * as S from './membersForm.style';
import {
  MEMBER_ROLE_OPTIONS,
  type MembersFormData,
} from '../constants';

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  formData: MembersFormData;
  updateFormData: (updates: Partial<MembersFormData>) => void;
}

export const MembersForm = ({ mode, formData, updateFormData }: Props) => {
  const isReadOnly = mode === 'detail';

  return (
    <S.Container>
      <S.Section>
        <S.FieldGroup>
          <S.Label>
            이름 <span>*</span>
          </S.Label>
          <Input
            placeholder="이름을 입력하세요"
            value={formData.memberName}
            onChange={(value) => updateFormData({ memberName: value })}
            disabled={isReadOnly}
          />
        </S.FieldGroup>
      </S.Section>

      <S.Section>
        <S.FieldGroup>
          <S.Label>
            이메일 <span>*</span>
          </S.Label>
          <Input
            placeholder="이메일을 입력하세요"
            value={formData.memberEmail}
            onChange={(value) => updateFormData({ memberEmail: value })}
            disabled={isReadOnly}
          />
        </S.FieldGroup>
      </S.Section>

      <S.Section>
        <S.FieldGroup>
          <S.Label>
            핸드폰번호 <span>*</span>
          </S.Label>
          <Input
            placeholder="핸드폰번호를 입력하세요"
            value={formData.memberTel}
            onChange={(value) =>
              updateFormData({ memberTel: allowOnlyNumbers(value) })
            }
            disabled={isReadOnly}
          />
        </S.FieldGroup>
      </S.Section>

      <S.Section>
        <S.FieldGroup>
          <S.Label>
            소속 <span>*</span>
          </S.Label>
          <Input
            placeholder="소속을 입력하세요"
            value={formData.memberDepartment}
            onChange={(value) => updateFormData({ memberDepartment: value })}
            disabled={isReadOnly}
          />
        </S.FieldGroup>
      </S.Section>

      <S.Section>
        <S.FieldGroup>
          <S.Label>
            권한 <span>*</span>
          </S.Label>
          <Dropdown
            options={MEMBER_ROLE_OPTIONS}
            value={formData.memberRole}
            onChange={(value) =>
              updateFormData({ memberRole: value as typeof formData.memberRole })
            }
            disabled={isReadOnly}
            placeholder="권한 선택"
          />
        </S.FieldGroup>
      </S.Section>

      {(mode === 'edit' || mode === 'detail') && (
        <S.Section>
          <S.HorizontalLayout>
            <S.FieldGroup>
              <S.Label>생성일자</S.Label>
              <Input
                placeholder="생성일자"
                value={formData.createdAt || ''}
                onChange={() => {
                  // readOnly
                }}
                disabled
              />
            </S.FieldGroup>
            <S.FieldGroup>
              <S.Label>수정일자</S.Label>
              <Input
                placeholder="수정일자"
                value={formData.updatedAt || ''}
                onChange={() => {
                  // readOnly
                }}
                disabled
              />
            </S.FieldGroup>
          </S.HorizontalLayout>
        </S.Section>
      )}
    </S.Container>
  );
};
