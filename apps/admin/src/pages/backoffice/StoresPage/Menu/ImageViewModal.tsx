import { useState } from 'react';
import { App, Button, Spin, Empty, Image } from 'antd';
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
  useGetMenuBulkImageList,
  usePostReplaceMenuMainImage,
  usePostMenuBulkMenuSse,
} from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import * as S from './ImageViewModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shopCode: string;
  shopSeq: number;
}

export const ImageViewModal = ({ isOpen, onClose, shopCode }: Props) => {
  const { message } = App.useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [draggingMenuSeq, setDraggingMenuSeq] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { mutateAsync: replaceImage } = usePostReplaceMenuMainImage();
  const { mutateAsync: requestMenuSse, isPending: isSyncing } =
    usePostMenuBulkMenuSse();
  const { data, isLoading } = useGetMenuBulkImageList(shopCode, {
    enabled: isOpen,
  });

  // 전체 메뉴 리스트와 다운로드 가능한(이미지가 있는) 리스트 분리
  const menuList = data?.data || [];
  const downloadableImages = menuList.filter((item) => item.imagePath);

  const handleSync = async () => {
    try {
      await requestMenuSse(shopCode);
      message.success('동기화를 요청하였습니다.');
    } catch (error) {
      console.error('Sync failed:', error);
      //message.error('동기화 처리에 실패했습니다.');
    }
    onClose();
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

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      message.warning('jpg, jpeg, png 확장자만 업로드 가능합니다.');
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
          <Button
            size="large"
            onClick={handleSync}
            disabled={isLoading || isUploading || isSyncing}
            loading={isLoading || isSyncing}
          >
            동기화
          </Button>
          <Button size="large" type="primary" onClick={onClose}>
            닫기
          </Button>
        </S.ModalFooter>
      }
    >
      <Spin spinning={isLoading || isUploading} description="처리 중...">
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
            {menuList.map((item) => (
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
