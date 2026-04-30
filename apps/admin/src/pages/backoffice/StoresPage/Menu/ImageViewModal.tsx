import { useState } from 'react';
import { Button } from '@/feature/backoffice/components';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import JSZip from 'jszip';
import { toast } from '@repo/feature/utils';
import * as S from './ImageViewModal.style';
import { Image } from 'antd';
import {
  useGetMenuBulkImageList,
  usePostReplaceMenuMainImage,
} from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import type { IMenuImageListItem } from '@repo/api/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shopCode: string;
  shopSeq: number;
}

export const ImageViewModal = ({ isOpen, onClose, shopCode }: Props) => {
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
      toast('전체 이미지 다운로드가 완료되었습니다.');
    } catch (error) {
      console.error('Failed to create zip:', error);
      toast('이미지 압축 다운로드에 실패했습니다.');
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
      toast('jpg, jpeg, png, webp, gif 확장자만 업로드 가능합니다.');
      return;
    }

    setIsUploading(true);
    try {
      await replaceImage({ menuSeq, file });
      toast('이미지가 변경 되었습니다.');
      await queryClient.invalidateQueries({
        queryKey: ['menu', 'bulkImageList', shopCode],
      });
    } catch (error) {
      console.error('Image replace failed:', error);
      toast('이미지 변경을 실패하였습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <S.Backdrop>
      {(isLoading || isDownloading || isUploading) && (
        <FullscreenLoadingSpinner />
      )}
      <S.ModalContainer>
        <S.Title>메뉴 이미지 목록</S.Title>

        <S.ContentWrapper>
          <S.Header>
            <p>
              매장 코드: <strong>{shopCode}</strong>
            </p>
            <S.StatsText>
              전체: {menuList.length}개 / 이미지 등록:{' '}
              {downloadableImages.length}개
            </S.StatsText>
          </S.Header>

          {menuList.length > 0 ? (
            <S.GridContainer>
              {menuList.map((item: IMenuImageListItem) => (
                <S.ItemContainer
                  key={item.menuSeq}
                  onDragOver={(e) => handleDragOver(e, item.menuSeq)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, item.menuSeq)}
                  style={{
                    opacity: draggingMenuSeq === item.menuSeq ? 0.8 : 1,
                    transform:
                      draggingMenuSeq === item.menuSeq
                        ? 'scale(0.98)'
                        : 'scale(1)',
                    boxShadow:
                      draggingMenuSeq === item.menuSeq
                        ? '0 0 0 3px #3b82f6'
                        : '0 0 0 0px transparent',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                  }}
                >
                  {item.imagePath ? (
                    <Image
                      src={item.imagePath}
                      alt={item.menuName}
                      style={S.imageStyle}
                    />
                  ) : (
                    <S.ImagePlaceholder>이미지 없음</S.ImagePlaceholder>
                  )}
                  <S.TextContainer>
                    <S.CategoryName>{item.categoryName}</S.CategoryName>
                    <br />
                    <strong>{item.menuName}</strong>
                  </S.TextContainer>
                </S.ItemContainer>
              ))}
            </S.GridContainer>
          ) : (
            <S.EmptyMessage>등록된 메뉴가 없습니다.</S.EmptyMessage>
          )}
        </S.ContentWrapper>

        <S.ButtonWrapper>
          {/*           <Button
            variant="outline"
            onClick={handleDownloadAll}
            disabled={
              downloadableImages.length === 0 || isLoading || isDownloading
            }
          >
            {isDownloading ? '압축 중...' : '전체 이미지 다운로드'}
          </Button> */}
          <Button variant="default" onClick={onClose}>
            닫기
          </Button>
        </S.ButtonWrapper>
      </S.ModalContainer>
    </S.Backdrop>
  );
};
