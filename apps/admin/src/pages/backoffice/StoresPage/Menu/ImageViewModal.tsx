import { useState } from 'react';
import JSZip from 'jszip';
import { App, Button, Spin, Empty, Image } from 'antd';
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
  useGetMenuBulkImageList,
  usePostReplaceMenuMainImage,
} from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import type { IMenuImageListItem } from '@repo/api/types/menuBulk';
import * as S from './ImageViewModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shopCode: string;
  shopSeq: number;
}

export const ImageViewModal = ({ isOpen, onClose, shopCode }: Props) => {
  const { message } = App.useApp();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [draggingMenuSeq, setDraggingMenuSeq] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { mutateAsync: replaceImage } = usePostReplaceMenuMainImage();

  const { data, isLoading } = useGetMenuBulkImageList(shopCode, {
    enabled: isOpen,
  });

  // 전체 메뉴 리스트와 다운로드 가능한(이미지가 있는) 리스트 분리
  const menuList = data?.data || [];
  const downloadableImages = menuList.filter(
    (item: IMenuImageListItem) => item.imagePath
  );

  const handleDownloadAll = async () => {
    if (downloadableImages.length === 0) return;
    setIsDownloading(true);

    try {
      const zip = new JSZip();

      // 각 이미지 URL을 fetch하여 zip 객체에 추가
      await Promise.all(
        downloadableImages.map(async (item, index) => {
          if (!item.imagePath) return;
          try {
            const response = await fetch(item.imagePath);
            const blob = await response.blob();
            const ext =
              item.imageExtension?.replace(/^\./, '') ||
              blob.type.split('/')[1] ||
              'jpg';

            // 메뉴명에서 특수문자를 제거하여 안전한 파일명 생성
            const safeMenuName =
              item.menuName
                .replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]/g, '')
                .trim() || 'image';
            zip.file(`${safeMenuName}_${index + 1}.${ext}`, blob);
          } catch (err) {
            console.error(
              `Failed to fetch image ${index + 1}:`,
              item.imagePath,
              err
            );
          }
        })
      );

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${shopCode}_images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success('전체 이미지 다운로드가 완료되었습니다.');
    } catch (error) {
      console.error('Failed to create zip:', error);
      message.error('이미지 압축 다운로드에 실패했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    menuSeq: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingMenuSeq(menuSeq);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingMenuSeq(null);
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    menuSeq: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingMenuSeq(null);

    const file = e.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      message.warning('jpg, jpeg, png, webp, gif 확장자만 업로드 가능합니다.');
      return;
    }

    setIsUploading(true);
    try {
      await replaceImage({ menuSeq, file });
      message.success('이미지가 변경되었습니다.');
      await queryClient.invalidateQueries({
        queryKey: ['menu', 'bulkImageList', shopCode],
      });
    } catch (error) {
      console.error('Image replace failed:', error);
      message.error('이미지 변경에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <S.StyledModal
      title={<S.ModalTitle>메뉴 이미지 목록</S.ModalTitle>}
      open={isOpen}
      onCancel={onClose}
      width={1000}
      closeIcon={<CloseOutlined style={{ color: '#fff' }} />}
      styles={{
        header: S.modalStyles.header,
        container: { padding: 0, borderRadius: '8px' },
        body: S.modalStyles.body as React.CSSProperties,
      }}
      footer={
        <S.ModalFooter>
          {/*
          <Button
            size="large"
            onClick={handleDownloadAll}
            disabled={downloadableImages.length === 0 || isLoading || isDownloading}
            loading={isDownloading}
          >
            전체 이미지 다운로드
          </Button>
          */}
          <Button size="large" type="primary" onClick={onClose}>
            닫기
          </Button>
        </S.ModalFooter>
      }
    >
      <Spin
        spinning={isLoading || isDownloading || isUploading}
        description="처리 중..."
      >
        <S.HeaderContainer>
          <S.ShopCodeText>
            매장 코드:{' '}
            <S.ShopCodeHighlight strong>{shopCode}</S.ShopCodeHighlight>
          </S.ShopCodeText>
          <S.StatsText type="secondary">
            전체: {menuList.length}개 / 이미지 등록: {downloadableImages.length}
            개
          </S.StatsText>
        </S.HeaderContainer>
        <S.InfoBanner>
          <InfoCircleOutlined style={{ color: '#1677ff' }} />
          <S.InfoText>
            변경할 이미지를 해당 메뉴 카드 위로 <strong>드래그 앤 드롭</strong>
            하여 즉시 교체할 수 있습니다.
          </S.InfoText>
        </S.InfoBanner>

        {menuList.length > 0 ? (
          <S.GridContainer>
            {menuList.map((item: IMenuImageListItem) => (
              <S.StyledCard
                key={item.menuSeq}
                hoverable
                size="small"
                onDragOver={(e) => handleDragOver(e, item.menuSeq)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item.menuSeq)}
                isDragging={draggingMenuSeq === item.menuSeq}
                styles={{ body: { padding: '12px', textAlign: 'center' } }}
              >
                <S.ImageWrapper>
                  {item.imagePath ? (
                    <Image
                      src={item.imagePath}
                      alt={item.menuName}
                      style={{
                        maxHeight: '100px',
                        maxWidth: '100%',
                        objectFit: 'contain',
                      }}
                      preview={{ mask: '확대' }}
                    />
                  ) : (
                    <S.EmptyImageText type="secondary">
                      이미지 없음
                    </S.EmptyImageText>
                  )}
                </S.ImageWrapper>
                <S.TextWrapper>
                  <S.CategoryName type="secondary">
                    {item.categoryName}
                  </S.CategoryName>
                  <br />
                  <S.MenuName strong ellipsis={{ tooltip: item.menuName }}>
                    {item.menuName}
                  </S.MenuName>
                </S.TextWrapper>
              </S.StyledCard>
            ))}
          </S.GridContainer>
        ) : (
          <Empty
            description="등록된 메뉴가 없습니다."
            style={{ margin: '40px 0' }}
          />
        )}
      </Spin>
    </S.StyledModal>
  );
};
