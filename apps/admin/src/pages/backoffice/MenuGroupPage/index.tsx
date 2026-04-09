import React, { useState, useMemo } from 'react';
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
import { useGetMenuGroupList } from '@repo/api/queries';
import { MenuName } from '../../../feature/dialogs/OrderListDialog/DetailOrderDialog/detailOrderDialog.style';
import type { IMenuGroup, IMenuGroupMenu } from '@repo/api/types';

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
/* interface MenuType {
  menuSeq: number;
  sortSeq: number;
  menuName: string;
  menuPrice: number;
  isRecommended: boolean;
  menuDescription: string;
} */

interface MenuGroupDataType extends IMenuGroup {
  no: number;
}

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

  // API 연동: 메뉴 그룹 목록 조회
  const { data: menuGroupResponse, isFetching } = useGetMenuGroupList({
    page: currentPage - 1,
    size: pageSize,
    keyword: searchKeyword || undefined,
  });

  const menuGroups: MenuGroupDataType[] = useMemo(() => {
    const content = menuGroupResponse?.data?.content || [];
    return content.map((item, index) => ({
      key: String(item.menuGroupSeq || index),
      no: (currentPage - 1) * pageSize + index + 1,
      menuGroupSeq: item.menuGroupSeq,
      menuGroupTag: item.menuGroupTag || '',
      menuGroupName: item.menuGroupName || '',
      menus: item.menus || [],
      createdAt: item.createDate || '',
    }));
  }, [menuGroupResponse?.data?.content, currentPage, pageSize]);

  const totalCount = menuGroupResponse?.data?.totalCount || 0;

  const handleCreate = () => {
    form.resetFields();
    setModalMode('new');
    setIsModalOpen(true);
  };

  const handleEdit = (record: MenuGroupDataType) => {
    form.setFieldsValue({
      menuGroupName: record.menuGroupName,
      menus: record.menus ? record.menus.map((m) => m.menuName) : [],
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
    {
      title: '메뉴명',
      dataIndex: 'menus',
      key: 'menus',
      render: (menus: IMenuGroupMenu[]) =>
        menus?.map((m) => m.menuName).join(', ') || '-',
    },
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
              placeholder="메뉴그룹명을 입력하세요"
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
          loading={isFetching}
          columns={columns}
          dataSource={menuGroups}
          rowKey={(record) => record.menuGroupSeq}
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
            total: totalCount,
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
