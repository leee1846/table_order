import React, { useState } from 'react';
import { keepPreviousData } from '@repo/api/tanstack-query';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Space, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { ROUTES } from '@/constants/routes';
import { useGetAdminShopList } from '@repo/api/queries';
import { useTablePageState } from '@/feature/backoffice/hooks';
import PageTitle from '@/feature/Backoffice/components/PageTitle';

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
  shopCode: string;
  shopName: string;
  ownerName?: string;
  phone?: string;
  status?: string;
}

const StyledTable = styled(Table<ShopDataType>)`
  .ant-table-thead > tr > th {
    background-color: #1d2a6d !important;
    color: white !important;
    border-bottom: none;
  }
`;

export const StoresPage = () => {
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

  const handleCreate = () => {
    navigate(ROUTES.BACKOFFICE.STORES_NEW.generate());
  };

  // TODO: 실제 API 응답 데이터 구조에 맞게 컬럼 데이터인덱스 수정 필요
  const columns: ColumnsType<ShopDataType> = [
    { title: '매장 코드', dataIndex: 'shopCode', key: 'shopCode', width: 120 },
    { title: '매장명', dataIndex: 'shopName', key: 'shopName', width: 200 },
    {
      title: '사업자등록번호',
      dataIndex: 'businessNumber',
      key: 'businessNumber',
      width: 150,
    },
    { title: '기본 주소', dataIndex: 'address1', key: 'address1' },
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
                  ROUTES.BACKOFFICE.STORES_EDIT.generate(record.shopCode)
                )
              }
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
            total: (shopList?.data?.totalPageNumber ?? 1) * pageSize,
            //showTotal: (total) => `총 ${total}건`,
            showSizeChanger: true,
          }}
          //scroll={{ y: 'calc(100vh - 400px)' }}
        />
      </ContentCard>
    </Container>
  );
};
