import { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import PageTitle from '@/feature/backoffice/components/PageTitle';
import { useTablePageState } from '@/feature/backoffice/hooks';
import { formatDateTime } from '@repo/util/date';
import { useConfirmDialog } from '@/feature/backoffice/hooks/useConfirmDialog';
import { ManualUploadModal } from './ManualUploadModal';
import type { IManualItem, TManualType } from '@repo/api/types';
import {
  useDeleteManual,
  useGetDownloadManual,
  useGetManualList,
} from '@repo/api/queries';

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

const StyledTable = styled(Table<IManualItem>)`
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

export const ManualPage = () => {
  const { showConfirm } = useConfirmDialog();
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const {
    currentPage,
    searchKeyword,
    searchInputValue,
    handleSearchInputChange,
    handleSearch,
    handlePageChange,
  } = useTablePageState({ pageSize });

  const {
    data: manualList,
    isFetching,
    refetch,
  } = useGetManualList({
    page: currentPage,
    pageSize,
    searchWord: searchKeyword,
  });

  const { mutateAsync: downloadManual } = useGetDownloadManual();
  const deleteManualMutation = useDeleteManual();

  useEffect(() => {
    handlePageChange(1);
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = () => {
    setIsUploadModalOpen(true);
  };

  const handleDownload = async (record: IManualItem) => {
    try {
      message.loading({
        content: '매뉴얼 다운로드 중...',
        key: 'downloadManual',
      });

      const blob = await downloadManual(record.manualSeq);

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', record.manualFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success({
        content: '매뉴얼 다운로드가 완료되었습니다.',
        key: 'downloadManual',
      });
    } catch {
      message.error({
        content: '매뉴얼 다운로드에 실패했습니다.',
        key: 'downloadManual',
      });
    }
  };

  const handleDelete = (record: IManualItem) => {
    showConfirm({
      title: '매뉴얼 삭제',
      content: `'${record.manualFileName}' 파일을 정말 삭제하시겠습니까?`,
      onConfirm: async () => {
        await deleteManualMutation.mutateAsync(record.manualSeq);
        message.success('매뉴얼이 삭제되었습니다.');
        refetch();
      },
    });
  };

  const columns: ColumnsType<IManualItem> = [
    {
      title: 'No.',
      key: 'no',
      width: 80,
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: '권한',
      dataIndex: 'manualType',
      key: 'manualType',
      onHeaderCell: () => ({
        style: { textAlign: 'center' },
      }),
      render: (manualType: TManualType) =>
        manualType === 'ADMIN' ? '관리자' : '매장',
    },
    {
      title: '파일명',
      dataIndex: 'manualFileName',
      key: 'manualFileName',
      onHeaderCell: () => ({
        style: { textAlign: 'center' },
      }),
    },
    {
      title: '등록일',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 180,
      align: 'center',
      render: (date: string) =>
        date ? formatDateTime(date, 'YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '등록자',
      dataIndex: 'createMemberName',
      key: 'createMemberName',
      width: 120,
      align: 'center',
    },
    {
      title: '관리',
      key: 'management',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="다운로드">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
            />
          </Tooltip>
          <Tooltip title="삭제">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <PageTitle title="매뉴얼" subtitle="목록" />
      <ContentCard>
        <TopBar>
          <Space>
            <SearchInput
              placeholder="파일명을 검색하세요"
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
              icon={<UploadOutlined />}
              onClick={handleUpload}
            >
              매뉴얼 업로드
            </CreateButton>
          </Space>
        </TopBar>

        <StyledTable
          columns={columns}
          dataSource={manualList?.data?.manualList}
          rowKey="manualSeq"
          loading={isFetching}
          pagination={{
            current: currentPage,
            pageSize,
            total: manualList?.data?.totalCount || 0,
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
      <ManualUploadModal
        isOpen={isUploadModalOpen}
        onSuccess={refetch}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </Container>
  );
};

export default ManualPage;
