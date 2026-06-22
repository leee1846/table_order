import React, { useState, useEffect, type CSSProperties } from 'react';
import {
  Modal,
  Upload,
  message,
  Button,
  Radio,
  Typography,
  type UploadProps,
  type UploadFile,
} from 'antd';
import { CloseOutlined, InboxOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import type { TManualType } from '@repo/api/types';
import { usePostUploadManual } from '@repo/api/queries';

const { Text } = Typography;

const StyledModal = styled(Modal)`
  .ant-modal-container,
  .ant-modal-content {
    padding: 0 !important;
  }
`;

export const modalStyles = {
  header: {
    backgroundColor: '#1d2a6d',
    padding: '20px 24px',
    margin: 0,
    borderRadius: '8px 8px 0 0',
  } as CSSProperties,
  content: { padding: 0, borderRadius: '8px' } as CSSProperties,
  body: { padding: '32px 24px' } as CSSProperties,
};

export const ModalTitle = styled.span`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

interface ManualUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ManualUploadModal: React.FC<ManualUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [manualFile, setManualFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [targetRole, setTargetRole] = useState<TManualType>('ADMIN');

  const { mutateAsync: uploadManual } = usePostUploadManual();

  useEffect(() => {
    if (isOpen) {
      setTargetRole('ADMIN');
      setManualFile(null);
    }
  }, [isOpen]);

  const handleUpload = async () => {
    if (!manualFile) {
      message.warning('업로드할 파일을 선택해주세요.');
      return;
    }
    setIsUploading(true);

    try {
      await uploadManual({
        manualType: targetRole,
        file: manualFile,
      });

      message.success('업로드가 완료되었습니다.');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('File upload failed:', error);
      message.error('업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      onClose();
    }
  };

  const props: UploadProps = {
    onRemove: () => {
      setManualFile(null);
    },
    beforeUpload: (file) => {
      const isPdf =
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf');
      const isPpt = file.name.endsWith('.ppt') || file.name.endsWith('.pptx');
      if (!(isPdf || isPpt)) {
        message.error('PDF, PPT, PPTX 파일만 업로드 가능합니다.');
        return Upload.LIST_IGNORE; // 파일 목록에 추가되는 것을 차단
      }
      setManualFile(file); // maxCount가 1이므로 새로 드래그한 파일로 덮어씌움
      return false; // 브라우저 자동 업로드 방지 (수동 업로드)
    },
  };

  return (
    <StyledModal
      title={<ModalTitle>매뉴얼 업로드</ModalTitle>}
      open={isOpen}
      onCancel={onClose}
      styles={modalStyles}
      mask={!isUploading}
      closable={!isUploading}
      closeIcon={<CloseOutlined style={{ color: '#fff' }} />}
      footer={
        <ModalFooter>
          <Button key="back" onClick={onClose}>
            취소
          </Button>
          <Button
            key="submit"
            type="primary"
            loading={isUploading}
            onClick={handleUpload}
          >
            업로드
          </Button>
        </ModalFooter>
      }
    >
      <div style={{ marginBottom: '10px' }}>
        <Text strong>권한 설정</Text>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Radio.Group
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        >
          <Radio value="ADMIN">관리자</Radio>
          <Radio value="SHOP">매장</Radio>
        </Radio.Group>
      </div>
      <Upload.Dragger
        {...props}
        style={{ marginBottom: '20px' }}
        maxCount={1} // 한 번에 1개의 파일만 업로드
        fileList={
          manualFile
            ? [
                {
                  uid: 'pdf',
                  name: `${manualFile?.name}`,
                  status: 'done',
                  originFileObj: manualFile,
                } as UploadFile,
              ]
            : []
        }
        accept=".pdf,.ppt,.pptx"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">클릭하거나 파일을 여기로 드래그하세요</p>
        <p className="ant-upload-hint">
          PDF, PPT, PPTX 파일만 업로드 가능합니다. (최대 1개)
        </p>
      </Upload.Dragger>
    </StyledModal>
  );
};
