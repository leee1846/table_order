import React, { useState } from 'react';
import { Table, Button, Input, Space, Tooltip, App } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import PageTitle from '@/feature/Backoffice/components/PageTitle';
import { useConfirmDialog } from '@/feature/Backoffice/hooks/useConfirmDialog';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';

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

// 기존 매장 목록 페이지와 동일한 테이블 헤더 스타일 적용
const StyledTable = styled(Table<StoreGroupDataType>)`
  .ant-table-thead > tr > th {
    background-color: #1d2a6d !important;
    color: white !important;
    border-bottom: none;
  }
`;

// --- Types & Mock Data ---
interface StoreGroupDataType {
  groupId: string;
  groupName: string;
  storeCount: number;
  description: string;
  createdAt: string;
}

const MOCK_DATA: StoreGroupDataType[] = Array.from({ length: 25 }).map(
  (_, i) => ({
    groupId: `G${String(i + 1).padStart(4, '0')}`,
    groupName: `매장그룹 테스트 ${i + 1}`,
    storeCount: Math.floor(Math.random() * 50) + 1,
    description: `테스트를 위한 그룹 설명입니다 (${i + 1})`,
    createdAt: '2024-05-01',
  })
);

export const StoreGroupPage = () => {
  const { message } = App.useApp();
  const { showConfirm } = useConfirmDialog();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const columns: ColumnsType<StoreGroupDataType> = [
    { title: '매장그룹 ID', dataIndex: 'groupId', key: 'groupId', width: 120 },
    {
      title: '매장 그룹명',
      dataIndex: 'groupName',
      key: 'groupName',
      width: 250,
    },
    {
      title: '포함 매장 수',
      dataIndex: 'storeCount',
      key: 'storeCount',
      width: 120,
      align: 'center',
    },
    { title: '설명', dataIndex: 'description', key: 'description' },
    { title: '생성일', dataIndex: 'createdAt', key: 'createdAt', width: 150 },
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
                  ROUTES.BACKOFFICE.STORE_GROUP_EDIT.generate(record.groupId)
                )
              }
            />
          </Tooltip>
          <Tooltip title="삭제">
            <Button
              type="text"
              //danger
              icon={<DeleteOutlined />}
              onClick={() => {
                showConfirm({
                  title: '그룹 삭제',
                  targetName: '매장 그룹',
                  itemName: record.groupName,
                  onConfirm: () => {
                    message.warning(`'${record.groupName}' 삭제`);
                  },
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleCreate = () => {
    console.log('Create new group');
    // TODO: 생성 페이지 라우팅 적용
    navigate(ROUTES.BACKOFFICE.STORE_GROUP_NEW.generate());
  };

  const handleSearch = () => {
    console.log('Search with text:', searchText);
    // TODO: 검색 로직 구현
  };

  return (
    <Container>
      <PageTitle title="매장 그룹 관리" subtitle="목록" />
      <ContentCard>
        <TopBar>
          <Space>
            <Input
              placeholder="그룹명을 검색하세요"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 240, borderRadius: '6px' }}
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
              매장 그룹 추가
            </Button>
          </Space>
        </TopBar>

        <StyledTable
          columns={columns}
          dataSource={MOCK_DATA}
          rowKey={(record) => record.groupId}
          pagination={{
            current: currentPage,
            pageSize,
            total: MOCK_DATA.length,
            showTotal: (total) => `총 ${total}건`,
            onChange: (page) => setCurrentPage(page),
            placement: ['bottomEnd'],
            showSizeChanger: true,
          }}
        />
      </ContentCard>
    </Container>
  );
};
