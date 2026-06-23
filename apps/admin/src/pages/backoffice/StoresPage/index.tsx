import { useState } from 'react';
import { keepPreviousData } from '@repo/api/tanstack-query';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Space, Tooltip, App } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  SettingOutlined,
  DownloadOutlined,
  UploadOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { ROUTES } from '@/constants/routes';
import { useGetAdminShopList, useGetDownloadPosExcel } from '@repo/api/queries';
import { useTablePageState } from '@/feature/backoffice/hooks';
import PageTitle from '@/feature/backoffice/components/PageTitle';
import { useAuthStore } from '@/stores/useAuthStore';
import { UploadModal } from './Menu/UploadModal';
import { ImageViewModal } from './Menu/ImageViewModal';
import { formatDateTime } from '@repo/util/date';
import * as XLSX from 'xlsx';
import * as S from './storesPage.style';
import { useStyle, type ShopDataType } from './storesPage.style';

const DEFAULT_PAGE_SIZE = 10;

export const StoresPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { styles } = useStyle();

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
      link.download = `${shopCode}_${shopName}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      message.success({
        content: '엑셀 다운로드가 완료되었습니다.',
        key: 'downloadExcel',
      });
    } catch {
      message.error({
        content: '엑셀 다운로드에 실패했습니다.',
        key: 'downloadExcel',
      });
    }
  };

  const handleListExcelDownload = () => {
    const data = shopList?.data?.shopList ?? [];
    if (data.length === 0) {
      message.warning('다운로드할 데이터가 없습니다.');
      return;
    }

    const excelData = data.map((item, index) => ({
      'No.': (currentPage - 1) * pageSize + index + 1,
      '매장 ID': item.shopCode || '-',
      매장명: item.shopName || '-',
      사업자등록번호: item.businessNumber || '-',
      주소: item.address1 || '-',
      '최초 POS 연동 일시': item.firstLinkedDate
        ? formatDateTime(item.firstLinkedDate, 'YYYY-MM-DD HH:mm')
        : '-',
      '최근 주문 일시': item.lastOrderDate
        ? formatDateTime(item.lastOrderDate, 'YYYY-MM-DD HH:mm')
        : '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '매장 목록');

    XLSX.writeFile(
      workbook,
      `매장_목록_${formatDateTime(new Date().toISOString(), 'YYYYMMDD_HHmmss')}.xlsx`
    );
  };

  // TODO: 실제 API 응답 데이터 구조에 맞게 컬럼 데이터인덱스 수정 필요
  const columns: ColumnsType<ShopDataType> = [
    {
      title: 'No.',
      key: 'no',
      width: 60,
      align: 'center',
      fixed: 'start',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: '매장 ID',
      dataIndex: 'shopCode',
      key: 'shopCode',
      width: 160,
      fixed: 'start',
      render: (text: string) =>
        text ? (
          <span style={{ userSelect: 'text', cursor: 'text' }}>{text}</span>
        ) : (
          '-'
        ),
      onHeaderCell: () => ({
        style: { textAlign: 'center' },
      }),
    },
    {
      title: '매장명',
      dataIndex: 'shopName',
      key: 'shopName',
      width: 230,
      onHeaderCell: () => ({
        style: { textAlign: 'center' },
      }),
      render: (text: string) =>
        text ? (
          <span style={{ userSelect: 'text', cursor: 'text' }}>{text}</span>
        ) : (
          '-'
        ),
    },
    // {
    //   title: '사업자등록번호',
    //   dataIndex: 'businessNumber',
    //   key: 'businessNumber',
    //   width: 130,
    //   align: 'center',
    //   render: (text: string) =>
    //     text ? (
    //       <span style={{ userSelect: 'text', cursor: 'text' }}>{text}</span>
    //     ) : (
    //       '-'
    //     ),
    // },
    {
      title: '주소',
      dataIndex: 'address1',
      key: 'address1',
      onHeaderCell: () => ({
        style: { textAlign: 'center' },
      }),
    },
    {
      title: '최초 POS 연동 일시',
      dataIndex: 'firstLinkedDate',
      key: 'firstLinkedDate',
      width: 150,
      align: 'center',
      render: (date?: string) =>
        date ? formatDateTime(date, 'YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '최근 주문 일시',
      dataIndex: 'lastOrderDate',
      key: 'lastOrderDate',
      width: 142,
      align: 'center',
      render: (date?: string) =>
        date ? formatDateTime(date, 'YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '매장 메뉴',
      key: 'storeMenu',
      width: 120,
      align: 'center',
      fixed: 'end',
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
      width: 80,
      align: 'center',
      fixed: 'end',
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
    <S.Container>
      <PageTitle title="매장 관리" subtitle="목록" />
      <S.ContentCard>
        <S.TopBar>
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
              icon={<DownloadOutlined />}
              style={{
                borderRadius: '8px',
                height: '40px',
                padding: '0 20px',
                fontWeight: 600,
              }}
              onClick={handleListExcelDownload}
            >
              엑셀 다운로드
            </Button>
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
        </S.TopBar>
        <S.StyledTable
          loading={isFetching}
          className={styles.customTable}
          columns={columns}
          dataSource={shopList?.data?.shopList ?? []}
          rowKey={(record) => record.shopCode || Math.random().toString()}
          pagination={{
            current: currentPage,
            pageSizeOptions: [
              10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000,
            ],
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
          scroll={{ x: 'max-content' }}
        />
      </S.ContentCard>
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
    </S.Container>
  );
};
