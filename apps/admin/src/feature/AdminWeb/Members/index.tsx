import { useState, useEffect } from 'react';
import { MembersForm } from './MembersForm';
import * as S from './members.style';
import { type MembersFormData, DEFAULT_MEMBERS_DATA } from './constants';
import { Button } from '@/feature/AdminWeb/components';

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
    <S.PageWrapper>
      <S.Container>
        <S.TitleContainer>
          <S.Title>
            회원 관리
            <div />
            <span>{getTitle()}</span>
          </S.Title>
          {mode !== 'detail' && (
            <S.ButtonGroup>
              {mode === 'edit' && onResetPassword && (
                <Button variant="outline" onClick={onResetPassword}>
                  비밀번호 초기화
                </Button>
              )}
              {mode === 'edit' && onDelete && (
                <Button variant="outline" onClick={onDelete}>
                  삭제
                </Button>
              )}
              <Button variant="default" onClick={handleSave}>
                저장
              </Button>
            </S.ButtonGroup>
          )}
        </S.TitleContainer>

        <MembersForm
          mode={mode}
          formData={formData}
          updateFormData={updateFormData}
        />
      </S.Container>
    </S.PageWrapper>
  );
};
