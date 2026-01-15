import { useState, useEffect } from 'react';
import { BasicButton } from '@repo/ui/components';
import { AdminForm } from './AdminForm';
import * as S from './adminManage.style';
import { type AdminFormData, DEFAULT_ADMIN_DATA } from './constants';

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  initialData?: AdminFormData;
  onSave?: (data: AdminFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const AdminManage = ({ mode, initialData, onSave, onDelete }: Props) => {
  const [formData, setFormData] = useState<AdminFormData>(DEFAULT_ADMIN_DATA);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const updateFormData = (updates: Partial<AdminFormData>) => {
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
          <p>관리자 관리</p>
          <span />
          <div>
            <p>{getTitle()}</p>
          </div>
        </S.Titles>
        {mode !== 'detail' && (
          <div style={{ display: 'flex', gap: '8px' }}>
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
        <AdminForm
          mode={mode}
          formData={formData}
          updateFormData={updateFormData}
        />
      </S.Content>
    </S.Container>
  );
};
