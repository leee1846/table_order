import { useRef, useState } from 'react';
import { Button } from '@/feature/backoffice/components';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import { toast } from '@repo/feature/utils';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from '../Menu/UploadModal.style';
import { usePostUploadPosExcelBundle } from '@repo/api/queries';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shopCode: string;
  shopSeq: number;
}

export const UploadModal = ({ isOpen, onClose, shopCode }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { mutateAsync: uploadPosExcelBundle } = usePostUploadPosExcelBundle();

  if (!isOpen) {
    return null;
  }

  const title = '엑셀 / 이미지 업로드';
  const accept = '.xlsx, .zip';

  const processFiles = (files: FileList | File[]) => {
    let newExcel: File | null = null;
    let newZip: File | null = null;
    let hasError = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const lower = file?.name.toLowerCase();
      if (file) {
        if (lower?.endsWith('.xlsx')) {
          newExcel = file;
        } else if (lower?.endsWith('.zip')) {
          newZip = file;
        } else {
          hasError = true;
        }
      }
    }

    if (hasError) {
      toast('엑셀(.xlsx) 또는 ZIP 파일만 업로드 가능합니다.');
    }

    if (newExcel) {
      setExcelFile(newExcel);
    }
    if (newZip) {
      setZipFile(newZip);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    processFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleClose = () => {
    setExcelFile(null);
    setZipFile(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleUpload = async () => {
    if (!excelFile) {
      toast('엑셀 파일을 등록해주세요.');
      return;
    }

    setIsUploading(true);

    try {
      await uploadPosExcelBundle({
        shopCode,
        excel: excelFile,
        imagesZip: zipFile || undefined,
      });
      toast('업로드가 완료되었습니다.');
    } catch (error) {
      console.error('File upload failed:', error);
      toast('업로드에 실패했습니다.');
    } finally {
      handleClose();
    }
  };

  return (
    <S.Backdrop>
      {isUploading && <FullscreenLoadingSpinner />}
      <S.ModalContainer>
        <S.Title>{title}</S.Title>
        <S.InfoText>
          <S.ShopCodeWrapper>
            매장 코드: <S.ShopCodeHighlight>{shopCode}</S.ShopCodeHighlight>
          </S.ShopCodeWrapper>
          <S.InfoListItem>
            • 반드시 <strong>정해진 엑셀 양식</strong>에 맞춰 업로드해 주세요.
          </S.InfoListItem>
          <S.InfoListItem isLast>
            • 메뉴 이미지는 <strong>하나의 ZIP 파일</strong>로 압축하여 함께
            업로드할 수 있습니다.
          </S.InfoListItem>
        </S.InfoText>

        <S.Dropzone
          isDragging={isDragging}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <S.FileInput
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <S.DropzoneText>
            클릭하거나 파일을 이곳으로 드래그 앤 드롭하세요.
          </S.DropzoneText>
        </S.Dropzone>

        {(excelFile || zipFile) && (
          <S.FileList>
            {excelFile && (
              <S.FileItem>
                <S.FileName title={excelFile.name}>
                  [엑셀] {excelFile.name}
                </S.FileName>
                <S.RemoveButton
                  type="button"
                  onClick={() => setExcelFile(null)}
                  disabled={isUploading}
                  title="목록에서 제거"
                >
                  <CloseIcon
                    width={16}
                    height={16}
                    color={theme.colors.grey[600]}
                  />
                </S.RemoveButton>
              </S.FileItem>
            )}
            {zipFile && (
              <S.FileItem>
                <S.FileName title={zipFile.name}>
                  [이미지] {zipFile.name}
                </S.FileName>
                <S.RemoveButton
                  type="button"
                  onClick={() => setZipFile(null)}
                  disabled={isUploading}
                  title="목록에서 제거"
                >
                  <CloseIcon
                    width={16}
                    height={16}
                    color={theme.colors.grey[600]}
                  />
                </S.RemoveButton>
              </S.FileItem>
            )}
          </S.FileList>
        )}

        <S.ButtonWrapper>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            취소
          </Button>
          <Button
            variant="default"
            onClick={handleUpload}
            disabled={!excelFile || isUploading}
          >
            {isUploading ? '업로드 중...' : '업로드'}
          </Button>
        </S.ButtonWrapper>
      </S.ModalContainer>
    </S.Backdrop>
  );
};
