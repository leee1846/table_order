import { useState } from 'react';
import { Button, App } from 'antd';
import {
  InboxOutlined,
  CloseOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { usePostUploadPosExcelBundle } from '@repo/api/queries';
import type { UploadFile } from 'antd/es/upload/interface';
import * as S from './UploadModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shopCode: string;
  shopSeq: number;
}

export const UploadModal = ({ isOpen, onClose, shopCode }: Props) => {
  const { message } = App.useApp();
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: uploadPosExcelBundle } = usePostUploadPosExcelBundle();

  const handleBeforeUpload = (file: File) => {
    const lower = file.name.toLowerCase();
    if (lower.endsWith('.xlsx')) {
      setExcelFile(file);
    } else if (lower.endsWith('.zip')) {
      setZipFile(file);
    } else {
      message.warning('엑셀(.xlsx) 또는 ZIP 파일만 업로드 가능합니다.');
    }
    return false; // 브라우저의 기본 업로드 동작 방지
  };

  const handleRemove = (file: UploadFile) => {
    if (file.uid === 'excel') setExcelFile(null);
    if (file.uid === 'zip') setZipFile(null);
  };

  const handleClose = () => {
    setExcelFile(null);
    setZipFile(null);
    setIsUploading(false);
    onClose();
  };

  const handleUpload = async () => {
    if (!excelFile) {
      message.warning('엑셀 파일을 등록해주세요.');
      return;
    }

    setIsUploading(true);

    try {
      await uploadPosExcelBundle({
        shopCode,
        excel: excelFile,
        imagesZip: zipFile || undefined,
      });
      message.success('업로드가 완료되었습니다.');
      handleClose();
    } catch (error) {
      console.error('File upload failed:', error);
      message.error('업로드에 실패했습니다.');
      setIsUploading(false);
    }
  };

  const fileList: UploadFile[] = [
    ...(excelFile
      ? [
          {
            uid: 'excel',
            name: `[엑셀] ${excelFile.name}`,
            status: 'done',
            originFileObj: excelFile as File,
          } as UploadFile,
        ]
      : []),
    ...(zipFile
      ? [
          {
            uid: 'zip',
            name: `[이미지] ${zipFile.name}`,
            status: 'done',
            originFileObj: zipFile as File,
          } as UploadFile,
        ]
      : []),
  ];

  return (
    <S.StyledModal
      title={<S.ModalTitle>엑셀 / 이미지 업로드</S.ModalTitle>}
      open={isOpen}
      onCancel={handleClose}
      maskClosable={!isUploading}
      closable={!isUploading}
      closeIcon={<CloseOutlined style={{ color: '#fff' }} />}
      width={500}
      styles={S.modalStyles}
      footer={
        <S.ModalFooter>
          <Button
            size="large"
            key="back"
            onClick={handleClose}
            disabled={isUploading}
          >
            취소
          </Button>
          <Button
            size="large"
            key="submit"
            type="primary"
            loading={isUploading}
            onClick={handleUpload}
            disabled={!excelFile}
          >
            업로드
          </Button>
        </S.ModalFooter>
      }
    >
      <S.ShopInfoContainer>
        <S.ShopCodeText>
          매장 코드:{' '}
          <S.ShopCodeHighlight strong>{shopCode}</S.ShopCodeHighlight>
        </S.ShopCodeText>
        <S.InfoBanner>
          <S.InfoIconWrapper>
            <InfoCircleOutlined />
          </S.InfoIconWrapper>
          <S.InfoList>
            <li>
              반드시 <strong>정해진 엑셀 양식</strong>에 맞춰 업로드해 주세요.
            </li>
            <li>
              메뉴 이미지는 <strong>ZIP 파일</strong>로 압축하여 함께 업로드할
              수 있습니다.
            </li>
          </S.InfoList>
        </S.InfoBanner>
      </S.ShopInfoContainer>

      <S.StyledDragger
        multiple
        accept=".xlsx, .zip"
        fileList={fileList}
        beforeUpload={handleBeforeUpload}
        onRemove={handleRemove}
        disabled={isUploading}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          클릭하거나 파일을 이곳으로 드래그 앤 드롭하세요.
        </p>
        <p className="ant-upload-hint">
          엑셀(.xlsx) 및 ZIP(.zip) 파일만 지원합니다.
        </p>
      </S.StyledDragger>
    </S.StyledModal>
  );
};
