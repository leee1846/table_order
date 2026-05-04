import { useState } from 'react';
import { keepPreviousData } from '@repo/api/tanstack-query';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Space, Tooltip, App } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  SettingOutlined,
  DownloadOutlined,
  UploadOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { ROUTES } from '@/constants/routes';
import { useGetAdminShopList, useGetDownloadPosExcel } from '@repo/api/queries';
import { useTablePageState } from '@/feature/backoffice/hooks';
import PageTitle from '@/feature/backoffice/components/PageTitle';
import { useAuthStore } from '@/stores/useAuthStore';
import { UploadModal } from './Menu/UploadModal';
import { ImageViewModal } from './Menu/ImageViewModal';

const DEFAULT_PAGE_SIZE = 10;

// --- Emotion Styles ---
const Container = styled.div`
  background-color: #f4f7fa;
  height: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-shrink: 0;
`;

// 임시 타입 (실제 데이터 타입에 맞춰 수정 필요)
interface ShopDataType {
  shopSeq: number;
  shopCode: string;
  shopName: string;
  ownerName?: string;
  phone?: string;
  status?: string;
  memberId?: string | number;
}

const StyledTable = styled(Table<ShopDataType>)`
  .ant-table-thead > tr > th {
    background-color: #1d2a6d !important;
    color: white !important;
    border-bottom: none;
  }
`;

export const StoresPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const {
    currentPage,
    searchKeyword,
    searchInputValue,
    handleSearchInputChange,
    handleSearch,
    handlePageChange,
  } = useTablePageState({ pageSize });

  const { data: shopList, isFetching } = useGetAdminShopList(
    {
      pageNumber: currentPage - 1,
      pageSize,
      searchWord: searchKeyword,
    },
    { placeholderData: keepPreviousData }
  );

  const { mutateAsync: downloadExcel } = useGetDownloadPosExcel();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedShopForUpload, setSelectedShopForUpload] = useState<{
    shopCode: string;
    shopSeq: number;
  } | null>(null);
  const [isImageViewModalOpen, setIsImageViewModalOpen] = useState(false);
  const [selectedShopForImage, setSelectedShopForImage] = useState<{
    shopCode: string;
    shopSeq: number;
  } | null>(null);

  const handleCreate = () => {
    navigate(ROUTES.BACKOFFICE.STORES_NEW.generate());
  };

  const redirectToStoreDetail = (shopCode: string, shopSeq: number) => {
    useAuthStore.getState().setShopDataForBackoffice(shopCode, shopSeq);
    const url = `${window.location.origin}${ROUTES.SETTINGS.NOTICES.generate()}`;
    window.open(url, '_blank');
  };

  const handleDownloadExcel = async (shopCode: string, shopName: string) => {
    try {
      message.loading({
        content: '엑셀 다운로드 중...',
        key: 'downloadExcel',
      });
      const blob = await downloadExcel(shopCode);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${shopName}_메뉴포스연동_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      message.success({
        content: '엑셀 다운로드가 완료되었습니다.',
        key: 'downloadExcel',
      });
    } catch (error) {
      message.error({
        content: '엑셀 다운로드에 실패했습니다.',
        key: 'downloadExcel',
      });
    }
  };

  // TODO: 실제 API 응답 데이터 구조에 맞게 컬럼 데이터인덱스 수정 필요
  const columns: ColumnsType<ShopDataType> = [
    {
      title: 'No.',
      key: 'no',
      width: 60,
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    { title: '매장 ID', dataIndex: 'shopCode', key: 'shopCode', width: 120 },
    { title: '매장명', dataIndex: 'shopName', key: 'shopName', width: 200 },
    {
      title: '사업자등록번호',
      dataIndex: 'businessNumber',
      key: 'businessNumber',
      width: 150,
    },
    { title: '기본 주소', dataIndex: 'address1', key: 'address1' },
    {
      title: '매장 메뉴',
      key: 'storeMenu',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="엑셀 다운로드">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() =>
                handleDownloadExcel(record.shopCode, record.shopName)
              }
            />
          </Tooltip>
          <Tooltip title="엑셀, 이미지 업로드">
            <Button
              type="text"
              icon={<UploadOutlined />}
              onClick={() => {
                setSelectedShopForUpload({
                  shopCode: record.shopCode,
                  shopSeq: record.shopSeq,
                });
                setIsUploadModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="이미지 보기">
            <Button
              type="text"
              icon={<PictureOutlined />}
              onClick={() => {
                setSelectedShopForImage({
                  shopCode: record.shopCode,
                  shopSeq: record.shopSeq,
                });
                setIsImageViewModalOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '관리',
      key: 'management',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="수정">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(
                  `${ROUTES.BACKOFFICE.STORES_EDIT.generate(record.shopCode)}?memberId=${record.memberId}`
                )
              }
            />
          </Tooltip>
          <Tooltip title="매장 설정">
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={() => {
                redirectToStoreDetail(record.shopCode, record.shopSeq);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <PageTitle title="매장 관리" subtitle="목록" />
      <ContentCard>
        <TopBar>
          <Space>
            <Input
              placeholder="검색어를 입력하세요"
              style={{ width: 240, borderRadius: '6px' }}
              value={searchInputValue}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              //prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              onPressEnter={handleSearch}
            />
            <Button
              type="primary"
              style={{ borderRadius: '6px' }}
              onClick={handleSearch}
            >
              검색
            </Button>
          </Space>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                borderRadius: '8px',
                height: '40px',
                padding: '0 20px',
                fontWeight: 600,
              }}
              onClick={handleCreate}
            >
              매장 등록
            </Button>
          </Space>
        </TopBar>
        <StyledTable
          loading={isFetching}
          columns={columns}
          dataSource={shopList?.data?.shopList ?? []}
          rowKey={(record) => record.shopCode || Math.random().toString()}
          pagination={{
            current: currentPage,
            pageSize,
            onChange: (page, size) => {
              handlePageChange(page);
              if (size !== pageSize) {
                setPageSize(size);
              }
            },
            placement: ['bottomEnd'],
            total: shopList?.data?.totalElements || 0,
            showTotal: (total) => `총 ${total}건`,
            showSizeChanger: true,
          }}
          //scroll={{ y: 'calc(100vh - 400px)' }}
        />
      </ContentCard>
      {selectedShopForUpload && (
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => {
            setIsUploadModalOpen(false);
            setSelectedShopForUpload(null);
          }}
          shopCode={selectedShopForUpload.shopCode}
          shopSeq={selectedShopForUpload.shopSeq}
        />
      )}
      {selectedShopForImage && (
        <ImageViewModal
          isOpen={isImageViewModalOpen}
          onClose={() => {
            setIsImageViewModalOpen(false);
            setSelectedShopForImage(null);
          }}
          shopCode={selectedShopForImage.shopCode}
          shopSeq={selectedShopForImage.shopSeq}
        />
      )}
    </Container>
  );
};
