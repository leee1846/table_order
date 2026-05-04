import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';
import type { IGetAdminShopItem } from '@repo/api/types';
import { useNavigate } from 'react-router-dom';
import { theme } from '@repo/ui';
import { Tooltip } from 'antd';
import {
  EditOutlined,
  UploadOutlined,
  PictureOutlined,
  DownloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button } from '@/feature/backoffice/components';
import { toast } from '@repo/feature/utils';
import * as S from './table.style';

import { useGetDownloadPosExcel } from '@repo/api/queries';
import { UploadModal } from '../Menu/UploadModal';
import { ImageViewModal } from '../Menu/ImageViewModal';

interface Props {
  stores: IGetAdminShopItem[];
}

export const Table = ({ stores }: Props) => {
  const navigate = useNavigate();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<{
    code: string;
    seq: number;
  } | null>(null);

  const [isImageViewModalOpen, setIsImageViewModalOpen] = useState(false);
  const [selectedImageShop, setSelectedImageShop] = useState<{
    code: string;
    seq: number;
  } | null>(null);

  const { mutateAsync: downloadPosExcel } = useGetDownloadPosExcel();

  const redirectToStoreDetail = (shopCode: string, shopSeq: number) => {
    useAuthStore.getState().setShopDataForBackoffice(shopCode, shopSeq);
    const url = `${window.location.origin}${ROUTES.SETTINGS.NOTICES.generate()}`;
    window.open(url, '_blank');
  };

  const openUploadModal = (shopCode: string, shopSeq: number) => {
    setSelectedShop({ code: shopCode, seq: shopSeq });
    setIsUploadModalOpen(true);
  };

  const handleBundleUpload = (shopCode: string, shopSeq: number) => {
    openUploadModal(shopCode, shopSeq);
  };

  const handleImageView = (shopCode: string, shopSeq: number) => {
    setSelectedImageShop({ code: shopCode, seq: shopSeq });
    setIsImageViewModalOpen(true);
  };

  const handleExcelDownload = async (shopCode: string) => {
    try {
      const blob = await downloadPosExcel(shopCode);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pos-excel-${shopCode}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast('엑셀 파일 다운로드에 실패했습니다.');
    }
  };

  const renderRows = () => {
    if (!stores || stores.length === 0) {
      return (
        <S.EmptyRow>
          <S.EmptyCell colSpan={6}>매장 목록이 없습니다.</S.EmptyCell>
        </S.EmptyRow>
      );
    }

    return stores.map((store) => (
      <S.Tr key={store.memberId}>
        <S.Td>{store.shopCode}</S.Td>
        <S.Td>{store.shopName}</S.Td>
        <S.Td>{store.businessNumber || '-'}</S.Td>
        <S.Td>{store.address1 || '-'}</S.Td>
        <S.ActionCell>
          <S.ActionWrapper>
            <Tooltip title="엑셀 다운로드" placement="bottom">
              <span style={{ marginRight: 8 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleExcelDownload(store.shopCode)}
                >
                  <DownloadOutlined
                    style={{ fontSize: 16, color: theme.colors.grey[700] }}
                  />
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="엑셀, 이미지 업로드">
              <span style={{ marginRight: 8 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleBundleUpload(store.shopCode, store.shopSeq)
                  }
                >
                  <UploadOutlined
                    style={{ fontSize: 16, color: theme.colors.grey[700] }}
                  />
                </Button>
              </span>
            </Tooltip>
            {/* <Tooltip title="이미지 업로드">
              <span style={{ marginRight: 8 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleImageUpload(store.shopCode, store.shopSeq)
                  }
                >
                  <PictureOutlined
                    style={{ fontSize: 16, color: theme.colors.grey[700] }}
                  />
                </Button>
              </span>
            </Tooltip> */}
            <Tooltip title="이미지 보기">
              <span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleImageView(store.shopCode, store.shopSeq)}
                >
                  <PictureOutlined
                    style={{ fontSize: 16, color: theme.colors.grey[700] }}
                  />
                </Button>
              </span>
            </Tooltip>
          </S.ActionWrapper>
        </S.ActionCell>
        <S.ActionCell>
          <S.ActionWrapper>
            <Tooltip title="매장 수정">
              <span style={{ marginRight: 8 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    navigate(
                      `${ROUTES.BACKOFFICE.STORES_EDIT.generate(store.shopCode)}?memberId=${store.memberId}`
                    )
                  }
                >
                  <EditOutlined
                    style={{ fontSize: 16, color: theme.colors.grey[700] }}
                  />
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="매장 설정">
              <span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    redirectToStoreDetail(store.shopCode, store.shopSeq)
                  }
                >
                  <SettingOutlined
                    style={{ fontSize: 16, color: theme.colors.grey[700] }}
                  />
                </Button>
              </span>
            </Tooltip>
          </S.ActionWrapper>
        </S.ActionCell>
      </S.Tr>
    ));
  };

  return (
    <>
      <S.TableContainer>
        <S.TableElement>
          <S.Thead>
            <S.Tr>
              <S.Th>매장 아이디</S.Th>
              <S.Th>매장명</S.Th>
              <S.Th>사업자등록번호</S.Th>
              <S.Th>기본 주소</S.Th>
              <S.Th>매장 메뉴</S.Th>
              <S.Th>작업</S.Th>
            </S.Tr>
          </S.Thead>
          <S.Tbody>{renderRows()}</S.Tbody>
        </S.TableElement>
      </S.TableContainer>

      {selectedShop && (
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          shopCode={selectedShop.code}
          shopSeq={selectedShop.seq}
        />
      )}

      {selectedImageShop && (
        <ImageViewModal
          isOpen={isImageViewModalOpen}
          onClose={() => setIsImageViewModalOpen(false)}
          shopCode={selectedImageShop.code}
          shopSeq={selectedImageShop.seq}
        />
      )}
    </>
  );
};
