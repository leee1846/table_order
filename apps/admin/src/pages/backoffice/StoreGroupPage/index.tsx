import React, { useMemo, useState } from 'react';
import { Table, Button, Input, Space, Tooltip, App } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import PageTitle from '@/feature/Backoffice/components/PageTitle';
import { useConfirmDialog } from '@/feature/Backoffice/hooks/useConfirmDialog';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@repo/api/tanstack-query';
import {
  useGetStoreGroupList,
  usePutUpdateStoreGroup,
  queryKeys,
} from '@repo/api/queries';

// --- Types & Mock Data ---
interface StoreGroupDataType {
  // TODO: 실제 API 응답 필드명(Swagger 참고)에 맞춰 수정해주세요.
  no: number;
  storeGroupSeq: number;
  groupId: string;
  groupName: string;
  storeCount: number;
  groupDescription: string;
  createdAt: string;
  // [key: string]: any; // 임시: 백엔드 필드명 호환을 위함 (ex. storeGroupSeq 등)
}

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

export const StoreGroupPage = () => {
  const { message } = App.useApp();
  const { showConfirm } = useConfirmDialog();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState('');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // API 연동: 매장 그룹 목록 조회
  const { data: storeGroupResponse, isFetching } = useGetStoreGroupList({
    page: currentPage - 1,
    size: pageSize,
    name: searchText || undefined,
  });

  // API 연동: 매장 그룹 삭제
  const deleteMutation = usePutUpdateStoreGroup();

  // API 응답 데이터를 테이블 타입(StoreGroupDataType)에 맞게 매핑
  const responseData = storeGroupResponse?.data;

  const storeGroups: StoreGroupDataType[] = useMemo(
    () =>
      (responseData?.content || []).map((item, index) => ({
        no: (currentPage - 1) * pageSize + index + 1,
        storeGroupSeq: item.storeGroupSeq || 0,
        groupId: String(item.storeGroupId || ''),
        groupName: item.groupName || '',
        storeCount: item.storeCount || 0,
        groupDescription: item.groupDescription || '',
        createdAt: item.createDate || '',
      })) as StoreGroupDataType[],
    [responseData?.content, currentPage, pageSize]
  );

  const totalCount = responseData?.totalElements || 0;

  const columns: ColumnsType<StoreGroupDataType> = [
    { title: 'No.', dataIndex: 'no', key: 'no', width: 80, align: 'center' },
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
    { title: '설명', dataIndex: 'groupDescription', key: 'groupDescription' },
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
                  ROUTES.BACKOFFICE.STORE_GROUP_EDIT.generate(
                    record.storeGroupSeq
                  )
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
                    const targetId = record.storeGroupSeq || record.groupId;
                    if (targetId) {
                      deleteMutation.mutate(
                        { storeGroupSeq: Number(targetId), isDeleted: true },
                        {
                          onSuccess: () => {
                            message.success('매장 그룹이 삭제되었습니다.');
                            queryClient.invalidateQueries({
                              queryKey: queryKeys.storeGroup.all,
                            });
                          },
                          onError: () => {
                            message.error(
                              '매장 그룹 삭제 중 오류가 발생했습니다.'
                            );
                          },
                        }
                      );
                    } else {
                      message.error('삭제할 그룹 식별자를 찾을 수 없습니다.');
                    }
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
    navigate(ROUTES.BACKOFFICE.STORE_GROUP_NEW.generate());
  };

  const handleSearch = () => {
    setSearchText(searchValue);
    setCurrentPage(1);
  };

  return (
    <Container>
      <PageTitle title="매장 그룹 관리" subtitle="목록" />
      <ContentCard>
        <TopBar>
          <Space>
            <Input
              placeholder="매장 그룹명 or 매장 그룹 ID"
              allowClear
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
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
          dataSource={storeGroups}
          rowKey={(record) => record.storeGroupSeq}
          loading={isFetching}
          pagination={{
            current: currentPage,
            pageSize,
            total: totalCount,
            showTotal: (total) => `총 ${total}건`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            placement: ['bottomEnd'],
            showSizeChanger: true,
          }}
        />
      </ContentCard>
    </Container>
  );
};
