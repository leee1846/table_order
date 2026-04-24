import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Button, Table, Space, Tag, Spin, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useParams } from 'react-router-dom';
import {
  useGetCampaignMenuGroups,
  useGetCampaignMenuGroupSyncStatus,
  usePostRegisterMenuGroupSync,
} from '@repo/api/queries';
import type { ICampaignMenuGroupSyncStatus } from '@repo/api/types';
import styled from '@emotion/styled';
import PageTitle from '@/feature/Backoffice/components/PageTitle';

const { Title, Text } = Typography;

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
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const LayoutWrapper = styled.div`
  display: flex;
  gap: 24px;
  flex: 1;
  overflow: hidden;
`;

// 좌측 패널 (메뉴 그룹 선택)
const LeftPanel = styled.div`
  width: 240px;
  background-color: #f4f5f7;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
`;

const GroupButton = styled(Button)<{ 'data-active'?: boolean }>`
  width: 100%;
  text-align: center;

  ${({ 'data-active': active }) =>
    active
      ? `
        background-color: #1d2a6d;
        color: #fff;
        border-color: #1d2a6d;
        font-weight: 600;
        &:hover, &:focus {
          background-color: #1d2a6d;
          color: #fff;
          opacity: 0.9;
        }
      `
      : `
        background-color: #fff;
        color: #8c8c8c;
        border-color: #d9d9d9;
      `}
`;

// 우측 패널 (테이블 영역)
const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RightHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SummaryTag = styled(Tag)`
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  margin-right: 0 !important; /* antd Space 컴포넌트의 기본 마진 제거 */
`;

const ActionButton = styled(Button)`
  background-color: #1d2a6d;
  height: 36px;
  padding: 0 32px;
  font-weight: 600;

  &:hover,
  &:focus {
    background-color: #1d2a6d;
    opacity: 0.9;
  }
`;

const PanelTitle = styled(Text)`
  display: block;
  margin-bottom: 12px;
  color: #595959;
  font-weight: 600;
`;

// 커스텀 테이블 (다크 블루 헤더 & 지브라 패턴)
const StyledTable = styled(Table<ICampaignMenuGroupSyncStatus>)`
  .ant-table-thead > tr > th {
    background-color: #1d2a6d !important;
    color: #ffffff !important;
    border-bottom: none;
    text-align: center;

    /* 체크박스 테두리를 하얗게 보이도록 강제 */
    .ant-checkbox-inner {
      border-color: #fff;
      background-color: transparent;
    }
  }

  .ant-table-tbody > tr > td {
    text-align: center;
    border-bottom: none; /* 내부 가로선 제거 (이미지 스타일에 맞춤) */
  }

  /* 짝수 행에만 연한 회색 배경 (지브라 패턴) */
  .zebra-row {
    background-color: #fafafa;
  }
`;

const StatusText = styled(Text)<{ status: string }>`
  font-weight: 600;
  color: ${(props) => (props.status === '등록 완료' ? '#389e0d' : '#cf1322')};
`;

const RegisterButton = styled(Button)`
  background-color: #1d2a6d;
  border-radius: 4px;

  &:hover,
  &:focus {
    background-color: #1d2a6d;
    opacity: 0.9;
  }
`;

const MenuGroupStatus: React.FC = () => {
  const { campaignSeq } = useParams<{ campaignSeq: string }>();
  const { data: menuGroupsRes, isLoading: isMenuGroupsLoading } =
    useGetCampaignMenuGroups(campaignSeq as string);

  const menuGroups = useMemo(() => {
    return menuGroupsRes?.data || [];
  }, [menuGroupsRes?.data]);

  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 메뉴 그룹 목록을 불러오면 첫 번째 그룹을 기본 선택 상태로 설정
  useEffect(() => {
    if (menuGroups && menuGroups.length > 0 && activeGroupId === null) {
      if (menuGroups[0]) {
        setActiveGroupId(menuGroups[0].menuGroupSeq);
      }
    }
  }, [menuGroups, activeGroupId]);

  // 동기화 현황 데이터 조회
  const {
    data: syncStatusRes,
    isLoading: isSyncLoading,
    refetch: refetchSyncStatus,
  } = useGetCampaignMenuGroupSyncStatus(
    {
      campaignSeq: Number(campaignSeq),
      menuGroupSeq: activeGroupId as number,
      page: currentPage - 1, // API가 0-based index를 사용한다고 가정
      size: pageSize,
    },
    {
      enabled: activeGroupId !== null,
    }
  );

  // 동기화 등록 Mutation
  const { mutate: registerSync } = usePostRegisterMenuGroupSync();

  // 개별 등록 처리
  const handleRegister = (shopSeq: number) => {
    if (!activeGroupId || !campaignSeq) return;

    registerSync(
      {
        campaignSeq: Number(campaignSeq),
        menuGroupSeq: activeGroupId,
        shopSeqs: [shopSeq],
      },
      {
        onSuccess: (res) => {
          const data = res?.data;
          const successItem = data?.registered?.find(
            (item) => item.shopSeq === shopSeq
          );
          const failedItem = data?.failed?.find(
            (item) => item.shopSeq === shopSeq
          );

          if (failedItem) {
            message.error(failedItem.reason || '등록에 실패했습니다.');
          } else if (successItem) {
            message.success(successItem.reason || '등록이 완료되었습니다.');
          } else if (data?.failedCount && data.failedCount > 0) {
            message.error('등록에 실패했습니다.');
          } else {
            message.success('등록이 완료되었습니다.');
          }

          refetchSyncStatus(); // 테이블 갱신
        },
        onError: () => {
          message.error('등록 중 오류가 발생했습니다.');
        },
      }
    );
  };

  // 일괄 등록 처리
  const handleBulkRegister = () => {
    if (!activeGroupId || !campaignSeq) return;
    if (selectedRowKeys.length === 0) {
      message.warning('등록할 매장을 선택해주세요.');
      return;
    }

    registerSync(
      {
        campaignSeq: Number(campaignSeq),
        menuGroupSeq: activeGroupId,
        shopSeqs: selectedRowKeys.map((key) =>
          Number(String(key).split('_')[1])
        ),
      },
      {
        onSuccess: (res) => {
          const data = res?.data;
          if (data?.failedCount && data.failedCount > 0) {
            const firstReason = data.failed[0]?.reason;
            message.error(
              `등록 실패: ${data.failedCount}건${firstReason ? ` (${firstReason})` : ''}`
            );
          } else if (data?.registeredCount && data.registeredCount > 0) {
            const firstReason = data.registered[0]?.reason;
            message.success(
              `총 ${data.registeredCount}건 등록 성공${firstReason ? ` (${firstReason})` : ''}`
            );
          } else {
            message.success('일괄 등록이 완료되었습니다.');
          }

          setSelectedRowKeys([]); // 선택 초기화
          refetchSyncStatus(); // 테이블 갱신
        },
        onError: () => {
          message.error('일괄 등록 중 오류가 발생했습니다.');
        },
      }
    );
  };

  const syncData = syncStatusRes?.data;
  const syncList = syncData?.content || [];

  // 테이블 컬럼 정의
  const columns: ColumnsType<ICampaignMenuGroupSyncStatus> = [
    { title: '매장 ID', dataIndex: 'shopCode', key: 'shopCode', width: '20%' },
    {
      title: '매장명',
      dataIndex: 'shopName',
      key: 'shopName',
      width: '30%',
      align: 'left',
    },
    {
      title: '동기화 상태',
      dataIndex: 'syncStatus',
      key: 'syncStatus',
      width: '25%',
      render: (status: string) => {
        const displayStatus = status === 'COMPLETED' ? '등록 완료' : '미등록';
        return <StatusText status={displayStatus}>{displayStatus}</StatusText>;
      },
    },
    {
      title: '개별 등록',
      key: 'action',
      width: '25%',
      render: (_, record) => {
        const isCompleted = record.syncStatus === 'COMPLETED';
        return !isCompleted ? (
          <RegisterButton
            type="primary"
            size="small"
            onClick={() => handleRegister(record.shopSeq)}
          >
            등록
          </RegisterButton>
        ) : (
          <Text type="secondary">—</Text>
        );
      },
    },
  ];

  return (
    <Container>
      <PageTitle title="캠페인 관리" subtitle="메뉴 태그 동기화 현황" />
      <ContentCard>
        <LayoutWrapper>
          {/* 1. 좌측 메뉴 그룹 리스트 */}
          <LeftPanel>
            <PanelTitle>메뉴 그룹 선택</PanelTitle>
            {isMenuGroupsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin />
              </div>
            ) : (
              menuGroups.map((group) => (
                <GroupButton
                  key={group.menuGroupSeq}
                  data-active={activeGroupId === group.menuGroupSeq}
                  onClick={() => setActiveGroupId(group.menuGroupSeq)}
                  size="large"
                >
                  {group.menuGroupName} ({group.menuGroupTag})
                </GroupButton>
              ))
            )}
          </LeftPanel>

          {/* 2. 우측 현황 테이블 영역 */}
          <RightPanel>
            <RightHeader>
              <Title level={5}>메뉴 태그 현황</Title>

              <Space size="middle">
                <Space size="small">
                  <SummaryTag color="#e6f4ff" style={{ color: '#0958d9' }}>
                    전체 {syncData?.totalCount || 0}
                  </SummaryTag>
                  <SummaryTag color="#f6ffed" style={{ color: '#389e0d' }}>
                    등록 완료 {syncData?.completedCount || 0}
                  </SummaryTag>
                  <SummaryTag color="#fff1f0" style={{ color: '#cf1322' }}>
                    미등록 {syncData?.unregisteredCount || 0}
                  </SummaryTag>
                </Space>

                <ActionButton type="primary" onClick={handleBulkRegister}>
                  일괄 등록
                </ActionButton>
              </Space>
            </RightHeader>

            <StyledTable
              rowKey={(record: ICampaignMenuGroupSyncStatus) =>
                `${activeGroupId}_${record.shopSeq}`
              }
              loading={isSyncLoading}
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
                getCheckboxProps: (record: ICampaignMenuGroupSyncStatus) => ({
                  disabled: record.syncStatus === 'COMPLETED',
                }),
              }}
              columns={columns}
              dataSource={syncList}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: syncData?.totalCount || 0,
                showSizeChanger: true,
                placement: ['bottomEnd'],
                showTotal: (total) => `총 ${total}건`,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  if (size !== pageSize) {
                    setPageSize(size);
                    setCurrentPage(1);
                  }
                },
              }}
              size="middle"
              // 홀/짝수 행에 따른 지브라 패턴 클래스 적용
              rowClassName={(_, index) => (index % 2 !== 0 ? 'zebra-row' : '')}
            />
          </RightPanel>
        </LayoutWrapper>
      </ContentCard>
    </Container>
  );
};

export default MenuGroupStatus;
