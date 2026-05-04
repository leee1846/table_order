import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex } from 'antd';
import styled from '@emotion/styled';
import { MembersForm } from './MembersForm';
import { type MembersFormData, DEFAULT_MEMBERS_DATA } from './constants';
import PageTitle from '@/feature/backoffice/components/PageTitle';

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  initialData?: MembersFormData;
  onSave?: (data: MembersFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  onResetPassword?: () => Promise<void>;
}

const FormWrapper = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const Members = ({
  mode,
  initialData,
  onSave,
  onDelete,
  onResetPassword,
}: Props) => {
  const navigate = useNavigate();
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

  const getSubtitle = () => {
    if (mode === 'create') return '등록';
    if (mode === 'edit') return '수정';
    return '상세';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Flex justify="space-between" align="center">
        <PageTitle title="회원 관리" subtitle={getSubtitle()} />
        <ButtonGroup>
          {mode === 'edit' && onDelete && (
            <Button onClick={onDelete} danger>
              삭제
            </Button>
          )}
          {mode === 'edit' && onResetPassword && (
            <Button onClick={onResetPassword}>비밀번호 초기화</Button>
          )}
        </ButtonGroup>
      </Flex>
      <FormWrapper>
        <MembersForm
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
    </div>
  );
};
