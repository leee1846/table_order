import React, { useState, useMemo } from 'react';
import { Table, Button, Input, Space, Tooltip, Form, App } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useTablePageState } from '@/feature/backoffice/hooks';
import PageTitle from '@/feature/backoffice/components/PageTitle';
import MenuGroupModal from './MenuGroupNewModal';
import { useQueryClient } from '@repo/api/tanstack-query';
import {
  useGetMenuGroupList,
  usePatchUpdateMenuGroup,
  queryKeys,
} from '@repo/api/queries';
import type { IMenuGroup, IMenuGroupMenu } from '@repo/api/types';
import { useConfirmDialog } from '@/feature/backoffice/hooks/useConfirmDialog';

const DEFAULT_PAGE_SIZE = 10;

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
  //const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showConfirm } = useConfirmDialog();
  const { message } = App.useApp();
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit'>('new');
  const [currentGroupSeq, setCurrentGroupSeq] = useState<number | null>(null);
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
    name: searchKeyword || undefined,
  });

  // API 연동: 메뉴 그룹 수정/삭제 훅
  const updateMutation = usePatchUpdateMenuGroup();

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

  const totalCount = menuGroupResponse?.data?.totalElements || 0;

  const handleCreate = () => {
    form.resetFields();
    setModalMode('new');
    setCurrentGroupSeq(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: MenuGroupDataType) => {
    form.setFieldsValue({
      menuGroupName: record.menuGroupName,
      menus: record.menus
        ? record.menus.map((m) => ({
            label: m.menuName,
            value: m.menuSeq,
          }))
        : [],
    });
    setModalMode('edit');
    setCurrentGroupSeq(record.menuGroupSeq);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns: ColumnsType<MenuGroupDataType> = [
    { title: 'No.', dataIndex: 'no', key: 'no', width: 80, align: 'center' },
    {
      title: '메뉴 태그',
      dataIndex: 'menuGroupTag',
      key: 'menuGroupTag',
      width: 160,
    },
    {
      title: '메뉴 그룹명',
      dataIndex: 'menuGroupName',
      key: 'menuGroupName',
      width: 200,
      render: (text: string) => (
        <div
          title={text}
          style={{
            maxWidth: 200,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'keep-all',
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: '메뉴명',
      dataIndex: 'menus',
      key: 'menus',
      width: 400,
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
          <Tooltip title="삭제">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => {
                showConfirm({
                  title: '메뉴 그룹 삭제',
                  targetName: '메뉴 그룹',
                  itemName: record.menuGroupName,
                  onConfirm: () => {
                    updateMutation.mutate(
                      {
                        menuGroupSeq: record.menuGroupSeq,
                        menuGroupName: record.menuGroupName,
                        menus: record.menus?.map((m) => m.menuSeq),
                        isDeleted: true,
                      },
                      {
                        onSuccess: () => {
                          message.success('메뉴 그룹이 삭제되었습니다.');
                          queryClient.invalidateQueries({
                            queryKey: queryKeys.menuGroup.all,
                          });
                        },
                      }
                    );
                  },
                });
              }}
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
              placeholder="메뉴그룹명 or 메뉴 태그"
              allowClear
              style={{ width: 240, borderRadius: '6px' }}
              value={searchInputValue}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onPressEnter={handleSearch}
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
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: queryKeys.menuGroup.all });
        }}
        mode={modalMode}
        menuGroupSeq={currentGroupSeq}
        form={form}
      />
    </Container>
  );
};

export default MenuGroupPage;
