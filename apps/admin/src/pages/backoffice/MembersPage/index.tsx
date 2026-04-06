import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Space, Tooltip, App } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import PageTitle from '@/feature/Backoffice/components/PageTitle';
import { ROUTES } from '@/constants/routes';
import { useGetAdminMemberList } from '@repo/api/queries';
import { keepPreviousData } from '@repo/api/tanstack-query';
import { useTablePageState } from '@/feature/backoffice/hooks';
import type { IGetAdminMember } from '@repo/api/types';

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

const StyledTable = styled(Table<IGetAdminMember>)`
  .ant-table-thead > tr > th {
    background-color: #1d2a6d !important;
    color: white !important;
    border-bottom: none;
  }
`;

const SearchInput = styled(Input)`
  width: 240px;
  border-radius: 6px;
`;

const ActionButton = styled(Button)`
  border-radius: 6px;
`;

const CreateButton = styled(Button)`
  border-radius: 8px;
  height: 40px;
  padding: 0 20px;
  font-weight: 600;
`;

const StatusText = styled.span<{ isDeleted: boolean }>`
  color: ${({ isDeleted }) => (isDeleted ? '#ff4d4f' : 'inherit')};
  font-weight: ${({ isDeleted }) => (isDeleted ? 600 : 'normal')};
`;

const DEFAULT_PAGE_SIZE = 10;

export const MembersPage = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const {
    currentPage,
    searchKeyword,
    searchInputValue,
    handleSearchInputChange,
    handleSearch,
    handlePageChange,
  } = useTablePageState({ pageSize });

  const { data: adminList, isFetching } = useGetAdminMemberList(
    {
      pageNumber: currentPage - 1,
      pageSize,
      searchWord: searchKeyword,
    },
    { placeholderData: keepPreviousData }
  );

  const handleCreate = () => {
    navigate(ROUTES.BACKOFFICE.MEMBERS_NEW.generate());
  };

  const columns: ColumnsType<IGetAdminMember> = [
    { title: '이름', dataIndex: 'memberName', key: 'memberName' },
    { title: '이메일', dataIndex: 'memberEmail', key: 'memberEmail' },
    { title: '핸드폰번호', dataIndex: 'memberTel', key: 'memberTel' },
    { title: '소속', dataIndex: 'memberDepartment', key: 'memberDepartment' },
    {
      title: '권한',
      dataIndex: 'memberRole',
      key: 'memberRole',
      align: 'center',
      render: (role: string) => (role === 'ADMIN' ? '관리자' : role),
    },
    {
      title: '삭제 여부',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      align: 'center',
      render: (isDeleted: boolean) => (
        <StatusText isDeleted={isDeleted}>{isDeleted ? 'O' : 'X'}</StatusText>
      ),
    },
    {
      title: '관리',
      key: 'management',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="수정">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(
                  ROUTES.BACKOFFICE.MEMBERS_EDIT.generate(record.memberId)
                )
              }
            />
          </Tooltip>
          <Tooltip title="상세">
            <Button
              type="text"
              icon={<FileTextOutlined />}
              onClick={() =>
                navigate(
                  ROUTES.BACKOFFICE.MEMBERS_DETAIL.generate(record.memberId)
                )
              }
            />
          </Tooltip>
          {/*           <Tooltip title="삭제">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => {
                message.warning(`'${record.memberName}' 삭제 기능 대기 중`);
              }}
            />
          </Tooltip> */}
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <PageTitle title="회원 관리" subtitle="목록" />
      <ContentCard>
        <TopBar>
          <Space>
            <SearchInput
              placeholder="검색어를 입력하세요"
              allowClear
              value={searchInputValue}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onPressEnter={handleSearch}
            />
            <ActionButton type="primary" onClick={handleSearch}>
              검색
            </ActionButton>
          </Space>
          <Space>
            <CreateButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              회원 등록
            </CreateButton>
          </Space>
        </TopBar>

        <StyledTable
          columns={columns}
          dataSource={adminList?.data?.memberList ?? []}
          rowKey={(record) => record.memberId || Math.random().toString()}
          loading={isFetching}
          pagination={{
            current: currentPage,
            pageSize,
            total: (adminList?.data?.totalPageNumber ?? 1) * pageSize,
            //showTotal: (total) => `총 ${total}건`,
            onChange: (page, size) => {
              //console.log(page, size);
              handlePageChange(page);
              if (size !== pageSize) {
                setPageSize(size);
              }
            },
            placement: ['bottomEnd'],
            showSizeChanger: true,
          }}
        />
      </ContentCard>
    </Container>
  );
};
