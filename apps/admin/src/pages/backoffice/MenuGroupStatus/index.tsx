import React, { useState } from 'react';
import { Typography, Button, Table, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styled from '@emotion/styled';
import PageTitle from '@/feature/Backoffice/components/PageTitle';

const { Title, Text } = Typography;

// --- Types ---
interface MenuGroup {
  id: string;
  name: string;
  code: string;
}

interface StoreSyncData {
  key: string;
  sid: string;
  name: string;
  status: '등록 완료' | '미등록';
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
const StyledTable = styled(Table<StoreSyncData>)`
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

const StatusText = styled(Text)<{ status: '등록 완료' | '미등록' }>`
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

// --- Mock Data ---
const MOCK_GROUPS: MenuGroup[] = [
  { id: 'g1', name: '크러시', code: 'G121' },
  { id: 'g2', name: '테라', code: 'G045' },
  { id: 'g3', name: '카스', code: 'G032' },
  { id: 'g4', name: '켈리', code: 'G088' },
];

const MOCK_TABLE_DATA: StoreSyncData[] = Array.from(
  { length: 100 },
  (_, i) => ({
    key: `${i + 1}`,
    sid: `S${String(i + 1).padStart(4, '0')}`,
    name: `테스트 매장 ${i + 1}`,
    status: i < 80 ? '등록 완료' : '미등록',
  })
);

const MenuGroupStatus: React.FC = () => {
  const [activeGroupId, setActiveGroupId] = useState<string>('g1');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 테이블 컬럼 정의
  const columns: ColumnsType<StoreSyncData> = [
    { title: '매장 SID', dataIndex: 'sid', key: 'sid', width: '20%' },
    {
      title: '매장명',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      align: 'left',
    },
    {
      title: '동기화 상태',
      dataIndex: 'status',
      key: 'status',
      width: '25%',
      render: (status: string) => (
        <StatusText status={status}>{status}</StatusText>
      ),
    },
    {
      title: '개별 등록',
      key: 'action',
      width: '25%',
      render: (_, record) =>
        record.status === '미등록' ? (
          <RegisterButton type="primary" size="small">
            등록
          </RegisterButton>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
  ];

  return (
    <Container>
      <PageTitle title="메뉴 그룹 관리" subtitle="현황" />
      <ContentCard>
        <LayoutWrapper>
          {/* 1. 좌측 메뉴 그룹 리스트 */}
          <LeftPanel>
            <PanelTitle>메뉴 그룹 선택</PanelTitle>
            {MOCK_GROUPS.map((group) => (
              <GroupButton
                key={group.id}
                data-active={activeGroupId === group.id}
                onClick={() => setActiveGroupId(group.id)}
                size="large"
              >
                {group.name} ({group.code})
              </GroupButton>
            ))}
          </LeftPanel>

          {/* 2. 우측 현황 테이블 영역 */}
          <RightPanel>
            <RightHeader>
              <Title level={5}>메뉴 태그 현황</Title>

              <Space size="middle">
                <Space size="small">
                  <SummaryTag color="#e6f4ff" style={{ color: '#0958d9' }}>
                    전체 100
                  </SummaryTag>
                  <SummaryTag color="#f6ffed" style={{ color: '#389e0d' }}>
                    동기화 80
                  </SummaryTag>
                  <SummaryTag color="#fff1f0" style={{ color: '#cf1322' }}>
                    미동기화 20
                  </SummaryTag>
                </Space>

                <ActionButton type="primary">일괄 등록</ActionButton>
              </Space>
            </RightHeader>

            <StyledTable
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              columns={columns}
              dataSource={MOCK_TABLE_DATA}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                showSizeChanger: true,
                placement: ['bottomEnd'],
                showTotal: (total) => `총 ${total}건`,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  if (size !== pageSize) {
                    setPageSize(size);
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
