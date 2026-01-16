import { useState, useEffect } from 'react';
import { BasicButton } from '@repo/ui/components';
import { MembersForm } from './MembersForm';
import * as S from './members.style';
import { type MembersFormData, DEFAULT_MEMBERS_DATA } from './constants';

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  initialData?: MembersFormData;
  onSave?: (data: MembersFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  onResetPassword?: () => Promise<void>;
}

export const Members = ({
  mode,
  initialData,
  onSave,
  onDelete,
  onResetPassword,
}: Props) => {
  const [formData, setFormData] =
    useState<MembersFormData>(DEFAULT_MEMBERS_DATA);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const updateFormData = (updates: Partial<MembersFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(formData);
    }
  };

  const getTitle = () => {
    if (mode === 'create') {
      return '생성';
    }
    if (mode === 'edit') {
      return '수정';
    }
    return '상세';
  };

  return (
    <S.Container>
      <S.Header>
        <S.Titles>
          <p>회원 관리</p>
          <span />
          <div>
            <p>{getTitle()}</p>
          </div>
        </S.Titles>
        {mode !== 'detail' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {mode === 'edit' && onResetPassword && (
              <BasicButton variant="Outline_Blue_M" onClick={onResetPassword}>
                비밀번호 초기화
              </BasicButton>
            )}
            {mode === 'edit' && onDelete && (
              <BasicButton variant="Outline_Grey_M" onClick={onDelete}>
                삭제
              </BasicButton>
            )}
            <BasicButton variant="Solid_Navy_M" onClick={handleSave}>
              저장
            </BasicButton>
          </div>
        )}
      </S.Header>

      <S.Content>
        <MembersForm
          mode={mode}
          formData={formData}
          updateFormData={updateFormData}
        />
      </S.Content>
    </S.Container>
  );
};
