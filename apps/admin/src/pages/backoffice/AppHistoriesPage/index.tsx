import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useGetAppVersionList } from '@repo/api/queries';
import { keepPreviousData } from '@repo/api/tanstack-query';
import { useTablePageState } from '@/feature/backoffice/hooks';
import { formatDateTime } from '@repo/util/date';
import type { IAppVersion, TAppType } from '@repo/api/types';
import { APP_TYPE } from '@/feature/backoffice/SidebarLayout';

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

const StyledTable = styled(Table<IAppVersion>)`
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

export const AppHistoriesPage = () => {
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
  const { type } = useParams<{ type: TAppType }>();

  const pageTitle = useMemo(() => {
    const typeLabel =
      type === APP_TYPE.MENU
        ? '메뉴판'
        : type === APP_TYPE.POS_APP
          ? '관리자'
          : '에이전트';
    return `배포 관리 (${typeLabel})`;
  }, [type]);

  const {
    data: historyList,
    isFetching,
    refetch,
  } = useGetAppVersionList(
    {
      pageNumber: currentPage - 1,
      pageSize,
      searchWord: searchKeyword,
      type: type || 'MENU',
    },
    { placeholderData: keepPreviousData }
  );

  useEffect(() => {
    handlePageChange(1);
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleCreate = () => {
    navigate(ROUTES.BACKOFFICE.APP_HISTORIES_NEW.generate());
  };

  const formatDeployDate = (dateStr: string | null | undefined): string => {
    if (!dateStr || typeof dateStr !== 'string') {
      return '';
    }

    if (dateStr.length === 14) {
      return formatDateTime(dateStr, 'YYYY-MM-DD HH시 mm분');
    }
    return dateStr;
  };

  const columns: ColumnsType<IAppVersion> = [
    /*     {
      title: 'ID',
      dataIndex: 'appVersionSeq',
      key: 'appVersionSeq',
      width: 80,
    }, */
    {
      title: 'No.',
      key: 'no',
      width: 80,
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    // {
    //   title: '구분',
    //   dataIndex: 'type',
    //   key: 'type',
    //   width: 100,
    //   align: 'center',
    // },
    {
      title: '버전',
      dataIndex: 'version',
      key: 'version',
      width: 120,
      align: 'center',
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      onHeaderCell: () => ({
        style: { textAlign: 'center' },
      }),
      render: (title: string) => title ?? '-',
    },
    {
      title: '배포일시',
      dataIndex: 'deployDate',
      key: 'deployDate',
      width: 180,
      onHeaderCell: () => ({
        style: { textAlign: 'center' },
      }),
      render: (deployDate: string) => formatDeployDate(deployDate) || '-',
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
                  ROUTES.BACKOFFICE.APP_HISTORIES_EDIT.generate(
                    record.appVersionSeq
                  )
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
                  ROUTES.BACKOFFICE.APP_HISTORIES_DETAIL.generate(
                    record.appVersionSeq
                  )
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
      <PageTitle title={pageTitle} subtitle="목록" />
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
              배포 등록
            </CreateButton>
          </Space>
        </TopBar>
        <StyledTable
          columns={columns}
          dataSource={historyList?.data?.appVersionList ?? []}
          rowKey="appVersionSeq"
          loading={isFetching}
          pagination={{
            current: currentPage,
            pageSize,
            total: historyList?.data?.totalElements || 0,
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
