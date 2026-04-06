import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Space, Tooltip, Form } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { ROUTES } from '@/constants/routes';
import { useTablePageState } from '@/feature/backoffice/hooks';
import PageTitle from '@/feature/Backoffice/components/PageTitle';
import MenuGroupModal from './MenuGroupNewModal';

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

// 데이터 타입 정의
interface MenuGroupDataType {
  key: string;
  no: number;
  menuGroupName: string;
  menuGroupTag: string;
  menuName: string;
  createdAt: string;
}

// 임시 목업 데이터
const MOCK_DATA: MenuGroupDataType[] = [
  {
    key: '1',
    no: 1,
    menuGroupName: '주류(소주)',
    menuGroupTag: '#소주 #주류',
    menuName: '참이슬, 처음처럼, 진로, 새로, 대선',
    createdAt: '2024-03-01',
  },
  {
    key: '2',
    no: 2,
    menuGroupName: '주류(맥주)',
    menuGroupTag: '#맥주 #주류',
    menuName: '카스, 테라, 켈리, 크러시',
    createdAt: '2024-03-02',
  },
  {
    key: '3',
    no: 3,
    menuGroupName: '여름 시즌 메뉴',
    menuGroupTag: '#여름 #빙수 #시즌',
    menuName: '수박화채, 파인애플 샤베트',
    createdAt: '2024-05-15',
  },
];

const StyledTable = styled(Table<MenuGroupDataType>)`
  .ant-table-thead > tr > th {
    background-color: #1d2a6d !important;
    color: white !important;
    border-bottom: none;
  }
`;

const MenuGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit'>('new');
  const [form] = Form.useForm();

  const {
    currentPage,
    searchKeyword,
    searchInputValue,
    handleSearchInputChange,
    handleSearch,
    handlePageChange,
  } = useTablePageState({ pageSize });

  const handleCreate = () => {
    form.resetFields();
    setModalMode('new');
    setIsModalOpen(true);
  };

  const handleEdit = (record: MenuGroupDataType) => {
    form.setFieldsValue({
      menuGroupName: record.menuGroupName,
      menus: record.menuName ? record.menuName.split(', ') : [],
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns: ColumnsType<MenuGroupDataType> = [
    { title: 'No.', dataIndex: 'no', key: 'no', width: 80, align: 'center' },
    {
      title: '메뉴 그룹명',
      dataIndex: 'menuGroupName',
      key: 'menuGroupName',
      width: 200,
    },
    {
      title: '메뉴 태그',
      dataIndex: 'menuGroupTag',
      key: 'menuGroupTag',
      width: 200,
    },
    { title: '메뉴명', dataIndex: 'menuName', key: 'menuName' },
    {
      title: '생성일',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      align: 'center',
    },
    {
      title: '관리',
      key: 'management',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="수정">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="메뉴 그룹 현황">
            <Button
              type="text"
              icon={<LinkOutlined />}
              onClick={() =>
                navigate(ROUTES.BACKOFFICE.MENU_GROUP_STATUS.generate())
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <PageTitle title="메뉴 그룹 관리" subtitle="목록" />
      <ContentCard>
        <TopBar>
          <Space>
            <Input
              placeholder="검색어를 입력하세요"
              style={{ width: 240, borderRadius: '6px' }}
              value={searchInputValue}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              //prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
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
              메뉴 그룹 등록
            </Button>
          </Space>
        </TopBar>
        <StyledTable
          columns={columns}
          dataSource={MOCK_DATA}
          rowKey="key"
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
            total: MOCK_DATA.length,
            showTotal: (total) => `총 ${total}건`,
            showSizeChanger: true,
          }}
          //scroll={{ y: 'calc(100vh - 400px)' }}
        />
      </ContentCard>

      <MenuGroupModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        mode={modalMode}
        form={form}
      />
    </Container>
  );
};

export default MenuGroupPage;
