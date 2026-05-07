import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex } from 'antd';
import styled from '@emotion/styled';
import { NoticesForm } from '@/feature/backoffice/Notices/NoticesForm';
import { ChangeHistoryDialog } from '@/feature/backoffice/ChangeHistoryDialog';
import PageTitle from '@/feature/backoffice/components/PageTitle';
import {
  type NoticesFormData,
  DEFAULT_NOTICES_DATA,
} from '@/feature/backoffice/Notices/constants';

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  initialData?: NoticesFormData;
  onSave?: (data: NoticesFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const FormWrapper = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  //margin-top: 24px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const Notices = ({ mode, initialData, onSave, onDelete }: Props) => {
  const navigate = useNavigate();
  const [formData, setFormData] =
    useState<NoticesFormData>(DEFAULT_NOTICES_DATA);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const updateFormData = (updates: Partial<NoticesFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(formData);
    }
  };

  const handleHistory = () => {
    setIsHistoryDialogOpen(true);
  };

  const handleCloseHistoryDialog = () => {
    setIsHistoryDialogOpen(false);
  };

  const getSubtitle = () => {
    if (mode === 'create') return '등록';
    if (mode === 'edit') return '수정';
    return '상세';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Flex justify="space-between" align="center">
        <PageTitle title="공지사항 관리" subtitle={getSubtitle()} />
        <ButtonGroup>
          {mode === 'edit' && onDelete && (
            <Button onClick={onDelete} danger>
              삭제
            </Button>
          )}
          {mode !== 'create' && (
            <Button onClick={handleHistory}>변경 이력</Button>
          )}
        </ButtonGroup>
      </Flex>

      <FormWrapper>
        <NoticesForm
          mode={mode}
          formData={formData}
          updateFormData={updateFormData}
        />

        <ActionButtons>
          <div />
          <ButtonGroup>
            <Button size="large" onClick={() => navigate(-1)}>
              {mode === 'detail' ? '목록' : '취소'}
            </Button>
            {mode !== 'detail' && (
              <Button size="large" type="primary" onClick={handleSave}>
                {mode === 'create' ? '저장' : '수정'}
              </Button>
            )}
          </ButtonGroup>
        </ActionButtons>
      </FormWrapper>

      <ChangeHistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={handleCloseHistoryDialog}
        histories={[
          {
            code: 'NOTICE',
            id: initialData?.id ?? '',
            label: '공지사항 변경 이력',
          },
        ]}
      />
    </div>
  );
};
