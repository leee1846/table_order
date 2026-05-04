import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Space, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import PageTitle from '@/feature/backoffice/components/PageTitle';
import { ROUTES } from '@/constants/routes';
import { useGetNoticeList } from '@repo/api/queries';
import { keepPreviousData } from '@repo/api/tanstack-query';
import { useTablePageState } from '@/feature/backoffice/hooks';
import { formatDateTime } from '@repo/util/date';
import type { INotice } from '@repo/api/types';
import { getBoardTypeLabel } from '@/feature/backoffice/Notices/constants';

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

const StyledTable = styled(Table<INotice>)`
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

const DEFAULT_PAGE_SIZE = 10;

export const NoticesPage = () => {
  const navigate = useNavigate();
  // const queryClient = useQueryClient();
  // const deleteNoticeMutation = useDeleteNotice();
  // const { showConfirm } = useConfirmDialog();
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const {
    currentPage,
    searchKeyword,
    searchInputValue,
    handleSearchInputChange,
    handleSearch,
    handlePageChange,
  } = useTablePageState({ pageSize });

  const { data: noticeList, isFetching } = useGetNoticeList(
    {
      page: currentPage, // 0-based index
      pageSize,
      searchWord: searchKeyword,
    },
    { placeholderData: keepPreviousData }
  );

  const handleCreate = () => {
    navigate(ROUTES.BACKOFFICE.NOTICES_NEW.generate());
  };

  // const handleDelete = (notice: INotice) => {
  //   showConfirm({
  //     title: '공지사항 삭제',
  //     targetName: '공지사항',
  //     itemName: notice.noticeTitle,
  //     onConfirm: async () => {
  //       try {
  //         await deleteNoticeMutation.mutateAsync(notice.noticeSeq);
  //         message.success('공지사항이 삭제되었습니다.');
  //         await queryClient.invalidateQueries({
  //           queryKey: queryKeys.notice.list(),
  //         });
  //       } catch (e) {
  //         message.error('공지사항 삭제 중 오류가 발생했습니다.');
  //       }
  //     },
  //   });
  // };

  const columns: ColumnsType<INotice> = [
    {
      title: 'No.',
      key: 'no',
      width: 80,
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: '유형',
      dataIndex: 'boardType',
      key: 'boardType',
      width: 80,
      align: 'center',
      render: (boardType) => getBoardTypeLabel(boardType),
    },
    { title: '제목', dataIndex: 'noticeTitle', key: 'noticeTitle' },
    {
      title: '작성일',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 180,
      align: 'center',
      render: (date: string) =>
        date ? formatDateTime(date, 'YYYY-MM-DD HH:mm:ss') : '-',
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
                  ROUTES.BACKOFFICE.NOTICES_EDIT.generate(record.noticeSeq)
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
                  ROUTES.BACKOFFICE.NOTICES_DETAIL.generate(record.noticeSeq)
                )
              }
            />
          </Tooltip>
          {/*           <Tooltip title="삭제">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record)}
            />
          </Tooltip> */}
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <PageTitle title="공지사항 관리" subtitle="목록" />
      <ContentCard>
        <TopBar>
          <Space>
            <SearchInput
              placeholder="제목을 검색하세요"
              allowClear
              value={searchInputValue}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onPressEnter={handleSearch}
            />
            <ActionButton type="primary" onClick={handleSearch}>
              검색
            </ActionButton>
          </Space>
          <div />
          <Space>
            <CreateButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              공지사항 등록
            </CreateButton>
          </Space>
        </TopBar>

        <StyledTable
          columns={columns}
          dataSource={noticeList?.data?.noticeList ?? []}
          rowKey="noticeId"
          loading={isFetching}
          pagination={{
            current: currentPage,
            pageSize,
            total: noticeList?.data?.totalElements || 0,
            showTotal: (total) => `총 ${total}건`,
            onChange: (page, size) => {
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
