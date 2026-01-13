import { useState, useEffect } from 'react';
import { BasicButton } from '@repo/ui/components';
import { NoticeForm } from './NoticeForm';
import * as S from './noticeManage.style';
import { type NoticeFormData, DEFAULT_NOTICE_DATA } from './constants';

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  initialData?: NoticeFormData;
  onSave?: (data: NoticeFormData) => Promise<void>;
}

export const NoticeManage = ({ mode, initialData, onSave }: Props) => {
  const [formData, setFormData] = useState<NoticeFormData>(
    DEFAULT_NOTICE_DATA
  );

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const updateFormData = (updates: Partial<NoticeFormData>) => {
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
          <p>공지사항</p>
          <span />
          <div>
            <p>{getTitle()}</p>
          </div>
        </S.Titles>
        {mode !== 'detail' && (
          <BasicButton variant="Solid_Navy_M" onClick={handleSave}>
            저장
          </BasicButton>
        )}
      </S.Header>

      <S.Content>
        <NoticeForm
          mode={mode}
          formData={formData}
          updateFormData={updateFormData}
        />
      </S.Content>
    </S.Container>
  );
};
